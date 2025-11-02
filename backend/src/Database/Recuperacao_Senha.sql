/*
  Recuperação de Senha - Tabela de tokens
  - Armazena apenas o HASH do token (não o token em si)
  - Expiração curta (30-60 min)
  - Uso único (Usado = 1 após redefinição)
*/

IF NOT EXISTS (
    SELECT 1 FROM sys.tables t WHERE t.name = 'RECUPERACAO_SENHA'
)
BEGIN
    CREATE TABLE dbo.RECUPERACAO_SENHA (
        ID_Reset            INT IDENTITY(1,1) PRIMARY KEY,
        ID_Usuario          INT NOT NULL,
        Token_Hash          VARBINARY(32) NOT NULL, -- SHA-256 (32 bytes)
        Expira_Em           DATETIME2(0) NOT NULL,
        Usado               BIT NOT NULL CONSTRAINT DF_RECUP_USADO DEFAULT(0),
        Criado_Em           DATETIME2(0) NOT NULL CONSTRAINT DF_RECUP_CRIADO DEFAULT(SYSDATETIME()),
        Usado_Em            DATETIME2(0) NULL
    );

    -- FK para USUARIOS (ajuste o nome da tabela/PK se necessário)
    ALTER TABLE dbo.RECUPERACAO_SENHA WITH CHECK
    ADD CONSTRAINT FK_RECUPERACAO_SENHA_USUARIO
    FOREIGN KEY (ID_Usuario) REFERENCES dbo.USUARIOS(ID_Usuario);

    -- Índices úteis
    CREATE INDEX IX_RECUP_TOKENHASH ON dbo.RECUPERACAO_SENHA (Token_Hash);
    CREATE INDEX IX_RECUP_USUARIO_USADO ON dbo.RECUPERACAO_SENHA (ID_Usuario, Usado);
    CREATE INDEX IX_RECUP_EXPIRA_EM ON dbo.RECUPERACAO_SENHA (Expira_Em);
END
GO

/* Limpeza de tokens expirados (opcional, pode ser colocado num job) */
-- DELETE FROM dbo.RECUPERACAO_SENHA WHERE Usado = 1 OR Expira_Em < DATEADD(day, -7, SYSDATETIME());
