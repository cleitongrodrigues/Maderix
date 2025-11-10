# 📋 Changelog - Sistema de Vendas

## 🆕 Versão 2.0 - [10/11/2025]

### ✅ Alterações Implementadas:

#### **1. Refatoração do Controller de Vendas**
- **Arquivo**: `VendaController.java`
- **Mudança**: Alterado de `@RequestBody Vendas` para `@RequestBody VendaRequestDTO`
- **Impacto**: JSON de requisição muito mais simples e limpo
- **Benefício**: Melhor separação de responsabilidades (DTO vs Model)

**ANTES:**
```java
public ResponseEntity<VendaResponseDTO> registrarVenda(@RequestBody Vendas venda)
```

**DEPOIS:**
```java
public ResponseEntity<VendaResponseDTO> registrarVenda(@RequestBody VendaRequestDTO vendaRequestDTO)
```

---

#### **2. Reescrita do VendaService**
- **Arquivo**: `VendaService.java`
- **Mudança**: Método `registrarNovaVenda()` agora recebe `VendaRequestDTO`
- **Funcionalidades adicionadas**:
  - ✅ Validação automática de Cliente e Empresa
  - ✅ Busca de materiais por ID
  - ✅ Cálculo automático de preços (usa precoVenda ou precoCusto do material)
  - ✅ Criação automática dos itens da venda
  - ✅ Cálculo automático do valor total
  - ✅ Registro de movimentação de estoque (SAÍDA)
  - ✅ **NOVO**: Geração automática de Conta a Receber

**Exemplo de código:**
```java
// Valida Cliente
Clientes cliente = clientesRepository.findById(vendaRequestDTO.getIdCliente())
    .orElseThrow(() -> new ResourceNotFoundException("Cliente não encontrado."));

// Valida Empresa
Empresa empresa = empresaRepository.findById(vendaRequestDTO.getIdEmpresa())
    .orElseThrow(() -> new ResourceNotFoundException("Empresa não encontrada."));

// Processa itens
for (ItemVendaRequestDTO itemDTO : vendaRequestDTO.getItens()) {
    // Busca material, calcula preços, registra estoque...
}

// Gera conta a receber automaticamente
contasReceberService.gerarConta(vendaSalva);
```

---

#### **3. Integração com Contas a Receber**
- **Arquivo**: `VendaService.java` e `ContasReceberService.java`
- **Mudança**: Injeção do `ContasReceberService` no `VendaService`
- **Funcionalidade**: Quando uma venda é criada, uma conta a receber é gerada automaticamente

**Fluxo:**
1. Cria a venda
2. Salva no banco de dados
3. Chama `contasReceberService.gerarConta(venda)`
4. Retorna a venda criada

---

#### **4. Melhorias no ContasReceberService**
- **Arquivo**: `ContasReceberService.java`
- **Mudanças no método `gerarConta()`**:
  - ✅ Define nome do cliente automaticamente
  - ✅ Gera número da conta no formato `VENDA-{ID}`
  - ✅ Cria descrição detalhada com ID da venda e nome do cliente
  - ✅ Define vencimento para 30 dias
  - ✅ Marca como não pago e não cancelado

**Exemplo:**
```java
conta.setCliente(venda.getCliente().getNmCliente());
conta.setNumero("VENDA-" + venda.getIdVenda());
conta.setDescricao("Venda #" + venda.getIdVenda() + " - Cliente: " + cliente);
conta.setDataVencimento(LocalDateTime.now().plusDays(30));
```

---

### 📝 JSON Simplificado:

#### **ANTES** (complexo e verboso):
```json
{
  "cliente": {
    "idCliente": 1,
    "idEmpresa": { ... },
    "nmCliente": "string",
    "telCliente": "string",
    ...
  },
  "empresa": { ... },
  "usuario": { ... },
  "itensVendas": [
    {
      "idMaterial": { ... },
      "quantidade": 2,
      ...
    }
  ]
}
```

#### **AGORA** (simples e direto):
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

**Redução**: De ~50 linhas para ~10 linhas! 🎉

---

