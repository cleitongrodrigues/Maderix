----------------------------------------------------------------------------------
-- PROCEDURE: Registrar venda
----------------------------------------------------------------------------------
CREATE PROCEDURE st_RegistrarVenda
    @EmpresaID INT,
    @ClienteID INT,
    @ValorTotal DECIMAL(12,2),
    @DataVenda DATE,
    @UsuarioID INT,
    @VendaID INT OUTPUT
AS
BEGIN
    SET NOCOUNT ON;

    -- Inserir a venda
    INSERT INTO VENDAS (EmpresaID, ClienteID, ValorTotal, DataVenda)
    VALUES (@EmpresaID, @ClienteID, @ValorTotal, @DataVenda);

    SET @VendaID = SCOPE_IDENTITY();

    -- Criar contas a receber
    INSERT INTO CONTAS_RECEBER (EmpresaID, ClienteID, VendaID, PlanoContaID, Valor, DataVencimento, Status)
    VALUES (@EmpresaID, @ClienteID, @VendaID, 1, @ValorTotal, DATEADD(DAY,30,@DataVenda), 'Aberto');

    -- Registrar log
    INSERT INTO LOG_SISTEMA (EmpresaID, UsuarioID, TabelaAfetada, Operacao, ChaveRegistro, ValoresNovos, DataOperacao)
    VALUES (@EmpresaID, @UsuarioID, 'VENDAS', 'INSERT', CAST(@VendaID AS VARCHAR(100)), CONCAT('ClienteID=', @ClienteID,'; ValorTotal=', @ValorTotal), GETDATE());
END;
GO

----------------------------------------------------------------------------------
-- PROCEDURE: Registrar movimentação de estoque (entrada ou saída)
----------------------------------------------------------------------------------
CREATE PROCEDURE st_RegistrarMovimentacaoEstoque
    @MaterialID INT,
    @Quantidade DECIMAL(12,2),
    @TipoMovimentacao VARCHAR(20), -- 'Entrada' ou 'Saida'
    @DataMovimentacao DATE,
    @EmpresaID INT,
    @UsuarioID INT
AS
BEGIN
    SET NOCOUNT ON;

    -- Inserir movimentação
    INSERT INTO MOVIMENTACAO_ESTOQUE (MaterialID, Quantidade, TipoMovimentacao, DataMovimentacao)
    VALUES (@MaterialID, @Quantidade, @TipoMovimentacao, @DataMovimentacao);

    -- Atualizar estoque
    UPDATE M
    SET M.QuantidadeEstoque = CASE 
        WHEN @TipoMovimentacao LIKE 'Entrada%' THEN M.QuantidadeEstoque + @Quantidade
        WHEN @TipoMovimentacao LIKE 'Saida%' THEN M.QuantidadeEstoque - @Quantidade
        ELSE M.QuantidadeEstoque
    END
    FROM MATERIAIS M
    WHERE M.MaterialID = @MaterialID;

    -- Registrar contas a pagar para entradas
    IF @TipoMovimentacao LIKE 'Entrada%'
    BEGIN
        DECLARE @FornecedorID INT;
        SELECT @FornecedorID = FornecedorID FROM FORNECEDORES WHERE EmpresaID = @EmpresaID;

        INSERT INTO CONTAS_PAGAR (EmpresaID, FornecedorID, PlanoContaID, Valor, DataVencimento, Status)
        SELECT @EmpresaID, @FornecedorID, 2, @Quantidade * PrecoCusto, DATEADD(DAY,30,@DataMovimentacao), 'Aberto'
        FROM MATERIAIS WHERE MaterialID = @MaterialID;
    END

    -- Registrar log
    INSERT INTO LOG_SISTEMA (EmpresaID, UsuarioID, TabelaAfetada, Operacao, ChaveRegistro, ValoresNovos, DataOperacao)
    VALUES (@EmpresaID, @UsuarioID, 'MOVIMENTACAO_ESTOQUE', 'INSERT', CAST(SCOPE_IDENTITY() AS VARCHAR(100)), CONCAT('MaterialID=', @MaterialID, '; Tipo=', @TipoMovimentacao, '; Qtd=', @Quantidade), GETDATE());
END;
GO

----------------------------------------------------------------------------------
-- PROCEDURE: Registrar entrada de materiais
----------------------------------------------------------------------------------
CREATE PROCEDURE st_RegistrarEntradaMateriais
    @EmpresaID INT,
    @UsuarioID INT,
    @DataEntrada DATE,
    @Itens TABLE (MaterialID INT, Quantidade DECIMAL(12,2)),
    @EntradaID INT OUTPUT
