CREATE DATABASE Maderix;
GO

USE Maderix;
GO

CREATE TABLE dbo.EMPRESA (ID_Empresa     Integer      IDENTITY PRIMARY KEY
                         ,NM_Fantasia    Varchar(150) COLLATE Latin1_General_CI_AS NOT NULL
                         ,RZ_Social      Varchar(150) COLLATE Latin1_General_CI_AS 		  
                         ,CNPJ           Varchar(18)  COLLATE Latin1_General_CI_AS UNIQUE  
                         ,DT_Cad_Empresa Datetime     NOT NULL DEFAULT GETDATE());
GO

CREATE TABLE dbo.PERFIS_USUARIO (ID_Perfil Integer     IDENTITY PRIMARY KEY
                                ,NM_Perfil Varchar(50) COLLATE Latin1_General_CI_AS NOT NULL UNIQUE);
GO

CREATE TABLE dbo.USUARIOS (ID_Usuario     Integer        IDENTITY PRIMARY KEY
                          ,ID_Empresa     Integer        NOT NULL
                          ,ID_Perfil      Integer        NOT NULL
                          ,NM_Usuario     Varchar(150)   COLLATE Latin1_General_CI_AS NOT NULL
                          ,Email          Varchar(100)   COLLATE Latin1_General_CI_AS NOT NULL UNIQUE
                          ,Tel_Usuario    Varchar(20)    COLLATE Latin1_General_CI_AS 
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

CREATE TABLE dbo.UNIDADES_MEDIDA (ID_Unidade  Integer      IDENTITY PRIMARY KEY
                                 ,Sigla       Varchar(10)   COLLATE Latin1_General_CI_AS NOT NULL UNIQUE
                                 ,Descricao   Varchar(50)   COLLATE Latin1_General_CI_AS NOT NULL);
GO

CREATE TABLE dbo.MATERIAIS (ID_Material     Integer        IDENTITY PRIMARY KEY
                           ,ID_Empresa      Integer        NOT NULL
                           ,ID_Unidade      Integer        NOT NULL
                           ,NM_Material     Varchar(150)   COLLATE Latin1_General_CI_AS NOT NULL
                           ,Descricao       Varchar(255)   COLLATE Latin1_General_CI_AS 
                           ,Preco_Custo     Decimal(10,2)  NOT NULL DEFAULT 0.00
                           ,Estoque_Atual   Integer        NOT NULL DEFAULT 0
                           ,DT_Cad_Material Datetime       NOT NULL DEFAULT GETDATE()
                           ,CONSTRAINT FK_Material_Empresa FOREIGN KEY (ID_Empresa) REFERENCES EMPRESA(ID_Empresa)
                           ,CONSTRAINT FK_Material_Unidade FOREIGN KEY (ID_Unidade) REFERENCES UNIDADES_MEDIDA(ID_Unidade));
GO

CREATE TABLE dbo.ITENS_VENDA (ID_Item_Venda    Integer         IDENTITY PRIMARY KEY
                             ,ID_Venda         Integer         NOT NULL
                             ,ID_Material      Integer         NOT NULL
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
                                ,Descricao       Varchar(255)  COLLATE Latin1_General_CI_AS NULL
                                ,Valor           Decimal(10,2) NOT NULL
                                ,Data_Vencimento Datetime      NOT NULL
                                ,Pago            Bit           NOT NULL DEFAULT 0
                                ,Data_Pagamento  Datetime      NULL
                                ,DT_Cad_Conta    Datetime      NOT NULL DEFAULT GETDATE()
                                ,CONSTRAINT FK_Conta_Venda     FOREIGN KEY (ID_Venda)   REFERENCES VENDAS(ID_Venda)
                                ,CONSTRAINT FK_Conta_Empresa   FOREIGN KEY (ID_Empresa) REFERENCES EMPRESA(ID_Empresa));
GO