-- ============================================================================
-- PROCEDURES PARA O SISTEMA MADERIX
-- ============================================================================
-- Versão: 1.0
-- Data: 03/11/2025
-- Compatível com: Creates.sql
-- ============================================================================

USE Maderix;
GO

-- ============================================================================
-- PROCEDURE: Registrar Nova Venda
-- ============================================================================
CREATE OR ALTER PROCEDURE sp_Registrar_Venda
    @ID_Empresa INT,
    @ID_Cliente INT,
    @ID_Usuario INT,
    @Valor_Total DECIMAL(10,2),
    @Status_Venda VARCHAR(50) = 'ABERTA',
    @ID_Venda INT OUTPUT
AS
BEGIN
    SET NOCOUNT ON;
    BEGIN TRANSACTION;
    
    BEGIN TRY
        -- Inserir a venda
        INSERT INTO VENDAS (ID_Cliente, ID_Empresa, ID_Usuario, Valor_Total, Status_Venda, DT_Venda)
        VALUES (@ID_Cliente, @ID_Empresa, @ID_Usuario, @Valor_Total, @Status_Venda, GETDATE());
        
        SET @ID_Venda = SCOPE_IDENTITY();
        
        COMMIT TRANSACTION;
        RETURN 0;
    END TRY
    BEGIN CATCH
        ROLLBACK TRANSACTION;
        THROW;
    END CATCH
END;
GO

-- ============================================================================
-- PROCEDURE: Adicionar Item à Venda
-- ============================================================================
CREATE OR ALTER PROCEDURE sp_Adicionar_Item_Venda
    @ID_Venda INT,
    @ID_Material INT,
    @SKU VARCHAR(60) = NULL,
    @Quantidade INT,
    @Preco_Unitario DECIMAL(10,2),
    @ID_Item_Venda INT OUTPUT
AS
BEGIN
    SET NOCOUNT ON;
    BEGIN TRANSACTION;
    
    BEGIN TRY
        DECLARE @Valor_Total_Item DECIMAL(10,2);
        SET @Valor_Total_Item = @Quantidade * @Preco_Unitario;
        
        -- Inserir item
        INSERT INTO ITENS_VENDA (ID_Venda, ID_Material, SKU, Quantidade, Preco_Unitario, Valor_Total_Item)
        VALUES (@ID_Venda, @ID_Material, @SKU, @Quantidade, @Preco_Unitario, @Valor_Total_Item);
        
        SET @ID_Item_Venda = SCOPE_IDENTITY();
        
        -- Atualizar valor total da venda
        UPDATE VENDAS
        SET Valor_Total = (SELECT SUM(Valor_Total_Item) FROM ITENS_VENDA WHERE ID_Venda = @ID_Venda)
        WHERE ID_Venda = @ID_Venda;
        
        COMMIT TRANSACTION;
        RETURN 0;
    END TRY
    BEGIN CATCH
        ROLLBACK TRANSACTION;
        THROW;
    END CATCH
END;
GO

-- ============================================================================
-- PROCEDURE: Registrar Movimentação de Estoque
-- ============================================================================
CREATE OR ALTER PROCEDURE sp_Registrar_Movimentacao_Estoque
    @ID_Material INT,
    @ID_Usuario INT = NULL,
    @ID_Venda INT = NULL,
    @Tipo_Movimento VARCHAR(50), -- 'ENTRADA', 'SAIDA', 'AJUSTE'
    @Quantidade INT,
    @Valor_Unitario DECIMAL(10,2),
    @Observacao VARCHAR(255) = NULL,
    @ID_Movimentacao INT OUTPUT
