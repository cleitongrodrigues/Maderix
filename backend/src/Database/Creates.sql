CREATE DATABASE Maderix;
GO

USE Maderix;
GO

CREATE TABLE dbo.EMPRESA (ID_Empresa     Integer      IDENTITY PRIMARY KEY
                         ,NM_Fantasia    Varchar(150) COLLATE Latin1_General_CI_AS NOT NULL
                         ,RZ_Social      Varchar(150) COLLATE Latin1_General_CI_AS NOT NULL
                         ,Telefone       Varchar(20)  COLLATE Latin1_General_CI_AS NULL
                         ,EMAIL          VARCHAR(150) COLLATE Latin1_General_CI_AS NULL UNIQUE
                         ,CNPJ           Varchar(18)  COLLATE Latin1_General_CI_AS UNIQUE
                         ,Endereco       VARCHAR(255) COLLATE Latin1_General_CI_AS NULL
                         ,DT_Cad_Empresa Datetime     NOT NULL DEFAULT (GETDATE()));
GO

CREATE TABLE dbo.PERFIS_USUARIO (ID_Perfil Integer      IDENTITY PRIMARY KEY
                                ,NM_Perfil Varchar(50)  COLLATE Latin1_General_CI_AS NOT NULL UNIQUE
                                ,Descricao Varchar(255) COLLATE Latin1_General_CI_AS NOT NULL
                                ,Ativo     Bit(1)       NOT NULL DEFAULT (1));
GO
	
CREATE TABLE dbo.PERMISSOES (ID_Permissoes Integer IDENTITY(1,1) PRIMARY KEY
                            ,CODIGO        VARCHAR(100) NOT NULL UNIQUE
                            ,NOME          VARCHAR(150) NOT NULL
                            ,DESCRICAO     VARCHAR(255) NULL);
GO

CREATE TABLE dbo.PERFIL_PERMISSAO (ID_PERFIL       INT NOT NULL
                                  ,ID_PERMISSAO    INT NOT NULL
                                  ,CONSTRAINT PK_PERFIL_PERMISSAO PRIMARY KEY (ID_PERFIL, ID_PERMISSAO)
                                  ,CONSTRAINT FK_PP_PERFIL FOREIGN KEY (ID_PERFIL) REFERENCES dbo.PERFIS_USUARIO(ID_Perfil)
                                  ,CONSTRAINT FK_PP_PERMISSAO FOREIGN KEY (ID_PERMISSAO) REFERENCES dbo.PERMISSOES(ID_Permissoes)
);
GO

CREATE TABLE dbo.USUARIOS (ID_Usuario     Integer        IDENTITY PRIMARY KEY
                          ,ID_Empresa     Integer        NOT NULL
                          ,ID_Perfil      Integer        NOT NULL
                          ,NM_Usuario     Varchar(150)   COLLATE Latin1_General_CI_AS NOT NULL
                          ,Email          Varchar(100)   COLLATE Latin1_General_CI_AS NOT NULL UNIQUE
						  ,NM_Login       Varchar(50)    COLLATE Latin1_General_CI_AS NOT NULL UNIQUE
						  ,SENHA_HASH     VARCHAR(200)   NOT NULL
                          ,Tel_Usuario    Varchar(20)    COLLATE Latin1_General_CI_AS
						  ,Ativo          Bit(1)         NOT NULL DEFAULT (1)
						  ,ULTIMO_LOGIN   DATETIME       NULL
                          ,Senha          Varchar(255)   COLLATE Latin1_General_CI_AS NOT NULL
                          ,DT_Cad_Usuario Datetime       NOT NULL DEFAULT GETDATE()
                          ,CONSTRAINT FK_Usuario_Empresa FOREIGN KEY (ID_Empresa) REFERENCES EMPRESA(ID_Empresa)
                          ,CONSTRAINT FK_Usuario_Perfil  FOREIGN KEY (ID_Perfil)  REFERENCES PERFIS_USUARIO(ID_Perfil));
GO

CREATE TABLE dbo.CLIENTES (ID_Cliente     Integer        IDENTITY PRIMARY KEY
                          ,ID_Empresa     Integer        NOT NULL
                          ,NM_Cliente     Varchar(150)   COLLATE Latin1_General_CI_AS NOT NULL
                          ,Tel_Cliente    Varchar(20)    COLLATE Latin1_General_CI_AS
                          ,Email          Varchar(100)   COLLATE Latin1_General_CI_AS
                          ,DT_Cad_Cliente Datetime       NOT NULL DEFAULT GETDATE()
                          ,CONSTRAINT FK_Cliente_Empresa FOREIGN KEY (ID_Empresa) REFERENCES EMPRESA(ID_Empresa));
GO

