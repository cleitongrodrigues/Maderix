# 🔧 Correção: Movimentação de Estoque - Erro 400

## ❌ Problema Relatado:

Ao fazer POST em `/api/movimentacaoEstoque` com o JSON:
```json
{
  "idMaterial": { "idMaterial": 1 },  // ❌ ERRADO
  "idUsuario": 1,
  "tipoMovimento": "ENTRADA",
  "quantidade": 10,
  "valorUnitario": 50.00,
  "observacao": "RECEBIMENTO DE MERCADORIA"
}
```

**Erro retornado**: 400 Bad Request - "id do material é obrigatório"

---

## 🔍 Problemas Identificados:

### **1. Import incorreto no Controller**
- **Arquivo**: `MovimentacaoEstoqueController.java`
- **Linha 18**: Usava `io.swagger.v3.oas.annotations.parameters.RequestBody`
- **Correto**: `org.springframework.web.bind.annotation.RequestBody`

### **2. JSON com sintaxe inválida**
```json
{
  "idMaterial": { "idMaterial": 1 }  // ❌ ERRADO - objeto aninhado
}
```

O DTO espera apenas o ID (Integer), não um objeto:
```json
{
  "idMaterial": 1  // ✅ CORRETO - apenas o número
}
```

### **3. Validações inadequadas**
- Validações estavam retornando ResponseEntity genérico
- Mensagens de erro não estavam padronizadas
- Não estava usando `@Valid` para validação automática

### **4. Usuário logado não era capturado**
- O campo `idUsuario` precisava ser enviado manualmente
- Deveria ser preenchido automaticamente do contexto de segurança

---

## ✅ Soluções Implementadas:

### **1. Corrigido import do `@RequestBody`**
```java
// ANTES
import io.swagger.v3.oas.annotations.parameters.RequestBody;

// DEPOIS
import org.springframework.web.bind.annotation.RequestBody;
```

### **2. Captura automática do usuário logado**
```java
@PostMapping
public ResponseEntity<MovimentacaoEstoque> criarMovimentacao(@Valid @RequestBody MovimentacaoRequestDTO dto){
    // Obter usuário logado automaticamente
    Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
    
    if (authentication != null && authentication.getPrincipal() instanceof Usuarios) {
        Usuarios usuarioLogado = (Usuarios) authentication.getPrincipal();
        dto.setIdUsuario(usuarioLogado.getIdUsuario());
    }
    
    // ... resto do código
}
```

### **3. Validações melhoradas**
```java
// Validações claras com mensagens específicas
if (dto.getIdMaterial() == null) {
    throw new BusinessRuleException("O ID do material é obrigatório.");
}

if (dto.getTipoMovimento() == null) {
    throw new BusinessRuleException("O tipo de movimentação é obrigatório.");
}

if (dto.getQuantidade() == null || dto.getQuantidade() <= 0) {
    throw new BusinessRuleException("A quantidade deve ser maior que zero.");
}
```

### **4. Adicionado `@Valid` no parâmetro**
```java
public ResponseEntity<MovimentacaoEstoque> criarMovimentacao(@Valid @RequestBody MovimentacaoRequestDTO dto)
```

---

## 📝 JSON Correto:

### **Formato Completo:**
```json
{
  "idMaterial": 1,
  "tipoMovimento": "ENTRADA",
  "quantidade": 10,
  "valorUnitario": 50.00,
  "observacao": "RECEBIMENTO DE MERCADORIA"
}
```

### **Formato Mínimo (com valorUnitario automático):**
```json
{
  "idMaterial": 1,
  "tipoMovimento": "ENTRADA",
  "quantidade": 10
}
```
**Nota**: Se `valorUnitario` não for informado, o sistema usa `precoVenda` ou `precoCusto` do material.

---

## 🎯 Campos do DTO:

### **Obrigatórios:**
- `idMaterial` (Integer) - ID do material a movimentar
- `tipoMovimento` (String) - Tipo: "ENTRADA", "SAIDA" ou "AJUSTE"
- `quantidade` (Integer) - Quantidade a movimentar (deve ser > 0)

### **Opcionais:**
- `valorUnitario` (BigDecimal) - Valor unitário (se não informado, usa do material)
- `observacao` (String) - Observação sobre a movimentação
- `idVenda` (Integer) - ID da venda relacionada (opcional)

### **Preenchido Automaticamente:**
- `idUsuario` (Integer) - ID do usuário logado (capturado do JWT)

---

## 📊 Tipos de Movimento:

| Tipo | Efeito no Estoque | Exemplo de Uso |
|------|-------------------|----------------|
| `ENTRADA` | **Aumenta** o estoque | Compra de mercadoria, devolução de cliente |
| `SAIDA` | **Diminui** o estoque | Venda, perda, doação |
| `AJUSTE` | **Aumenta** o estoque | Correção de inventário |

---

## 🔄 Como Funciona:

### **1. Entrada de Material (Compra)**
```http
POST /api/movimentacaoEstoque
Authorization: Bearer {token}
Content-Type: application/json

{
  "idMaterial": 1,
  "tipoMovimento": "ENTRADA",
  "quantidade": 50,
  "valorUnitario": 100.00,
  "observacao": "Compra fornecedor XYZ - NF 12345"
}
```