AS
BEGIN
    SET NOCOUNT ON;
    BEGIN TRANSACTION;
    
    BEGIN TRY
        -- Validar tipo de movimento
        IF @Tipo_Movimento NOT IN ('ENTRADA', 'SAIDA', 'AJUSTE')
        BEGIN
            RAISERROR('Tipo de movimento inválido. Use: ENTRADA, SAIDA ou AJUSTE', 16, 1);
            RETURN -1;
        END
        
        -- Inserir movimentação
        INSERT INTO MOVIMENTACAO_ESTOQUE (ID_Material, ID_Usuario, ID_Venda, Tipo_Movimento, Quantidade, Valor_Unitario, Observacao, DT_Movimentacao)
        VALUES (@ID_Material, @ID_Usuario, @ID_Venda, @Tipo_Movimento, @Quantidade, @Valor_Unitario, @Observacao, GETDATE());
        
        SET @ID_Movimentacao = SCOPE_IDENTITY();
        
        -- Atualizar estoque atual
        IF @Tipo_Movimento = 'ENTRADA' OR @Tipo_Movimento = 'AJUSTE'
        BEGIN
            UPDATE MATERIAIS
            SET Estoque_Atual = Estoque_Atual + @Quantidade
            WHERE ID_Material = @ID_Material;
        END
        ELSE IF @Tipo_Movimento = 'SAIDA'
        BEGIN
            -- Verificar se há estoque suficiente
            DECLARE @Estoque_Atual INT;
            SELECT @Estoque_Atual = Estoque_Atual FROM MATERIAIS WHERE ID_Material = @ID_Material;
            
            IF @Estoque_Atual < @Quantidade
            BEGIN
                RAISERROR('Estoque insuficiente para realizar a saída', 16, 1);
                ROLLBACK TRANSACTION;
                RETURN -1;
            END
            
            UPDATE MATERIAIS
            SET Estoque_Atual = Estoque_Atual - @Quantidade
            WHERE ID_Material = @ID_Material;
        END
        
        COMMIT TRANSACTION;
        RETURN 0;
    END TRY
    BEGIN CATCH
        ROLLBACK TRANSACTION;
        THROW;
    END CATCH
END;
GO

-- ============================================================================
-- PROCEDURE: Finalizar Venda (mudar status para CONCLUÍDA)
-- ============================================================================
CREATE OR ALTER PROCEDURE sp_Finalizar_Venda
    @ID_Venda INT,
    @ID_Usuario INT
AS
BEGIN
    SET NOCOUNT ON;
    BEGIN TRANSACTION;
    
    BEGIN TRY
        -- Atualizar status da venda
        UPDATE VENDAS
        SET Status_Venda = 'CONCLUÍDA'
        WHERE ID_Venda = @ID_Venda;
        
        -- Registrar saída de estoque para cada item
        DECLARE @ID_Material INT, @Quantidade INT, @Preco_Unitario DECIMAL(10,2);
        
        DECLARE cur_Itens CURSOR FOR
        SELECT ID_Material, Quantidade, Preco_Unitario
        FROM ITENS_VENDA
        WHERE ID_Venda = @ID_Venda;
        
        OPEN cur_Itens;
        FETCH NEXT FROM cur_Itens INTO @ID_Material, @Quantidade, @Preco_Unitario;
        
        WHILE @@FETCH_STATUS = 0
        BEGIN
            DECLARE @ID_Mov INT;
            EXEC sp_Registrar_Movimentacao_Estoque 
                @ID_Material = @ID_Material,
                @ID_Usuario = @ID_Usuario,
                @ID_Venda = @ID_Venda,
                @Tipo_Movimento = 'SAIDA',
                @Quantidade = @Quantidade,
                @Valor_Unitario = @Preco_Unitario,
                @Observacao = 'Saída por venda',
                @ID_Movimentacao = @ID_Mov OUTPUT;
            
            FETCH NEXT FROM cur_Itens INTO @ID_Material, @Quantidade, @Preco_Unitario;
        END
        
        CLOSE cur_Itens;
        DEALLOCATE cur_Itens;
        
        COMMIT TRANSACTION;
        RETURN 0;
    END TRY
    BEGIN CATCH
        IF CURSOR_STATUS('global','cur_Itens') >= 0
        BEGIN
            CLOSE cur_Itens;
            DEALLOCATE cur_Itens;
        END
        ROLLBACK TRANSACTION;
        THROW;
    END CATCH
END;
GO

-- ============================================================================
-- PROCEDURE: Cancelar Venda
-- ============================================================================
CREATE OR ALTER PROCEDURE sp_Cancelar_Venda
    @ID_Venda INT,
    @ID_Usuario INT,
    @Motivo VARCHAR(255)
AS
BEGIN
    SET NOCOUNT ON;
    BEGIN TRANSACTION;
    
    BEGIN TRY
        -- Verificar se já existe cancelamento
        IF EXISTS (SELECT 1 FROM CANCELAMENTOS_VENDA WHERE ID_Venda = @ID_Venda)
        BEGIN
            RAISERROR('Esta venda já foi cancelada anteriormente', 16, 1);
            RETURN -1;
        END
        
        -- Atualizar status da venda
        UPDATE VENDAS
        SET Status_Venda = 'CANCELADA'
        WHERE ID_Venda = @ID_Venda;
        
        -- Registrar o cancelamento
        INSERT INTO CANCELAMENTOS_VENDA (ID_Venda, ID_Usuario, Data_Evento, Motivo)
        VALUES (@ID_Venda, @ID_Usuario, GETDATE(), @Motivo);
        
        -- Marcar contas a receber como canceladas
        UPDATE CONTAS_RECEBER
        SET Cancelado = 1
        WHERE ID_Venda = @ID_Venda;
        
        COMMIT TRANSACTION;
        RETURN 0;
    END TRY
    BEGIN CATCH
        ROLLBACK TRANSACTION;
        THROW;
    END CATCH
