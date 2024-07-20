# Prise en Main

<!-- > **Remarque** : Assurez-vous d'avoir complété les instructions de [Configuration de l'Environnement - React Native](https://reactnative.dev/docs/environment-setup) jusqu'à l'étape "Créer une nouvelle application", avant de continuer. -->

## Étape 1 : Démarrer le Serveur Metro

Tout d'abord, vous devez démarrer **Metro**, le _bundler_ JavaScript fourni _avec_ React Native.

Pour démarrer Metro, exécutez la commande suivante depuis la _racine_ du projet :

```bash
# en utilisant npm
npm start

# OU en utilisant Yarn
yarn start
```

## Étape 2 : Démarrer l'application

Laissez Metro Bundler s'exécuter dans son propre terminal. Ouvrez un nouveau terminal depuis la racine de votre projet React Native. Exécutez la commande suivante pour démarrer l'application Android ou iOS :

### Pour Android :

```bash
# en utilisant npm
npm run android

# OU en utilisant Yarn
yarn android
```

### Pour iOS :

```bash
# en utilisant npm
npm run ios

# OU en utilisant Yarn
yarn ios
```

Si tout est correctement configuré, vous devriez voir l'application s'exécuter dans votre émulateur Android ou simulateur iOS sous peu, à condition que vous ayez correctement configuré votre émulateur/simulateur.

C'est une façon de lancer l'application — vous pouvez également la lancer directement depuis Android Studio et Xcode respectivement.
Vous pouvez également brancher votre propre appareil et l'utiliser comme émulateur.

# Dépannage

Si vous n'arrivez pas à faire fonctionner cela, consultez la page [Dépannage](https://reactnative.dev/docs/troubleshooting).

# Documentation de Déploiement et Infrastructures

## 1. Base de Données SQL (MySQL)

La base de données MySQL est utilisée pour stocker les données de fin de parties de nombreux joueurs. Chaque fois qu'un joueur recherche son nom, les données de ses parties sont collectées et enregistrées, incluant l'historique des parties.

## 2. API en NodeJS

L'API développée en NodeJS sert de middleware entre l'application mobile et les bases de données MySQL et MongoDB. Elle utilise l'API de Riot pour collecter les données de jeu et les stocker dans les bases de données.

## 3. Application Mobile en React-Native

L'application mobile, développée en React-Native, permet aux utilisateurs de rechercher leurs pseudo/tag et d'afficher les données de jeu collectées. Elle interagit avec l'API NodeJS pour récupérer et afficher les informations pertinentes.
