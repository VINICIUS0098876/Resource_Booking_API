# Resource Booking API ![Node.js](https://img.shields.io/badge/Node.js-339933?logo=node.js&logoColor=fff) ![TypeScript](https://img.shields.io/badge/TypeScript-007acc?logo=typescript&logoColor=fff) ![Prisma](https://img.shields.io/badge/Prisma-2D3748?logo=prisma&logoColor=fff) ![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)

## Sobre o Projeto

A **Resource Booking API** é uma API RESTful desenvolvida para gerenciar reservas de recursos — como salas de laboratório, equipamentos e auditórios — no ambiente universitário. O sistema assegura gestão eficiente de horários, permissões de usuários e validações rigorosas de dados, prevenindo conflitos de agendamento e simplificando o controle do uso dos recursos.

---

## Features

- **Autenticação & Autorização**
  - Login seguro utilizando JWT.
  - RBAC: Níveis de acesso `ADMIN` e `ESTUDANTE`.
  - Middlewares para proteção de rotas sensíveis.

- **Gerenciamento de Recursos**
  - CRUD completo de salas e equipamentos (permissão exclusiva de ADMIN).

- **Sistema de Reservas Inteligente**
  - Reservas podem ser criadas tanto por alunos quanto administradores.
  - Lógica robusta para impedir conflitos de horários (overlapping dates).

- **Segurança e Qualidade**
  - Tratamento de erros centralizado e respostas consistentes.

---

## Tecnologias Utilizadas

- **Node.js**
- **TypeScript**
- **Express.js**
- **Prisma ORM**
- **MySQL**
- **JWT**
- **Bcrypt**
- **Swagger/OpenAPI** (Documentação interativa)

---

## Pré-requisitos

- **Node.js** (versão 18+ recomendada)
- **MySQL** (em execução e com um banco configurado)
- **npm** (gerenciador de pacotes)

---

## Passo a Passo de Instalação

1. **Clone o repositório:**
   ```bash
   git clone https://github.com/VINICIUS0098876/Resource_Booking_API.git
   cd Resource_Booking_API
   ```

2. **Instale as dependências:**
   ```bash
   npm install
   ```

3. **Configure as variáveis de ambiente:**
   Crie um arquivo `.env` na raiz do projeto seguindo o exemplo abaixo:
   ```env
   DATABASE_URL="mysql://user:password@localhost:3306/database"
   JWT_SECRET="sua_chave_jwt"
   PORT=3333
   ```

4. **Gere os artefatos do Prisma e aplique o schema:**
   ```bash
   npx prisma generate
   npx prisma db push
   # ou, para rodar as migrations, caso esteja utilizando
   # npx prisma migrate dev
   ```

5. **Inicie o servidor em ambiente de desenvolvimento:**
   ```bash
   npm run dev
   ```

---

## Documentação da API

A documentação interativa da API está disponível em:

```
/api-docs
```

Acesse no navegador após subir a aplicação para consultar endpoints, payloads e exemplos de requisições via Swagger/OpenAPI.

---

## Autor

Feito com dedicação por [Vinicius Guimarães Roberto (VINICIUS0098876)](https://github.com/VINICIUS0098876)

---