END;
GO

-- ============================================================================
-- PROCEDURE: Registrar Pagamento de Venda
-- ============================================================================
CREATE OR ALTER PROCEDURE sp_Registrar_Pagamento_Venda
    @ID_Venda INT,
    @ID_Conta INT = NULL,
    @Tipo_Pagamento VARCHAR(20), -- 'PIX', 'Cartão', 'Dinheiro', 'Boleto'
    @Valor DECIMAL(10,2),
    @ID_Usuario INT,
    @Observacao VARCHAR(255) = NULL,
    @ID_Pagamento INT OUTPUT
AS
BEGIN
    SET NOCOUNT ON;
    BEGIN TRANSACTION;
    
    BEGIN TRY
        -- Registrar pagamento
        INSERT INTO PAGAMENTOS_VENDA (ID_Venda, ID_Conta, Data_Pagamento, Tipo_Pagamento, Valor, ID_Usuario, Observacao)
        VALUES (@ID_Venda, @ID_Conta, GETDATE(), @Tipo_Pagamento, @Valor, @ID_Usuario, @Observacao);
        
        SET @ID_Pagamento = SCOPE_IDENTITY();
        
        -- Se houver ID_Conta, marcar como paga
        IF @ID_Conta IS NOT NULL
        BEGIN
            UPDATE CONTAS_RECEBER
            SET Pago = 1,
                Data_Pagamento = GETDATE()
            WHERE ID_Conta = @ID_Conta;
        END
        
        COMMIT TRANSACTION;
        RETURN 0;
    END TRY
    BEGIN CATCH
        ROLLBACK TRANSACTION;
        THROW;
    END CATCH
END;
GO

-- ============================================================================
-- PROCEDURE: Gerar Conta a Receber de uma Venda
-- ============================================================================
CREATE OR ALTER PROCEDURE sp_Gerar_Conta_Receber
    @ID_Venda INT,
    @ID_Empresa INT,
    @Numero VARCHAR(50) = NULL,
    @Cliente VARCHAR(150) = NULL,
    @Descricao VARCHAR(255) = NULL,
    @Dias_Vencimento INT = 30,
    @ID_Conta INT OUTPUT
AS
BEGIN
    SET NOCOUNT ON;
    BEGIN TRANSACTION;
    
    BEGIN TRY
        DECLARE @Valor DECIMAL(10,2), @Data_Vencimento DATETIME;
        
        -- Buscar valor total da venda
        SELECT @Valor = Valor_Total FROM VENDAS WHERE ID_Venda = @ID_Venda;
        
        -- Calcular vencimento
        SET @Data_Vencimento = DATEADD(DAY, @Dias_Vencimento, GETDATE());
        
        -- Inserir conta a receber
        INSERT INTO CONTAS_RECEBER (ID_Venda, ID_Empresa, Numero, Cliente, Descricao, Valor, Data_Vencimento, Pago, DT_Cad_Conta, Cancelado)
        VALUES (@ID_Venda, @ID_Empresa, @Numero, @Cliente, @Descricao, @Valor, @Data_Vencimento, 0, GETDATE(), 0);
        
        SET @ID_Conta = SCOPE_IDENTITY();
        
        COMMIT TRANSACTION;
        RETURN 0;
    END TRY
    BEGIN CATCH
        ROLLBACK TRANSACTION;
        THROW;
    END CATCH
END;
GO

PRINT '============================================================================';
PRINT 'PROCEDURES CRIADAS COM SUCESSO!';
PRINT '============================================================================';
PRINT 'Total de Procedures: 8';
PRINT '- sp_Registrar_Venda';
PRINT '- sp_Adicionar_Item_Venda';
PRINT '- sp_Registrar_Movimentacao_Estoque';
PRINT '- sp_Finalizar_Venda';
PRINT '- sp_Cancelar_Venda';
PRINT '- sp_Registrar_Pagamento_Venda';
PRINT '- sp_Gerar_Conta_Receber';
PRINT '============================================================================';
GO