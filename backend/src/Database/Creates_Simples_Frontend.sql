/*
    Script simplificado de criação de tabelas para atender o frontend (Maderix)
    - Foco em simplicidade e clareza para iniciantes
      - Tabelas cobrem: Empresa, Perfis/Permissões, Usuários, Unidades, Produtos (Materiais), Clientes,
         Vendas e Itens, Movimentação de Estoque, Contas a Receber, Pagamentos e Cancelamentos
    - Comentário em cada campo explicando a finalidade

    Observações:
    - Este script assume SQL Server (T-SQL). Execute no banco desejado antes de começar a usar o app.
    - Tipos de dados escolhidos para serem práticos (NVARCHAR para acentos; DECIMAL para valores/quantidades).
    - Colunas com padrão de datas usam GETDATE(); ajuste se preferir fuso horário UTC.
*/

SET ANSI_NULLS ON;
SET QUOTED_IDENTIFIER ON;
GO

/* =========================
   EMPRESAS (multi-empresa)
   ========================= */
CREATE TABLE dbo.EMPRESAS (
    ID               INT IDENTITY(1,1) PRIMARY KEY,      -- Identificador único da empresa
    NOME             NVARCHAR(150) NOT NULL,             -- Nome fantasia/razão social da empresa
    CNPJ             NVARCHAR(20) NULL,                  -- Documento da empresa (CNPJ)
    TELEFONE         NVARCHAR(20) NULL,                  -- Telefone para contato
    EMAIL            NVARCHAR(150) NULL,                 -- E-mail da empresa
    ATIVO            BIT NOT NULL DEFAULT (1),           -- Indicador se a empresa está ativa
    CRIADO_EM        DATETIME2 NOT NULL DEFAULT (GETDATE()) -- Data/hora de criação do registro
);
GO

/* ==========================================
   PERFIS_USUARIO (papéis como Admin, Vendedor)
   ========================================== */
CREATE TABLE dbo.PERFIS_USUARIO (
    ID          INT IDENTITY(1,1) PRIMARY KEY,           -- Identificador do perfil
    NOME        NVARCHAR(100) NOT NULL UNIQUE,           -- Nome do perfil (ex.: Admin, Vendedor)
    DESCRICAO   NVARCHAR(255) NULL,                      -- Descrição amigável do perfil
    ATIVO       BIT NOT NULL DEFAULT (1)                 -- Indicador se o perfil está ativo
);
GO

/* =====================================
   PERMISSOES (códigos usados no frontend)
   ===================================== */
CREATE TABLE dbo.PERMISSOES (
    ID          INT IDENTITY(1,1) PRIMARY KEY,           -- Identificador da permissão
    CODIGO      NVARCHAR(100) NOT NULL UNIQUE,           -- Código único (deve casar com o frontend)
    NOME        NVARCHAR(150) NOT NULL,                  -- Nome amigável da permissão
    DESCRICAO   NVARCHAR(255) NULL                       -- Descrição do que a permissão permite
);
GO

/* ===========================================================
   PERFIL_PERMISSAO (tabela de ligação Perfil x Permissão)
   =========================================================== */
CREATE TABLE dbo.PERFIL_PERMISSAO (
    ID_PERFIL       INT NOT NULL,                         -- Referência ao perfil (PERFIS_USUARIO)
    ID_PERMISSAO    INT NOT NULL,                         -- Referência à permissão (PERMISSOES)
    CONSTRAINT PK_PERFIL_PERMISSAO PRIMARY KEY (ID_PERFIL, ID_PERMISSAO), -- Evita duplicidade
    CONSTRAINT FK_PP_PERFIL FOREIGN KEY (ID_PERFIL) REFERENCES dbo.PERFIS_USUARIO(ID),
    CONSTRAINT FK_PP_PERMISSAO FOREIGN KEY (ID_PERMISSAO) REFERENCES dbo.PERMISSOES(ID)
);
GO

/* =============================
   USUARIOS (usuários do sistema)
   ============================= */
