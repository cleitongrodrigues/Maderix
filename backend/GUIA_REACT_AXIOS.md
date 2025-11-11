# 🚀 GUIA RÁPIDO REACT/AXIOS - BACKEND MADERIX

## **1. CONFIGURAÇÃO INICIAL DO AXIOS**

### **1.1 Criar instância do Axios (src/services/api.js)**
```javascript
import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8080/api', // Ajustar porta se necessário
  headers: {
    'Content-Type': 'application/json'
  }
});

// Interceptor para adicionar token JWT automaticamente
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token'); // ou sessionStorage
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Interceptor para tratar erros globalmente
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token inválido/expirado, redirecionar para login
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;
```

---

## **2. EXEMPLOS DE CHAMADAS POR MÓDULO**

### **2.1 AUTENTICAÇÃO**

#### **Login**
```javascript
import api from './api';

export const login = async (email, senha) => {
  try {
    const response = await api.post('/auth/login', {
      email,
      senha
    });
    
    // Salvar token
    localStorage.setItem('token', response.data.token);
    
    return response.data;
  } catch (error) {
    throw error.response?.data || 'Erro ao fazer login';
  }
};
```

---

### **2.2 VENDAS**

#### **Criar Venda**
```javascript
export const criarVenda = async (vendaData) => {
  try {
    const response = await api.post('/vendas', {
      idCliente: vendaData.clienteId,
      idEmpresa: vendaData.empresaId,
      itens: vendaData.itens.map(item => ({
        idMaterial: item.materialId,
        quantidade: item.quantidade,
        valorUnitario: item.precoUnitario
      }))
    });
    
    return response.data;
  } catch (error) {
    // Tratar erros de validação
    if (error.response?.status === 400) {
      console.error('Erro de validação:', error.response.data);
    }
    throw error;
  }
};

// Exemplo de uso no componente React:
const handleCriarVenda = async () => {
  const vendaData = {
    clienteId: 1,
    empresaId: 1,
    itens: [
      { materialId: 1, quantidade: 2, precoUnitario: 50.00 },
      { materialId: 2, quantidade: 3, precoUnitario: 30.00 }
    ]
  };
  
  try {
    const venda = await criarVenda(vendaData);
    console.log('Venda criada:', venda);
    // Atualizar estado, mostrar sucesso, etc.
  } catch (error) {
    console.error('Erro ao criar venda:', error);
    // Mostrar mensagem de erro ao usuário
  }
};
```

#### **Listar Vendas**
```javascript
export const listarVendas = async () => {
  try {
    const response = await api.get('/vendas');
    return response.data; // Array de VendaResponseDTO
  } catch (error) {
    throw error;
  }
};
```

#### **Cancelar Venda**
```javascript
export const cancelarVenda = async (idVenda) => {
  try {
    const response = await api.patch(`/vendas/${idVenda}/cancelar`);
    return response.data;
  } catch (error) {
    throw error;
  }
};
```

---

### **2.3 CLIENTES**

#### **Criar Cliente**
```javascript
export const criarCliente = async (clienteData) => {
  try {
    const response = await api.post('/clientes', {
      idEmpresa: clienteData.empresaId,
      nmCliente: clienteData.nome,
      telCliente: clienteData.telefone,
      email: clienteData.email
    });
    
    return response.data; // ClienteResponseDTO
  } catch (error) {
    throw error;
  }
};
```

#### **Listar Clientes**
```javascript
export const listarClientes = async () => {
  const response = await api.get('/clientes');
  return response.data; // Array de ClienteResponseDTO
};
```

#### **Atualizar Cliente**
```javascript
export const atualizarCliente = async (id, clienteData) => {
  const response = await api.put(`/clientes/${id}`, {
    idEmpresa: clienteData.empresaId,
    nmCliente: clienteData.nome,
    telCliente: clienteData.telefone,
    email: clienteData.email
  });
  
  return response.data;
};
```

---

### **2.4 MATERIAIS**

#### **Criar Material**
```javascript
export const criarMaterial = async (materialData) => {
  const response = await api.post('/materiais', {
    idEmpresa: materialData.empresaId,
    idUnidade: materialData.unidadeId,
    nmMaterial: materialData.nome,
    codigo: materialData.codigo,
    precoVenda: materialData.precoVenda,
    precoCusto: materialData.precoCusto,
    estoqueAtual: materialData.estoque,
    fornecedor: materialData.fornecedor,
    categoria: materialData.categoria,
    ativo: true
  });
  
  return response.data;
};
```

