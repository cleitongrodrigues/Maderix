# 🚀 INTEGRAÇÃO FRONTEND-BACKEND - MADERIX

**Data:** 10/11/2025  
**Status:** ✅ Configurado e pronto para usar

---

## ✅ **O QUE FOI CONFIGURADO**

### **1. Serviços HTTP (src/services/http.js)**
- ✅ Base URL configurada para `http://localhost:8080/api`
- ✅ Interceptor JWT automático (adiciona token em todas as requisições)
- ✅ Tratamento de erro 401 (redireciona para login)
- ✅ Métodos disponíveis: `get`, `post`, `put`, `patch`, `del`

### **2. Autenticação (src/services/auth.js)**
- ✅ `login(email, senha)` - Login e retorno de token JWT
- ✅ `forgotPassword(email)` - Solicitar recuperação de senha
- ✅ `resetPassword(token, novaSenhaPura)` - Resetar senha

### **3. API Completa (src/services/api.js)**
APIs organizadas por módulo:
- ✅ `clientesAPI` - CRUD de clientes
- ✅ `materiaisAPI` - CRUD de materiais
- ✅ `vendasAPI` - Criar e listar vendas
- ✅ `contasReceberAPI` - Contas a receber
- ✅ `pagamentosVendaAPI` - Pagamentos
- ✅ `estoqueAPI` - Movimentação de estoque
- ✅ `empresasAPI` - CRUD de empresas
- ✅ `unidadesAPI` - Unidades de medida
- ✅ `usuariosAPI` - Usuários
- ✅ `perfisAPI` - Perfis e permissões
- ✅ `permissoesAPI` - Permissões

### **4. Login Atualizado**
- ✅ Conectado com API real
- ✅ Salva token JWT no localStorage
- ✅ Recuperação de senha funcional
- ✅ Mostra token de recuperação em desenvolvimento

---

## 📋 **COMO USAR NOS COMPONENTES**

### **Exemplo 1: Login**
```javascript
import { login } from "../../services/auth";

const handleLogin = async () => {
  try {
    const response = await login(email, senha);
    localStorage.setItem("token", response.token);
    navigate("/home");
  } catch (error) {
    setError(error.message);
  }
};
```

### **Exemplo 2: Listar Clientes**
```javascript
import { clientesAPI } from "../../services/api";

const CarregarClientes = async () => {
  try {
    const clientes = await clientesAPI.listar();
    setClientes(clientes);
  } catch (error) {
    console.error("Erro ao carregar clientes:", error);
  }
};
```

### **Exemplo 3: Criar Venda**
```javascript
import { vendasAPI } from "../../services/api";

const handleCriarVenda = async () => {
  try {
    const vendaData = {
      idCliente: 1,
      idEmpresa: 1,
      itens: [
        { idMaterial: 1, quantidade: 2, valorUnitario: 50.00 }
      ]
    };
    
    const vendaCriada = await vendasAPI.criar(vendaData);
    alert(`Venda #${vendaCriada.idVenda} criada com sucesso!`);
  } catch (error) {
    alert(`Erro: ${error.message}`);
  }
};
```

### **Exemplo 4: Criar Cliente**
```javascript
import { clientesAPI } from "../../services/api";

const handleCriarCliente = async () => {
  try {
    const cliente = {
      idEmpresa: 1,
      nmCliente: "João Silva",
      telCliente: "14997062581",
      email: "joao@email.com"
    };
    
    const clienteCriado = await clientesAPI.criar(cliente);
    alert("Cliente criado com sucesso!");
  } catch (error) {
    alert(`Erro: ${error.message}`);
  }
};
```

### **Exemplo 5: Registrar Movimentação de Estoque**
```javascript
import { estoqueAPI } from "../../services/api";

const handleMovimentacao = async () => {
  try {
    const movimentacao = {
      idMaterial: 1,
      tipoMovimento: "ENTRADA", // ou "SAIDA", "AJUSTE"
      quantidade: 10,
      valorUnitario: 50.00,
      observacao: "Recebimento de mercadoria"
    };
    
    await estoqueAPI.registrar(movimentacao);
    alert("Movimentação registrada!");
  } catch (error) {
    alert(`Erro: ${error.message}`);
  }
};
```

---

## 🔧 **CONFIGURAÇÃO DO AMBIENTE**

### **1. Arquivo .env**
Criado em `frontend/.env`:
```bash
REACT_APP_API_BASE_URL=http://localhost:8080/api
```

### **2. Iniciar Backend**
```bash
cd backend
mvn spring-boot:run
```

### **3. Iniciar Frontend**
```bash
cd frontend
npm start
```

---

## 🔒 **AUTENTICAÇÃO JWT**

### **Como funciona:**
1. Usuário faz login → Recebe token JWT
2. Token é salvo no `localStorage`
3. Todas as requisições incluem: `Authorization: Bearer {token}`
4. Se token inválido/expirado → Redireciona para login

### **Token no localStorage:**
```javascript
// Salvar
localStorage.setItem("token", response.token);

