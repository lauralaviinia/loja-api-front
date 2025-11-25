# 🛍️ Front-end da loja

Uma aplicação web completa para gerenciamento de loja, construída com React, TypeScript e Vite, totalmente integrada à API REST da Loja.

## 📋 Funcionalidades
- ✅ Interface completa para gerenciamento de Produtos
- ✅ CRUD de Categorias
- ✅ CRUD de Clientes
- ✅ CRUD de Pedidos
- ✅ Formulários validados com Zod
- ✅ Navegação com React Router DOM
- ✅ Consumo da API com Axios
- ✅ Interface moderna e responsiva
- ✅ Integração total com a API da Loja

## 🛠️ Tecnologias
- React + TypeScript
- Vite
- React Router DOM
- Axios
- Zod
- Material UI
- ESLint + TypeScript Rules

## 🚀 Como Rodar a Aplicação

### 📋 Pré-requisitos
- Node.js (v18 ou superior)  
- npm ou yarn  
- API da loja rodando em: http://localhost:3333  
- Git  

### 1️⃣ Clone o Repositório
```bash
git clone https://github.com/seu-usuario/loja-api.git
cd loja-api
```

### 2️⃣ Instale as Dependências
```bash
npm install
```

### 3️⃣ Configure as Variáveis de Ambiente
**Crie um arquivo .env na raiz do projeto:**
```bash
VITE_API_URL=http://localhost:3333
```

### 4️⃣ Inicie o Projeto
```bash
npm run dev
```
A aplicação estará disponível em:
- http://localhost:5173

### 5️⃣ Build para Produção
```bash
npm run build
npm run preview
```

## 🌐 Integração com a API

🛒 **Produtos**

- `GET /produtos` → Listar produtos
- `POST /produtos` → Criar produto
- `PUT /produtos/:id` → Atualizar produto
- `DELETE /produtos/:id` → Deletar produto

📂 **Categorias**

- CRUD completo

👥 **Clientes**

- CRUD completo

📦 **Pedidos**

- Listagem completa e CRUD
- Exibição de cliente + produtos do pedido

# 📄 Licença
Este projeto está sob a licença MIT. Veja o arquivo LICENSE para mais detalhes.

# 🎀 Autora
Laura Lavínia Lopes de Andrade

- GitHub: @lauralaviinia
- RGM: 33467145