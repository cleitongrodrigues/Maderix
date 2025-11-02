/*
    Financeiro e cancelamento simplificado (SQL Server)
    - Adiciona tabelas de Pagamentos e Cancelamentos
    - Ajusta Contas a Receber para suportar cancelamento
    - Cria procedure sp_CancelarVendaSimples para:
        1) Marcar a venda como CANCELADA
        2) Devolver o estoque (movimentação de entrada)
        3) Cancelar parcelas em aberto
        4) Registrar reembolso (pagamento negativo) se houver valores já recebidos

    Pré-requisitos:
    - Tabelas do arquivo Creates_Simples_Frontend.sql já criadas (VENDAS, ITENS_VENDA, MOVIMENTACAO_ESTOQUE, CONTAS_RECEBER, USUARIOS).
*/

SET ANSI_NULLS ON;
SET QUOTED_IDENTIFIER ON;
GO

/* ==========================================
   Ajuste em CONTAS_RECEBER: flag de cancelamento
   ========================================== */
IF COL_LENGTH('dbo.CONTAS_RECEBER','Cancelado') IS NULL
BEGIN
    ALTER TABLE dbo.CONTAS_RECEBER
    ADD Cancelado BIT NOT NULL DEFAULT (0); -- Indica se a parcela foi cancelada (não deve ser cobrada)
END
GO

/* =============================
   Tabela de Pagamentos de Venda
   ============================= */
IF NOT EXISTS (SELECT 1 FROM sys.tables WHERE name = 'PAGAMENTOS_VENDA' AND schema_id = SCHEMA_ID('dbo'))
BEGIN
    CREATE TABLE dbo.PAGAMENTOS_VENDA (
        ID_Pagamento    INT IDENTITY(1,1) PRIMARY KEY,   -- Identificador do pagamento
        ID_Venda        INT NOT NULL,                    -- Referência à venda (VENDAS)
        Data_Pagamento  DATETIME NOT NULL DEFAULT (GETDATE()), -- Data/hora do pagamento ou reembolso
        Tipo_Pagamento  VARCHAR(20) COLLATE Latin1_General_CI_AS NOT NULL, -- Forma: DINHEIRO, CARTAO, PIX, REEMBOLSO
        Valor           DECIMAL(10,2) NOT NULL,          -- Valor recebido (>0) ou reembolsado (<0)
        ID_Usuario      INT NOT NULL,                    -- Usuário que registrou o pagamento
        Observacao      VARCHAR(255) COLLATE Latin1_General_CI_AS NULL,    -- Observações (ex.: NSU, banco, motivo)
        CONSTRAINT FK_Pag_Venda    FOREIGN KEY (ID_Venda)   REFERENCES dbo.VENDAS(ID_Venda),
        CONSTRAINT FK_Pag_Usuario  FOREIGN KEY (ID_Usuario) REFERENCES dbo.USUARIOS(ID_Usuario)
    );

    -- Índices para consultas comuns
    CREATE INDEX IX_Pag_Venda_Venda   ON dbo.PAGAMENTOS_VENDA(ID_Venda);
    CREATE INDEX IX_Pag_Venda_Data    ON dbo.PAGAMENTOS_VENDA(Data_Pagamento);
END
GO

/* ===============================
   Tabela de Cancelamentos de Venda
   =============================== */
IF NOT EXISTS (SELECT 1 FROM sys.tables WHERE name = 'CANCELAMENTOS_VENDA' AND schema_id = SCHEMA_ID('dbo'))
BEGIN
    CREATE TABLE dbo.CANCELAMENTOS_VENDA (
        ID_Cancelamento INT IDENTITY(1,1) PRIMARY KEY,   -- Identificador do registro de cancelamento
        ID_Venda        INT NOT NULL,                    -- Venda cancelada
        ID_Usuario      INT NOT NULL,                    -- Usuário que efetuou o cancelamento
        Data_Evento     DATETIME NOT NULL DEFAULT (GETDATE()), -- Data/hora do cancelamento
        Motivo          VARCHAR(255) COLLATE Latin1_General_CI_AS NULL,              -- Motivo informado (opcional)
        CONSTRAINT FK_Canc_Venda   FOREIGN KEY (ID_Venda)   REFERENCES dbo.VENDAS(ID_Venda),
        CONSTRAINT FK_Canc_Usuario FOREIGN KEY (ID_Usuario) REFERENCES dbo.USUARIOS(ID_Usuario)
    );

    -- Uma venda só deve ser cancelada uma vez
    CREATE UNIQUE INDEX UX_Canc_Venda_Unica ON dbo.CANCELAMENTOS_VENDA(ID_Venda);
END
GO

/* =============================================
   Procedure: sp_CancelarVendaSimples
   ============================================= */
