/*
    Devolução parcial simplificada (SQL Server)
    - Preferência por procedures (sem triggers) para clareza e controle
    - Cria o tipo de tabela dbo.TP_DevolucaoItem e a procedure sp_DevolverItensVendaSimples
    - Fluxo:
        1) Valida a venda (FECHADA) e os itens/quantidades
        2) Insere movimentações de estoque de ENTRADA (ID_Venda e Observacao)
        3) Atualiza MATERIAIS.Estoque_Atual somando as quantidades devolvidas
        4) Calcula o reembolso proporcional ao(s) item(ns) devolvido(s)
        5) Insere um pagamento negativo em PAGAMENTOS_VENDA (TIPO='REEMBOLSO')

    Pré-requisitos:
    - Tabelas do Creates_Simples_Frontend.sql (especialmente VENDAS, ITENS_VENDA, MATERIAIS, MOVIMENTACAO_ESTOQUE, PAGAMENTOS_VENDA)
*/

SET ANSI_NULLS ON;
SET QUOTED_IDENTIFIER ON;
GO

/* ======================
   Tipo de tabela (input)
   ====================== */
IF NOT EXISTS (
    SELECT 1 FROM sys.table_types WHERE name = 'TP_DevolucaoItem' AND schema_id = SCHEMA_ID('dbo')
)
BEGIN
    CREATE TYPE dbo.TP_DevolucaoItem AS TABLE (
        ID_Material INT NOT NULL,   -- Material a devolver (ID_Material)
        Quantidade  INT NOT NULL    -- Quantidade a devolver (> 0, inteiro)
    );
END
GO

/* ==================================
   Procedure: sp_DevolverItensVendaSimples
   ================================== */
IF OBJECT_ID('dbo.sp_DevolverItensVendaSimples','P') IS NOT NULL
    DROP PROCEDURE dbo.sp_DevolverItensVendaSimples;
GO

CREATE PROCEDURE dbo.sp_DevolverItensVendaSimples
    @ID_VENDA   INT,                      -- Venda alvo (deve estar FECHADA)
    @ID_USUARIO INT,                      -- Usuário que registra a devolução
    @MOTIVO     VARCHAR(255) = NULL,      -- Motivo opcional
    @ITENS      dbo.TP_DevolucaoItem READONLY -- Lista de itens (material/quantidade)
