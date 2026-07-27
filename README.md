# Portfolio — Achraf Belghiti

Site **100 % statique** (HTML / CSS / JavaScript), sans serveur, sans PHP, sans Node.js
et sans base de données. Hébergé gratuitement sur **GitHub Pages** :

> https://belghitiachraf41-arch.github.io/portfolio/

---

## 1. Structure du dépôt

```
portfolio/
├── index.html                  <- page unique, à la racine du dépôt
├── .nojekyll                   <- désactive le traitement Jekyll (à conserver)
├── README.md
├── css/
│   └── style.css               <- thèmes, responsive, animations
├── js/
│   └── script.js               <- menu mobile, thème, animations, interactions
├── images/
│   ├── favicon.svg             <- icône du site
│   ├── portrait/               <- portrait.jpg
│   ├── logos/                  <- logos écoles / marques
│   └── creations/              <- visuels et vidéos des créations
└── documents/
    └── CV-Achraf-Belghiti.pdf
```

Tous les chemins du site sont **relatifs** (`./css/style.css`, `./js/script.js`,
`./images/...`, `./documents/...`). Aucun chemin absolu (`/css/...`), aucun chemin
Windows (`C:\\Users\\...`), aucun `file:///`, aucun `localhost`.

---

## 2. Publier / mettre à jour sur GitHub Pages

1. Ouvrir **Settings → Pages** du dépôt.
2. **Source** : *Deploy from a branch*.
3. **Branch** : `main` — **Folder** : `/ (root)` → **Save**.
4. Attendre 1 à 3 minutes : le site est en ligne sur
   https://belghitiachraf41-arch.github.io/portfolio/

Mise à jour depuis un ordinateur :

```bash
git clone https://github.com/belghitiachraf41-arch/portfolio.git
cd portfolio
# ... modifications ...
git add .
git commit -m "Mise à jour du portfolio"
git push
```

Sans Git : bouton **Add file → Upload files** sur GitHub, puis glisser les fichiers.

---

## 3. Fichiers médias à téléverser (noms exacts, sensibles à la casse)

**`images/portrait/`**
- portrait.jpg

**`images/logos/`**
- ash-logo-sm.png
- ismagi-logo.png
- ofppt-logo-sm.png

**`images/creations/` — images**
- dunkin-summer-2026.jpeg
- dunkin-pool-pink-pineapple.jpeg
- dunkin-beach-donut.jpeg
- dunkin-car-window.jpeg
- dunkin-flowers.jpeg
- dunkin-passenger-princess.jpeg
- dunkin-kitten-meme.jpeg
- dunkin-spongebob-meme.jpeg
- dunkin-highway-meme.jpeg
- ash-coffee-bearmilk.jpg
- ash-donut-menu.jpg
- ash-airways-huddle.jpg
- ash-airways-stewardess.jpg
- ash-jersey-train.jpg
- luma-bags.jpg

**`images/creations/` — vidéos**
- video-1.mp4
- video-2.mp4
- video-3.mp4
- video-4.mp4

**`documents/`**
- CV-Achraf-Belghiti.pdf

> **Important :** GitHub Pages distingue les majuscules et les minuscules.
> `Portrait.JPG` ne fonctionnera pas si le code appelle `portrait.jpg`.
> Tant qu une image est absente, un cadre indiquant le fichier manquant s affiche
> à sa place : le reste du site continue de fonctionner normalement.

Poids conseillé : images ≤ 300 Ko (JPEG qualité 80 %, largeur max 1600 px),
vidéos ≤ 10 Mo (MP4 / H.264). Les images sont déjà chargées en `loading="lazy"`.

---

## 4. Récupérer le projet complet en ZIP

Sur la page du dépôt : **Code → Download ZIP**, ou directement :
https://github.com/belghitiachraf41-arch/portfolio/archive/refs/heads/main.zip

---

## 5. Fonctionnalités

- Responsive : mobile, tablette, ordinateur (menu hamburger sous 768 px).
- Thème sombre / clair mémorisé dans le navigateur.
- Animations d apparition au défilement (désactivées si *prefers-reduced-motion*).
- Navigation interne fluide et lien actif automatique.
- Boutons e-mail, téléphone, LinkedIn, Instagram et téléchargement du CV.
- SEO : titre, meta description, Open Graph, canonical, favicon, `lang="fr"`.
- Accessibilité : textes alternatifs, focus visible, lien d évitement, attributs ARIA.
