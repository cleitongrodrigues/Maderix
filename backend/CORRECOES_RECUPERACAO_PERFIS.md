# 🔧 CORREÇÕES - RECUPERAÇÃO DE SENHA E PERFIS

**Data:** 10/11/2025  
**Issues Resolvidas:** 2

---

## ✅ **PROBLEMA 1: RECUPERAÇÃO DE SENHA NÃO RETORNAVA TOKEN**

### **🔴 Problema Identificado**
O endpoint `POST /api/auth/esqueceu-senha` estava retornando `ResponseEntity<Void>`, ou seja, não retornava o token de recuperação gerado.

**Impacto:** 
- Frontend não recebia o token
- Impossível testar fluxo de recuperação
- Necessário implementar envio por email (complexo)

### **✅ Solução Implementada**

#### **1. Criado `RecuperacaoSenhaResponseDTO.java`**
```java
public class RecuperacaoSenhaResponseDTO {
    private String token;
    private String email;
    private String mensagem;
    
    public RecuperacaoSenhaResponseDTO(TokensRecuperacao tokenRecuperacao) {
        this.token = tokenRecuperacao.getToken();
        this.email = tokenRecuperacao.getEmailDestinatario();
        this.mensagem = "Token de recuperação gerado com sucesso. Válido por 15 minutos.";
    }
}
```

#### **2. Atualizado `AutenticacaoController.java`**
**ANTES:**
```java
@PostMapping("/esqueceu-senha")
public ResponseEntity<Void> solicitarRecuperacao(...) {
    recuperacaoSenhaService.gerarToken(request.getEmail(), ipSolicitacao);
    return ResponseEntity.ok().build(); // ❌ Retorna vazio
}
```

**AGORA:**
```java
@PostMapping("/esqueceu-senha")
public ResponseEntity<RecuperacaoSenhaResponseDTO> solicitarRecuperacao(...) {
    TokensRecuperacao tokenGerado = recuperacaoSenhaService.gerarToken(
        request.getEmail(),
        ipSolicitacao
    );
    
    RecuperacaoSenhaResponseDTO response = new RecuperacaoSenhaResponseDTO(tokenGerado);
    return ResponseEntity.ok(response); // ✅ Retorna token
}
```

### **📋 Como Usar**

#### **Request:**
```bash
POST /api/auth/esqueceu-senha
Content-Type: application/json

{
  "email": "usuario@email.com"
}
```

#### **Response (200 OK):**
```json
{
  "token": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
  "email": "usuario@email.com",
  "mensagem": "Token de recuperação gerado com sucesso. Válido por 15 minutos."
}
```

#### **Resetar Senha:**
```bash
POST /api/auth/reset-senha
Content-Type: application/json

{
  "token": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
  "novaSenhaPura": "NovaSenha@123"
}
```

### **⚠️ IMPORTANTE - PRODUÇÃO**
Em produção, **NÃO retorne o token diretamente**. O fluxo correto é:
1. Gerar token
2. Enviar email com link: `https://app.com/reset-senha?token={token}`
3. Retornar apenas: `{ "mensagem": "Email enviado com sucesso" }`

Para desenvolvimento/testes, o token está sendo retornado para facilitar.

---

## ✅ **PROBLEMA 2: PERFIS - PARÂMETRO NÃO RECONHECIDO NO SWAGGER**

### **🔴 Problema Identificado**
Nos endpoints PATCH de adicionar/remover permissões, o `@PathVariable` tinha nome diferente da rota:

- **Rota definida:** `/{perfilId}/permissoes/adicionar`
- **Parâmetro:** `@PathVariable Integer id` ❌

**Erro:** Spring não conseguia mapear `{perfilId}` para `id`, causando erro 404/500.

### **✅ Solução Implementada**

#### **Atualizado `PerfisUsuarioController.java`**

**ANTES:**
```java
@PatchMapping("/{perfilId}/permissoes/adicionar")
public ResponseEntity<PerfisUsuario> adicionar(
    @PathVariable Integer id, // ❌ Nome não bate
    @Valid @RequestBody PerfilPermissaoRequestDTO requestDTO 
)
```

