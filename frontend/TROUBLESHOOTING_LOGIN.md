# 🔧 TROUBLESHOOTING - PROBLEMAS DE LOGIN

**Data:** 10/11/2025

---

## ❌ **PROBLEMA: NÃO CONSIGO LOGAR NO SISTEMA**

### **🔍 DIAGNÓSTICO RÁPIDO**

Abra o **Console do navegador** (F12) e tente fazer login. Você verá uma das seguintes mensagens:

---

## **1️⃣ ERRO: "Failed to fetch" ou "NetworkError"**

### **❌ Problema:**
O frontend não consegue se conectar ao backend.

### **✅ Soluções:**

#### **A) Backend não está rodando**
```bash
# Terminal 1 - Inicie o backend
cd backend
mvn spring-boot:run

# Aguarde até ver: "Started BackendApplication in X seconds"
```

#### **B) Backend rodando na porta errada**
Verifique se o backend está em `http://localhost:8080`:
```bash
# Teste no terminal
curl http://localhost:8080/api/auth/login
```

Se estiver em outra porta, atualize o `.env`:
```bash
REACT_APP_API_BASE_URL=http://localhost:PORTA_CORRETA/api
```

#### **C) Problema de CORS**
Verifique o arquivo `WebSecurityConfig.java`:
```java
@Bean
public CorsConfigurationSource corsConfigurationSource() {
    CorsConfiguration configuration = new CorsConfiguration();
    configuration.setAllowedOriginPatterns(List.of("*"));
    configuration.setAllowedMethods(List.of("GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"));
    configuration.setAllowedHeaders(List.of("*"));
    // ...
}
```

---

## **2️⃣ ERRO: "401 Unauthorized" ou "Email ou senha incorretos"**

### **❌ Problema:**
Backend está funcionando, mas as credenciais estão erradas.

### **✅ Soluções:**

#### **A) Verifique se existe usuário no banco**
```sql
-- Conecte no banco e execute:
SELECT * FROM USUARIOS;
```

Se não houver usuários, crie um:
```sql
-- Senha: admin123 (hash bcrypt)
INSERT INTO USUARIOS (NM_Usuario, Email, Senha_Hash, ID_Perfil, ID_Empresa, Ativo) 
VALUES ('Admin', 'admin@admin.com', '$2a$10$YourBcryptHashHere', 1, 1, true);
```

#### **B) Use credenciais corretas**
- **Email:** Use o email cadastrado no banco (ex: `admin@admin.com`)
- **Senha:** Use a senha original (antes do hash bcrypt)

#### **C) Crie usuário via API (se tiver endpoint público)**
```bash
curl -X POST http://localhost:8080/api/usuarios \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@admin.com",
    "senhaHash": "admin123",
    "nmUsuario": "Administrador",
    "idPerfil": 1,
    "idEmpresa": 1,
    "ativo": true
  }'
```

---

## **3️⃣ ERRO: "400 Bad Request"**

### **❌ Problema:**
Dados enviados estão no formato errado.

### **✅ Soluções:**

#### **Verifique o formato esperado pelo backend:**
```java
// LoginRequestDTO.java
public class LoginRequestDTO {
    private String email;    // ✅ Deve ser "email"
    private String senha;    // ✅ Deve ser "senha"
}
```

#### **Verifique o que está sendo enviado:**
```javascript
// No Console do navegador, você verá:
🔵 Tentando login com: { email: "admin@admin.com" }
```

Se o campo estiver errado, corrija em `auth.js`:
```javascript
export async function login(email, senha) {
  const response = await post("/auth/login", { email, senha }); // ✅ Correto
  return response;
}
```

---

## **4️⃣ ERRO: "500 Internal Server Error"**

### **❌ Problema:**
Erro no backend (banco de dados, configuração, etc).

### **✅ Soluções:**

#### **A) Verifique logs do backend**
No terminal onde o backend está rodando, procure por:
```
ERROR ... 
at com.maderix.backend...
```

#### **B) Problemas comuns:**

**Banco de dados não conectado:**
```properties
# application.properties
spring.datasource.url=jdbc:mysql://localhost:3306/maderix
spring.datasource.username=root
spring.datasource.password=suasenha
```

**Tabelas não criadas:**
```bash
# Execute os scripts SQL:
mysql -u root -p maderix < Creates.sql
```

**Relações/Foreign Keys quebradas:**
```sql
-- Verifique se as tabelas relacionadas existem
SELECT * FROM PERFIS_USUARIO;
SELECT * FROM EMPRESA;
```

---