AS
BEGIN
    SET NOCOUNT ON;

    BEGIN TRY
        BEGIN TRAN;

        -- 0) Validação da venda
    DECLARE @status VARCHAR(50), @existe INT;
    SELECT @status = V.Status_Venda, @existe = 1 FROM dbo.VENDAS V WHERE V.ID_Venda = @ID_VENDA;
        IF @existe IS NULL RAISERROR('Venda não encontrada.',16,1);
        IF @status = 'CANCELADA' RAISERROR('Venda cancelada não pode ter devolução.',16,1);
        IF @status <> 'FECHADA' RAISERROR('A devolução só é permitida para venda FECHADA.',16,1);

        -- 1) Validar itens informados
        IF NOT EXISTS (SELECT 1 FROM @ITENS) RAISERROR('Nenhum item informado para devolução.',16,1);
    IF EXISTS (SELECT 1 FROM @ITENS WHERE Quantidade <= 0) RAISERROR('Quantidade deve ser maior que zero.',16,1);

        -- Agregar itens para evitar duplicidade do mesmo material
                ;WITH R AS (
                        SELECT ID_Material, SUM(Quantidade) AS QTD_REQ
              FROM @ITENS
                         GROUP BY ID_Material
        ),
        S AS (
                        SELECT I.ID_Material,
                                     SUM(I.Quantidade) AS QTD_VENDIDA,
                                     SUM(I.Quantidade * I.Preco_Unitario) AS TOTAL_ITENS
              FROM dbo.ITENS_VENDA I
                         WHERE I.ID_Venda = @ID_VENDA
                         GROUP BY I.ID_Material
        ),
        RET AS (
                        SELECT ME.ID_Material, SUM(ME.Quantidade) AS QTD_DEVOLVIDA
              FROM dbo.MOVIMENTACAO_ESTOQUE ME
                         WHERE ME.Tipo_Movimento = 'ENTRADA'
                             AND ME.ID_Venda = @ID_VENDA
                             AND (ME.Observacao LIKE 'Devolução%' OR ME.Observacao LIKE 'Devolucao%')
                         GROUP BY ME.ID_Material
        )
        SELECT 1 as OK
          INTO #__val_tmp
          FROM R
                    LEFT JOIN S ON S.ID_Material = R.ID_Material
                    LEFT JOIN RET ON RET.ID_Material = R.ID_Material
          WHERE R.QTD_REQ <= ISNULL(S.QTD_VENDIDA,0) - ISNULL(RET.QTD_DEVOLVIDA,0)
            AND R.QTD_REQ > 0
                        AND S.ID_Material IS NOT NULL; -- item deve existir na venda

                DECLARE @itensInformados INT = (SELECT COUNT(*) FROM (SELECT 1 FROM @ITENS GROUP BY ID_Material) X);
        DECLARE @itensValidos INT = (SELECT COUNT(*) FROM #__val_tmp);
        DROP TABLE #__val_tmp;

        IF @itensValidos < @itensInformados
        BEGIN
            RAISERROR('Itens inválidos na devolução: quantidade excede o vendido (descontando devoluções anteriores) ou material não pertence à venda.',16,1);
        END

        -- 2) Movimentações de estoque (entrada por devolução)
       ;WITH R AS (
          SELECT ID_Material, SUM(Quantidade) AS QTD_REQ
              FROM @ITENS
           GROUP BY ID_Material
        )
       INSERT INTO dbo.MOVIMENTACAO_ESTOQUE (ID_Material, ID_Usuario, ID_Venda, Tipo_Movimento, Quantidade, Valor_Unitario, Observacao)
       SELECT R.ID_Material, @ID_USUARIO, @ID_VENDA, 'ENTRADA', R.QTD_REQ,
            ISNULL((SELECT TOP 1 I.Preco_Unitario FROM dbo.ITENS_VENDA I WHERE I.ID_Venda=@ID_VENDA AND I.ID_Material=R.ID_Material), 0.00),
            COALESCE(@MOTIVO, 'Devolução parcial de venda')
          FROM R;

        -- 2.1) Atualizar estoque atual
                ;WITH R AS (
                        SELECT ID_Material, SUM(Quantidade) AS QTD_REQ
              FROM @ITENS
                         GROUP BY ID_Material
        )
        UPDATE M
                     SET M.Estoque_Atual = M.Estoque_Atual + R.QTD_REQ
                    FROM dbo.MATERIAIS M
                    JOIN R ON R.ID_Material = M.ID_Material;

        -- 3) Calcular valor de reembolso proporcional
                DECLARE @valorReembolso DECIMAL(10,2);
                ;WITH R AS (
                        SELECT ID_Material, SUM(Quantidade) AS QTD_REQ
              FROM @ITENS
                         GROUP BY ID_Material
        ),
        S AS (
                        SELECT I.ID_Material,
                                     SUM(I.Quantidade) AS QTD_VENDIDA,
                                     SUM(I.Quantidade * I.Preco_Unitario) AS TOTAL_ITENS
              FROM dbo.ITENS_VENDA I
                         WHERE I.ID_Venda = @ID_VENDA
                         GROUP BY I.ID_Material
        )
                SELECT @valorReembolso = ROUND(SUM(S.TOTAL_ITENS * (R.QTD_REQ * 1.0 / NULLIF(S.QTD_VENDIDA,0))), 2)
          FROM R
                    JOIN S ON S.ID_Material = R.ID_Material;

        IF @valorReembolso IS NULL OR @valorReembolso <= 0
        BEGIN
            -- Nenhum valor a reembolsar (não deveria acontecer se itens foram validados)
            SET @valorReembolso = 0;
        END

        -- 4) Registrar pagamento negativo (reembolso)
        IF @valorReembolso > 0
        BEGIN
        INSERT INTO dbo.PAGAMENTOS_VENDA (ID_Venda, Data_Pagamento, Tipo_Pagamento, Valor, ID_Usuario, Observacao)
        VALUES (@ID_VENDA, GETDATE(), 'REEMBOLSO', -@valorReembolso, @ID_USUARIO,
            COALESCE(@MOTIVO, 'Reembolso por devolução parcial'));
        END

        COMMIT TRAN;
    END TRY
    BEGIN CATCH
        IF XACT_STATE() <> 0 ROLLBACK TRAN;
        DECLARE @ErrMsg NVARCHAR(4000) = ERROR_MESSAGE();
        RAISERROR(@ErrMsg,16,1);
    END CATCH
END
GO

/*
Como usar (exemplo):
-- 1) Crie um DataTable do tipo dbo.TP_DevolucaoItem e envie os itens/quantidades
--    No SSMS, você pode testar com uma variável do tipo:
--    DECLARE @itens dbo.TP_DevolucaoItem;
--    INSERT INTO @itens(ID_MATERIAL, QUANTIDADE) VALUES (10, 1.000), (11, 0.500);
-- 2) Execute a procedure informando a venda e o usuário
--    EXEC dbo.sp_DevolverItensVendaSimples @ID_VENDA = 123, @ID_USUARIO = 5, @MOTIVO = N'Peça com defeito', @ITENS = @itens;
*/
