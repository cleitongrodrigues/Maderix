# Maderix

# Para iniciar o Back-end, utilize o seuinte comando:
  ./mvnw clean spring-boot:run

# Para alterar a versão do java, basta acessar o pom.xml e alterar o java.version para a versão desejada
classDiagram
    class EMPRESA {
        +ID_Empresa: Integer
        --
        +NM_Fantasia: Varchar
        +RZ_Social: Varchar
        +CNPJ: Varchar
        +DT_Cad_Empresa: Datetime
    }

    class PERFIS_USUARIO {
        +ID_Perfil: Integer
        --
        +NM_Perfil: Varchar
    }

    class USUARIOS {
        +ID_Usuario: Integer
        --
        +NM_Usuario: Varchar
        +Email: Varchar
        +Tel_Usuario: Varchar
        +Senha: Varchar
        +DT_Cad_Usuario: Datetime
        +ID_Empresa: Integer
        +ID_Perfil: Integer
    }

    class CLIENTES {
        +ID_Cliente: Integer
        --
        +NM_Cliente: Varchar
        +Tel_Cliente: Varchar
        +Email: Varchar
        +DT_Cad_Cliente: Datetime
        +ID_Empresa: Integer
    }
    
    class VENDAS {
        +ID_Venda: Integer
        --
        +Valor_Total: Decimal
        +Status_Venda: Varchar
        +DT_Venda: Datetime
        +ID_Cliente: Integer
        +ID_Empresa: Integer
        +ID_Usuario: Integer
    }

    class UNIDADES_MEDIDA {
        +ID_Unidade: Integer
        --
        +Sigla: Varchar
        +Descricao: Varchar
    }
    
    class MATERIAIS {
        +ID_Material: Integer
        --
        +NM_Material: Varchar
        +Descricao: Varchar
        +Preco_Custo: Decimal
        +Estoque_Atual: Integer
        +DT_Cad_Material: Datetime
        +ID_Empresa: Integer
        +ID_Unidade: Integer
    }

    class ITENS_VENDA {
        +ID_Item_Venda: Integer
        --
        +Quantidade: Integer
        +Preco_Unitario: Decimal
        +Valor_Total_Item: Decimal
        +ID_Venda: Integer
        +ID_Material: Integer
    }

    class MOVIMENTACAO_ESTOQUE {
        +ID_Movimentacao: Integer
        --
        +Tipo_Movimento: Varchar
        +Quantidade: Integer
        +Valor_Unitario: Decimal
        +Observacao: Varchar
        +DT_Movimentacao: Datetime
        +ID_Material: Integer
        +ID_Usuario: Integer
        +ID_Venda: Integer
    }
    
    class CONTAS_RECEBER {
        +ID_Conta: Integer
        --
        +Descricao: Varchar
        +Valor: Decimal
        +Data_Vencimento: Datetime
        +Pago: Bit
        +Data_Pagamento: Datetime
        +DT_Cad_Conta: Datetime
        +ID_Venda: Integer
        +ID_Empresa: Integer
    }

    EMPRESA "1" o-- "1..*" USUARIOS : possui
    EMPRESA "1" o-- "1..*" CLIENTES : possui
    EMPRESA "1" o-- "1..*" VENDAS : realiza
    EMPRESA "1" o-- "1..*" MATERIAIS : gerencia
    EMPRESA "1" o-- "1..*" CONTAS_RECEBER : possui

    PERFIS_USUARIO "1" o-- "1..*" USUARIOS : classifica

    USUARIOS "1" o-- "0..1" VENDAS : realiza
    USUARIOS "1" o-- "0..*" MOVIMENTACAO_ESTOQUE : efetua

    CLIENTES "1" o-- "1..*" VENDAS : faz
    
    VENDAS "1" *-- "1..*" ITENS_VENDA : contém
    VENDAS "1" o-- "0..*" MOVIMENTACAO_ESTOQUE : causa
    VENDAS "1" o-- "1..*" CONTAS_RECEBER : gera

    MATERIAIS "1" o-- "1..*" ITENS_VENDA : é parte de
    MATERIAIS "1" o-- "1..*" MOVIMENTACAO_ESTOQUE : é movimentado

    UNIDADES_MEDIDA "1" o-- "1..*" MATERIAIS : mede
