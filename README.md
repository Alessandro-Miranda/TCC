# Projeto de TCC - Aplicativo de mensagens

## Status do projeto

Em desenvolvimento :warning:

## Objetivo

O projeto visa a criação de uma aplicação simples para troca de mensagens.

## Descrição

A aplicação criada possibilitará a troca de mensagens de forma instantânea utilizando o protocolo websocket onde, somente pessoas com usuário já pré-cadastrado por um administrador, poderá logar e ter contato com os demais usuários da corporação a qual pertence.

## Funcionalidades

- [ ] Cadastro de usuários
- [x] Troca de mensagens em tempo real
- [x] Armazenamento de mensagens em banco de dados

## To-do
- [ ] Sistema de adminstração para cadastro de usuários
- [x] Tela de login dos usuários
- [x] Interface da tela inicial
- [x] Interface da tela de mensagens
- [x] Criação do servidor
- [x] Conexão do servidor com o cliente

## Pré-requisitos

Antes de iniciar o desenvolvimento, tenha certeza de ter instalado na sua máquina o [expo-cli](https://docs.expo.dev/workflow/expo-cli/), [node](https://nodejs.org/en/) e [yarn](https://yarnpkg.com/); Também é necessário ter um emulador ou ter o [Expo go](https://expo.dev/client) instalado no aparelho celular a ser testado durante o desenvolvimento ou em um emulador.

## Inicialização

### Client

Acesse a pasta _client_ via terminal

> cd client

e, utilizando o yarn, instale as dependências necessárias

> yarn install

Para iniciar a aplicação no modo desenvolvimento basta utilizar o comando:

> yarn start

Após o expo-cli iniciar a aplicação, será disponibilizado as informações para acessar utilizando o expo go, seja com o QR code ou atráves do link gerado.

### Server

Acesse a pasta _server_ via terminal

> cd server

e instale as dependências necessárias

>npm install

_**Obs.**: Também é necessário criar o arquivo .env. Para isso, basta seguir o exemplo do arquivo .env.example_

Para iniciar o servidor em modo desenvolvimento basta utilizar o comando:

>npm run dev

Com o servidor iniciado, já será possível acessar as seguintes rotas:

- _/messages/contacts/:email/:department_: Rota que permite acesso aos contatos do usuário através do departamento ao qual ele pertence (Retorna todos os usuários que pretencem ao mesmo departamento). O parâmetro email é obrigátorio. O parâmetro department, quando omitido, faz com que seja retornado apenas os contatos com quem o usuário já trocou alguma mensagem, independentemente do departamento. Ao chamar esta rota, é necessário passar o cabeçalho **'x-access-token'**, passando o token de autenticação, para validar o acesso do usuário.

- _/auth_: Rota de autenticação. No corpo da requisição deve ser enviado um json contendo o email e password do usuário.

-_/auth/confirm-authentication_: Rota que valida se o token de autenticação ainda está valido. Nessa rota é necessário enviar o cabeçalho **'x-access-token'**, passando o token do usuário. retornando _true_ or false

### Contatos

Todos os contatos são identificados pelo seu e-mail e possuem as seguintes propriedades.

Campo           | Tipo      | Descrição
----------------|-----------|---------
admin           | Boolean   | Indica se o usuário é um administrador
email           | String    | E-mail cadastrado do usuário
department      | String    | Departamento ao qual o usuário pertence. Por exemplo: TI
first_name      | String    | Primeiro nome do usuário
last_name       | String    | Último nome do usuário

### Autenticação

Quando solicitado a autenticação, será retornado informações básicas do usuário e, juntamente, seu token de autenticação. As informações são:

Campo           | Tipo      | Descrição
----------------|-----------|---------
token           | String    | Token de autenticação
user            | Object    | Informações básicas do usuário
admin           | Boolean   | Indica se o usuário é um administrador
department      | String    | Departamento ao qual o usuário pertence. Por exemplo: TI
first_name      | String    | Primeiro nome do usuário
last_name       | String    | Último nome do usuário
email           | String    | E-mail cadastrado do usuário

### Exemplo de retorno

Ao solicitar os contatos na rota /messages/contacts passando o usuário e departamento (Ex.: _/messages/contacts/useremail@emal.com/rh_), o retorno será como o exemplo abaixo

```json
[
  {
    "admin": false,
	"email": "maria@email.com.br",
	"department": "rh",
	"last_name": "santos",
	"first_name": "maria"
  },
  {
    "email": "fulano@email.com.br",
	"admin": false,
    "first_name": "fulano",
    "department": "rh",
    "last_name": "rosa"
  },
  {
    "admin": false,
    "department": "rh",
    "first_name": "john",
    "email": "john@email.com.br",
    "last_name": "smith"
  }
]
```

_**Obs**.: O retorno quando ocultado o parâmetro do departamento também é igual ao exemplo acima

Quando solicitado a autenticação do usuário, haverá o seguinte retorno

```json
{
	"token": "eyJhbGciTiXIUzI1QiIsInC5cCI6IkpXVCJ9.eyLpZUI6ImFsZXNzWR5kcm9AZW1wcmVzYS5jb20uYnIiLCJpYXQiOjE2NDExMzI0KIgsImV4cCI6MTY0MTEzNDIxOH0._QW1IeVBrKInk-dt4dX20kqGAbla2MRpefJGsINfNxQ",
	"user": {
		"admin": false,
		"first_name": "john",
		"last_name": "smith",
		"email": "john@empresa.com.br",
		"department": "ti"
	}
}
```

## Tecnologias e Ferramentas

- [React-Native](https://reactnative.dev/)
- [Expo-cli](https://docs.expo.dev/workflow/expo-cli/)
- [Expo Go](https://expo.dev/client)
- [TypeScript](https://www.typescriptlang.org/)
- [NodeJs](https://nodejs.org/)
- [Express](https://expressjs.com/pt-br/)
- [Insomnia](https://insomnia.rest/download)
- [Firebase](https://firebase.google.com/?hl=pt)

## Licença

Este projeto está sob a licença MIT - veja o arquivo [LICENSE](https://github.com/Alessandro-Miranda/TCC/blob/master/LICENSE) para detalhes.