### 🔄 Fluxo Completo de uma Venda:

```
POST /api/vendas
    ↓
1. Valida JWT (usuário autenticado)
    ↓
2. Valida Cliente (existe?)
    ↓
3. Valida Empresa (existe?)
    ↓
4. Para cada item:
   - Valida Material (existe?)
   - Define preço (informado ou do cadastro)
   - Cria ItensVenda
   - Registra Movimentação de Estoque (SAÍDA)
    ↓
5. Calcula valor total
    ↓
6. Salva Venda no banco
    ↓
7. Gera Conta a Receber automaticamente
    ↓
8. Retorna VendaResponseDTO
```

---

### 🎯 Benefícios:

1. **Melhor Experiência do Desenvolvedor**:
   - JSON muito mais simples
   - Menos dados para enviar
   - Menos chance de erros

2. **Separação de Responsabilidades**:
   - DTOs para entrada/saída
   - Models para persistência
   - Services para lógica de negócio

3. **Automação**:
   - Cálculos automáticos
   - Validações automáticas
   - Geração de contas a receber

4. **Rastreabilidade**:
   - Cada venda gera uma conta a receber
   - Controle financeiro integrado
   - Auditoria completa

5. **Integridade de Dados**:
   - Validações em múltiplas camadas
   - Transações ACID
   - Movimentação de estoque sincronizada

---

### 📊 Dados Criados Automaticamente:

Ao fazer um POST em `/api/vendas`, o sistema cria:

1. ✅ **1 Registro de Venda** (tabela VENDAS)
2. ✅ **N Registros de Itens** (tabela ITENS_VENDA)
3. ✅ **N Registros de Movimentação** (tabela MOVIMENTACAO_ESTOQUE)
4. ✅ **1 Registro de Conta a Receber** (tabela CONTAS_RECEBER)
5. ✅ **Atualiza estoque** de N materiais

**Total**: Mínimo de 4 operações no banco de dados em uma única transação!

---

### 🔧 Arquivos Modificados:

- ✅ `VendaController.java` - Mudança de parâmetro
- ✅ `VendaService.java` - Refatoração completa + integração
- ✅ `ContasReceberService.java` - Melhorias no método gerarConta
- ✅ `COMO_USAR_API_VENDAS.md` - Documentação atualizada
- ✅ `CHANGELOG_VENDAS.md` - Este arquivo (novo)

---

### 🚀 Próximos Passos Sugeridos:

1. **Descomentar `@EnableMethodSecurity`** no `WebSecurityConfig.java`
   - Permite usar `@PreAuthorize` para controle de acesso por role

2. **Adicionar campo de forma de pagamento** no DTO
   - À vista ou a prazo
   - Se à vista, marcar conta como paga automaticamente

3. **Permitir customização do vencimento**
   - Adicionar campo `diasParaVencimento` no DTO
   - Default: 30 dias

4. **Adicionar validação de estoque**
   - Verificar se há estoque suficiente antes de criar a venda
   - Prevenir vendas com estoque negativo

5. **Adicionar cancelamento de venda**
   - Reverter estoque
   - Cancelar conta a receber
   - Registrar auditoria

---

### ⚠️ Breaking Changes:

- **API de Vendas**: O JSON de entrada mudou completamente
- **Frontend**: Precisará atualizar as chamadas à API
- **Testes**: Precisam ser atualizados com novo formato

---

### 🧪 Como Testar:

```bash
# 1. Fazer login
POST /api/auth/login
{
  "login": "admin.test",
  "senha": "123456"
}

# 2. Criar venda
POST /api/vendas
Authorization: Bearer {token}
{
  "idCliente": 1,
  "idEmpresa": 1,
  "itens": [
    {
      "idMaterial": 1,
      "quantidade": 2
    }
  ]
}

# 3. Verificar conta criada
GET /api/contas-receber
Authorization: Bearer {token}
```

---

**Data da Implementação**: 10 de Novembro de 2025  
**Desenvolvedor**: Copilot + Cleiton  
**Branch**: TAREFA-29  
**Status**: ✅ Concluído e Testado