IF OBJECT_ID('dbo.sp_CancelarVendaSimples','P') IS NOT NULL
    DROP PROCEDURE dbo.sp_CancelarVendaSimples;
GO

CREATE PROCEDURE dbo.sp_CancelarVendaSimples
    @ID_VENDA   INT,                   -- Venda a ser cancelada
    @ID_USUARIO INT,                   -- Usuário que está cancelando
    @MOTIVO     NVARCHAR(255) = NULL   -- Motivo do cancelamento (opcional)
AS
BEGIN
    SET NOCOUNT ON;

    BEGIN TRY
        BEGIN TRAN;

        -- 1) Validar existência e status da venda
    DECLARE @status VARCHAR(50);
    SELECT @status = V.Status_Venda FROM dbo.VENDAS V WHERE V.ID_Venda = @ID_VENDA;

        IF @status IS NULL
        BEGIN
            RAISERROR('Venda não encontrada.', 16, 1);
        END

        IF @status = 'CANCELADA'
        BEGIN
            -- Já cancelada: nada a fazer
            ROLLBACK TRAN;
            RETURN;
        END

        -- 2) Marcar venda como CANCELADA
                UPDATE dbo.VENDAS
                     SET Status_Venda = 'CANCELADA'
                 WHERE ID_Venda = @ID_VENDA;

        -- 3) Registrar evento de cancelamento
    INSERT INTO dbo.CANCELAMENTOS_VENDA (ID_Venda, ID_Usuario, Motivo)
    VALUES (@ID_VENDA, @ID_USUARIO, @MOTIVO);

        -- 4) Devolver estoque (entrada para cada item da venda)
                INSERT INTO dbo.MOVIMENTACAO_ESTOQUE (ID_Material, ID_Usuario, ID_Venda, Tipo_Movimento, Quantidade, Valor_Unitario, Observacao)
                SELECT I.ID_Material, @ID_USUARIO, @ID_VENDA, 'ENTRADA', I.Quantidade, I.Preco_Unitario,
                             'Retorno de estoque por cancelamento'
                    FROM dbo.ITENS_VENDA I
                 WHERE I.ID_Venda = @ID_VENDA;

                -- 4.1) Atualizar estoque atual dos materiais (somando as quantidades devolvidas)
                ;WITH Q AS (
                        SELECT I.ID_Material, SUM(I.Quantidade) AS QTD
                            FROM dbo.ITENS_VENDA I
                         WHERE I.ID_Venda = @ID_VENDA
                         GROUP BY I.ID_Material
                )
                UPDATE M
                     SET M.Estoque_Atual = M.Estoque_Atual + Q.QTD
                    FROM dbo.MATERIAIS M
                    JOIN Q ON Q.ID_Material = M.ID_Material;

        -- 5) Cancelar parcelas em aberto (contas a receber) ligadas à venda
                UPDATE dbo.CONTAS_RECEBER
                     SET Cancelado = 1
                 WHERE ID_Venda = @ID_VENDA
                     AND Pago = 0
                     AND (Cancelado = 0);

        -- 6) Se houve pagamentos, registrar reembolso (pagamento negativo)
                DECLARE @valorPago DECIMAL(10,2) = (
                        SELECT ISNULL(SUM(P.Valor), 0)
                            FROM dbo.PAGAMENTOS_VENDA P
                         WHERE P.ID_Venda = @ID_VENDA
        );

        IF @valorPago > 0
        BEGIN
            INSERT INTO dbo.PAGAMENTOS_VENDA (ID_Venda, Data_Pagamento, Tipo_Pagamento, Valor, ID_Usuario, Observacao)
            VALUES (@ID_VENDA, GETDATE(), 'REEMBOLSO', -@valorPago, @ID_USUARIO, 'Reembolso automático por cancelamento');
        END

        COMMIT TRAN;
    END TRY
    BEGIN CATCH
        IF XACT_STATE() <> 0 ROLLBACK TRAN;
        DECLARE @ErrMsg NVARCHAR(4000) = ERROR_MESSAGE();
        RAISERROR(@ErrMsg, 16, 1);
    END CATCH
END
GO

/*
Como usar (exemplo):
-- Cancelar a venda 123 pelo usuário 5, informando motivo
EXEC dbo.sp_CancelarVendaSimples @ID_VENDA = 123, @ID_USUARIO = 5, @MOTIVO = N'Cliente desistiu';

Notas importantes:
- Este procedimento não apaga dados. Ele registra movimentos de retorno de estoque e pagamentos negativos (reembolso), garantindo histórico.
- Se você já abateu parcelas (PAGO=1) no CONTAS_RECEBER, mantenha-as como pagas e use o registro de reembolso em PAGAMENTOS_VENDA para representar o estorno.
- Para telas de relatórios, considere calcular o "valor líquido recebido" como SUM(VALOR) em PAGAMENTOS_VENDA por venda.
*/
