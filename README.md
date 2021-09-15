# PROJETO DE TCC

## Status do projeto

Em desenvolvimento :warning:

## Objetivo

O projeto visa a criação de uma aplicação simples para troca de mensagens entre usuários

## Descrição

A aplicação criada possibilitará a troca de mensagens de forma instantânea utilizando o protocolo websocket onde, somente pessoas com usuário já pré-cadastrado por um administrador poderá logar e ter contato com os demais usuários da corporação a qual pertence.

## Funcionalidades

- [ ] Cadastro de usuários
- [ ] Troca de mensagens em tempo real
- [ ] Armazenamento de mensagens em banco de dados
- [ ] Login restrito

## To-do
- [ ] Sistema de adminstração para cadastro de usuários
- [ ] Tela de login dos usuários
- [ ] Interface da tela inicial
- [ ] Interface da tela de mensagens
- [ ] Criação do servidor
- [ ] Conexão do servidor com o cliente

## Inicialização

1º Clone o projeto
> git clone https://github.com/Alessandro-Miranda/TCC.git

### Client

Acesse a pasta _client_ via terminal

> cd client

e, utilizando o yarn, instale as dependências necessárias

> yarn install

Para iniciar o aplicativo pode-se utilizar as seguintes instruções:

> npm start

ou

> yarn start

### Server

Acesse a pasta

> cd server

e, utilizando o yarn ou npm, instale as dependências necessárias

>npm install

ou

>yarn install

Para iniciar o servidor em modo desenvolvimento:

>npm run dev

## Tecnologias e Ferramentas
- [React-Native](https://reactnative.dev/)
- [TypeScript](https://www.typescriptlang.org/)
- [NodeJs](https://nodejs.org/)
- [Express](https://expressjs.com/pt-br/)
- [Styled Components](https://styled-components.com/)