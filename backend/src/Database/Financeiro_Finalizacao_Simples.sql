/*
    Finalização de venda simplificada (SQL Server)
    - Preferência por procedures ao invés de triggers para regras de negócio
    - Cria procedure sp_FinalizarVendaSimples para:
        1) Validar venda
        2) Gerar saída de estoque
        3) Registrar recebimento à vista OU gerar parcelas no Contas a Receber (a prazo)
        4) Marcar venda como FECHADA

    Pré-requisitos:
    - Tabelas do arquivo Creates_Simples_Frontend.sql já criadas
    - Opcionalmente, execute antes o Financeiro_Cancelamento_Simples.sql (cria PAGAMENTOS_VENDA)
*/

SET ANSI_NULLS ON;
SET QUOTED_IDENTIFIER ON;
GO

-- Garantir que a tabela de pagamentos exista (caso o script de cancelamento não tenha sido rodado ainda)
IF NOT EXISTS (SELECT 1 FROM sys.tables WHERE name = 'PAGAMENTOS_VENDA' AND schema_id = SCHEMA_ID('dbo'))
BEGIN
    CREATE TABLE dbo.PAGAMENTOS_VENDA (
        ID_Pagamento    INT IDENTITY(1,1) PRIMARY KEY,
        ID_Venda        INT NOT NULL,
        Data_Pagamento  DATETIME NOT NULL DEFAULT (GETDATE()),
        Tipo_Pagamento  VARCHAR(20) COLLATE Latin1_General_CI_AS NOT NULL, -- DINHEIRO, CARTAO, PIX, REEMBOLSO
        Valor           DECIMAL(10,2) NOT NULL,
        ID_Usuario      INT NOT NULL,
        Observacao      VARCHAR(255) COLLATE Latin1_General_CI_AS NULL,
        CONSTRAINT FK_Pag_Venda2   FOREIGN KEY (ID_Venda)   REFERENCES dbo.VENDAS(ID_Venda),
        CONSTRAINT FK_Pag_Usuario2 FOREIGN KEY (ID_Usuario) REFERENCES dbo.USUARIOS(ID_Usuario)
    );
    CREATE INDEX IX_Pag_Venda2_Venda ON dbo.PAGAMENTOS_VENDA(ID_Venda);
END
GO

IF OBJECT_ID('dbo.sp_FinalizarVendaSimples','P') IS NOT NULL
    DROP PROCEDURE dbo.sp_FinalizarVendaSimples;
GO

CREATE PROCEDURE dbo.sp_FinalizarVendaSimples
    @ID_VENDA             INT,                 -- Venda a finalizar
    @ID_USUARIO           INT,                 -- Usuário responsável
    @FORMA                VARCHAR(20) = 'DINHEIRO', -- 'DINHEIRO' | 'CARTAO' | 'PIX' | 'APRAZO'
    @PARCELAS             INT = 1,             -- Nº de parcelas (se APRAZO)
    @PRIMEIRO_VENCIMENTO  DATE = NULL,         -- Primeiro vencimento (se APRAZO); padrão: hoje
    @DIAS_ENTRE_PARCELAS  INT = 30,            -- Intervalo entre parcelas
    @VALOR_PAGO_AVISTA    DECIMAL(18,2) = NULL -- Valor recebido à vista (se null, usa total líquido)
