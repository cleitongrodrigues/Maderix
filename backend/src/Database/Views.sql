-- ============================================================================
-- VIEWS PARA O SISTEMA MADERIX
-- ============================================================================
-- Versão: 1.0
-- Data: 03/11/2025
-- Compatível com: Creates.sql
-- ============================================================================

USE Maderix;
GO

-- ============================================================================
-- VIEW: Resumo de Vendas por Cliente
-- ============================================================================
CREATE OR ALTER VIEW vw_Vendas_Por_Cliente AS
SELECT 
    c.ID_Cliente,
    c.NM_Cliente,
    c.Email,
    c.Tel_Cliente AS Telefone,
    COUNT(v.ID_Venda) AS Total_Vendas,
    SUM(v.Valor_Total) AS Valor_Total_Vendas,
    MAX(v.DT_Venda) AS Ultima_Venda,
    MIN(v.DT_Venda) AS Primeira_Venda
FROM CLIENTES c
LEFT JOIN VENDAS v ON c.ID_Cliente = v.ID_Cliente
GROUP BY c.ID_Cliente, c.NM_Cliente, c.Email, c.Tel_Cliente;
GO

-- ============================================================================
-- VIEW: Vendas Detalhadas com Informações Completas
-- ============================================================================
CREATE OR ALTER VIEW vw_Vendas_Detalhadas AS
SELECT 
    v.ID_Venda,
    v.DT_Venda,
    v.Status_Venda,
    v.Valor_Total,
    c.ID_Cliente,
    c.NM_Cliente,
    c.Email AS Email_Cliente,
    u.ID_Usuario,
    u.NM_Usuario,
    e.ID_Empresa,
    e.NM_Fantasia,
    e.CNPJ,
    COUNT(iv.ID_Item_Venda) AS Total_Itens,
    SUM(iv.Quantidade) AS Total_Quantidade_Itens
FROM VENDAS v
INNER JOIN CLIENTES c ON v.ID_Cliente = c.ID_Cliente
INNER JOIN USUARIOS u ON v.ID_Usuario = u.ID_Usuario
INNER JOIN EMPRESA e ON v.ID_Empresa = e.ID_Empresa
LEFT JOIN ITENS_VENDA iv ON v.ID_Venda = iv.ID_Venda
GROUP BY 
    v.ID_Venda, v.DT_Venda, v.Status_Venda, v.Valor_Total,
    c.ID_Cliente, c.NM_Cliente, c.Email,
    u.ID_Usuario, u.NM_Usuario,
    e.ID_Empresa, e.NM_Fantasia, e.CNPJ;
GO

-- ============================================================================
-- VIEW: Itens de Venda com Detalhes de Produto
-- ============================================================================
CREATE OR ALTER VIEW vw_Itens_Venda_Detalhados AS
SELECT 
    iv.ID_Item_Venda,
    iv.ID_Venda,
    v.DT_Venda,
    v.Status_Venda,
    iv.ID_Material,
    m.NM_Material,
    m.Categoria,
    m.Fornecedor,
    iv.SKU,
    iv.Quantidade,
    iv.Preco_Unitario,
    iv.Valor_Total_Item,
    u.ID_Unidade,
    u.Descricao AS NM_Unidade,
    u.Sigla AS Sigla_Unidade
FROM ITENS_VENDA iv
INNER JOIN VENDAS v ON iv.ID_Venda = v.ID_Venda
INNER JOIN MATERIAIS m ON iv.ID_Material = m.ID_Material
INNER JOIN UNIDADES_MEDIDA u ON m.ID_Unidade = u.ID_Unidade;
GO

-- ============================================================================
-- VIEW: Estoque Atual com Informações Completas
-- ============================================================================
CREATE OR ALTER VIEW vw_Estoque_Atual AS
SELECT 
    m.ID_Material,
    m.NM_Material,
    m.Categoria,
    m.Fornecedor,
    m.Estoque_Atual,
    m.Estoque_Minimo,
    u.Descricao AS NM_Unidade,
    u.Sigla AS Sigla_Unidade,
    e.NM_Fantasia AS Empresa,
    CASE 
        WHEN m.Estoque_Atual <= 0 THEN 'SEM ESTOQUE'
        WHEN m.Estoque_Atual <= m.Estoque_Minimo THEN 'ESTOQUE BAIXO'
        ELSE 'ESTOQUE OK'
    END AS Status_Estoque,
    CASE 
        WHEN m.Estoque_Atual <= 0 THEN 3
        WHEN m.Estoque_Atual <= m.Estoque_Minimo THEN 2
        ELSE 1
    END AS Prioridade_Reposicao