**Resultado**:
- ✅ Estoque do material 1 **aumenta** em 50 unidades
- ✅ Registra movimentação com valor R$ 100,00/un
- ✅ Associa ao usuário logado
- ✅ Salva observação

### **2. Saída de Material (Manual)**
```http
POST /api/movimentacaoEstoque
Authorization: Bearer {token}

{
  "idMaterial": 1,
  "tipoMovimento": "SAIDA",
  "quantidade": 5,
  "observacao": "Perda por avaria"
}
```

**Resultado**:
- ✅ Estoque do material 1 **diminui** em 5 unidades
- ✅ Usa valorUnitario do cadastro do material
- ⚠️ Valida se há estoque suficiente

### **3. Ajuste de Inventário**
```http
POST /api/movimentacaoEstoque
Authorization: Bearer {token}

{
  "idMaterial": 1,
  "tipoMovimento": "AJUSTE",
  "quantidade": 3,
  "observacao": "Ajuste após inventário físico"
}
```

**Resultado**:
- ✅ Estoque do material 1 **aumenta** em 3 unidades
- ✅ Registra como ajuste de inventário

---

## ⚠️ Validações Automáticas:

### **1. Estoque Insuficiente**
```json
{
  "idMaterial": 1,
  "tipoMovimento": "SAIDA",
  "quantidade": 1000  // Se não tiver 1000 no estoque
}
```
**Erro**: `"Estoque insuficiente para a movimentação."`

### **2. Material Não Encontrado**
```json
{
  "idMaterial": 999,  // ID inexistente
  "tipoMovimento": "ENTRADA",
  "quantidade": 10
}
```
**Erro**: `"Material não encontrado. id=999"`

### **3. Tipo de Movimento Inválido**
```json
{
  "idMaterial": 1,
  "tipoMovimento": "INVALIDO",  // Tipo não existe
  "quantidade": 10
}
```
**Erro**: Erro de deserialização do enum

---

## 🧪 Como Testar:

### **Passo 1: Fazer Login**
```http
POST /api/auth/login
Content-Type: application/json

{
  "login": "admin.test",
  "senha": "123456"
}
```

### **Passo 2: Criar Movimentação**
```http
POST /api/movimentacaoEstoque
Authorization: Bearer {SEU_TOKEN}
Content-Type: application/json

{
  "idMaterial": 1,
  "tipoMovimento": "ENTRADA",
  "quantidade": 10,
  "valorUnitario": 50.00,
  "observacao": "Teste de entrada"
}
```

### **Passo 3: Listar Movimentações**
```http
GET /api/movimentacaoEstoque
Authorization: Bearer {SEU_TOKEN}
```

### **Passo 4: Verificar Estoque Atualizado**
```http
GET /api/materiais/1
Authorization: Bearer {SEU_TOKEN}
```

**Resultado**: O campo `estoqueAtual` deve estar atualizado!

---

## 📂 Arquivos Modificados:

1. ✅ **MovimentacaoEstoqueController.java**
   - Corrigido import do `@RequestBody`
   - Adicionado captura automática do usuário logado
   - Melhoradas validações com mensagens claras
   - Adicionado `@Valid` para validação automática
   - Retorna tipo específico ao invés de `ResponseEntity<?>`

2. ✅ **Modelos Json para teste no swagger.txt**
   - Adicionado exemplo correto de movimentação
   - Documentação sobre tipos de movimento
   - Nota sobre preenchimento automático do usuário

3. ✅ **MOVIMENTACAO_ESTOQUE_FIX.md** (este arquivo)
   - Documentação completa da correção
   - Exemplos de uso
   - Guia de testes

---

## 💡 Diferenças Importantes:

### **Movimentação Manual vs Automática:**

| Aspecto | Manual (POST) | Automática (Venda) |
|---------|---------------|-------------------|
| Endpoint | `/api/movimentacaoEstoque` | `/api/vendas` |
| Tipo | Qualquer (ENTRADA/SAIDA/AJUSTE) | Sempre SAIDA |
| Usuário | Do token JWT | Do token JWT |
| Venda | Não vinculada | Vinculada à venda |
| Uso | Compras, ajustes, perdas | Vendas de produtos |

---

## 🎯 Melhores Práticas:

1. **Sempre informar observação** para rastreabilidade
2. **Usar ENTRADA** para compras e recebimentos
3. **Usar SAIDA** apenas para casos especiais (perdas, doações)
4. **Usar AJUSTE** para correções de inventário
5. **Deixar vendas** gerarem movimentações automáticas

---

## 📌 Resumo da Correção:

### **Antes:**
- ❌ Import errado do `@RequestBody`
- ❌ JSON precisava de objeto aninhado
- ❌ Validações retornavam String genérica
- ❌ Usuário precisava ser enviado manualmente

### **Depois:**
- ✅ Import correto
- ✅ JSON simples com apenas IDs
- ✅ Validações com BusinessRuleException
- ✅ Usuário capturado automaticamente do JWT
- ✅ Mensagens de erro claras e específicas

---

**Data da Correção**: 10 de Novembro de 2025  
**Branch**: TAREFA-29  
**Status**: ✅ Resolvido e Testado
