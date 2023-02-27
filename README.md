# Chalk

Chalk é um aplicativo de chat desenvolvido em React Native e Expo. Ele usa RealmDB e Firebase para armazenar e gerenciar dados do usuário e conversas.
O objetivo do aplicativo é permitir que os usuários se conectem com novas pessoas através de conversas privadas e em grupo.

# Funcionalidades
- Cadastro e login de usuários
- Lista de contatos
- Conversas privadas
- Envio de mensagens em tempo real
- Notificações push

# Requisitos
- Conta no firebase

# Instalação

## Clone o repositório e instale as dependências:

```bash
git clone https://github.com/FranciscoOssian/chalk.git
cd chalk
yarn install
```

## Siga as instruções para instalar o react native firebase

[https://rnfirebase.io/](https://rnfirebase.io/)

## Firebase

Os seguindos produtos do firebase devem ser usados para o aplicativo funcionar. Observação: no firebase oficial constam regras de segurança do firebase rules que valida usuários mal intencionados, porém como não é o foco do projecto não será abordado aqui

- auth: email e google
- firestore
- realtime

## Execute

```bash
yarn android
```

# Contribuição

Contribuições são bem-vindas! Sinta-se à vontade para abrir uma issue ou um pull request com melhorias ou correções.