FROM MATERIAIS m
INNER JOIN UNIDADES_MEDIDA u ON m.ID_Unidade = u.ID_Unidade
INNER JOIN EMPRESA e ON m.ID_Empresa = e.ID_Empresa;
GO

-- ============================================================================
-- VIEW: Movimentações de Estoque Detalhadas
-- ============================================================================
CREATE OR ALTER VIEW vw_Movimentacoes_Estoque AS
SELECT 
    me.ID_Movimentacao,
    me.DT_Movimentacao,
    me.Tipo_Movimento,
    me.Quantidade,
    me.Valor_Unitario,
    me.Quantidade * me.Valor_Unitario AS Valor_Total,
    me.Observacao,
    m.ID_Material,
    m.NM_Material,
    m.Categoria,
    u.NM_Usuario,
    v.ID_Venda,
    v.Status_Venda
FROM MOVIMENTACAO_ESTOQUE me
INNER JOIN MATERIAIS m ON me.ID_Material = m.ID_Material
LEFT JOIN USUARIOS u ON me.ID_Usuario = u.ID_Usuario
LEFT JOIN VENDAS v ON me.ID_Venda = v.ID_Venda;
GO

-- ============================================================================
-- VIEW: Contas a Receber com Status
-- ============================================================================
CREATE OR ALTER VIEW vw_Contas_Receber AS
SELECT 
    cr.ID_Conta,
    cr.Numero,
    cr.Cliente,
    cr.Descricao,
    cr.Valor,
    cr.Data_Vencimento,
    cr.Data_Pagamento,
    cr.DT_Cad_Conta,
    cr.Pago,
    cr.Cancelado,
    e.NM_Fantasia AS Empresa,
    v.ID_Venda,
    v.Status_Venda,
    CASE 
        WHEN cr.Cancelado = 1 THEN 'CANCELADA'
        WHEN cr.Pago = 1 THEN 'PAGA'
        WHEN cr.Data_Vencimento < GETDATE() THEN 'VENCIDA'
        ELSE 'PENDENTE'
    END AS Status_Conta,
    CASE 
        WHEN cr.Cancelado = 1 OR cr.Pago = 1 THEN 0
        ELSE DATEDIFF(DAY, cr.Data_Vencimento, GETDATE())
    END AS Dias_Atraso
FROM CONTAS_RECEBER cr
INNER JOIN EMPRESA e ON cr.ID_Empresa = e.ID_Empresa
LEFT JOIN VENDAS v ON cr.ID_Venda = v.ID_Venda;
GO

-- ============================================================================
-- VIEW: Pagamentos de Vendas Detalhados
-- ============================================================================
CREATE OR ALTER VIEW vw_Pagamentos_Vendas AS
SELECT 
    pv.ID_Pagamento,
    pv.Data_Pagamento,
    pv.Tipo_Pagamento,
    pv.Valor,
    pv.Observacao,
    v.ID_Venda,
    v.DT_Venda,
    v.Status_Venda,
    v.Valor_Total AS Valor_Total_Venda,
    c.NM_Cliente,
    u.NM_Usuario AS Usuario_Registro,
    cr.ID_Conta,
    cr.Numero AS Numero_Conta
FROM PAGAMENTOS_VENDA pv
INNER JOIN VENDAS v ON pv.ID_Venda = v.ID_Venda
INNER JOIN CLIENTES c ON v.ID_Cliente = c.ID_Cliente
INNER JOIN USUARIOS u ON pv.ID_Usuario = u.ID_Usuario
LEFT JOIN CONTAS_RECEBER cr ON pv.ID_Conta = cr.ID_Conta;
GO