AS
BEGIN
    SET NOCOUNT ON;

    -- Inserir cabeçalho da entrada
    INSERT INTO ENTRADA_MATERIAIS (EmpresaID, DataEntrada)
    VALUES (@EmpresaID, @DataEntrada);

    SET @EntradaID = SCOPE_IDENTITY();

    -- Inserir itens
    INSERT INTO ENTRADA_MATERIAIS_ITENS (EntradaID, MaterialID, Quantidade)
    SELECT @EntradaID, MaterialID, Quantidade FROM @Itens;

    -- Atualizar estoque
    UPDATE M
    SET M.QuantidadeEstoque = M.QuantidadeEstoque + I.Quantidade
    FROM MATERIAIS M
    INNER JOIN @Itens I ON I.MaterialID = M.MaterialID;

    -- Registrar log
    DECLARE @ItemMaterialID INT, @ItemQtd DECIMAL(12,2);
    DECLARE curItens CURSOR FOR SELECT MaterialID, Quantidade FROM @Itens;
    OPEN curItens;
    FETCH NEXT FROM curItens INTO @ItemMaterialID, @ItemQtd;
    WHILE @@FETCH_STATUS = 0
    BEGIN
        INSERT INTO LOG_SISTEMA (EmpresaID, UsuarioID, TabelaAfetada, Operacao, ChaveRegistro, ValoresNovos, DataOperacao)
        VALUES (@EmpresaID, @UsuarioID, 'ENTRADA_MATERIAIS', 'INSERT', CAST(@EntradaID AS VARCHAR(100)), CONCAT('MaterialID=', @ItemMaterialID, '; Quantidade=', @ItemQtd), GETDATE());

        FETCH NEXT FROM curItens INTO @ItemMaterialID, @ItemQtd;
    END
    CLOSE curItens;
    DEALLOCATE curItens;
END;
GO

----------------------------------------------------------------------------------
-- PROCEDURE: Receber pagamento (conta a receber ou parcela)
----------------------------------------------------------------------------------
CREATE PROCEDURE st_ReceberPagamento
    @ContaReceberID INT,
    @ValorPago DECIMAL(12,2),
    @DataPagamento DATE,
    @UsuarioID INT
AS
BEGIN
    SET NOCOUNT ON;

    -- Atualiza a conta
    UPDATE CONTAS_RECEBER
    SET ValorPago = @ValorPago,
        DataPagamento = @DataPagamento,
        Status = 'Pago'
    WHERE ContaReceberID = @ContaReceberID;

    -- Lança no caixa
    INSERT INTO CAIXA_BANCOS (EmpresaID, PlanoContaID, TipoMovimento, Valor, Historico, Origem, ReferenciaID)
    SELECT EmpresaID, PlanoContaID, 'E', @ValorPago, 'Recebimento de Cliente', 'ContaReceber', @ContaReceberID
    FROM CONTAS_RECEBER
    WHERE ContaReceberID = @ContaReceberID;

    -- Log
    INSERT INTO LOG_SISTEMA (EmpresaID, UsuarioID, TabelaAfetada, Operacao, ChaveRegistro, ValoresNovos, DataOperacao)
    SELECT EmpresaID, @UsuarioID, 'CONTAS_RECEBER', 'PAGAMENTO', CAST(ContaReceberID AS VARCHAR(100)), CONCAT('ValorPago=', @ValorPago, '; DataPagamento=', @DataPagamento), GETDATE()
    FROM CONTAS_RECEBER WHERE ContaReceberID = @ContaReceberID;
END;
GO

----------------------------------------------------------------------------------
-- PROCEDURE: Pagar conta (contas a pagar)
----------------------------------------------------------------------------------
CREATE PROCEDURE st_PagarConta
    @ContaPagarID INT,
    @ValorPago DECIMAL(12,2),
    @DataPagamento DATE,
    @UsuarioID INT
AS
BEGIN
    SET NOCOUNT ON;

    -- Atualiza a conta
    UPDATE CONTAS_PAGAR
    SET ValorPago = @ValorPago,
        DataPagamento = @DataPagamento,
        Status = 'Pago'
    WHERE ContaPagarID = @ContaPagarID;

    -- Lança no caixa (saída)
    INSERT INTO CAIXA_BANCOS (EmpresaID, PlanoContaID, TipoMovimento, Valor, Historico, Origem, ReferenciaID)
    SELECT EmpresaID, PlanoContaID, 'S', @ValorPago, 'Pagamento a Fornecedor', 'ContaPagar', @ContaPagarID
    FROM CONTAS_PAGAR
    WHERE ContaPagarID = @ContaPagarID;

    -- Log
    INSERT INTO LOG_SISTEMA (EmpresaID, UsuarioID, TabelaAfetada, Operacao, ChaveRegistro, ValoresNovos, DataOperacao)
    SELECT EmpresaID, @UsuarioID, 'CONTAS_PAGAR', 'PAGAMENTO', CAST(ContaPagarID AS VARCHAR(100)), CONCAT('ValorPago=', @ValorPago, '; DataPagamento=', @DataPagamento), GETDATE()
    FROM CONTAS_PAGAR WHERE ContaPagarID = @ContaPagarID;
END;
GO

