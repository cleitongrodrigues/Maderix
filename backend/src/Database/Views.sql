```sql
CREATE VIEW vw_FluxoCaixaDetalhado
AS
SELECT 
    c.MovimentoID,
    c.EmpresaID,
    e.NomeFantasia AS Empresa,
    c.PlanoContaID,
    pc.Descricao AS ContaContabil,
    c.TipoMovimento, -- E = Entrada | S = Saída
    c.Valor,
    c.DataMovimento,
    c.Historico,
    c.Origem,        -- Ex: Venda, Compra, ContaReceber, ContaPagar
    c.ReferenciaID   -- ID da origem (ex: VendaID, ContaPagarID)
FROM CAIXA_BANCOS c
INNER JOIN EMPRESA e ON e.EmpresaID = c.EmpresaID
INNER JOIN PLANO_CONTAS pc ON pc.PlanoContaID = c.PlanoContaID;
```