CREATE TABLE dbo.VENDAS (ID_Venda     Integer        IDENTITY PRIMARY KEY
                        ,ID_Cliente   Integer        NOT NULL
                        ,ID_Empresa   Integer        NOT NULL
                        ,ID_Usuario   Integer        NULL
                        ,Valor_Total  Decimal(10,2)  NOT NULL
                        ,Status_Venda Varchar(50)    COLLATE Latin1_General_CI_AS NOT NULL DEFAULT 'ABERTA'
                        ,DT_Venda     Datetime       NOT NULL DEFAULT GETDATE()
                        ,CONSTRAINT FK_Venda_Cliente FOREIGN KEY (ID_Cliente) REFERENCES CLIENTES(ID_Cliente)
                        ,CONSTRAINT FK_Venda_Empresa FOREIGN KEY (ID_Empresa) REFERENCES EMPRESA(ID_Empresa)
                        ,CONSTRAINT FK_Venda_Usuario FOREIGN KEY (ID_Usuario) REFERENCES USUARIOS(ID_Usuario));
GO

CREATE TABLE dbo.UNIDADES_MEDIDA (ID_Unidade  Integer       IDENTITY PRIMARY KEY
                                 ,Sigla       Varchar(10)   COLLATE Latin1_General_CI_AS NOT NULL UNIQUE
                                 ,Descricao   Varchar(50)   COLLATE Latin1_General_CI_AS NOT NULL
								 ,Ativo       Bit(1)        NOT NULL DEFAULT (1));
GO

CREATE TABLE dbo.MATERIAIS (ID_Material     Integer        IDENTITY PRIMARY KEY
                           ,ID_Empresa      Integer        NOT NULL
                           ,ID_Unidade      Integer        NOT NULL
                           ,NM_Material     Varchar(150)   COLLATE Latin1_General_CI_AS NOT NULL
						   ,Codigo          VARCHAR(60)    NOT NULL UNIQUE
						   ,PRECO_VENDA     DECIMAL(18,2)  NOT NULL DEFAULT (0)
                           ,Descricao       Varchar(255)   COLLATE Latin1_General_CI_AS
                           ,Preco_Custo     Decimal(10,2)  NOT NULL DEFAULT 0.00
                           ,Estoque_Atual   Integer        NOT NULL DEFAULT 0
						   ,Fornecedor      VARCHAR(150)   COLLATE Latin1_General_CI_AS NULL
						   ,Categoria       VARCHAR(100)   COLLATE Latin1_General_CI_AS NULL
                           ,DT_Cad_Material Datetime       NOT NULL DEFAULT (GETDATE())
						   ,Ativo           Bit(1)         NOT NULL DEFAULT (1)
                           ,CONSTRAINT FK_Material_Empresa FOREIGN KEY (ID_Empresa) REFERENCES EMPRESA(ID_Empresa)
                           ,CONSTRAINT FK_Material_Unidade FOREIGN KEY (ID_Unidade) REFERENCES UNIDADES_MEDIDA(ID_Unidade));
GO

CREATE TABLE dbo.ITENS_VENDA (ID_Item_Venda    Integer         IDENTITY PRIMARY KEY
                             ,ID_Venda         Integer         NOT NULL
                             ,ID_Material      Integer         NOT NULL
							 ,SKU              VARCHAR(60)     COLLATE Latin1_General_CI_AS NULL
                             ,Quantidade       Integer         NOT NULL
                             ,Preco_Unitario   Decimal(10,2)   NOT NULL
                             ,Valor_Total_Item Decimal(10,2)   NOT NULL
                             ,CONSTRAINT FK_ItemVenda_Venda    FOREIGN KEY (ID_Venda)    REFERENCES VENDAS(ID_Venda)
                             ,CONSTRAINT FK_ItemVenda_Material FOREIGN KEY (ID_Material) REFERENCES MATERIAIS(ID_Material));
GO

CREATE TABLE dbo.MOVIMENTACAO_ESTOQUE (ID_Movimentacao Integer             IDENTITY PRIMARY KEY
                                      ,ID_Material     Integer             NOT NULL
                                      ,ID_Usuario      Integer             NULL
                                      ,ID_Venda        Integer             NULL
                                      ,Tipo_Movimento  Varchar(50)         COLLATE Latin1_General_CI_AS NOT NULL CHECK (Tipo_Movimento IN ('ENTRADA', 'SAIDA', 'AJUSTE'))
                                      ,Quantidade      Integer             NOT NULL
                                      ,Valor_Unitario  Decimal(10,2)       NOT NULL
                                      ,Observacao      Varchar(255)        COLLATE Latin1_General_CI_AS NULL
                                      ,DT_Movimentacao Datetime            NOT NULL DEFAULT GETDATE()
                                      ,CONSTRAINT FK_Movimentacao_Material FOREIGN KEY (ID_Material) REFERENCES MATERIAIS(ID_Material)
                                      ,CONSTRAINT FK_Movimentacao_Venda    FOREIGN KEY (ID_Venda)    REFERENCES VENDAS(ID_Venda)
                                      ,CONSTRAINT FK_Movimentacao_Usuario  FOREIGN KEY (ID_Usuario)  REFERENCES USUARIOS(ID_Usuario));
GO