----------------------------------------------------------------------------------
-- PROCEDURE: Relatório de fluxo de caixa
----------------------------------------------------------------------------------
CREATE PROCEDURE st_RelatorioFluxoCaixa
    @DataInicio DATE,
    @DataFim DATE
AS
BEGIN
    SET NOCOUNT ON;

    -- Relatório detalhado de entradas e saídas
    SELECT 
        c.EmpresaID,
        e.NomeFantasia AS Empresa,
        c.TipoMovimento,
        SUM(c.Valor) AS Total,
        COUNT(*) AS QtdeMovimentos
    FROM CAIXA_BANCOS c
    INNER JOIN EMPRESA e ON e.EmpresaID = c.EmpresaID
    WHERE c.DataMovimento BETWEEN @DataInicio AND DATEADD(DAY, 1, @DataFim)
    GROUP BY c.EmpresaID, e.NomeFantasia, c.TipoMovimento
    ORDER BY e.NomeFantasia, c.TipoMovimento;

    -- Saldo consolidado
    SELECT 
        c.EmpresaID,
        e.NomeFantasia AS Empresa,
        SUM(CASE WHEN c.TipoMovimento = 'E' THEN c.Valor ELSE 0 END) -
        SUM(CASE WHEN c.TipoMovimento = 'S' THEN c.Valor ELSE 0 END) AS Saldo
    FROM CAIXA_BANCOS c
    INNER JOIN EMPRESA e ON e.EmpresaID = c.EmpresaID
    WHERE c.DataMovimento BETWEEN @DataInicio AND DATEADD(DAY, 1, @DataFim)
    GROUP BY c.EmpresaID, e.NomeFantasia
    ORDER BY e.NomeFantasia;
END;
GO

----------------------------------------------------------------------------------
-- PROCEDURE: Estornar pagamento de parcela
----------------------------------------------------------------------------------
CREATE PROCEDURE st_EstornarParcela
    @ParcelaReceberID INT,
    @UsuarioID INT
AS
BEGIN
    SET NOCOUNT ON;

    DECLARE @ValorPago DECIMAL(12,2), @DataPagamento DATE, @EmpresaID INT;

    SELECT @ValorPago = ValorPago, @DataPagamento = DataPagamento, @EmpresaID = EmpresaID
    FROM PARCELAS_RECEBER WHERE ParcelaReceberID = @ParcelaReceberID;

    -- Estorna a parcela
    UPDATE PARCELAS_RECEBER
    SET ValorPago = NULL, DataPagamento = NULL, Status = 'Aberto'
    WHERE ParcelaReceberID = @ParcelaReceberID;

    -- Remove lançamento no caixa
    DELETE FROM CAIXA_BANCOS WHERE Origem = 'ParcelaReceber' AND ReferenciaID = @ParcelaReceberID;

    -- Log
    INSERT INTO LOG_SISTEMA (EmpresaID, UsuarioID, TabelaAfetada, Operacao, ChaveRegistro, ValoresAnteriores, ValoresNovos, DataOperacao)
    VALUES (@EmpresaID, @UsuarioID, 'PARCELAS_RECEBER', 'ESTORNO', CAST(@ParcelaReceberID AS VARCHAR(100)), CONCAT('ValorPago=', @ValorPago, '; DataPagamento=', @DataPagamento), 'NULL', GETDATE());
END;
GO

----------------------------------------------------------------------------------
-- PROCEDURE: Estornar pagamento de conta a pagar
----------------------------------------------------------------------------------
CREATE PROCEDURE st_EstornarContaPagar
    @ContaPagarID INT,
    @UsuarioID INT
AS
BEGIN
    SET NOCOUNT ON;

    DECLARE @ValorPago DECIMAL(12,2), @DataPagamento DATE, @EmpresaID INT;

    SELECT @ValorPago = ValorPago, @DataPagamento = DataPagamento, @EmpresaID = EmpresaID
    FROM CONTAS_PAGAR WHERE ContaPagarID = @ContaPagarID;

    -- Estorna a conta
    UPDATE CONTAS_PAGAR
    SET ValorPago = NULL, DataPagamento = NULL, Status = 'Aberto'
    WHERE ContaPagarID = @ContaPagarID;

    -- Remove lançamento no caixa
    DELETE FROM CAIXA_BANCOS WHERE Origem = 'ContaPagar' AND ReferenciaID = @ContaPagarID;

    -- Log
    INSERT INTO LOG_SISTEMA (EmpresaID, UsuarioID, TabelaAfetada, Operacao, ChaveRegistro, ValoresAnteriores, ValoresNovos, DataOperacao)
    VALUES (@EmpresaID, @UsuarioID, 'CONTAS_PAGAR', 'ESTORNO', CAST(@ContaPagarID AS VARCHAR(100)), CONCAT('ValorPago=', @ValorPago, '; DataPagamento=', @DataPagamento), 'NULL', GETDATE());
END;
GO