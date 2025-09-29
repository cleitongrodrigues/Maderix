----------------------------------------------------------------------------------
-- LOG DE MATERIAIS (INSERT, UPDATE, DELETE)
----------------------------------------------------------------------------------
CREATE TRIGGER trg_Materiais_Log
ON MATERIAIS
AFTER INSERT, UPDATE, DELETE
AS
BEGIN
    SET NOCOUNT ON;

    DECLARE @UsuarioID INT = ISNULL(CAST(SESSION_CONTEXT(N'UsuarioID') AS INT), 0);

    -- UPDATE ou DELETE
    IF EXISTS (SELECT 1 FROM deleted)
    BEGIN
        INSERT INTO LOG_SISTEMA
            (EmpresaID, UsuarioID, TabelaAfetada, Operacao, ChaveRegistro, ValoresAnteriores, ValoresNovos, DataOperacao)
        SELECT 
            d.EmpresaID,
            @UsuarioID,
            'MATERIAIS',
            CASE WHEN EXISTS(SELECT 1 FROM inserted i WHERE i.MaterialID = d.MaterialID) THEN 'UPDATE' ELSE 'DELETE' END,
            CAST(d.MaterialID AS VARCHAR(100)),
            CONCAT('Nome=', d.Nome, '; Estoque=', d.QuantidadeEstoque, '; Preco=', d.PrecoCusto),
            CASE WHEN EXISTS(SELECT 1 FROM inserted i WHERE i.MaterialID = d.MaterialID)
                 THEN (SELECT CONCAT('Nome=', i.Nome, '; Estoque=', i.QuantidadeEstoque, '; Preco=', i.PrecoCusto)
                       FROM inserted i WHERE i.MaterialID = d.MaterialID)
                 ELSE NULL END,
            GETDATE()
        FROM deleted d;
    END

    -- INSERT
    IF EXISTS (SELECT 1 FROM inserted i EXCEPT SELECT 1 FROM deleted)
    BEGIN
        INSERT INTO LOG_SISTEMA
            (EmpresaID, UsuarioID, TabelaAfetada, Operacao, ChaveRegistro, ValoresNovos, DataOperacao)
        SELECT 
            i.EmpresaID,
            @UsuarioID,
            'MATERIAIS',
            'INSERT',
            CAST(i.MaterialID AS VARCHAR(100)),
            CONCAT('Nome=', i.Nome, '; Estoque=', i.QuantidadeEstoque, '; Preco=', i.PrecoCusto),
            GETDATE()
        FROM inserted i;
    END
END;
GO

----------------------------------------------------------------------------------
-- LOG DE ESTORNOS DE PARCELAS (PARCELAS_RECEBER)
----------------------------------------------------------------------------------
CREATE TRIGGER trg_Estorno_Parcela_Log
ON PARCELAS_RECEBER
AFTER UPDATE
AS
BEGIN
    SET NOCOUNT ON;

    DECLARE @UsuarioID INT = ISNULL(CAST(SESSION_CONTEXT(N'UsuarioID') AS INT), 0);

    INSERT INTO LOG_SISTEMA
        (EmpresaID, UsuarioID, TabelaAfetada, Operacao, ChaveRegistro, ValoresAnteriores, ValoresNovos, DataOperacao)
    SELECT 
        i.EmpresaID,
        @UsuarioID,
        'PARCELAS_RECEBER',
        'ESTORNO',
        CAST(i.ParcelaReceberID AS VARCHAR(100)),
        CONCAT('ValorPago=', d.ValorPago, '; DataPagamento=', d.DataPagamento),
        CONCAT('ValorPago=', i.ValorPago, '; DataPagamento=', i.DataPagamento),
        GETDATE()
    FROM inserted i
    INNER JOIN deleted d ON i.ParcelaReceberID = d.ParcelaReceberID
    WHERE d.ValorPago IS NOT NULL AND (i.ValorPago IS NULL OR i.ValorPago < d.ValorPago);
END;
GO

----------------------------------------------------------------------------------
-- LOG DE ESTORNOS DE CONTAS A PAGAR
----------------------------------------------------------------------------------
CREATE TRIGGER trg_Estorno_ContaPagar_Log
ON CONTAS_PAGAR
AFTER UPDATE
AS
BEGIN
    SET NOCOUNT ON;

    DECLARE @UsuarioID INT = ISNULL(CAST(SESSION_CONTEXT(N'UsuarioID') AS INT), 0);

    INSERT INTO LOG_SISTEMA
        (EmpresaID, UsuarioID, TabelaAfetada, Operacao, ChaveRegistro, ValoresAnteriores, ValoresNovos, DataOperacao)
    SELECT 
        i.EmpresaID,
        @UsuarioID,
        'CONTAS_PAGAR',
        'ESTORNO',
        CAST(i.ContaPagarID AS VARCHAR(100)),
        CONCAT('ValorPago=', d.ValorPago, '; DataPagamento=', d.DataPagamento),
        CONCAT('ValorPago=', i.ValorPago, '; DataPagamento=', i.DataPagamento),
        GETDATE()
    FROM inserted i
    INNER JOIN deleted d ON i.ContaPagarID = d.ContaPagarID
    WHERE d.ValorPago IS NOT NULL AND (i.ValorPago IS NULL OR i.ValorPago < d.ValorPago);
END;
GO