-- ============================================================================
-- VIEW: Cancelamentos de Vendas
-- ============================================================================
CREATE OR ALTER VIEW vw_Cancelamentos_Vendas AS
SELECT 
    cv.ID_Cancelamento,
    cv.Data_Evento,
    cv.Motivo,
    v.ID_Venda,
    v.DT_Venda,
    v.Valor_Total,
    c.NM_Cliente,
    u.NM_Usuario AS Usuario_Cancelamento,
    e.NM_Fantasia AS Empresa
FROM CANCELAMENTOS_VENDA cv
INNER JOIN VENDAS v ON cv.ID_Venda = v.ID_Venda
INNER JOIN CLIENTES c ON v.ID_Cliente = c.ID_Cliente
INNER JOIN USUARIOS u ON cv.ID_Usuario = u.ID_Usuario
INNER JOIN EMPRESA e ON v.ID_Empresa = e.ID_Empresa;
GO

-- ============================================================================
-- VIEW: Usuários com Perfis e Permissões
-- ============================================================================
CREATE OR ALTER VIEW vw_Usuarios_Perfis AS
SELECT 
    u.ID_Usuario,
    u.NM_Usuario,
    u.Email,
    u.Tel_Usuario AS Telefone,
    u.Ativo,
    e.NM_Fantasia AS Empresa,
    p.NM_Perfil,
    p.Descricao AS Descricao_Perfil,
    (SELECT COUNT(*) 
     FROM PERFIL_PERMISSAO pp 
     WHERE pp.ID_Perfil = p.ID_Perfil) AS Total_Permissoes
FROM USUARIOS u
INNER JOIN EMPRESA e ON u.ID_Empresa = e.ID_Empresa
INNER JOIN PERFIS_USUARIO p ON u.ID_Perfil = p.ID_Perfil;
GO

-- ============================================================================
-- VIEW: Resumo Financeiro por Empresa
-- ============================================================================
CREATE OR ALTER VIEW vw_Resumo_Financeiro_Empresa AS
SELECT 
    e.ID_Empresa,
    e.NM_Fantasia,
    e.CNPJ,
    COUNT(DISTINCT v.ID_Venda) AS Total_Vendas,
    SUM(v.Valor_Total) AS Valor_Total_Vendas,
    COUNT(DISTINCT cr.ID_Conta) AS Total_Contas_Receber,
    SUM(CASE WHEN cr.Pago = 0 AND cr.Cancelado = 0 THEN cr.Valor ELSE 0 END) AS Valor_Contas_Pendentes,
    SUM(CASE WHEN cr.Pago = 1 THEN cr.Valor ELSE 0 END) AS Valor_Contas_Pagas,
    COUNT(DISTINCT c.ID_Cliente) AS Total_Clientes,
    COUNT(DISTINCT m.ID_Material) AS Total_Materiais
FROM EMPRESA e
LEFT JOIN VENDAS v ON e.ID_Empresa = v.ID_Empresa
LEFT JOIN CONTAS_RECEBER cr ON e.ID_Empresa = cr.ID_Empresa
LEFT JOIN CLIENTES c ON e.ID_Empresa = c.ID_Empresa
LEFT JOIN MATERIAIS m ON e.ID_Empresa = m.ID_Empresa
GROUP BY e.ID_Empresa, e.NM_Fantasia, e.CNPJ;
GO

PRINT '============================================================================';
PRINT 'VIEWS CRIADAS COM SUCESSO!';
PRINT '============================================================================';
PRINT 'Total de Views: 10';
PRINT '- vw_Vendas_Por_Cliente';
PRINT '- vw_Vendas_Detalhadas';
PRINT '- vw_Itens_Venda_Detalhados';
PRINT '- vw_Estoque_Atual';
PRINT '- vw_Movimentacoes_Estoque';
PRINT '- vw_Contas_Receber';
PRINT '- vw_Pagamentos_Vendas';
PRINT '- vw_Cancelamentos_Vendas';
PRINT '- vw_Usuarios_Perfis';
PRINT '- vw_Resumo_Financeiro_Empresa';
PRINT '============================================================================';
GO

