/* =========================================================================
   Achraf Belghiti - Portfolio
   Section « Projets » : donnees structurees + cartes + fenetre detaillee.
   Chemin : ./js/projects.js
   100% statique, aucune dependance, compatible GitHub Pages.
   ========================================================================= */
(function () {
  'use strict';

  var REDUCE = !!(window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches);

  /* --- Icones SVG en ligne (aucun fichier externe, aucun lien casse) ----- */
  var SVG_HEAD = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" focusable="false" aria-hidden="true">';

  var ICONS = {
    video:   SVG_HEAD + '<rect x="2.6" y="5.6" width="12.8" height="12.8" rx="3"/><path d="M15.4 10.4 21 7.4v9.2l-5.6-3z"/></svg>',
    flame:   SVG_HEAD + '<path d="M12 2.8c3 3.1 4.8 5.7 4.8 8.4a4.8 4.8 0 0 1-9.6 0c0-2.7 1.8-5.3 4.8-8.4z"/><circle cx="12" cy="13.4" r="2"/></svg>',
    compass: SVG_HEAD + '<circle cx="12" cy="12" r="8.8"/><path d="M15.4 8.6l-2.1 4.7-4.7 2.1 2.1-4.7z"/></svg>',
    sparkle: SVG_HEAD + '<path d="M12 2.9l1.9 5.2 5.2 1.9-5.2 1.9-1.9 5.2-1.9-5.2-5.2-1.9 5.2-1.9z"/><path d="M18.5 17.6l.6 1.7 1.7.6-1.7.6-.6 1.7-.6-1.7-1.7-.6 1.7-.6z"/></svg>',
    arrow:   '<svg class="proj-arrow" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" focusable="false" aria-hidden="true"><path d="M5 12h13"/><path d="M13 6l6 6-6 6"/></svg>',
    ext:     '<svg class="proj-btn-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" focusable="false" aria-hidden="true"><path d="M14 4h6v6"/><path d="M20 4l-8.6 8.6"/><path d="M18 14.4V19a1.5 1.5 0 0 1-1.5 1.5H5A1.5 1.5 0 0 1 3.5 19V7.5A1.5 1.5 0 0 1 5 6h4.6"/></svg>',
    close:   '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" focusable="false" aria-hidden="true"><path d="M6.5 6.5l11 11"/><path d="M17.5 6.5l-11 11"/></svg>'
  };


  /* =======================================================================
     DONNEES STRUCTUREES DES PROJETS
     Une seule source de verite : les cartes ET les fenetres detaillees
     sont generees automatiquement a partir de ce tableau.
     ----------------------------------------------------------------------
     ATTENTION AUX CHEMINS PDF : ils correspondent exactement aux fichiers
     presents dans le dossier ./documents/ (espaces encodes en %20 et le
     caractere « & » encode en %26).
     ======================================================================= */
  var projects = [

    /* ------------------------------ PROJET 1 ------------------------------ */
    {
      id: 'choco-bites',
      title: 'Choco Bites',
      category: 'Création de marque — Production audiovisuelle — Marketing de contenu',
      categoryShort: 'Branding & production vidéo',
      shortDescription: 'Création d’un concept de marque de brownies faits maison et réalisation d’une vidéo publicitaire basée sur la transformation émotionnelle du consommateur.',
      fullDescription: 'Le projet avait pour objectif de présenter Choco Bites comme une marque de brownies artisanaux, gourmands et réconfortants. La vidéo publicitaire montre le passage d’un état de tristesse à un état de bonheur après la découverte du produit.',
      date: '2025 — année académique 2024-2025',
      dateShort: '2025',
      team: [
        'Achraf Belghiti',
        'Souha Mohtaram',
        'Mohamed Amine El Ouazzani',
        'Ayman Boulahssass'
      ],
      supervisor: 'Dr. Maha S’hail',
      role: [
        'Montage vidéo',
        'Assemblage chronologique des scènes',
        'Étalonnage des couleurs',
        'Participation à la stratégie créative',
        'Contribution à la présentation du produit'
      ],
      objectives: [
        'Positionner Choco Bites comme une marque de brownies artisanaux, gourmands et réconfortants.',
        'Raconter en vidéo le passage de la tristesse au bonheur grâce à la découverte du produit.'
      ],
      achievements: [
        'Création du concept de la marque',
        'Définition du message publicitaire',
        'Pré-production et scénario',
        'Repérage à Rabat et aux Oudayas',
        'Réalisation d’une vidéo en trois scènes',
        'Utilisation de plans larges, gros plans et close-ups produit',
        'Passage d’une ambiance froide à une ambiance visuelle chaleureuse',
        'Montage et postproduction de la vidéo'
      ],
      results: [
        'Création d’une identité de marque cohérente',
        'Réalisation d’une publicité vidéo émotionnelle',
        'Mise en valeur de la texture et du caractère gourmand du produit',
        'Création d’une connexion émotionnelle entre le produit et le consommateur'
      ],
      skills: ['Branding', 'Storytelling', 'Production audiovisuelle', 'Scénario', 'Montage vidéo', 'Étalonnage', 'Marketing de contenu'],
      pdf: './documents/CHOCO%20BITES_compressed.pdf',
      pdfName: 'CHOCO BITES_compressed.pdf',
      cover: null,
      theme: {
        icon: 'video',
        tag: 'Brand & Film',
        gradient: 'linear-gradient(135deg,#2a1408 0%,#6b3b1c 52%,#e2762b 100%)'
      }
    },


    /* ------------------------------ PROJET 2 ------------------------------ */
    {
      id: 'lueur-and-co',
      title: 'Lueur & Co',
      category: 'Branding — Identité visuelle — Stratégie marketing',
      categoryShort: 'Branding & identité visuelle',
      shortDescription: 'Conception complète d’une marque de bougies artisanales naturelles positionnée sur un univers élégant, responsable et accessible.',
      fullDescription: 'Lueur & Co est un concept de marque de bougies naturelles et artisanales. Le projet avait pour objectif de construire une marque cohérente, depuis son positionnement jusqu’à son identité graphique, son expérience client et sa présence digitale.',
      date: '2025 — année académique 2024-2025',
      dateShort: '2025',
      team: [
        'Achraf Belghiti',
        'Ayman Boulahssass',
        'Aymen Ouhandia'
      ],
      supervisor: 'Dr. Zermouri Aicha',
      role: [
        'Recherche marketing',
        'Positionnement de la marque',
        'Développement de l’identité visuelle',
        'Création des supports de présentation',
        'Participation à la stratégie digitale et commerciale'
      ],
      objectives: [
        'Construire une marque de bougies naturelles et artisanales cohérente de bout en bout.',
        'Relier le positionnement, l’identité graphique, l’expérience client et la présence digitale.'
      ],
      achievements: [
        'Analyse du positionnement concurrentiel',
        'Création d’une matrice de positionnement',
        'Analyse SWOT',
        'Définition du marketing mix',
        'Création du buyer persona',
        'Conception du logo',
        'Définition de la palette chromatique',
        'Sélection des typographies',
        'Création du slogan et du ton de communication',
        'Conception du parcours client',
        'Présentation de l’expérience d’achat',
        'Développement d’un concept de site web',
        'Création d’un calendrier éditorial',
        'Conception d’un système de traçabilité produit'
      ],
      results: [
        'Création d’une identité de marque complète et cohérente',
        'Définition d’un positionnement « masstige » combinant accessibilité et prestige',
        'Création d’un univers visuel naturel, artisanal et élégant',
        'Construction d’une stratégie marketing et digitale structurée',
        'Développement d’une expérience client différenciante'
      ],
      skills: ['Brand strategy', 'Identité visuelle', 'Analyse concurrentielle', 'SWOT', 'Marketing mix', 'Buyer persona', 'UI concept', 'Expérience client', 'Stratégie digitale'],
      pdf: './documents/Lueur%20%26%20co_compressed.pdf',
      pdfName: 'Lueur & co_compressed.pdf',
      cover: null,
      theme: {
        icon: 'flame',
        tag: 'Brand & Strategy',
        gradient: 'linear-gradient(135deg,#1f241d 0%,#6e8560 50%,#e7dcc7 100%)'
      }
    },


    /* ------------------------------ PROJET 3 ------------------------------ */
    {
      id: 'moodtrip',
      title: 'MoodTrip',
      category: 'Application mobile — Marketing digital — UX/UI — Stratégie de marque',
      categoryShort: 'App mobile & marketing digital',
      shortDescription: 'Conception d’une application de recommandation de voyages qui propose des destinations selon l’humeur et les émotions de l’utilisateur.',
      fullDescription: 'MoodTrip est une application innovante qui connecte l’état émotionnel d’un voyageur avec une destination adaptée. Le projet visait à développer l’identité de la marque, l’expérience de l’application et une stratégie de marketing digital complète.',
      date: '2025 — année académique 2024-2025',
      dateShort: '2025',
      team: [
        'Achraf Belghiti',
        'Projet académique réalisé en équipe'
      ],
      supervisor: '',
      role: [
        'Participation à la stratégie de marque',
        'Création de contenu',
        'Benchmark concurrentiel',
        'Développement de la stratégie webmarketing',
        'Participation à la conception de l’application',
        'Création et structuration des supports visuels'
      ],
      objectives: [
        'Connecter l’état émotionnel du voyageur à une destination adaptée.',
        'Développer l’identité de marque, l’expérience applicative et une stratégie digitale complète.'
      ],
      achievements: [
        'Création de l’identité visuelle',
        'Logo, couleurs et typographie',
        'Maquettes de l’application mobile',
        'Benchmark concurrentiel',
        'Analyse de Roadtrippers, Pack Up + Go, Spotted by Locals et Culture Trip',
        'Définition du buyer persona',
        'Création d’un plan d’action digital avec la méthode SMART',
        'Création de publications et de vidéos',
        'Stratégie d’e-mailing',
        'Simulation de campagnes publicitaires',
        'Création d’articles de blog',
        'Définition des indicateurs de performance',
        'Création d’une stratégie d’engagement et de fidélisation',
        'Proposition de partenariats avec des influenceurs et acteurs du tourisme'
      ],
      results: [
        'Création d’un concept complet d’application de voyage',
        'Développement d’une proposition de valeur différenciante basée sur l’émotion',
        'Création d’une stratégie digitale multicanale',
        'Définition de KPI comme les téléchargements, le coût par installation, le taux de conversion et le taux d’engagement',
        'Conception d’une expérience de voyage personnalisée',
        'Création d’une stratégie de communauté, de fidélisation et de rétention'
      ],
      skills: ['UX/UI', 'Application mobile', 'Branding', 'Benchmark', 'Stratégie digitale', 'Content marketing', 'Publicité digitale', 'E-mailing', 'SEO', 'KPI', 'Fidélisation'],
      pdf: './documents/projet%20MOODTRIP_compressed%20(1).pdf',
      pdfName: 'projet MOODTRIP_compressed (1).pdf',
      cover: null,
      theme: {
        icon: 'compass',
        tag: 'App & Digital',
        gradient: 'linear-gradient(135deg,#1c1560 0%,#5b4be1 55%,#ffd24c 100%)'
      }
    },


    /* ------------------------------ PROJET 4 ------------------------------ */
    {
      id: 'aphrodite',
      title: 'Aphrodite',
      category: 'Branding — Identité visuelle — Packaging — Marketing produit',
      categoryShort: 'Branding & packaging premium',
      shortDescription: 'Création d’une marque premium de bougies artisanales inspirée par l’élégance, la mythologie grecque et les parfums de haute qualité.',
      fullDescription: 'Le projet Aphrodite avait pour objectif de créer une marque de bougies parfumées haut de gamme destinée aux personnes recherchant une expérience élégante, sensorielle et raffinée.',
      date: '2025 — année académique 2024-2025',
      dateShort: '2025',
      team: [
        'Achraf Belghiti',
        'Mohamed Amine El Ouazzani',
        'Souha Mohtaram',
        'Ayman Boulahssass'
      ],
      supervisor: 'Dr. Maha S’hail',
      role: [
        'Participation au concept de la marque',
        'Développement de l’identité visuelle',
        'Création de supports graphiques',
        'Participation au positionnement et à l’univers produit',
        'Contribution à la charte graphique'
      ],
      objectives: [
        'Créer une marque de bougies parfumées haut de gamme.',
        'Adresser une cible en quête d’une expérience élégante, sensorielle et raffinée.'
      ],
      achievements: [
        'Création du nom et du slogan',
        'Définition du positionnement premium',
        'Création du logo',
        'Création de différentes versions du logo',
        'Construction de la charte graphique',
        'Définition des couleurs et des typographies',
        'Création d’un moodboard',
        'Conception du packaging',
        'Développement du buyer persona',
        'Création de visuels produits',
        'Définition de la promesse de marque',
        'Construction d’un univers inspiré de l’élégance grecque'
      ],
      results: [
        'Création d’une identité premium complète',
        'Développement d’un univers visuel distinctif',
        'Création d’un packaging cohérent avec le positionnement',
        'Définition d’une promesse claire : « L’élégance, à chaque flamme »',
        'Présentation professionnelle d’une gamme de bougies artisanales'
      ],
      skills: ['Branding', 'Identité visuelle', 'Packaging', 'Direction artistique', 'Buyer persona', 'Positionnement', 'Storytelling de marque', 'Design graphique'],
      pdf: './documents/Aphrodite_compressed.pdf',
      pdfName: 'Aphrodite_compressed.pdf',
      cover: null,
      theme: {
        icon: 'sparkle',
        tag: 'Premium Brand',
        gradient: 'linear-gradient(135deg,#0d2a20 0%,#1e4b39 50%,#c9a227 100%)'
      }
    }

  ];


  /* =======================================================================
     OUTILS
     ======================================================================= */
  function esc(value) {
    return String(value == null ? '' : value)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  function byId(id) {
    for (var i = 0; i < projects.length; i++) {
      if (projects[i].id === id) { return projects[i]; }
    }
    return null;
  }

  function listHtml(items, cls) {
    if (!items || !items.length) { return ''; }
    var out = '';
    for (var i = 0; i < items.length; i++) {
      out += '<li>' + esc(items[i]) + '</li>';
    }
    return '<ul class="' + cls + '">' + out + '</ul>';
  }

  function badgesHtml(items, limit) {
    if (!items || !items.length) { return ''; }
    var max = limit ? Math.min(limit, items.length) : items.length;
    var out = '';
    for (var i = 0; i < max; i++) {
      out += '<li class="proj-badge">' + esc(items[i]) + '</li>';
    }
    return out;
  }

  function block(title, inner) {
    if (!inner) { return ''; }
    return '<div class="proj-block"><h4 class="proj-block-title">' + esc(title) + '</h4>' + inner + '</div>';
  }

  function metaItem(label, valueHtml) {
    if (!valueHtml) { return ''; }
    return '<div class="proj-meta-item"><span class="proj-meta-label">' + esc(label) + '</span>'
         + '<div class="proj-meta-value">' + valueHtml + '</div></div>';
  }

  function icon(name) {
    return ICONS[name] || ICONS.sparkle;
  }

  /* Visuel de couverture : image du portfolio si disponible, sinon
     emplacement propre genere avec les couleurs de la marque + une icone. */
  function coverHtml(p, titleClass) {
    var theme = p.theme || {};
    var html = '<span class="proj-cover-art" style="background-image:' + esc(theme.gradient) + ';"></span>';
    if (p.cover) {
      html += '<img class="proj-cover-img" src="' + esc(p.cover) + '" alt="" loading="lazy" decoding="async">';
    }
    html += '<span class="proj-cover-inner">'
         +    '<span class="proj-cover-icon">' + icon(theme.icon) + '</span>'
         +    '<span class="' + titleClass + '">' + esc(p.title) + '</span>'
         +    '<span class="proj-cover-tag">' + esc(theme.tag || '') + '</span>'
         +  '</span>';
    return html;
  }


  /* =======================================================================
     CARTES (generees automatiquement depuis le tableau projects)
     ======================================================================= */
  function cardHtml(p, index) {
    return '<article class="proj-card lift" data-proj-id="' + esc(p.id) + '" data-index="' + index + '"'
         +   (REDUCE ? '' : ' data-reveal=""') + '>'
         +   '<div class="proj-cover" aria-hidden="true">' + coverHtml(p, 'proj-cover-title') + '</div>'
         +   '<div class="proj-body">'
         +     '<span class="proj-kicker">' + esc(p.categoryShort) + '</span>'
         +     '<h3 class="proj-title">' + esc(p.title) + '</h3>'
         +     '<p class="proj-desc">' + esc(p.shortDescription) + '</p>'
         +     '<ul class="proj-badges">' + badgesHtml(p.skills, 3) + '</ul>'
         +     '<div class="proj-foot">'
         +       '<button type="button" class="proj-open" data-proj-open="' + esc(p.id) + '"'
         +         ' aria-haspopup="dialog" aria-label="Voir les détails du projet ' + esc(p.title) + '">'
         +         '<span>Voir les détails</span>' + ICONS.arrow
         +       '</button>'
         +       '<span class="proj-date">' + esc(p.dateShort) + '</span>'
         +     '</div>'
         +   '</div>'
         + '</article>';
  }

  /* Secours : si le rendu echoue, on garde des liens PDF fonctionnels. */
  function fallbackHtml() {
    var out = '<ul class="proj-noscript">';
    for (var i = 0; i < projects.length; i++) {
      out += '<li><a href="' + esc(projects[i].pdf) + '" target="_blank" rel="noopener noreferrer">'
           + esc(projects[i].title) + ' (PDF)</a></li>';
    }
    return out + '</ul>';
  }


  /* =======================================================================
     FENETRE DETAILLEE (modal accessible, une seule instance reutilisee)
     ======================================================================= */
  var modal = null, dialog = null, scroller = null, bannerEl = null,
      bodyEl = null, pdfLink = null, lastTrigger = null;

  var FOCUSABLE = 'a[href], area[href], button:not([disabled]), input:not([disabled]),'
                + ' select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

  function buildModal() {
    modal = document.createElement('div');
    modal.className = 'proj-modal';
    modal.id = 'proj-modal';
    modal.hidden = true;
    modal.innerHTML =
        '<div class="proj-modal-backdrop" data-proj-close="1"></div>'
      + '<div class="proj-modal-dialog" role="dialog" aria-modal="true"'
      +      ' aria-labelledby="proj-modal-title" aria-describedby="proj-modal-lead" tabindex="-1">'
      +   '<button type="button" class="proj-modal-close" data-proj-close="1"'
      +     ' aria-label="Fermer la fenêtre du projet">' + ICONS.close + '</button>'
      +   '<div class="proj-modal-scroll">'
      +     '<div class="proj-modal-banner"></div>'
      +     '<div class="proj-modal-body"></div>'
      +   '</div>'
      +   '<div class="proj-modal-actions">'
      +     '<a class="proj-btn proj-btn-primary" data-proj-pdf="1" href="#"'
      +       ' target="_blank" rel="noopener noreferrer">Voir le projet complet' + ICONS.ext + '</a>'
      +     '<button type="button" class="proj-btn" data-proj-close="1">Fermer</button>'
      +   '</div>'
      + '</div>';

    document.body.appendChild(modal);

    dialog   = modal.querySelector('.proj-modal-dialog');
    scroller = modal.querySelector('.proj-modal-scroll');
    bannerEl = modal.querySelector('.proj-modal-banner');
    bodyEl   = modal.querySelector('.proj-modal-body');
    pdfLink  = modal.querySelector('[data-proj-pdf]');

    modal.addEventListener('click', function (event) {
      var target = event.target;
      if (target && target.closest && target.closest('[data-proj-close]')) {
        event.preventDefault();
        closeModal();
      }
    });
  }

  function fillModal(p) {
    var theme = p.theme || {};

    bannerEl.innerHTML =
        '<span class="proj-cover-art" style="background-image:' + esc(theme.gradient) + ';"></span>'
      + (p.cover ? '<img class="proj-cover-img" src="' + esc(p.cover) + '" alt="" decoding="async">' : '')
      + '<div class="proj-modal-banner-inner">'
      +   '<span class="proj-cover-icon">' + icon(theme.icon) + '</span>'
      +   '<h3 class="proj-modal-title" id="proj-modal-title">' + esc(p.title) + '</h3>'
      +   '<p class="proj-modal-category">' + esc(p.category) + '</p>'
      + '</div>';

    var team = listHtml(p.team, 'proj-list proj-list-tight');
    if (p.supervisor) {
      team += '<p class="proj-note">Encadrement : ' + esc(p.supervisor) + '</p>';
    }

    bodyEl.innerHTML =
        '<p class="proj-lead" id="proj-modal-lead">' + esc(p.shortDescription) + '</p>'
      + '<div class="proj-meta">'
      +   metaItem('Date', '<p class="proj-text">' + esc(p.date) + '</p>')
      +   metaItem('Équipe', team)
      +   metaItem('Mon rôle', listHtml(p.role, 'proj-list proj-list-tight'))
      + '</div>'
      + block('Contexte & objectif', '<p class="proj-text">' + esc(p.fullDescription) + '</p>'
              + listHtml(p.objectives, 'proj-list'))
      + block('Principales réalisations', listHtml(p.achievements, 'proj-list proj-list-2'))
      + block('Résultats et livrables', listHtml(p.results, 'proj-list'))
      + block('Outils et compétences', '<ul class="proj-badges proj-badges-lg">' + badgesHtml(p.skills) + '</ul>');

    pdfLink.setAttribute('href', p.pdf);
    pdfLink.setAttribute('aria-label', 'Voir le projet complet ' + p.title + ' (PDF, nouvel onglet)');
    pdfLink.setAttribute('title', p.pdfName || '');
  }


  /* --- Blocage du defilement de la page pendant l'ouverture -------------- */
  var savedPadding = '';

  function lockScroll() {
    var bar = window.innerWidth - document.documentElement.clientWidth;
    savedPadding = document.body.style.paddingRight;
    if (bar > 0) { document.body.style.paddingRight = bar + 'px'; }
    document.body.classList.add('proj-modal-open');
  }

  function unlockScroll() {
    document.body.classList.remove('proj-modal-open');
    document.body.style.paddingRight = savedPadding;
  }

  /* --- Piege a focus + touche Echap ------------------------------------- */
  function visibleFocusables() {
    var nodes = dialog.querySelectorAll(FOCUSABLE);
    var list = [];
    for (var i = 0; i < nodes.length; i++) {
      var node = nodes[i];
      if (node.offsetWidth > 0 || node.offsetHeight > 0 || node.getClientRects().length) {
        list.push(node);
      }
    }
    return list;
  }

  function onKeydown(event) {
    var key = event.key;

    if (key === 'Escape' || key === 'Esc') {
      event.preventDefault();
      event.stopPropagation();
      closeModal();
      return;
    }

    if (key !== 'Tab') { return; }

    var list = visibleFocusables();
    if (!list.length) { event.preventDefault(); dialog.focus(); return; }

    var first = list[0];
    var last = list[list.length - 1];
    var active = document.activeElement;

    if (event.shiftKey) {
      if (active === first || active === dialog || !dialog.contains(active)) {
        event.preventDefault();
        last.focus();
      }
    } else if (active === last) {
      event.preventDefault();
      first.focus();
    }
  }

  /* --- Ouverture / fermeture -------------------------------------------- */
  function openModal(id, trigger) {
    var p = byId(id);
    if (!p) { return; }
    if (!modal) { buildModal(); }

    lastTrigger = trigger || null;
    fillModal(p);
    lockScroll();

    modal.hidden = false;
    void modal.offsetWidth;
    modal.classList.add('is-open');
    scroller.scrollTop = 0;
    dialog.focus();

    document.addEventListener('keydown', onKeydown, true);
  }

  function closeModal() {
    if (!modal || modal.hidden) { return; }

    modal.classList.remove('is-open');
    document.removeEventListener('keydown', onKeydown, true);

    var finish = function () {
      modal.hidden = true;
      unlockScroll();
      if (lastTrigger && document.body.contains(lastTrigger)) {
        lastTrigger.focus();
      }
      lastTrigger = null;
    };

    if (REDUCE) { finish(); } else { window.setTimeout(finish, 280); }
  }


  /* =======================================================================
     INITIALISATION
     ======================================================================= */
  function renderCards(grid) {
    var html = '';
    for (var i = 0; i < projects.length; i++) {
      html += cardHtml(projects[i], i);
    }
    grid.innerHTML = html;

    grid.addEventListener('click', function (event) {
      var target = event.target;
      if (!target || !target.closest) { return; }
      if (target.closest('a')) { return; }

      var card = target.closest('.proj-card');
      if (!card) { return; }

      event.preventDefault();
      openModal(card.getAttribute('data-proj-id'), card.querySelector('[data-proj-open]'));
    });
  }

  function showAll(cards) {
    for (var i = 0; i < cards.length; i++) {
      cards[i].classList.add('is-in');
    }
  }

  function revealCards(grid) {
    var cards = grid.querySelectorAll('.proj-card');
    if (REDUCE || !('IntersectionObserver' in window)) { showAll(cards); return; }

    var observer = new IntersectionObserver(function (entries, obs) {
      for (var i = 0; i < entries.length; i++) {
        if (!entries[i].isIntersecting) { continue; }
        (function (el) {
          var step = parseInt(el.getAttribute('data-index') || '0', 10);
          window.setTimeout(function () { el.classList.add('is-in'); }, step * 90);
        }(entries[i].target));
        obs.unobserve(entries[i].target);
      }
    }, { threshold: 0.12, rootMargin: '0px 0px -6% 0px' });

    for (var i = 0; i < cards.length; i++) { observer.observe(cards[i]); }

    // Filet de securite : tout est visible apres 2,6 s.
    window.setTimeout(function () { showAll(cards); }, 2600);
  }

  function init() {
    var grid = document.getElementById('proj-grid');
    if (!grid) { return; }

    try {
      renderCards(grid);
      revealCards(grid);
    } catch (error) {
      grid.innerHTML = fallbackHtml();
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  /* Petite API publique, pratique pour tester depuis la console :
     PortfolioProjects.open('moodtrip')  /  PortfolioProjects.close()      */
  window.PortfolioProjects = {
    data: projects,
    open: function (id) { openModal(id, null); },
    close: closeModal
  };

}());
