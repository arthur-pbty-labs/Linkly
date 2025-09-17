# Linkly

Linkly est un raccourcisseur de liens moderne qui permet de transformer vos longues URL en liens courts, partageables et personnalisables.

## 🚀 Fonctionnalités

### Pour tous les utilisateurs
- ✅ **Raccourcissement d'URL instantané** - Transformez n'importe quelle URL longue en lien court
- ✅ **Génération automatique de QR codes** - Chaque lien génère automatiquement un QR code téléchargeable
- ✅ **Interface responsive** - Design moderne adapté à tous les appareils
- ✅ **Liens temporaires** - Les utilisateurs anonymes bénéficient de liens valides 7 jours

### Pour les utilisateurs connectés
- ✅ **Authentification OAuth** - Connexion via GitHub et Google
- ✅ **Codes personnalisés** - Créez des liens avec vos propres codes
- ✅ **Expiration personnalisée** - Définissez votre propre date d'expiration
- ✅ **Limitation de clics** - Configurez un nombre maximum de clics
- ✅ **Usage unique** - Liens qui se désactivent après le premier clic
- ✅ **Tableau de bord** - Interface complète pour gérer vos liens
- ✅ **Statistiques détaillées** - Suivez les clics, dates et analytiques
- ✅ **Gestion des liens** - Supprimez et consultez l'historique de vos liens

## 🛠️ Technologies utilisées

- **Frontend**: Next.js 15, TypeScript, Tailwind CSS
- **Backend**: API Routes Next.js
- **Base de données**: Prisma ORM avec SQLite
- **Authentification**: NextAuth.js (GitHub + Google)
- **QR Codes**: Bibliothèque qrcode
- **Déploiement**: Docker + Docker Compose

## 📦 Installation et déploiement

### Prérequis
- Node.js 18+
- Docker et Docker Compose (pour le déploiement)

### Installation locale

1. **Cloner le projet**
```bash
git clone https://github.com/arthur-pbty/Linkly.git
cd Linkly
```

2. **Installer les dépendances**
```bash
npm install
```

3. **Configuration de l'environnement**
```bash
cp .env.example .env.local
```

Remplissez les variables d'environnement dans `.env.local`:
```env
DATABASE_URL="file:./dev.db"
NEXTAUTH_SECRET="votre-clé-secrète-ici"
NEXTAUTH_URL="http://localhost:3000"
GITHUB_CLIENT_ID="votre-github-client-id"
GITHUB_CLIENT_SECRET="votre-github-client-secret"
GOOGLE_CLIENT_ID="votre-google-client-id"
GOOGLE_CLIENT_SECRET="votre-google-client-secret"
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

L'application sera accessible sur `http://localhost:3000`

### Déploiement avec Docker

1. **Construction et lancement**
```bash
docker-compose up --build
```

L'application sera accessible sur `http://localhost:3000`

## 📂 Structure du projet

```
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── api/               # API Routes
│   │   ├── dashboard/         # Tableau de bord utilisateur
│   │   ├── [shortCode]/       # Redirection des liens courts
│   │   └── page.tsx           # Page d'accueil
│   ├── components/            # Composants React
│   ├── lib/                   # Utilitaires et configurations
│   └── types/                 # Définitions TypeScript
├── prisma/                    # Schéma de base de données
├── Dockerfile                 # Configuration Docker
├── docker-compose.yml         # Orchestration Docker
└── tailwind.config.js         # Configuration Tailwind CSS
```

## 🎯 API Endpoints

- `POST /api/links` - Créer un nouveau lien court
- `GET /api/links` - Récupérer les liens de l'utilisateur connecté  
- `DELETE /api/links/[id]` - Supprimer un lien
- `GET /[shortCode]` - Redirection vers l'URL originale

## 🔐 Sécurité

- Validation des URLs
- Protection contre les liens malveillants
- Gestion des expirations automatiques
- Authentification sécurisée via OAuth
- Sessions JWT pour les performances

## 📊 Fonctionnalités avancées

- **Analytics en temps réel** - Suivi des clics par date, pays, et user agent
- **QR codes personnalisables** - Génération et téléchargement automatiques
- **Interface multilingue** - Interface en français avec support i18n
- **Design responsive** - Optimisé pour mobile, tablette et desktop
- **Performance optimisée** - Build statique Next.js avec optimisations

## 🤝 Contribution

Les contributions sont les bienvenues ! N'hésitez pas à :

1. Fork le projet
2. Créer une branche feature (`git checkout -b feature/nouvelle-fonctionnalite`)
3. Commiter vos changements (`git commit -m 'Ajouter nouvelle fonctionnalité'`)
4. Pusher vers la branche (`git push origin feature/nouvelle-fonctionnalite`)
5. Ouvrir une Pull Request

## 📄 Licence

Ce projet est sous licence MIT. Voir le fichier [LICENSE](LICENSE) pour plus de détails.

## 📞 Support

Pour toute question ou support, veuillez ouvrir une issue sur GitHub.

---

Développé avec ❤️ par [Arthur](https://github.com/arthur-pbty)