// Obter
const token = localStorage.getItem("token");

// Remover (logout)
localStorage.removeItem("token");
```

---

## 📊 **ESTRUTURA DE DADOS**

### **Login Response:**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "usuario": {
    "idUsuario": 1,
    "email": "admin@admin.com",
    "nmUsuario": "Administrador",
    "perfil": {
      "idPerfil": 1,
      "nmPerfil": "Admin"
    }
  }
}
```

### **Cliente Response:**
```json
{
  "idCliente": 1,
  "idEmpresa": 1,
  "nomeEmpresa": "Maderix Central",
  "nmCliente": "João Silva",
  "telCliente": "14997062581",
  "email": "joao@email.com",
  "dataCadCliente": "2025-11-10T10:30:00"
}
```

### **Venda Response:**
```json
{
  "idVenda": 1,
  "idCliente": 1,
  "nomeCliente": "João Silva",
  "idEmpresa": 1,
  "nomeEmpresa": "Maderix Central",
  "statusVenda": "ABERTA",
  "valorTotal": 100.00,
  "dataCadVenda": "2025-11-10T10:30:00",
  "itens": [
    {
      "idItemVenda": 1,
      "idMaterial": 1,
      "nomeMaterial": "MDF Carvalho",
      "quantidade": 2,
      "valorUnitario": 50.00,
      "valorTotal": 100.00
    }
  ]
}
```

---

## ⚠️ **TRATAMENTO DE ERROS**

### **Padrão de Tratamento:**
```javascript
try {
  const data = await clientesAPI.criar(cliente);
  // Sucesso
} catch (error) {
  // Erro
  console.error("Erro:", error);
  
  // Verificar tipo de erro
  if (error.status === 400) {
    alert("Dados inválidos: " + error.message);
  } else if (error.status === 401) {
    alert("Não autorizado. Faça login novamente.");
  } else if (error.status === 404) {
    alert("Recurso não encontrado.");
  } else {
    alert("Erro: " + error.message);
  }
}
```

### **Erros Comuns:**
| Status | Significado | Ação |
|--------|-------------|------|
| 400 | Bad Request | Dados inválidos, verificar formulário |
| 401 | Unauthorized | Token inválido, redireciona para login |
| 403 | Forbidden | Sem permissão para a ação |
| 404 | Not Found | Recurso não existe |
| 500 | Server Error | Erro no servidor, tentar novamente |

---

## 🎯 **PRÓXIMOS PASSOS**

### **Para cada página/módulo:**
1. Importar API correspondente de `services/api.js`
2. Criar estados para dados e loading
3. Usar `useEffect` para carregar dados iniciais
4. Implementar funções de criar/editar/deletar
5. Adicionar tratamento de erros
6. Adicionar feedback visual (loading, sucesso, erro)

### **Exemplo de Estrutura Completa:**
```javascript
import React, { useState, useEffect } from "react";
import { clientesAPI } from "../../services/api";

function Clientes() {
  const [clientes, setClientes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    carregarClientes();
  }, []);

  async function carregarClientes() {
    try {
      setLoading(true);
      setError("");
      const data = await clientesAPI.listar();
      setClientes(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  async function handleCriar(cliente) {
    try {
      setLoading(true);
      await clientesAPI.criar(cliente);
      await carregarClientes(); // Recarrega lista
      alert("Cliente criado com sucesso!");
    } catch (err) {
      alert("Erro: " + err.message);
    } finally {
      setLoading(false);
    }
  }

  // ... resto do componente
}
```

---

## ✅ **CHECKLIST DE INTEGRAÇÃO**

- [x] Backend rodando em `http://localhost:8080`
- [x] Frontend configurado com `.env`
- [x] Serviços HTTP criados
- [x] APIs organizadas por módulo
- [x] Login conectado com backend
- [x] Interceptor JWT configurado
- [x] Tratamento de erros 401
- [ ] Testar login com usuário real
- [ ] Implementar outros módulos (clientes, vendas, etc)
- [ ] Adicionar loading states
- [ ] Adicionar toasts/notificações
- [ ] Implementar logout

---

## 🎊 **TUDO PRONTO!**

O frontend está 100% configurado para se comunicar com o backend. 

**Próximos passos:**
1. Iniciar backend
2. Iniciar frontend
3. Testar login
4. Começar a implementar outros módulos usando os serviços criados

**Exemplo de uso em qualquer componente:**
```javascript
import { clientesAPI, vendasAPI, materiaisAPI } from "../../services/api";
```

Boa codificação! 🚀