#### **Listar Materiais**
```javascript
export const listarMateriais = async () => {
  const response = await api.get('/materiais');
  return response.data; // Array de MaterialResponseDTO
};
```

---

### **2.5 CONTAS A RECEBER**

#### **Listar Contas Pendentes**
```javascript
export const listarContasPendentes = async () => {
  try {
    const response = await api.get('/contasReceber');
    // Já retorna apenas contas pendentes (pago=false)
    return response.data;
  } catch (error) {
    throw error;
  }
};
```

#### **Marcar Conta como Paga**
```javascript
export const marcarContaPaga = async (idConta) => {
  const response = await api.patch(`/contasReceber/${idConta}/pagar`);
  return response.data;
};
```

---

### **2.6 PAGAMENTOS DE VENDA**

#### **Registrar Pagamento**
```javascript
export const registrarPagamento = async (pagamentoData) => {
  try {
    const response = await api.post('/pagamentos-venda', {
      idContaReceber: pagamentoData.contaId,
      valor: pagamentoData.valor,
      formaPagamento: pagamentoData.formaPagamento,
      observacao: pagamentoData.observacao
      // NÃO enviar idUsuario - é preenchido automaticamente pelo backend!
    });
    
    return response.data;
  } catch (error) {
    throw error;
  }
};
```

---

### **2.7 MOVIMENTAÇÃO DE ESTOQUE**

#### **Registrar Movimentação**
```javascript
export const registrarMovimentacao = async (movimentacaoData) => {
  const response = await api.post('/movimentacaoEstoque', {
    idMaterial: movimentacaoData.materialId,
    tipoMovimento: movimentacaoData.tipo, // "ENTRADA", "SAIDA" ou "AJUSTE"
    quantidade: movimentacaoData.quantidade,
    valorUnitario: movimentacaoData.valorUnitario,
    observacao: movimentacaoData.observacao
    // idUsuario preenchido automaticamente!
  });
  
  return response.data;
};
```

---

## **3. COMPONENTE REACT EXEMPLO - CRIAR VENDA**

```jsx
import React, { useState, useEffect } from 'react';
import { criarVenda, listarClientes, listarMateriais } from '../services/api';

const CriarVendaForm = () => {
  const [clientes, setClientes] = useState([]);
  const [materiais, setMateriais] = useState([]);
  const [venda, setVenda] = useState({
    clienteId: '',
    empresaId: 1, // Pode vir do contexto/estado global
    itens: [{ materialId: '', quantidade: 1, precoUnitario: 0 }]
  });

  useEffect(() => {
    // Carregar clientes e materiais ao montar
    const carregarDados = async () => {
      const [clientesData, materiaisData] = await Promise.all([
        listarClientes(),
        listarMateriais()
      ]);
      setClientes(clientesData);
      setMateriais(materiaisData);
    };
    
    carregarDados();
  }, []);

  const adicionarItem = () => {
    setVenda({
      ...venda,
      itens: [...venda.itens, { materialId: '', quantidade: 1, precoUnitario: 0 }]
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const vendaCriada = await criarVenda(venda);
      alert(`Venda #${vendaCriada.idVenda} criada com sucesso!`);
      // Redirecionar ou limpar formulário
    } catch (error) {
      alert('Erro ao criar venda: ' + error.message);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <select 
        value={venda.clienteId}
        onChange={(e) => setVenda({...venda, clienteId: e.target.value})}
        required
      >
        <option value="">Selecione um cliente</option>
        {clientes.map(c => (
          <option key={c.idCliente} value={c.idCliente}>
            {c.nmCliente}
          </option>
        ))}
      </select>

      {venda.itens.map((item, index) => (
        <div key={index}>
          <select 
            value={item.materialId}
            onChange={(e) => {
              const novosMateriais = [...venda.itens];
              const materialSelecionado = materiais.find(m => m.idMaterial === parseInt(e.target.value));
              novosMateriais[index] = {
                ...item,
                materialId: e.target.value,
                precoUnitario: materialSelecionado?.precoVenda || 0
              };
              setVenda({...venda, itens: novosMateriais});
            }}
            required
          >
            <option value="">Selecione um material</option>
            {materiais.map(m => (
              <option key={m.idMaterial} value={m.idMaterial}>
                {m.nmMaterial} - R$ {m.precoVenda}
              </option>
            ))}
          </select>

          <input 
            type="number"
            min="1"
            value={item.quantidade}
            onChange={(e) => {
              const novosItens = [...venda.itens];
              novosItens[index].quantidade = parseInt(e.target.value);
              setVenda({...venda, itens: novosItens});
            }}
            required
          />

          <input 
            type="number"
            step="0.01"
            value={item.precoUnitario}
            onChange={(e) => {
              const novosItens = [...venda.itens];
              novosItens[index].precoUnitario = parseFloat(e.target.value);
              setVenda({...venda, itens: novosItens});
            }}
            required
          />
        </div>
      ))}

      <button type="button" onClick={adicionarItem}>
        Adicionar Item
      </button>

      <button type="submit">Criar Venda</button>
    </form>
  );
};