CREATE TABLE dbo.USUARIOS (
    ID              INT IDENTITY(1,1) PRIMARY KEY,       -- Identificador do usuário
    ID_EMPRESA      INT NOT NULL,                         -- Empresa a qual o usuário pertence
    ID_PERFIL       INT NOT NULL,                         -- Perfil (papel) do usuário
    NOME            NVARCHAR(150) NOT NULL,              -- Nome completo do usuário
    EMAIL           NVARCHAR(150) NOT NULL UNIQUE,       -- E-mail (também pode ser usado para login)
    LOGIN           NVARCHAR(60)  NOT NULL UNIQUE,       -- Login de acesso (apelido/username)
    SENHA_HASH      NVARCHAR(200) NOT NULL,              -- Hash da senha (nunca armazene senha em texto plano)
    TELEFONE        NVARCHAR(20) NULL,                   -- Telefone do usuário
    ATIVO           BIT NOT NULL DEFAULT (1),             -- Indicador se o usuário está ativo
    ULTIMO_LOGIN    DATETIME2 NULL,                      -- Data/hora do último login
    CRIADO_EM       DATETIME2 NOT NULL DEFAULT (GETDATE()), -- Data/hora de criação do registro
    CONSTRAINT FK_USUARIOS_EMPRESA FOREIGN KEY (ID_EMPRESA) REFERENCES dbo.EMPRESAS(ID),
    CONSTRAINT FK_USUARIOS_PERFIL  FOREIGN KEY (ID_PERFIL)  REFERENCES dbo.PERFIS_USUARIO(ID)
);
GO

/* ==========================================
   UNIDADES_MEDIDA (ex.: UN, KG, M, CX)
   ========================================== */
CREATE TABLE dbo.UNIDADES_MEDIDA (
    ID          INT IDENTITY(1,1) PRIMARY KEY,           -- Identificador da unidade de medida
    SIGLA       NVARCHAR(10) NOT NULL UNIQUE,            -- Sigla (ex.: UN, KG, M)
    DESCRICAO   NVARCHAR(60) NOT NULL,                   -- Descrição da unidade (ex.: Unidade, Quilograma)
    ATIVO       BIT NOT NULL DEFAULT (1)                 -- Indicador se a unidade está ativa
);
GO

/* ============================
   MATERIAIS (produtos/itens)
   ============================ */
