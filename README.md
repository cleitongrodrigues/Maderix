# 🪵 Maderix: Sistema de Gestão de Estoque e Financeiro para Marcenarias

Maderix é uma solução completa para micro e pequenas empresas no setor madeireiro e de marcenaria, focada em centralizar o controle de estoque de matéria-prima e a gestão de contas a receber. O sistema automatiza o registro de transações, garantindo que o estoque físico seja atualizado em tempo real.

---

## 🛠️ Stack Tecnológica

O projeto é baseado em uma arquitetura de microserviços (mono-repositório) com uma stack moderna e robusta.

| Camada | Tecnologia | Versão |
| :--- | :--- | :--- |
| **Backend (API)** | **Spring Boot** | 3.x (Latest) |
| **Segurança** | Spring Security, **JWT (Auth0)** | - |
| **Banco de Dados** | JPA/Hibernate, **H2 (Em Memória para Dev)**, MySQL (Produção) | - |
| **Frontend (Web)** | **React** | Latest |
| **Ambiente** | **Node.js** | LTS (Última) |
| **Build Tool** | Maven | - |

---

## ⚙️ Guia de Instalação e Execução

Siga estas instruções para configurar e rodar o projeto localmente.

### 1. Pré-Requisitos

Certifique-se de ter instalado:
* Java Development Kit **(JDK 17 ou superior)**
* Node.js **(LTS)**
* npm (gerenciador de pacotes do Node) ou Yarn
* Maven (instalado ou via wrapper)

### 2. Configuração do Backend (Spring Boot)

1. **Clonar o Repositório:**
   ```bash
   git clone [https://www.youtube.com/watch?v=m_6f3r-fwsE](https://www.youtube.com/watch?v=m_6f3r-fwsE)
   cd backend

   Configurar a Chave JWT: Edite o arquivo src/main/resources/application.properties e adicione sua chave secreta para o JWT. (A chave deve ser longa e complexa):
  # Chave de segurança para o JWT
  api.security.token.secret=SUA_CHAVE_SECRETA_AQUI

  Rodar o Backend: O projeto está configurado para usar o H2 Database em memória para desenvolvimento.

  # Compila e executa o projeto
  ./mvnw spring-boot:run
  Ou
  mvn spring-boot:run
  A API estará rodando em http://localhost:8080

  Instalar Dependências: A partir da pasta raiz do frontend:
  npm install ou npm i

  Iniciar a Aplicação:
  npm start

  O frontend será aberto no seu navegador, geralmente em http://localhost:3000

  🔒 Endpoints e Documentação
  Documentação da API (Swagger/OpenAPI): Acesse http://localhost:8080/swagger-ui/index.html para testar todos os endpoints (Login, CRUDs, Vendas, Cancelamento).

  Console do Banco de Dados (H2): Acesse http://localhost:8080/h2-console (JDBC URL: jdbc:h2:mem:maderixdb) para verificar o schema e os dados criados.