export default CriarVendaForm;
```

---

## **4. TRATAMENTO DE ERROS**

```javascript
const tratarErro = (error) => {
  if (error.response) {
    // Servidor respondeu com erro
    switch (error.response.status) {
      case 400:
        return `Erro de validação: ${JSON.stringify(error.response.data)}`;
      case 401:
        return 'Não autorizado. Faça login novamente.';
      case 403:
        return 'Sem permissão para esta ação.';
      case 404:
        return 'Recurso não encontrado.';
      case 500:
        return 'Erro interno do servidor. Tente novamente mais tarde.';
      default:
        return 'Erro desconhecido.';
    }
  } else if (error.request) {
    // Requisição feita mas sem resposta
    return 'Sem resposta do servidor. Verifique sua conexão.';
  } else {
    // Erro ao configurar requisição
    return `Erro: ${error.message}`;
  }
};

// Uso:
try {
  await criarVenda(vendaData);
} catch (error) {
  const mensagem = tratarErro(error);
  alert(mensagem);
}
```

---

## **5. FORMATAÇÃO DE DADOS**

### **5.1 Datas**
```javascript
// Backend retorna: "2025-12-10T22:00:00"
const formatarData = (dataISO) => {
  return new Date(dataISO).toLocaleDateString('pt-BR');
};

// Uso:
<span>{formatarData(conta.dataVencimento)}</span>
```

### **5.2 Valores Monetários**
```javascript
const formatarMoeda = (valor) => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(valor);
};

// Uso:
<span>{formatarMoeda(venda.valorTotal)}</span>
```

---

## **6. ESTADO GLOBAL (CONTEXT API OU REDUX)**

```javascript
// AuthContext.js
import React, { createContext, useState, useContext } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [usuario, setUsuario] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token'));

  const login = (userData, tokenJWT) => {
    setUsuario(userData);
    setToken(tokenJWT);
    localStorage.setItem('token', tokenJWT);
  };

  const logout = () => {
    setUsuario(null);
    setToken(null);
    localStorage.removeItem('token');
  };

  return (
    <AuthContext.Provider value={{ usuario, token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
```

---

## **7. CHECKLIST DE INTEGRAÇÃO**

- [ ] Axios instalado (`npm install axios`)
- [ ] Instância do Axios configurada com baseURL
- [ ] Interceptor de request para adicionar token JWT
- [ ] Interceptor de response para tratar erros 401
- [ ] Funções de API criadas para cada endpoint
- [ ] Tratamento de erros implementado
- [ ] Formatação de datas e valores funcionando
- [ ] Loading states nos componentes
- [ ] Feedback visual de sucesso/erro ao usuário
- [ ] Context API ou Redux para estado global
- [ ] Validação de formulários no frontend

---

## **8. DICAS IMPORTANTES**

✅ **Sempre envie token JWT** - Configurado automaticamente no interceptor  
✅ **Não envie idUsuario** - Backend pega do token automaticamente  
✅ **Use apenas IDs nos requests** - Não envie objetos aninhados  
✅ **Trate erros de validação** - Status 400 retorna detalhes  
✅ **Implemente loading states** - Melhora UX durante requisições  
✅ **Valide no frontend também** - Reduz requisições desnecessárias  
✅ **Use async/await** - Mais legível que Promises encadeadas  
✅ **Centralize chamadas de API** - Facilita manutenção  

---

**🎯 Com este guia, você tem tudo para integrar React/Axios com o backend Maderix!**