CREATE TABLE dbo.CONTAS_RECEBER (ID_Conta        Integer       IDENTITY PRIMARY KEY
                                ,ID_Venda        Integer       NOT NULL
                                ,ID_Empresa      Integer       NOT NULL
								,Numero          VARCHAR(50)   COLLATE Latin1_General_CI_AS NULL
								,Cliente         VARCHAR(150)  COLLATE Latin1_General_CI_AS NULL
                                ,Descricao       Varchar(255)  COLLATE Latin1_General_CI_AS NULL
                                ,Valor           Decimal(10,2) NOT NULL
                                ,Data_Vencimento Datetime      NOT NULL
                                ,Pago            Bit           NOT NULL DEFAULT 0
                                ,Data_Pagamento  Datetime      NULL
                                ,DT_Cad_Conta    Datetime      NOT NULL DEFAULT GETDATE()
								,Cancelado       BIT(1)        NOT NULL DEFAULT 0
                                ,CONSTRAINT FK_Conta_Venda     FOREIGN KEY (ID_Venda)   REFERENCES VENDAS(ID_Venda)
                                ,CONSTRAINT FK_Conta_Empresa   FOREIGN KEY (ID_Empresa) REFERENCES EMPRESA(ID_Empresa));
GO
	
CREATE TABLE dbo.PAGAMENTOS_VENDA (ID_Pagamento    Integer         IDENTITY(1,1) PRIMARY KEY
                                   ,ID_Venda        Integer         NOT NULL
								   ,ID_Conta        Integer         NULL
                                   ,Data_Pagamento  DATETIME        NOT NULL DEFAULT GETDATE()
                                   ,Tipo_Pagamento  VARCHAR(20)     COLLATE Latin1_General_CI_AS NOT NULL
                                   ,Valor           DECIMAL(10,2)   NOT NULL
                                   ,ID_Usuario      Integer         NOT NULL
                                   ,Observacao      VARCHAR(255)    COLLATE Latin1_General_CI_AS NULL
                                   ,CONSTRAINT FK_Pagamento_Venda   FOREIGN KEY (ID_Venda)   REFERENCES VENDAS(ID_Venda)
								   ,CONSTRAINT FK_Pagamento_Conta   FOREIGN KEY (ID_Conta)   REFERENCES CONTAS_RECEBER(ID_Conta)
                                   ,CONSTRAINT FK_Pagamento_Usuario FOREIGN KEY (ID_Usuario) REFERENCES USUARIOS(ID_Usuario));
GO

 
CREATE TABLE dbo.CANCELAMENTOS_VENDA (ID_Cancelamento Integer      IDENTITY(1,1) PRIMARY KEY
                                      ,ID_Venda        Integer      NOT NULL
                                      ,ID_Usuario      Integer      NOT NULL
                                      ,Data_Evento     DATETIME     NOT NULL DEFAULT GETDATE()
                                      ,Motivo          VARCHAR(255) COLLATE Latin1_General_CI_AS NULL
                                      ,CONSTRAINT FK_Cancelamento_Venda   FOREIGN KEY (ID_Venda)   REFERENCES VENDAS(ID_Venda)
                                      ,CONSTRAINT FK_Cancelamento_Usuario FOREIGN KEY (ID_Usuario) REFERENCES USUARIOS(ID_Usuario));
GO

-- Uma venda só deve ter um registro de cancelamento
CREATE UNIQUE INDEX UX_Cancelamento_Venda_Unica ON dbo.CANCELAMENTOS_VENDA(ID_Venda);
GO

-- ============================================================================
-- TABELA: TOKENS_RECUPERACAO (para funcionalidade "Esqueci minha senha")
-- ============================================================================
CREATE TABLE dbo.TOKENS_RECUPERACAO (
    ID_Token           INTEGER      IDENTITY(1,1) PRIMARY KEY,
    ID_Usuario         INTEGER      NOT NULL,
    Token              VARCHAR(200) NOT NULL UNIQUE,
    Email_Destinatario VARCHAR(100) NOT NULL,
    Data_Criacao       DATETIME     NOT NULL DEFAULT GETDATE(),
    Data_Expiracao     DATETIME     NOT NULL,
    Utilizado          BIT          NOT NULL DEFAULT 0,
    Data_Utilizacao    DATETIME     NULL,
    IP_Solicitacao     VARCHAR(50)  NULL,
    IP_Utilizacao      VARCHAR(50)  NULL,
    CONSTRAINT FK_Token_Usuario FOREIGN KEY (ID_Usuario) 
        REFERENCES USUARIOS(ID_Usuario) ON DELETE CASCADE
);
GO

-- Índice para busca rápida por token
CREATE INDEX IX_Token_Recuperacao ON dbo.TOKENS_RECUPERACAO(Token);
GO

-- Índice para limpeza de tokens expirados
CREATE INDEX IX_Token_Expiracao ON dbo.TOKENS_RECUPERACAO(Data_Expiracao, Utilizado);
GO

-- Índice para buscar tokens por usuário
CREATE INDEX IX_Token_Usuario ON dbo.TOKENS_RECUPERACAO(ID_Usuario);
GO

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