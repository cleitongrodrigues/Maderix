IF NOT EXISTS(SELECT 1 FROM SYSOBJECTS WHERE NAME = 'Maderix')
BEGIN
  CREATE DATABASE Maderix;
END

IF NOT EXISTS (SELECT 1 FROM SYSOBJECTS WHERE NAME = 'dbo.Empresa')
BEGIN
  CREATE TABLE dbo.Empresa (EmpresaID    Integer      Identity PRIMARY KEY
                           ,NomeFantasia Varchar(150) NOT NULL
                           ,RazaoSocial  Varchar(150)
                           ,CNPJ         Varchar(18)  UNIQUE
                           ,DataCadastro Datetime     NOT NULL DEFAULT CURRENT_TIMESTAMP
                           )ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
END

IF NOT EXISTS (SELECT 1 FROM SYSOBJECTS WHERE NAME = 'dbo.Usuarios')
BEGIN
  CREATE TABLE dbo.Usuarios (UsuarioID   Integer Identity PRIMARY KEY
                            ,EmpresaID   Integer             NOT NULL
                            ,Nome        Varchar(150)        NOT NULL
                            ,Email       Varchar(100) UNIQUE NOT NULL
                            ,SenhaHash   Varchar(255)        NOT NULL
                            ,TipoUsuario Varchar(20)         NOT NULL COMMENT 'Admin, Marceneiro, Vendedor'
                            ,Ativo       Bit(1)              NOT NULL DEFAULT 1
                            ,CONSTRAINT FK_Usuario_Empresa FOREIGN KEY (EmpresaID) REFERENCES Empresa(EmpresaID)
                            )ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
END

IF NOT EXISTS (SELECT 1 FROM SYSOBJECTS WHERE NAME = 'dbo.Clientes')
BEGIN
  CREATE TABLE dbo.Clientes (ClienteID    Integer Identity PRIMARY KEY
                            ,EmpresaID    Integer      NOT NULL
                            ,Nome         Varchar(150) NOT NULL
                            ,Telefone     Varchar(20)
                            ,Email        Varchar(100)
                            ,DataCadastro Datetime     NOT NULL DEFAULT CURRENT_TIMESTAMP
                            ,CONSTRAINT FK_Cliente_Empresa FOREIGN KEY (EmpresaID) REFERENCES Empresa(EmpresaID)
                            )ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
END

IF NOT EXISTS (SELECT 1 FROM SYSOBJECTS WHERE NAME = 'dbo.Fornecedores')
BEGIN
  CREATE TABLE dbo.Fornecedores (FornecedorID Integer Identity PRIMARY KEY
                                ,EmpresaID    Integer      NOT NULL
                                ,NomeFantasia Varchar(150) NOT NULL
                                ,RazaoSocial  Varchar(150)
                                ,CNPJ         Varchar(18)
                                ,Contato      Varchar(255)
                                ,CONSTRAINT FK_Fornecedor_Empresa FOREIGN KEY (EmpresaID) REFERENCES Empresa(EmpresaID)
                                )ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
END

IF NOT EXISTS (SELECT 1 FROM SYSOBJECTS WHERE NAME = 'dbo.Materiais')
BEGIN
  CREATE TABLE dbo.Materiais (MaterialID        Integer Identity PRIMARY KEY
                             ,EmpresaID         Integer        NOT NULL
                             ,Nome              Varchar(150)   NOT NULL
                             ,Descricao         Varchar(255)
                             ,UnidadeMedida     Varchar(20)    NOT NULL COMMENT 'm², unidade, litro, metro linear'
                             ,QuantidadeEstoque Decimal(10, 2) NOT NULL DEFAULT 0.00
                             ,EstoqueMinimo     Decimal(10, 2) NOT NULL DEFAULT 0.00
                             ,PrecoCusto        Decimal(10, 2)
                             ,CONSTRAINT FK_Material_Empresa FOREIGN KEY (EmpresaID) REFERENCES Empresa(EmpresaID)
                             )ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
END

IF NOT EXISTS (SELECT 1 FROM SYSOBJECTS WHERE NAME = 'dbo.Movimentacoes')
BEGIN
  CREATE TABLE dbo.Movimentacoes (MovimentacaoID   Integer Identity PRIMARY KEY
                                 ,MaterialID       Integer        NOT NULL
                                 ,UsuarioID        Integer
                                 ,TipoMovimentacao Varchar(50)    NOT NULL COMMENT 'Entrada - Compra, Saída - Venda, Saída - Uso em Projeto, Ajuste'
                                 ,Quantidade       Decimal(10, 2) NOT NULL
                                 ,DataMovimentacao Datetime       NOT NULL DEFAULT CURRENT_TIMESTAMP
                                 ,Observacao       Varchar(255)
                                 ,CONSTRAINT FK_Movimentacao_Material FOREIGN KEY (MaterialID) REFERENCES Materiais(MaterialID)
                                 ,CONSTRAINT FK_Movimentacao_Usuario  FOREIGN KEY (UsuarioID)  REFERENCES Usuarios(UsuarioID) ON DELETE SET NULL
                                 )ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
END

IF NOT EXISTS (SELECT 1 FROM SYSOBJECTS WHERE NAME = 'dbo.Produto')
BEGIN
  CREATE TABLE dbo.Produto (ProdutoID         Integer        Identity PRIMARY KEY
                           ,EmpresaID         Integer        NOT NULL
                           ,Nome              Varchar(150)   NOT NULL
                           ,Descricao         Varchar(255)
                           ,PrecoVenda        Decimal(10, 2) NOT NULL
                           ,Ativo             Bit(1)         NOT NULL
                           ,QuantidadeEstoque Integer        NOT NULL DEFAULT 0
                           ,CONSTRAINT FK_ProdutoAcabado_Empresa FOREIGN KEY (EmpresaID) REFERENCES Empresa(EmpresaID)
                           ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
END                               