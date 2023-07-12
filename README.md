# Chalk

Chalk is a chat application developed in React Native and Expo. It uses RealmDB and Firebase to store and manage user data and conversations.
The purpose of the application is to allow users to connect with new people through private and group conversations.

# Features
- User registration and login
- Contact list
- Private conversations
- Real-time messaging
- Push notifications

# Requirements
- Firebase account

# Installation

## Clone the repository and install the dependencies:

```bash
git clone https://github.com/FranciscoOssian/chalk.git
cd chalk
yarn install
```

## Follow the instructions to install react native firebase

[https://rnfirebase.io/](https://rnfirebase.io/)

## Firebase

The following Firebase products must be used for the application to function. Note: in the official firebase there are firebase rules security rules that validate malicious users, however as it is not the focus of the project it will not be addressed here

- auth: email and google
- firestore
- realtime

## Execute

```bash
yarn android
```

# Contribution

Contributions are welcome! Feel free to open an issue or pull request with improvements or corrections.
