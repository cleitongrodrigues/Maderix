# Passo a Passo para o Sistema

## 1. Tela de Login
**Objetivo**: Permitir que os usuários façam login no sistema.

### Campos:
- E-mail
- Senha

### Funcionalidades:
- Autenticação do usuário.
- Redirecionamento para o painel principal após login bem-sucedido.

**Backend**: Validação do usuário na tabela `USUARIOS`.

---

## 2. Tela de Dashboard
**Objetivo**: Exibir um resumo das informações principais do sistema.

### Informações:
- Total de materiais no estoque.
- Total de vendas realizadas.
- Contas a receber pendentes.
- Gráficos ou indicadores de movimentações recentes.

### Funcionalidades:
- Links para acessar as outras telas do sistema.

---

## 3. Tela de Gestão de Materiais
**Objetivo**: Gerenciar os materiais no estoque.

### Funcionalidades:
- Listar todos os materiais cadastrados.
- Botão para adicionar um novo material.
- Botão para editar ou excluir materiais existentes.
- Exibição do estoque atual de cada material.

**Backend**: CRUD na tabela `MATERIAIS`.

---

## 4. Tela de Movimentação de Estoque
**Objetivo**: Registrar entradas e saídas de materiais.

### Funcionalidades:
- Selecionar o material.
- Escolher o tipo de movimentação (`ENTRADA` ou `SAIDA`).
- Informar a quantidade movimentada.
- Exibir o histórico de movimentações.

**Backend**: Inserção e consulta na tabela `MOVIMENTACAO_ESTOQUE`.

---

## 5. Tela de Gestão de Clientes
**Objetivo**: Gerenciar os clientes cadastrados.

### Funcionalidades:
- Listar todos os clientes cadastrados.
- Botão para adicionar um novo cliente.
- Botão para editar ou excluir clientes existentes.

**Backend**: CRUD na tabela `CLIENTES`.

---

## 6. Tela de Registro de Vendas
**Objetivo**: Registrar novas vendas realizadas.

### Funcionalidades:
- Selecionar o cliente.
- Informar o valor total da venda.
- Exibir o histórico de vendas realizadas.

**Backend**: Inserção e consulta na tabela `VENDAS`.