**AGORA:**
```java
@PatchMapping("/{perfilId}/permissoes/adicionar")
public ResponseEntity<PerfisUsuario> adicionar(
    @PathVariable("perfilId") Integer id, // ✅ Nome explícito
    @Valid @RequestBody PerfilPermissaoRequestDTO requestDTO 
)
```

**Mesma correção aplicada em:**
- `/{perfilId}/permissoes/adicionar`
- `/{perfilId}/permissoes/remover`

### **📋 Como Usar**

#### **Adicionar Permissões:**
```bash
PATCH /api/perfis/1/permissoes/adicionar
Content-Type: application/json
Authorization: Bearer {token}

{
  "permissoesIds": [1, 2, 3, 5]
}
```

#### **Remover Permissões:**
```bash
PATCH /api/perfis/1/permissoes/remover
Content-Type: application/json
Authorization: Bearer {token}

{
  "permissoesIds": [2, 3]
}
```

#### **Response (200 OK):**
```json
{
  "idPerfil": 1,
  "nmPerfil": "Administrador",
  "permissoes": [
    { "idPermissao": 1, "nmPermissao": "Criar Venda" },
    { "idPermissao": 5, "nmPermissao": "Visualizar Relatórios" }
  ]
}
```

---

## ✅ **BÔNUS: CORREÇÃO ADICIONAL NO PUT**

### **Problema Encontrado**
O endpoint `PUT` de atualizar perfil estava sem `/{id}` na rota:

**ANTES:**
```java
@PutMapping // ❌ Faltava /{id}
public ResponseEntity<PerfisUsuario> atualizarPerfil(@PathVariable Integer id, ...)
```

**AGORA:**
```java
@PutMapping("/{id}") // ✅ Rota completa
public ResponseEntity<PerfisUsuario> atualizarPerfil(@PathVariable Integer id, ...)
```

---

## 📊 **RESUMO DAS ALTERAÇÕES**

### **Arquivos Criados (1)**
- ✅ `RecuperacaoSenhaResponseDTO.java`

### **Arquivos Modificados (3)**
- ✅ `AutenticacaoController.java` - Retorna token de recuperação
- ✅ `PerfisUsuarioController.java` - Corrigido @PathVariable nos 3 endpoints
- ✅ `Modelos Json para teste no swagger.txt` - Adicionados exemplos

### **Correções Aplicadas**
| Endpoint | Problema | Solução |
|----------|----------|---------|
| POST /api/auth/esqueceu-senha | Não retornava token | ✅ Retorna RecuperacaoSenhaResponseDTO |
| PATCH /api/perfis/{perfilId}/permissoes/adicionar | PathVariable não mapeava | ✅ @PathVariable("perfilId") |
| PATCH /api/perfis/{perfilId}/permissoes/remover | PathVariable não mapeava | ✅ @PathVariable("perfilId") |
| PUT /api/perfis/{id} | Faltava /{id} na rota | ✅ @PutMapping("/{id}") |

---

## 🧪 **TESTES RECOMENDADOS**

### **Recuperação de Senha**
1. ✅ POST /api/auth/esqueceu-senha com email válido → Deve retornar token
2. ✅ POST /api/auth/esqueceu-senha com email inválido → Deve retornar 404
3. ✅ POST /api/auth/reset-senha com token válido → Deve resetar senha
4. ✅ POST /api/auth/reset-senha com token expirado → Deve retornar erro
5. ✅ POST /api/auth/reset-senha com token já usado → Deve retornar erro

### **Perfis e Permissões**
1. ✅ PATCH /api/perfis/1/permissoes/adicionar → Deve adicionar permissões
2. ✅ PATCH /api/perfis/1/permissoes/remover → Deve remover permissões
3. ✅ PUT /api/perfis/1 → Deve atualizar perfil
4. ✅ Verificar no Swagger se parâmetros aparecem corretamente

---

## ✅ **CONCLUSÃO**

✅ **Recuperação de senha** agora retorna token para testes  
✅ **Perfis e permissões** funcionam corretamente no Swagger  
✅ **PathVariables** corrigidos em todos os endpoints  
✅ **Documentação** atualizada com exemplos  

**Status:** 🟢 **PRONTO PARA TESTES**

---

**Desenvolvido com ❤️ por Copilot AI Assistant**
