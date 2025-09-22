# Linkly - Raccourcisseur de liens

Linkly est une application web complète de raccourcissement de liens construite avec Next.js, Tailwind CSS, Prisma, et SQLite. Elle offre des fonctionnalités avancées d'authentification, de gestion des liens, et de génération de QR codes.

## ✨ Fonctionnalités

### Pour tous les utilisateurs
- ✅ Création de liens courts avec génération automatique de QR codes
- ✅ Redirection rapide et fiable
- ✅ Liens anonymes avec expiration automatique après 7 jours

### Pour les utilisateurs connectés
- ✅ Authentification via GitHub et Google (NextAuth)
- ✅ Tableau de bord personnel pour gérer ses liens
- ✅ Options avancées :
  - Date d'expiration personnalisée
  - Limite de clics maximum
  - Liens à usage unique
- ✅ Statistiques détaillées :
  - Nombre de clics
  - Date de création
  - Dernier accès
- ✅ Suppression des liens
- ✅ Téléchargement des QR codes

## 🛠 Technologies utilisées

- **Frontend**: Next.js 14, TypeScript, Tailwind CSS
- **Backend**: API Routes Next.js
- **Base de données**: SQLite avec Prisma ORM
- **Authentification**: NextAuth.js (GitHub, Google)
- **QR Codes**: qrcode library
- **Déploiement**: Docker & Docker Compose

## 🚀 Installation et développement

### Prérequis
- Node.js 18 ou plus récent
- npm ou yarn

### Installation

1. **Cloner le projet**
```bash
git clone <url-du-repo>
cd linkly
```

2. **Installer les dépendances**
```bash
npm install
```

3. **Configurer l'environnement**
Variables requises dans `.env` :
```env
# Base de données
DATABASE_URL="file:./dev.db"

# NextAuth
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secret-key-change-this-in-production"

# GitHub OAuth (optionnel pour le développement)
GITHUB_ID="your-github-client-id"
GITHUB_SECRET="your-github-client-secret"

# Google OAuth (optionnel pour le développement)
GOOGLE_ID="your-google-client-id"
GOOGLE_SECRET="your-google-client-secret"
```

4. **Initialiser la base de données**
```bash
npx prisma generate
npx prisma db push
```

5. **Lancer le serveur de développement**
```bash
npm run dev
```

## 🐳 Déploiement avec Docker

```bash
# Créer le répertoire pour la base de données
mkdir -p data

# Mettre à jour les variables d'environnement dans docker-compose.yml
# avec vos vraies clés OAuth

# Lancer l'application
docker-compose up -d
```
