# 📌 Sistema de Controle de Estoque e Vendas — Maderix

## 🔑 1. Módulo de Autenticação

* **Login**: usuário entra com email/login + senha.
* **Recuperação de senha** (opcional, usando o `registroToken`).

---

## 👥 2. Módulo de Usuários e Perfis

* **Cadastro de usuários** (vinculados à empresa).
* **Perfis de usuário** (admin, vendedor, financeiro etc.).
* **Gestão de permissões** por perfil.

---

## 🏢 3. Módulo de Empresa

* **Cadastro da empresa** (razão social, fantasia, CNPJ).
* **Listagem e edição** de dados da empresa.

---

## 👨‍👩‍👧 4. Módulo de Clientes

* **Cadastro de clientes** (nome, telefone, email).
* **Listagem, edição e exclusão** de clientes.
* **Busca rápida** por nome/telefone/email.

---

## 📦 5. Módulo de Estoque

* **Cadastro de unidades de medida** (ex.: UN, KG, M²).
* **Cadastro de materiais** (nome, descrição, preço de custo, estoque atual).
* **Movimentação de estoque**: entradas, saídas, ajustes.
* **Histórico de movimentações**.

---

## 🛒 6. Módulo de Vendas

* **Lançar venda**: escolher cliente, vendedor, empresa, adicionar itens.
* **Detalhe da venda**: status, valores, parcelas.
* **Finalizar venda** → gera automaticamente contas a receber.

---

## 💰 7. Módulo Financeiro

* **Contas a receber**: listagem de títulos gerados pelas vendas.
* **Baixa de pagamento**: registrar pagamento total ou parcial.
* **Controle de status** (Aberto, Pago, Atrasado).

---

## 📊 8. Relatórios

* **Relatório de vendas por período**.
* **Fluxo de caixa** (entradas e saídas).
* **Estoque mínimo / materiais em falta**.
* **Histórico de movimentações de estoque**.

---

👉 **Sugestão de ordem de implementação (roadmap):**

1. Login
2. Usuários e Perfis
3. Empresa
4. Clientes
5. Estoque
6. Vendas
7. Financeiro
8. Relatórios