CREATE TABLE dbo.MATERIAIS (
    ID              INT IDENTITY(1,1) PRIMARY KEY,       -- Identificador do produto/material
    ID_EMPRESA      INT NOT NULL,                         -- Empresa dona do produto
    NOME            NVARCHAR(150) NOT NULL,              -- Nome do produto/material
    CODIGO          NVARCHAR(60) NOT NULL UNIQUE,        -- Código/SKU do produto
    ID_UNIDADE      INT NOT NULL,                         -- Unidade de medida (UNIDADES_MEDIDA)
    PRECO_VENDA     DECIMAL(18,2) NOT NULL DEFAULT (0),  -- Preço de venda atual
    CUSTO_MEDIO     DECIMAL(18,2) NOT NULL DEFAULT (0),  -- Custo médio de aquisição
    ESTOQUE_ATUAL   DECIMAL(18,3) NOT NULL DEFAULT (0),  -- Estoque atual (com 3 casas decimais)
    ATIVO           BIT NOT NULL DEFAULT (1),             -- Indicador se o produto está ativo
    CRIADO_EM       DATETIME2 NOT NULL DEFAULT (GETDATE()), -- Data/hora de criação do registro
    CONSTRAINT FK_MATERIAIS_EMPRESA FOREIGN KEY (ID_EMPRESA) REFERENCES dbo.EMPRESAS(ID),
   /*
       Script de criação de tabelas (compatível com Creates.sql existente)
       - Mantém nomes de tabelas e colunas já usados pelo backend (JPA)
       - Adiciona tabelas necessárias ao financeiro (Pagamentos/Cancelamentos) e coluna Cancelado em CONTAS_RECEBER
       - Comentários explicativos em cada coluna

       Observações:
       - SQL Server (T-SQL). Execute no banco correto antes de iniciar o app.
       - Tipos seguem o padrão do Creates.sql: Varchar com COLLATE Latin1_General_CI_AS e Decimal(10,2).
   */

   SET ANSI_NULLS ON;
   SET QUOTED_IDENTIFIER ON;
   GO

   /* =====================
      EMPRESA (multi-empresa)
      ===================== */
   CREATE TABLE dbo.EMPRESA (
       ID_Empresa      INT IDENTITY(1,1) PRIMARY KEY,                     -- Identificador único da empresa
       NM_Fantasia     VARCHAR(150) COLLATE Latin1_General_CI_AS NOT NULL,-- Nome fantasia da empresa
       RZ_Social       VARCHAR(150) COLLATE Latin1_General_CI_AS NULL,    -- Razão social (opcional)
       CNPJ            VARCHAR(18)  COLLATE Latin1_General_CI_AS UNIQUE,  -- CNPJ (formato com máscara)
       DT_Cad_Empresa  DATETIME     NOT NULL DEFAULT GETDATE()            -- Data/hora do cadastro
   );
   GO

   /* ========================
      PERFIS_USUARIO (papéis)
      ======================== */
   CREATE TABLE dbo.PERFIS_USUARIO (
       ID_Perfil   INT IDENTITY(1,1) PRIMARY KEY,                         -- Identificador do perfil
       NM_Perfil   VARCHAR(50) COLLATE Latin1_General_CI_AS NOT NULL UNIQUE -- Nome do perfil (ex.: Admin, Vendedor)
   );
   GO

   /* ==========================
      USUARIOS (usuários do app)
      ========================== */
   CREATE TABLE dbo.USUARIOS (
       ID_Usuario     INT IDENTITY(1,1) PRIMARY KEY,                      -- Identificador do usuário
       ID_Empresa     INT NOT NULL,                                       -- Empresa do usuário (FK)
       ID_Perfil      INT NOT NULL,                                       -- Perfil do usuário (FK)
       NM_Usuario     VARCHAR(150) COLLATE Latin1_General_CI_AS NOT NULL, -- Nome completo do usuário
       Email          VARCHAR(100) COLLATE Latin1_General_CI_AS NOT NULL UNIQUE, -- E-mail (único)
       Tel_Usuario    VARCHAR(20)  COLLATE Latin1_General_CI_AS NULL,     -- Telefone de contato
       Senha          VARCHAR(255) COLLATE Latin1_General_CI_AS NOT NULL, -- Senha (hash)
       DT_Cad_Usuario DATETIME NOT NULL DEFAULT GETDATE(),                -- Data/hora do cadastro
       CONSTRAINT FK_Usuario_Empresa FOREIGN KEY (ID_Empresa) REFERENCES EMPRESA(ID_Empresa),
       CONSTRAINT FK_Usuario_Perfil  FOREIGN KEY (ID_Perfil)  REFERENCES PERFIS_USUARIO(ID_Perfil)
   );
   GO

   /* ========================
      CLIENTES (cadastro base)
      ======================== */
   CREATE TABLE dbo.CLIENTES (
       ID_Cliente     INT IDENTITY(1,1) PRIMARY KEY,                      -- Identificador do cliente
       ID_Empresa     INT NOT NULL,                                       -- Empresa à qual o cliente pertence (FK)
       NM_Cliente     VARCHAR(150) COLLATE Latin1_General_CI_AS NOT NULL, -- Nome do cliente
       Tel_Cliente    VARCHAR(20)  COLLATE Latin1_General_CI_AS NULL,     -- Telefone do cliente
       Email          VARCHAR(100) COLLATE Latin1_General_CI_AS NULL,     -- E-mail do cliente
       DT_Cad_Cliente DATETIME NOT NULL DEFAULT GETDATE(),                -- Data/hora do cadastro
       CONSTRAINT FK_Cliente_Empresa FOREIGN KEY (ID_Empresa) REFERENCES EMPRESA(ID_Empresa)
   );
   GO

   /* =========================
      VENDAS (cabeçalho venda)
      ========================= */
   CREATE TABLE dbo.VENDAS (
       ID_Venda      INT IDENTITY(1,1) PRIMARY KEY,                       -- Identificador da venda
       ID_Cliente    INT NOT NULL,                                        -- Cliente (FK)
       ID_Empresa    INT NOT NULL,                                        -- Empresa (FK)
       ID_Usuario    INT NULL,                                            -- Usuário vendedor (FK)
       Valor_Total   DECIMAL(10,2) NOT NULL,                              -- Total da venda (definido pela aplicação)
       Status_Venda  VARCHAR(50) COLLATE Latin1_General_CI_AS NOT NULL DEFAULT 'ABERTA', -- Status da venda
       DT_Venda      DATETIME NOT NULL DEFAULT GETDATE(),                  -- Data/hora da venda
       CONSTRAINT FK_Venda_Cliente FOREIGN KEY (ID_Cliente) REFERENCES CLIENTES(ID_Cliente),
       CONSTRAINT FK_Venda_Empresa FOREIGN KEY (ID_Empresa) REFERENCES EMPRESA(ID_Empresa),
       CONSTRAINT FK_Venda_Usuario FOREIGN KEY (ID_Usuario) REFERENCES USUARIOS(ID_Usuario)
   );
   GO

   /* ===============================
      UNIDADES_MEDIDA (ex.: UN, KG)
      =============================== */
   CREATE TABLE dbo.UNIDADES_MEDIDA (
       ID_Unidade  INT IDENTITY(1,1) PRIMARY KEY,                          -- Identificador da unidade
       Sigla       VARCHAR(10) COLLATE Latin1_General_CI_AS NOT NULL UNIQUE, -- Sigla (UN, KG, M)
       Descricao   VARCHAR(50) COLLATE Latin1_General_CI_AS NOT NULL        -- Descrição da unidade
   );
   GO

   /* ================================
      MATERIAIS (produtos/itens)
      ================================ */
   CREATE TABLE dbo.MATERIAIS (
       ID_Material     INT IDENTITY(1,1) PRIMARY KEY,                      -- Identificador do material
       ID_Empresa      INT NOT NULL,                                       -- Empresa dona do item (FK)
       ID_Unidade      INT NOT NULL,                                       -- Unidade de medida (FK)
       NM_Material     VARCHAR(150) COLLATE Latin1_General_CI_AS NOT NULL, -- Nome do material
       Descricao       VARCHAR(255) COLLATE Latin1_General_CI_AS NULL,     -- Descrição do material
       Preco_Custo     DECIMAL(10,2) NOT NULL DEFAULT 0.00,                -- Preço de custo
       Estoque_Atual   INT NOT NULL DEFAULT 0,                              -- Quantidade em estoque (inteiro)
       DT_Cad_Material DATETIME NOT NULL DEFAULT GETDATE(),                -- Data/hora do cadastro
       CONSTRAINT FK_Material_Empresa FOREIGN KEY (ID_Empresa) REFERENCES EMPRESA(ID_Empresa),
       CONSTRAINT FK_Material_Unidade FOREIGN KEY (ID_Unidade) REFERENCES UNIDADES_MEDIDA(ID_Unidade)
   );
   GO

   /* ================================
      ITENS_VENDA (itens por venda)
      ================================ */
   CREATE TABLE dbo.ITENS_VENDA (
       ID_Item_Venda    INT IDENTITY(1,1) PRIMARY KEY,                     -- Identificador do item da venda
       ID_Venda         INT NOT NULL,                                      -- Venda (FK)
       ID_Material      INT NOT NULL,                                      -- Material vendido (FK)
       Quantidade       INT NOT NULL,                                      -- Quantidade vendida (inteiro)
       Preco_Unitario   DECIMAL(10,2) NOT NULL,                            -- Preço unitário na venda
       Valor_Total_Item DECIMAL(10,2) NOT NULL,                            -- Total do item (= Quantidade * Preco_Unitario)
       CONSTRAINT FK_ItemVenda_Venda    FOREIGN KEY (ID_Venda)    REFERENCES VENDAS(ID_Venda),
       CONSTRAINT FK_ItemVenda_Material FOREIGN KEY (ID_Material) REFERENCES MATERIAIS(ID_Material)
   );
   GO

   /* ======================================
      MOVIMENTACAO_ESTOQUE (entradas/saídas)
      ====================================== */
   CREATE TABLE dbo.MOVIMENTACAO_ESTOQUE (
       ID_Movimentacao INT IDENTITY(1,1) PRIMARY KEY,                       -- Identificador da movimentação
       ID_Material     INT NOT NULL,                                        -- Material movimentado (FK)
       ID_Usuario      INT NULL,                                            -- Usuário responsável (FK)
       ID_Venda        INT NULL,                                            -- Venda relacionada (FK)
       Tipo_Movimento  VARCHAR(50) COLLATE Latin1_General_CI_AS NOT NULL CHECK (Tipo_Movimento IN ('ENTRADA','SAIDA','AJUSTE')), -- Tipo de movimento
       Quantidade      INT NOT NULL,                                        -- Quantidade movimentada (inteiro)
       Valor_Unitario  DECIMAL(10,2) NOT NULL,                              -- Valor unitário associado ao movimento
       Observacao      VARCHAR(255) COLLATE Latin1_General_CI_AS NULL,      -- Observação (livre)
       DT_Movimentacao DATETIME NOT NULL DEFAULT GETDATE(),                 -- Data/hora do movimento
       CONSTRAINT FK_Movimentacao_Material FOREIGN KEY (ID_Material) REFERENCES MATERIAIS(ID_Material),
       CONSTRAINT FK_Movimentacao_Venda    FOREIGN KEY (ID_Venda)    REFERENCES VENDAS(ID_Venda),
       CONSTRAINT FK_Movimentacao_Usuario  FOREIGN KEY (ID_Usuario)  REFERENCES USUARIOS(ID_Usuario)
   );
   GO

   /* =====================================
      CONTAS_RECEBER (financeiro básico)
      ===================================== */
   CREATE TABLE dbo.CONTAS_RECEBER (
       ID_Conta        INT IDENTITY(1,1) PRIMARY KEY,                       -- Identificador da conta a receber
       ID_Venda        INT NOT NULL,                                        -- Venda relacionada (FK)
       ID_Empresa      INT NOT NULL,                                        -- Empresa (FK)
       Descricao       VARCHAR(255) COLLATE Latin1_General_CI_AS NULL,      -- Descrição da parcela
       Valor           DECIMAL(10,2) NOT NULL,                              -- Valor da parcela
       Data_Vencimento DATETIME NOT NULL,                                   -- Data de vencimento
       Pago            BIT NOT NULL DEFAULT 0,                               -- Indicador de pagamento
       Data_Pagamento  DATETIME NULL,                                       -- Data de pagamento (se pago)
       DT_Cad_Conta    DATETIME NOT NULL DEFAULT GETDATE(),                 -- Data/hora de criação
       Cancelado       BIT NOT NULL DEFAULT 0,                               -- Flag de cancelamento da parcela
       CONSTRAINT FK_Conta_Venda   FOREIGN KEY (ID_Venda)   REFERENCES VENDAS(ID_Venda),
       CONSTRAINT FK_Conta_Empresa FOREIGN KEY (ID_Empresa) REFERENCES EMPRESA(ID_Empresa)
   );
   GO

   /* ======================================
      PAGAMENTOS_VENDA (recebimentos/estornos)
      ====================================== */
   CREATE TABLE dbo.PAGAMENTOS_VENDA (
       ID_Pagamento    INT IDENTITY(1,1) PRIMARY KEY,                       -- Identificador do pagamento
       ID_Venda        INT NOT NULL,                                        -- Venda relacionada (FK)
       Data_Pagamento  DATETIME NOT NULL DEFAULT GETDATE(),                 -- Data/hora do pagamento/estorno
       Tipo_Pagamento  VARCHAR(20) COLLATE Latin1_General_CI_AS NOT NULL,   -- DINHEIRO, CARTAO, PIX, REEMBOLSO
       Valor           DECIMAL(10,2) NOT NULL,                              -- Valor recebido (>0) ou reembolsado (<0)
       ID_Usuario      INT NOT NULL,                                        -- Usuário que registrou
       Observacao      VARCHAR(255) COLLATE Latin1_General_CI_AS NULL,      -- Observações
       CONSTRAINT FK_Pagamento_Venda   FOREIGN KEY (ID_Venda)   REFERENCES VENDAS(ID_Venda),
       CONSTRAINT FK_Pagamento_Usuario FOREIGN KEY (ID_Usuario) REFERENCES USUARIOS(ID_Usuario)
   );
   GO

   /* ======================================
      CANCELAMENTOS_VENDA (log de cancelamento)
      ====================================== */
   CREATE TABLE dbo.CANCELAMENTOS_VENDA (
       ID_Cancelamento INT IDENTITY(1,1) PRIMARY KEY,                       -- Identificador do cancelamento
       ID_Venda        INT NOT NULL,                                        -- Venda cancelada (FK)
       ID_Usuario      INT NOT NULL,                                        -- Usuário que cancelou (FK)
       Data_Evento     DATETIME NOT NULL DEFAULT GETDATE(),                 -- Data/hora do cancelamento
       Motivo          VARCHAR(255) COLLATE Latin1_General_CI_AS NULL,      -- Motivo do cancelamento
       CONSTRAINT FK_Cancelamento_Venda   FOREIGN KEY (ID_Venda)   REFERENCES VENDAS(ID_Venda),
       CONSTRAINT FK_Cancelamento_Usuario FOREIGN KEY (ID_Usuario) REFERENCES USUARIOS(ID_Usuario)
   );
   GO

   -- Uma venda só deve ter um registro de cancelamento
   CREATE UNIQUE INDEX UX_Cancelamento_Venda_Unica ON dbo.CANCELAMENTOS_VENDA(ID_Venda);
   GO

   /* ==================
      ÍNDICES AUXILIARES
      ================== */
   CREATE INDEX IX_Usuarios_Empresa      ON dbo.USUARIOS(ID_Empresa);
   CREATE INDEX IX_Usuarios_Perfil       ON dbo.USUARIOS(ID_Perfil);
   CREATE INDEX IX_Clientes_Empresa      ON dbo.CLIENTES(ID_Empresa);
   CREATE INDEX IX_Materiais_Empresa     ON dbo.MATERIAIS(ID_Empresa);
   CREATE INDEX IX_Materiais_Unidade     ON dbo.MATERIAIS(ID_Unidade);
   CREATE INDEX IX_Vendas_Empresa        ON dbo.VENDAS(ID_Empresa);
   CREATE INDEX IX_Vendas_Cliente        ON dbo.VENDAS(ID_Cliente);
   CREATE INDEX IX_Vendas_Usuario        ON dbo.VENDAS(ID_Usuario);
   CREATE INDEX IX_Itens_Venda_Venda     ON dbo.ITENS_VENDA(ID_Venda);
   CREATE INDEX IX_Itens_Venda_Material  ON dbo.ITENS_VENDA(ID_Material);
   CREATE INDEX IX_Mov_Estoque_Material  ON dbo.MOVIMENTACAO_ESTOQUE(ID_Material);
   CREATE INDEX IX_CR_Empresa            ON dbo.CONTAS_RECEBER(ID_Empresa);
   CREATE INDEX IX_CR_Vencimento         ON dbo.CONTAS_RECEBER(Data_Vencimento);
   CREATE INDEX IX_Pag_Venda             ON dbo.PAGAMENTOS_VENDA(ID_Venda);
   CREATE INDEX IX_Pag_Data              ON dbo.PAGAMENTOS_VENDA(Data_Pagamento);
   GO

   /*
      DICAS RÁPIDAS
      - Para evitar inconsistências, gere movimentos e financeiro via procedures (finalizar/cancelar/devolver).
      - O Valor_Total em VENDAS pode ser atualizado pela aplicação somando ITENS_VENDA.
      - Estoque_Atual é inteiro neste modelo; as movimentações usam Quantidade inteira.
   */
