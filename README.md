# digital-abonnement

Site vitrine statique (un seul fichier `index.html`) pour vendre des abonnements digitaux, avec commande par WhatsApp.
Aucun build n'est nécessaire.

## Déployer sur Vercel
1. Importer ce dépôt GitHub dans Vercel (New Project).
2. Framework Preset : **Other**. Laisser Build Command et Output Directory vides.
3. Cliquer sur Deploy.

## Modifier le contenu
Le contenu (offres, prix, numéro WhatsApp, moyens de paiement) est dans le bloc
`<script type="application/json" id="site-data">` de `index.html`.
Modifier ce JSON puis faire un commit : Vercel redéploie automatiquement.

Note : le bouton « الإدارة » (panneau d'administration) ne fonctionne que dans claude.ai.
Sur Vercel il n'apparaît pas.
