# Projet Lam Phone — Contexte permanent

Site vitrine d'un réparateur de téléphones et ordinateurs à Pont-Évêque (38780). Langue du site : **français**.

## Identité / coordonnées (NE PAS INVENTER, NE PAS CHANGER sans demande)
- Nom : **Lam Phone**
- Téléphone : **07 63 51 70 25** — liens : texte `07 63 51 70 25`, `tel:+33763517025`, WhatsApp `https://wa.me/33763517025` (message prérempli devis).
- E-mail : **lamphone38@gmail.com** (lien → Gmail compose `https://mail.google.com/mail/?view=cm&fs=1&to=lamphone38@gmail.com&su=Demande%20de%20devis%20Lam%20Phone`)
- Adresse : Pont-Évêque, 38780 (lien Google Maps `https://www.google.com/maps/search/?api=1&query=Pont-Évêque+38780`)
- Horaires : 24h/24, 7j/7
- SIRET : 838 821 817 00023 (mentions légales)
- Pas de garantie 6 mois mentionnée (demande client).

## Fichiers
- `index.html` : accueil (héro téléphone, stats, services, tarifs, avis, CTA, footer)
- `assistance.html` : page Assistance = assistant virtuel (chat flottant + FAQ). Le chat est aussi sur toutes les pages.
- `devis.html` : formulaire de devis qui envoie la demande sur WhatsApp (+33763517025) — ne PAS casser le handler `devisForm` dans script.js
- `contact.html`, `appel.html`, `avis.html` : pages reliées par le menu (Accueil / Services / Tarifs / Assistance / Devis / Avis / Contact)
- `style.css`, `script.js`, `affiche-lam-phone.html` (affiche QR à imprimer), `qr-lam-phone.png`, `qr-site-lam-phone.png`, `qr-whatsapp.png`, `qr-snapchat.png`, `qr-lam-phone38.png`, `qr-lam-phone-tiktok.png`, `404.html`, `robots.txt`, `sitemap.xml`

## Statistiques de visite
- **Google Analytics 4** : ID de mesure `G-PYYDF2GKPQ` (ne pas changer/dupliquer).
- Installé via `script.js` (module `gaInit`) : gtag chargé **après** acceptation du bandeau RGPD ; choix stocké dans `localStorage` (`lamGA` = `yes`/`no`).
- Bandeau cookies `.ga-banner` injecté par JS (textes + boutons Accepter/Refuser).
- Lire les stats : https://analytics.google.com avec le compte `lamphone38@gmail.com` → « Site Lam Phone » → Rapports / Realtime.

## Assistance virtuelle (chat, fonctionne sans serveur)
- Widget chat sur toutes les pages (bouton en bas à gauche, `.chat-btn` ; fenêtre `.chat-panel`).
- Moteur dans `script.js` : `CHAT_INTENTS` (mots-clés + réponses), scoring par longueur de mot clé ; repli `CHAT_FALLBACK` → appelle/WhatsApp quand il ne sait pas.
- Réponses = contenu réel du site (tarifs, horaires 24/7, Pont-Évêque + déplacement, toutes marques, diagnostic gratuit). Ne PAS inventer de garantie.
- Ne casse pas : normalize (accents), gère accents via `normalize("NFD")`, chaîne `script.js` chaque page.

## Générateur de revenus (toujours respecter)
- Le CTA PRINCIPAL des pages = **appel** (`tel:+33763517025`) puis WhatsApp.
- Tous les « Devis gratuit » pointent vers `devis.html`.
- Barre d'action fixe sur mobile : `.cta-bar` (2 boutons : appeler / WhatsApp).
- Formulaire Devis → ouvre `wa.me/33763517025` avec la demande pré-remplie (pas de serveur, rien n'est stocké).

## Design (goût client : sobre/pro + détails premium — « peau v2 » validée le 23/09/2026)
- Accent `#0ea5e9`, foncé `#0284c7`, navy profond `#0b1f3a`, fond `#f6f9fc`, texte `#1f2937`.
- Polices : Poppins (titres/logo), Inter (corps), DM Serif Display (slogan contact).
- Pas d'émojis. Animations subtiles uniquement : reveal au scroll `.rev` (sûr : contenu jamais invisible), reflet des boutons, dégradé du mot hero, blobs du hero.
- Détails v2 : numéro dans le header (`.header-tel`, desktop), mini-puces héros (`.hero-points`), ligne marques (`.brands`), badge « Avis vérifié », ligne « Le plus demandé » (`.is-pop`), scroll-padding, sélection colorée.
- Ne jamais refondre sans validation du client (historique : refonte animations/compteurs rejetée puis peau v2 demandée).

## ATTENTION ENCODAGE (très important)
- Les fichiers sont UTF-8. NE JAMAIS réécrire un `.html`/`.js` avec `Set-Content`/`Get-Content` en PowerShell : ça casse les accents. Utiliser les outils d'édition, ou `git checkout -- <fichier>` pour restaurer.

## Publication
- Dépôt GitHub : `dedel38780/lam-phone` (branche `main`).
- Adresse en ligne : **https://dedel38780.github.io/lam-phone/**
- Publier = `git add -A` → `git commit -m "..."` → `git push` → attendre ~1 min de build GitHub Pages → Ctrl+F5.
- Git installé à `C:\Program Files\Git\cmd\git.exe` (utiliser ce chemin si non dans le PATH).
- Ordre des commandes : les chainer avec `if ($?)` (PowerShell, pas de `&&`).

## Règles pour l'assistant
- Lire ce fichier est obligatoire avant toute modification du site.
- Application du skill webdesign (système de design). Ne jamais refondre sans validation.
- Ne pas inclure de secret/jeton dans le code.