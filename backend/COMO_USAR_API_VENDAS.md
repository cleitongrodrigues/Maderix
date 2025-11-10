# 📘 Como Usar a API de Vendas

## ✅ O que foi alterado:

1. **`VendaController.java`**: Agora aceita `VendaRequestDTO` ao invés de `Vendas` (Model)
2. **`VendaService.java`**: Reescrito para converter o DTO em Model automaticamente

---

## 🚀 Como Fazer uma Requisição POST para Vendas

### **Passo 1: Fazer Login (Obter o Token JWT)**

```http
POST http://localhost:8080/api/auth/login
Content-Type: application/json

{
  "login": "admin.test",
  "senha": "123456"
}
```

**Resposta esperada:**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

---

### **Passo 2: Criar uma Venda**

#### **Formato JSON SIMPLIFICADO (Novo):**

```http
POST http://localhost:8080/api/vendas
Content-Type: application/json
Authorization: Bearer SEU_TOKEN_AQUI

{
  "idCliente": 1,
  "idEmpresa": 1,
  "itens": [
    {
      "idMaterial": 1,
      "quantidade": 3,
      "valorUnitario": 150.00
    },
    {
      "idMaterial": 2,
      "quantidade": 5
    }
  ]
}
```

---

## 📋 Campos do JSON:

### **Campos Obrigatórios:**
- `idCliente` (Integer): ID do cliente cadastrado
- `idEmpresa` (Integer): ID da empresa
- `itens` (Array): Lista de itens da venda
  - `idMaterial` (Integer): ID do material
  - `quantidade` (Integer): Quantidade vendida (mínimo 1)

### **Campos Opcionais:**
- `valorUnitario` (BigDecimal): Preço unitário do item
  - Se não informado, o sistema usa o `precoVenda` do material
  - Se `precoVenda` não existir, usa o `precoCusto`

---

## 🔍 O que acontece automaticamente:

1. ✅ **Valida** se o cliente e empresa existem
2. ✅ **Busca os materiais** e valida se existem
3. ✅ **Calcula o preço** de cada item (se não informado)
4. ✅ **Calcula o valor total** da venda
5. ✅ **Cria os itens da venda** automaticamente
6. ✅ **Registra movimentação de estoque** (SAÍDA)
7. ✅ **Cria uma conta a receber** com vencimento em 30 dias
8. ✅ **Define o usuário logado** como responsável pela venda
9. ✅ **Define o status** como "ABERTA"

---

## ⚠️ Pré-requisitos:

Antes de criar uma venda, certifique-se de ter:

1. ✅ **Cliente cadastrado** (com ID válido)
2. ✅ **Empresa cadastrada** (com ID válido)
3. ✅ **Material cadastrado** (com ID válido e preço configurado)
4. ✅ **Token JWT válido** (fazer login primeiro)

---

## 📝 Exemplo Completo (Swagger):

### **JSON para o Swagger:**

```json
{
  "idCliente": 1,
  "idEmpresa": 1,
  "itens": [
    {
      "idMaterial": 1,
      "quantidade": 2,
      "valorUnitario": 50.00
    }
  ]
}
```

### **Resposta esperada:**

```json
{
  "idVenda": 1,
  "cliente": {
    "idCliente": 1,
    "nmCliente": "douglas",
    "telCliente": "14997062581",
    "email": "douglas@gmail.com"
  },
  "empresa": {
    "idEmpresa": 1,
    "nmFantasia": "Maderix Central"
  },
  "usuario": {
    "idUsuario": 1,
    "nmUsuario": "Admin Principal"
  },
  "valorTotal": 100.00,
  "statusVenda": "ABERTA",
  "dataVenda": "2025-11-10T22:00:00",
  "itensVendas": [
    {
      "idItemVenda": 1,
      "idMaterial": {
        "idMaterial": 1,
        "nmMaterial": "MDF Carvalho"
      },
      "quantidade": 2,
      "precoUnitario": 50.00,
      "valorTotalItem": 100.00
    }
  ]
}
```

---

## 🛠️ Testando no Swagger:

1. Acesse: `http://localhost:8080/swagger-ui.html`
2. Faça login em `/api/auth/login`
3. Copie o token retornado
4. Clique no botão **"Authorize"** no Swagger
5. Cole o token no formato: `Bearer SEU_TOKEN`
6. Vá até `/api/vendas` (POST)
7. Use o JSON de exemplo acima
8. Execute a requisição

---

## 🎯 Diferença do Antes e Depois:

### **❌ ANTES (Formato complexo):**
```json
{
  "cliente": {
    "idCliente": 1,
    "idEmpresa": {
      "idEmpresa": 1,
      "nmFantasia": "string",
      "rzSocial": "string",
      ...
    },
    "nmCliente": "string",
    ...
  },
  "empresa": { ... },
  "usuario": { ... },
  "itensVendas": [ ... ]
}
```

### **✅ AGORA (Formato simplificado):**
```json
{
  "idCliente": 1,
  "idEmpresa": 1,
  "itens": [
    {
      "idMaterial": 1,
      "quantidade": 3
    }
  ]
}
```

---

## 🔒 Observações de Segurança:

- ✅ A rota está protegida por JWT (precisa estar autenticado)
- ⚠️ O `@PreAuthorize("hasRole('ADMIN')")` está **comentado** no código
- 💡 Se quiser ativar verificação de role, descomente a linha 42 no `VendaController.java`

---

## � Contas a Receber (NOVO!):

### **Geração Automática:**
Quando você cria uma venda, o sistema **automaticamente cria uma conta a receber** com as seguintes informações:

- **Número da Conta**: `VENDA-{ID_VENDA}` (ex: VENDA-1)
- **Cliente**: Nome do cliente da venda
- **Valor**: Valor total da venda
- **Descrição**: "Venda #{ID} - Cliente: {NOME}"
- **Vencimento**: 30 dias após a criação
- **Status**: Não pago
- **Cancelado**: Não

### **Como Consultar:**
```http
GET http://localhost:8080/api/contas-receber
Authorization: Bearer SEU_TOKEN
```

### **Como Marcar Como Paga:**
```http
PUT http://localhost:8080/api/contas-receber/{id}/pagar
Authorization: Bearer SEU_TOKEN
```

### **Exemplo de Conta Gerada:**
```json
{
  "idConta": 1,
  "numero": "VENDA-1",
  "cliente": "douglas",
  "descricao": "Venda #1 - Cliente: douglas",
  "valor": 100.00,
  "dataVencimento": "2025-12-10T22:00:00",
  "pago": false,
  "cancelado": false,
  "venda": {
    "idVenda": 1
  },
  "empresa": {
    "idEmpresa": 1
  }
}
```

---

## �📌 Problemas Comuns:

### **Erro 403 (Forbidden):**
- ❌ Token expirado ou inválido
- ❌ Não enviou o header `Authorization: Bearer TOKEN`
- ❌ `@EnableMethodSecurity` está comentado no `WebSecurityConfig`

### **Erro 404 (Not Found):**
- ❌ Cliente, Empresa ou Material não existe no banco
- ❌ ID informado é inválido

### **Erro 400 (Bad Request):**
- ❌ JSON malformado
- ❌ Campos obrigatórios não informados
- ❌ Quantidade menor que 1

---

**🎉 Pronto! Agora a API está muito mais simples e fácil de usar!**