AS
BEGIN
    SET NOCOUNT ON;

    BEGIN TRY
        BEGIN TRAN;

        -- 1) Validar venda e status
                DECLARE @status VARCHAR(50);
                DECLARE @totalLiquido DECIMAL(10,2);
                SELECT @status = V.Status_Venda, @totalLiquido = V.Valor_Total
                    FROM dbo.VENDAS V
                 WHERE V.ID_Venda = @ID_VENDA;

        IF @status IS NULL
            RAISERROR('Venda não encontrada.',16,1);

        IF @status = 'CANCELADA'
            RAISERROR('Venda já cancelada; não pode ser finalizada.',16,1);

        IF @status = 'FECHADA'
        BEGIN
            -- Já finalizada: tornar idempotente
            ROLLBACK TRAN;
            RETURN;
        END

        -- Evitar dupla movimentação: se já existe movimento de VENDA para esta venda, não repetir
        IF EXISTS (
            SELECT 1 FROM dbo.MOVIMENTACAO_ESTOQUE ME
             WHERE ME.Tipo_Movimento = 'SAIDA' AND ME.ID_Venda = @ID_VENDA
        )
        BEGIN
            RAISERROR('Movimentação de estoque para esta venda já existe.',16,1);
        END

        -- 2) Gerar saída de estoque por item
        INSERT INTO dbo.MOVIMENTACAO_ESTOQUE (ID_Material, ID_Usuario, ID_Venda, Tipo_Movimento, Quantidade, Valor_Unitario, Observacao)
        SELECT I.ID_Material, @ID_USUARIO, @ID_VENDA, 'SAIDA', I.Quantidade, I.Preco_Unitario,
               'Saída por finalização de venda'
          FROM dbo.ITENS_VENDA I
         WHERE I.ID_Venda = @ID_VENDA;

        -- 2.1) Atualizar estoque atual dos materiais (subtraindo as quantidades vendidas)
        ;WITH Q AS (
                        SELECT I.ID_Material, SUM(I.Quantidade) AS QTD
              FROM dbo.ITENS_VENDA I
                         WHERE I.ID_Venda = @ID_VENDA
                         GROUP BY I.ID_Material
        )
        UPDATE M
                     SET M.Estoque_Atual = M.Estoque_Atual - Q.QTD
                    FROM dbo.MATERIAIS M
                    JOIN Q ON Q.ID_Material = M.ID_Material;

        -- 3) Financeiro: à vista (pagamento) OU a prazo (parcelas)
        IF UPPER(@FORMA) <> 'APRAZO'
        BEGIN
            DECLARE @valorReceber DECIMAL(10,2) = ISNULL(@VALOR_PAGO_AVISTA, @totalLiquido);
            IF @valorReceber <> 0
            BEGIN
                INSERT INTO dbo.PAGAMENTOS_VENDA (ID_Venda, Data_Pagamento, Tipo_Pagamento, Valor, ID_Usuario, Observacao)
                VALUES (@ID_VENDA, GETDATE(), @FORMA, @valorReceber, @ID_USUARIO, 'Recebimento por finalização de venda');
            END
        END
        ELSE
        BEGIN
            -- Geração de parcelas no Contas a Receber
            IF @PARCELAS IS NULL OR @PARCELAS < 1 SET @PARCELAS = 1;
            IF @PRIMEIRO_VENCIMENTO IS NULL SET @PRIMEIRO_VENCIMENTO = CAST(GETDATE() AS DATE);

            -- Evitar duplicidade de parcelas desta venda
            IF EXISTS (SELECT 1 FROM dbo.CONTAS_RECEBER WHERE ID_Venda = @ID_VENDA AND Cancelado = 0)
            BEGIN
                RAISERROR('Já existem parcelas em aberto para esta venda.',16,1);
            END

            DECLARE @base DECIMAL(10,2) = FLOOR((@totalLiquido / @PARCELAS) * 100) / 100.0;
            DECLARE @somaBase DECIMAL(10,2) = @base * @PARCELAS;
            DECLARE @resto DECIMAL(10,2) = @totalLiquido - @somaBase; -- centavos para ajustar na última parcela

            DECLARE @i INT = 1;
            WHILE @i <= @PARCELAS
            BEGIN
                DECLARE @valorParcela DECIMAL(10,2) = CASE WHEN @i = @PARCELAS THEN @base + @resto ELSE @base END;
                DECLARE @venc DATE = DATEADD(DAY, (@i-1) * @DIAS_ENTRE_PARCELAS, @PRIMEIRO_VENCIMENTO);

                INSERT INTO dbo.CONTAS_RECEBER (
                    ID_Venda, ID_Empresa, Descricao, Valor, Data_Vencimento, Pago, Data_Pagamento, DT_Cad_Conta, Cancelado
                )
                SELECT V.ID_Venda, V.ID_Empresa, 'Parcela ' + CAST(@i AS VARCHAR(10)) + ' gerada por finalização de venda',
                       @valorParcela, @venc, 0, NULL, GETDATE(), 0
                  FROM dbo.VENDAS V
                 WHERE V.ID_Venda = @ID_VENDA;

                SET @i += 1;
            END
        END

        -- 4) Marcar venda como FECHADA
        UPDATE dbo.VENDAS SET Status_Venda = 'FECHADA' WHERE ID_Venda = @ID_VENDA;

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
Como usar:
-- À vista (dinheiro) recebendo o total
EXEC dbo.sp_FinalizarVendaSimples @ID_VENDA = 123, @ID_USUARIO = 5, @FORMA = 'DINHEIRO';

-- À vista (cartão) recebendo valor específico (ex.: entrada diferente do total)
EXEC dbo.sp_FinalizarVendaSimples @ID_VENDA = 123, @ID_USUARIO = 5, @FORMA = 'CARTAO', @VALOR_PAGO_AVISTA = 100.00;

-- A prazo em 3x, primeiro vencimento daqui 10 dias, 30 dias entre parcelas
EXEC dbo.sp_FinalizarVendaSimples @ID_VENDA = 123, @ID_USUARIO = 5, @FORMA = 'APRAZO', @PARCELAS = 3, @PRIMEIRO_VENCIMENTO = DATEADD(DAY,10,CAST(GETDATE() AS DATE)), @DIAS_ENTRE_PARCELAS = 30;
*/