## **5️⃣ TOKEN RECEBIDO MAS NÃO REDIRECIONA**

### **❌ Problema:**
Login funciona mas não vai para `/home`.

### **✅ Soluções:**

#### **Verifique se o token está sendo salvo:**
```javascript
// Abra Console do navegador após tentar login:
localStorage.getItem('token') // Deve mostrar o token
```

#### **Verifique se a rota existe:**
```javascript
// App.js ou AppRoutes.js
<Route path="/home" element={<Home />} />
```

---

## **🧪 TESTE DE CONEXÃO AUTOMÁTICO**

### **Use o componente de teste:**

1. **Abra `App.js`:**
```javascript
import TestConnection from './TestConnection';

function App() {
  return (
    <div>
      <TestConnection /> {/* Adicione temporariamente */}
      {/* ... resto do app */}
    </div>
  );
}
```

2. **Recarregue a página**
3. **Clique em "Testar Conexão"**
4. **Veja o diagnóstico automático**

---

## **📋 CHECKLIST COMPLETO**

### **Backend:**
- [ ] Backend está rodando (`mvn spring-boot:run`)
- [ ] Console mostra: "Started BackendApplication"
- [ ] Porta 8080 está disponível
- [ ] Banco de dados está conectado
- [ ] Tabelas foram criadas
- [ ] Existe pelo menos 1 usuário no banco
- [ ] CORS está configurado no `WebSecurityConfig.java`

### **Frontend:**
- [ ] `.env` tem `REACT_APP_API_BASE_URL=http://localhost:8080/api`
- [ ] Frontend está rodando (`npm start`)
- [ ] Console não mostra erros ao carregar
- [ ] Aba Network (F12) mostra requisição para `/auth/login`

### **Credenciais:**
- [ ] Email existe no banco de dados
- [ ] Senha corresponde ao hash bcrypt
- [ ] Usuário está com `Ativo = true`
- [ ] Perfil do usuário existe
- [ ] Empresa do usuário existe

---

## **🔍 COMANDOS ÚTEIS DE DEBUG**

### **Testar backend diretamente:**
```bash
# Teste de login via CURL
curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@admin.com","senha":"admin123"}'
```

### **Verificar porta 8080:**
```bash
# Windows
netstat -ano | findstr :8080

# Linux/Mac
lsof -i :8080
```

### **Logs do backend:**
```bash
# Aumentar nível de log (application.properties)
logging.level.com.maderix=DEBUG
logging.level.org.springframework.security=DEBUG
```

---

## **💡 SOLUÇÃO RÁPIDA - CRIAR USUÁRIO DE TESTE**

Se você não tem usuários no banco, use este script SQL:

```sql
-- 1. Criar empresa (se não existir)
INSERT INTO EMPRESA (NM_Fantasia, RZ_Social, CNPJ, DT_Cad_Empresa)
VALUES ('Maderix Central', 'Maderix LTDA', '12.345.678/0001-90', NOW());

-- 2. Criar perfil (se não existir)
INSERT INTO PERFIS_USUARIO (NM_Perfil, Descricao, DT_Cad_Perfil)
VALUES ('Administrador', 'Acesso total ao sistema', NOW());

-- 3. Criar usuário
-- Senha: admin123 (você precisa gerar o hash bcrypt)
INSERT INTO USUARIOS (NM_Usuario, Email, Senha_Hash, ID_Perfil, ID_Empresa, Ativo, DT_Cad_Usuario)
VALUES (
  'Admin',
  'admin@admin.com',
  '$2a$10$N9qo8uLOickgx2ZMRZoMye4YjJOxRgEjU7xPF.KXF2xXaB7hBCEUC', -- Senha: admin123
  1,
  1,
  true,
  NOW()
);
```

---

## **📞 AINDA COM PROBLEMAS?**

### **1. Capture as informações:**
- Screenshot do Console (F12)
- Screenshot da aba Network
- Logs do terminal do backend
- Conteúdo do arquivo `.env`

### **2. Verifique:**
```javascript
// No Console do navegador, execute:
console.log("API URL:", process.env.REACT_APP_API_BASE_URL);
console.log("Token:", localStorage.getItem('token'));
```

### **3. Teste isolado:**
```bash
# Backend funcionando?
curl http://localhost:8080/api/auth/login

# Frontend consegue fazer requisições?
# Abra Console e execute:
fetch('http://localhost:8080/api/auth/login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ email: 'admin@admin.com', senha: 'admin123' })
}).then(r => r.json()).then(console.log)
```

---

**Boa sorte! 🚀**
