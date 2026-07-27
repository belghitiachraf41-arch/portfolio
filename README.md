# Achraf Belghiti — Portfolio (site statique)

Site statique HTML / CSS / JavaScript, prêt pour GitHub Pages.

## Structure
```
index.html
css/style.css
js/script.js
images/          (logos, portrait, images/creations/)
.nojekyll        (désactive le traitement Jekyll)
```

## Publier sur GitHub Pages
1. Créez un dépôt GitHub et poussez **le contenu de ce dossier à la racine**
   (index.html doit être à la racine du dépôt).
   ```
   git init
   git add .
   git commit -m "Portfolio"
   git branch -M main
   git remote add origin https://github.com/VOTRE-USER/VOTRE-REPO.git
   git push -u origin main
   ```
2. Sur GitHub : **Settings → Pages**.
3. Source : **Deploy from a branch**, branche `main`, dossier `/ (root)`.
4. Enregistrez. Le site sera en ligne sous quelques minutes à l'adresse
   `https://VOTRE-USER.github.io/VOTRE-REPO/`.

## Notes
- Tous les chemins sont relatifs — fonctionne aussi dans un sous-dossier de dépôt.
- Responsive : ordinateur, tablette et mobile (menu hamburger).
- Le chatbot IA nécessite un backend pour répondre en direct ; sans backend, il
  affiche un message renvoyant vers l'e-mail d'Achraf.
