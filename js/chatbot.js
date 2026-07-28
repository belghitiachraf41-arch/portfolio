/* ================================================================
   chatbot.js — Assistant virtuel du portfolio d'Achraf Belghiti
   ----------------------------------------------------------------
   Widget de discussion 100 % statique. Il repond aux questions des
   visiteurs en s'appuyant UNIQUEMENT sur les informations presentes
   sur le site (sections de index.html), qu'il indexe au chargement.
   Aucune dependance, aucune cle API, aucun serveur, aucun cookie.
   ================================================================ */
(function () {
  'use strict';

  if (window.__pcbLoaded) { return; }
  window.__pcbLoaded = true;

  /* ============================================================
     1) OUTILS TEXTE
     ============================================================ */

  function clean(s) { return String(s == null ? '' : s).replace(/\s+/g, ' ').trim(); }

  function esc(s) {
    return clean(s).replace(/&/g, '&amp;').replace(/</g, '&lt;')
      .replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  }

  function norm(s) {
    return clean(s).toLowerCase()
      .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
      .replace(/[\u2019']/g, ' ')
      .replace(/[^a-z0-9@+.\- ]/g, ' ')
      .replace(/\s+/g, ' ').trim();
  }

  /* pluriel simple -> singulier (competences -> competence) */
  function stem(w) {
    return (w.length > 3 && w.charAt(w.length - 1) === 's') ? w.slice(0, -1) : w;
  }

  var STOP = {};
  ('a au aux avec ce cet cette ces dans de des du elle en et eux il ils je la le les leur lui ma mais me ' +
   'meme mes moi mon ne nos notre nous on ou par pas pour que qui sa se ses son sur ta te tes toi ton tu ' +
   'un une vos votre vous est ete etre sont suis quel quelle quels quelles quoi comment combien dis dites ' +
   'parle parlez peux peut sais savoir merci plait svp stp veux voudrais aimerais donne donner fait faire ' +
   'plus tres tout tous toute toutes the and for you your what which where when who about tell')
    .split(' ').forEach(function (w) { STOP[w] = true; });

  function terms(s) {
    var out = [];
    norm(s).split(' ').forEach(function (w) {
      if (w.length > 2 && !STOP[w]) { out.push(stem(w)); }
    });
    return out;
  }

  /* Synonymes : relie le vocabulaire du visiteur a celui du site */
  var SYNONYMS = [
    { keys: ['etude', 'formation', 'diplome', 'ecole', 'universite', 'scolaire', 'study', 'school', 'cursus'],
      add: ['education', 'licence', 'ismagi', 'baccalaureat', 'institut', 'lycee', 'gestion'] },
    { keys: ['travail', 'travaille', 'emploi', 'job', 'poste', 'boulot', 'stage', 'carriere', 'parcours', 'work', 'internship', 'experience'],
      add: ['experience', 'commercial', 'vendeur', 'conseiller', 'stagiaire', 'wafacash', 'marjane'] },
    { keys: ['competence', 'skill', 'outil', 'logiciel', 'maitrise', 'sait', 'qualite'],
      add: ['competence', 'crm', 'wordpress', 'canva', 'negociation', 'contenu', 'negociation'] },
    { keys: ['langue', 'language', 'parlee', 'bilingue'],
      add: ['arabe', 'francai', 'anglai', 'langue'] },
    { keys: ['projet', 'realisation', 'design', 'visuel', 'video', 'campagne', 'portfolio', 'creation', 'graphisme'],
      add: ['creation', 'canva', 'photoshop', 'dunkin', 'luma', 'airway', 'coffee', 'contenu'] },
    { keys: ['certificat', 'certification', 'attestation'],
      add: ['certification', 'excellence', 'entrepreneuriale', 'qualifiante', 'licence'] },
    { keys: ['benevolat', 'benevole', 'volontariat', 'associatif', 'can'],
      add: ['benevolat', 'coupe', 'afrique', 'nation', 'supporter'] },
    { keys: ['profil', 'presentation', 'presente', 'bio', 'biographie', 'achraf', 'belghiti', 'age'],
      add: ['profil', 'marketing', 'digital', 'developpement', 'commercial'] },
    { keys: ['ville', 'habite', 'localisation', 'adresse', 'situe', 'base', 'city', 'location', 'pay'],
      add: ['rabat', 'maroc', 'menzeh'] },
    { keys: ['dispo', 'disponible', 'disponibilite', 'recrutement', 'recruter', 'embaucher', 'opportunite', 'alternance', 'freelance', 'mission', 'cdi'],
      add: ['disponible', 'opportunite', 'contact', 'marketing'] }
  ];

  SYNONYMS.forEach(function (g) {
    g.keys = g.keys.map(function (k) { return stem(norm(k)); });
    g.add = g.add.map(function (k) { return stem(norm(k)); });
  });

  function expand(q) {
    var t = terms(q), extra = [];
    SYNONYMS.forEach(function (group) {
      for (var i = 0; i < t.length; i++) {
        if (group.keys.indexOf(t[i]) !== -1) { extra = extra.concat(group.add); break; }
      }
    });
    return { main: t, all: t.concat(extra) };
  }

  /* ============================================================
     2) BASE DE CONNAISSANCES : extraite du contenu du site
     ============================================================ */

  var KB = [];        /* blocs de texte trouves dans la page */
  var LINKS = {};     /* liens utiles trouves dans la page */

  var FALLBACK_LABELS = {
    about: 'Profil', experience: 'Experience', education: 'Education',
    certifications: 'Licences & certifications', skills: 'Competences',
    creations: 'Creations', volunteer: 'Benevolat', contact: 'Contact'
  };

  function sectionLabel(sec) {
    var h = sec.querySelector('h1, h2, h3');
    var t = h ? clean(h.textContent) : '';
    t = t.replace(/^\d{1,2}\s*[\u2014\u2013-]\s*/, '');
    if (!t || t.length > 60) { t = FALLBACK_LABELS[sec.id] || 'Portfolio'; }
    return t;
  }

  /* Decoupe une section en blocs de sens (une carte, une experience...) */
  function collectBlocks(el, out) {
    var txt = clean(el.textContent);
    if (!txt) { return; }
    var kids = [], i, tag;
    for (i = 0; i < el.children.length; i++) {
      tag = el.children[i].tagName;
      if (tag !== 'SCRIPT' && tag !== 'STYLE' && tag !== 'NAV' && tag !== 'NOSCRIPT' && tag !== 'svg') {
        kids.push(el.children[i]);
      }
    }
    if (txt.length <= 380 || kids.length === 0) { out.push(txt); return; }
    kids.forEach(function (k) { collectBlocks(k, out); });
  }

  function addBlock(text, label, id) {
    text = clean(text);
    if (text.length < 15) { return; }
    var key = norm(text);
    for (var i = 0; i < KB.length; i++) { if (KB[i].key === key) { return; } }
    KB.push({
      text: text, label: label, id: id, key: key,
      labelKey: norm(label),
      words: terms(label + ' ' + text)
    });
  }

  function buildKB() {
    KB = [];
    var sections = document.querySelectorAll('section');
    for (var i = 0; i < sections.length; i++) {
      (function (sec) {
        var label = sectionLabel(sec);
        var blocks = [];
        collectBlocks(sec, blocks);
        blocks.forEach(function (b) { addBlock(b, label, sec.id || ''); });
      })(sections[i]);
    }
    /* Liens utiles : e-mail, telephone, reseaux, CV */
    var anchors = document.querySelectorAll('a[href]');
    for (var j = 0; j < anchors.length; j++) {
      var href = anchors[j].getAttribute('href') || '';
      var low = href.toLowerCase();
      if (!LINKS.email && low.indexOf('mailto:') === 0) { LINKS.email = href.slice(7).split('?')[0]; }
      if (!LINKS.tel && low.indexOf('tel:') === 0) { LINKS.tel = href.slice(4); }
      if (!LINKS.linkedin && low.indexOf('linkedin.') !== -1) { LINKS.linkedin = href; }
      if (!LINKS.instagram && low.indexOf('instagram.') !== -1) { LINKS.instagram = href; }
      if (!LINKS.cv && low.indexOf('.pdf') !== -1) { LINKS.cv = href; }
    }
  }

  /* ============================================================
     3) RECHERCHE DE LA MEILLEURE REPONSE
     ============================================================ */

  function scoreBlock(block, q) {
    var score = 0, i, w, weight;
    for (i = 0; i < q.all.length; i++) {
      w = q.all[i];
      weight = q.main.indexOf(w) !== -1 ? 3 : 1;
      if (block.words.indexOf(w) !== -1) { score += weight; }
      else if (block.key.indexOf(w) !== -1) { score += weight * 0.6; }
      if (block.labelKey.indexOf(w) !== -1) { score += weight * 0.8; }
    }
    /* les blocs tres longs sont legerement penalises */
    return score / (1 + Math.log(1 + block.words.length / 25));
  }

  function search(question, limit) {
    var q = expand(question);
    if (!q.all.length) { return []; }
    var ranked = [];
    KB.forEach(function (b) {
      var s = scoreBlock(b, q);
      if (s > 1.2) { ranked.push({ b: b, s: s }); }
    });
    ranked.sort(function (a, b) { return b.s - a.s; });
    return ranked.slice(0, limit || 2);
  }

  function sectionLink(id, label) {
    if (!id) { return ''; }
    return '<a class="pcb-jump" href="#' + esc(id) + '" data-pcb-goto="' + esc(id) + '">\u2192 Voir la section ' + esc(label) + '</a>';
  }

  function contactCard() {
    var rows = [];
    if (LINKS.email) { rows.push('\u2709\uFE0F <a href="mailto:' + esc(LINKS.email) + '">' + esc(LINKS.email) + '</a>'); }
    if (LINKS.tel) { rows.push('\u260E\uFE0F <a href="tel:' + esc(LINKS.tel) + '">' + esc(LINKS.tel) + '</a>'); }
    if (LINKS.linkedin) { rows.push('\uD83D\uDD17 <a href="' + esc(LINKS.linkedin) + '" target="_blank" rel="noopener">LinkedIn</a>'); }
    if (LINKS.instagram) { rows.push('\uD83D\uDCF7 <a href="' + esc(LINKS.instagram) + '" target="_blank" rel="noopener">Instagram</a>'); }
    if (LINKS.cv) { rows.push('\uD83D\uDCC4 <a href="' + esc(LINKS.cv) + '" target="_blank" rel="noopener">CV (PDF)</a>'); }
    return rows.join('<br>');
  }

  /* Intentions traitees directement (petites phrases, contact, aide) */
  function intentAnswer(question) {
    var n = norm(question);
    var has = function () {
      for (var i = 0; i < arguments.length; i++) {
        if (n.indexOf(arguments[i]) !== -1) { return true; }
      }
      return false;
    };

    if (/^(bonjour|salut|bonsoir|hello|hi|coucou|hey|slm|salam|ahlan)\b/.test(n) || n === 'bjr') {
      return { html: 'Bonjour \uD83D\uDC4B Je suis l\'assistant du portfolio d\'Achraf Belghiti. Posez-moi une question sur son parcours, ses competences, ses creations ou ses coordonnees.' };
    }
    if (/^(merci|thanks|thank you|shokran)/.test(n)) {
      return { html: 'Avec plaisir ! Une autre question ?' };
    }
    if (/^(au revoir|bye|a bientot|ciao)/.test(n)) {
      return { html: 'Bonne visite, et a bientot !' };
    }
    if (has('qui es tu', 'qui etes vous', 'tu es qui', 'c est quoi ce chat', 'que peux tu', 'que sais tu', 'aide', 'help')) {
      return { html: 'Je suis un assistant integre au site : je reponds a partir des informations publiees sur ce portfolio (profil, experiences, formation, certifications, competences, creations, benevolat, contact). Essayez par exemple : <em>Quelles sont ses competences ?</em>' };
    }
    if (has('cv', 'resume', 'curriculum')) {
      if (LINKS.cv) {
        return { html: 'Le CV complet est telechargeable ici : <a href="' + esc(LINKS.cv) + '" target="_blank" rel="noopener">CV d\'Achraf Belghiti (PDF)</a>.' };
      }
    }
    if (has('email', 'e-mail', 'mail', 'contact', 'contacter', 'joindre', 'telephone', 'numero', 'whatsapp', 'reseaux', 'linkedin', 'instagram', 'coordonnees')) {
      var card = contactCard();
      if (card) {
        return { html: 'Voici comment joindre Achraf :<br>' + card, id: 'contact', label: 'Contact' };
      }
    }
    return null;
  }

  function answer(question) {
    var direct = intentAnswer(question);
    if (direct) {
      return direct.html + (direct.id ? '<br>' + sectionLink(direct.id, direct.label || 'Contact') : '');
    }

    var hits = search(question, 2);
    if (!hits.length) {
      return 'Je n\'ai pas trouve cette information sur le site \uD83E\uDD14 Je peux parler de son <strong>profil</strong>, ses <strong>experiences</strong>, sa <strong>formation</strong>, ses <strong>certifications</strong>, ses <strong>competences</strong>, ses <strong>creations</strong>, son <strong>benevolat</strong> et ses <strong>coordonnees</strong>.' +
        (LINKS.email ? '<br>Pour une question plus precise : <a href="mailto:' + esc(LINKS.email) + '">' + esc(LINKS.email) + '</a>.' : '');
    }

    var best = hits[0].b;
    var html = '<strong>' + esc(best.label) + '</strong><br>' + esc(best.text);
    if (hits[1] && hits[1].s > hits[0].s * 0.6) {
      html += '<br><br>' + esc(hits[1].b.text);
    }
    html += '<br>' + sectionLink(best.id, best.label);
    return html;
  }

  /* ============================================================
     4) INTERFACE
     ============================================================ */

  var SUGGESTIONS = ['Son profil', 'Ses experiences', 'Sa formation', 'Ses competences', 'Ses creations', 'Le contacter'];

  var CSS = [
    '.pcb-btn,.pcb-panel{font-family:inherit;box-sizing:border-box}',
    '.pcb-btn{position:fixed;right:20px;bottom:20px;z-index:9000;width:58px;height:58px;border:0;border-radius:50%;',
    'background:var(--accent,#e2725b);color:#fff;cursor:pointer;display:flex;align-items:center;justify-content:center;',
    'box-shadow:0 8px 24px rgba(0,0,0,.28);transition:transform .2s ease,box-shadow .2s ease}',
    '.pcb-btn:hover{transform:translateY(-2px) scale(1.04)}',
    '.pcb-btn svg{width:28px;height:28px;fill:currentColor}',
    '.pcb-badge{position:absolute;top:-4px;right:-4px;background:#22c55e;width:14px;height:14px;border-radius:50%;border:2px solid var(--bg,#fff)}',
    '.pcb-panel{position:fixed;right:20px;bottom:90px;z-index:9001;width:360px;max-width:calc(100vw - 32px);height:520px;',
    'max-height:calc(100vh - 120px);display:none;flex-direction:column;overflow:hidden;border-radius:16px;',
    'background:var(--card,var(--bg,#fff));color:var(--text,#111);border:1px solid var(--bd1,rgba(128,128,128,.28));',
    'box-shadow:0 18px 50px rgba(0,0,0,.32)}',
    '.pcb-panel.pcb-open{display:flex}',
    '.pcb-head{display:flex;align-items:center;gap:10px;padding:12px 14px;border-bottom:1px solid var(--bd1,rgba(128,128,128,.28))}',
    '.pcb-av{width:36px;height:36px;border-radius:50%;background:var(--accent,#e2725b);color:#fff;display:flex;',
    'align-items:center;justify-content:center;font-weight:700;font-size:14px;flex:0 0 auto}',
    '.pcb-title{font-weight:700;font-size:14px;line-height:1.2}',
    '.pcb-sub{font-size:11.5px;opacity:.7;line-height:1.2}',
    '.pcb-close{margin-left:auto;background:none;border:0;color:inherit;font-size:22px;line-height:1;cursor:pointer;opacity:.7;padding:4px 6px}',
    '.pcb-close:hover{opacity:1}',
    '.pcb-log{flex:1;overflow-y:auto;padding:14px;display:flex;flex-direction:column;gap:10px;font-size:13.5px;line-height:1.55}',
    '.pcb-msg{max-width:88%;padding:9px 12px;border-radius:14px;word-wrap:break-word}',
    '.pcb-bot{align-self:flex-start;background:var(--accent-soft,rgba(226,114,91,.12));border:1px solid var(--bd1,rgba(128,128,128,.2));border-bottom-left-radius:4px}',
    '.pcb-user{align-self:flex-end;background:var(--accent,#e2725b);color:#fff;border-bottom-right-radius:4px}',
    '.pcb-msg a{color:inherit;text-decoration:underline}',
    '.pcb-jump{display:inline-block;margin-top:6px;font-size:12.5px;font-weight:600;text-decoration:none;opacity:.85}',
    '.pcb-jump:hover{opacity:1;text-decoration:underline}',
    '.pcb-chips{display:flex;flex-wrap:wrap;gap:6px;padding:0 14px 10px}',
    '.pcb-chip{background:transparent;color:inherit;border:1px solid var(--bd1,rgba(128,128,128,.35));border-radius:999px;',
    'padding:5px 10px;font-size:12px;cursor:pointer;transition:background .15s ease}',
    '.pcb-chip:hover{background:var(--accent-soft,rgba(226,114,91,.14))}',
    '.pcb-form{display:flex;gap:8px;padding:10px 12px;border-top:1px solid var(--bd1,rgba(128,128,128,.28))}',
    '.pcb-input{flex:1;background:var(--bg,#fff);color:var(--text,#111);border:1px solid var(--bd1,rgba(128,128,128,.35));',
    'border-radius:10px;padding:9px 11px;font-size:13.5px;font-family:inherit}',
    '.pcb-input:focus{outline:2px solid var(--accent,#e2725b);outline-offset:1px}',
    '.pcb-send{background:var(--accent,#e2725b);color:#fff;border:0;border-radius:10px;padding:0 14px;cursor:pointer;font-size:15px}',
    '.pcb-dots span{display:inline-block;width:6px;height:6px;margin-right:3px;border-radius:50%;background:currentColor;opacity:.5;animation:pcb-b 1s infinite}',
    '.pcb-dots span:nth-child(2){animation-delay:.15s}.pcb-dots span:nth-child(3){animation-delay:.3s}',
    '@keyframes pcb-b{0%,60%,100%{transform:translateY(0)}30%{transform:translateY(-4px)}}',
    '@media (max-width:520px){.pcb-panel{right:12px;left:12px;width:auto;bottom:84px;height:min(70vh,520px)}}',
    '@media (prefers-reduced-motion:reduce){.pcb-btn,.pcb-dots span{transition:none;animation:none}}'
  ].join('');

  var ICON = '<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M12 3C6.9 3 2.8 6.3 2.8 10.4c0 2.3 1.2 4.4 3.2 5.8-.1 1-.5 2.4-1.5 3.6 1.9-.3 3.6-1.2 4.7-2 .9.2 1.8.3 2.8.3 5.1 0 9.2-3.3 9.2-7.7S17.1 3 12 3zm-4 8.7a1.3 1.3 0 1 1 0-2.6 1.3 1.3 0 0 1 0 2.6zm4 0a1.3 1.3 0 1 1 0-2.6 1.3 1.3 0 0 1 0 2.6zm4 0a1.3 1.3 0 1 1 0-2.6 1.3 1.3 0 0 1 0 2.6z"/></svg>';

  var panel, log, input, toggleBtn;

  function addMsg(html, who) {
    var d = document.createElement('div');
    d.className = 'pcb-msg ' + (who === 'user' ? 'pcb-user' : 'pcb-bot');
    d.innerHTML = html;
    log.appendChild(d);
    log.scrollTop = log.scrollHeight;
    return d;
  }

  function ask(question) {
    question = clean(question);
    if (!question) { return; }
    addMsg(esc(question), 'user');
    var typing = addMsg('<span class="pcb-dots"><span></span><span></span><span></span></span>', 'bot');
    var reply = answer(question);
    window.setTimeout(function () {
      typing.innerHTML = reply;
      log.scrollTop = log.scrollHeight;
    }, 350);
  }

  function openPanel() {
    panel.classList.add('pcb-open');
    panel.setAttribute('aria-hidden', 'false');
    toggleBtn.setAttribute('aria-expanded', 'true');
    input.focus();
    log.scrollTop = log.scrollHeight;
  }

  function closePanel() {
    panel.classList.remove('pcb-open');
    panel.setAttribute('aria-hidden', 'true');
    toggleBtn.setAttribute('aria-expanded', 'false');
    toggleBtn.focus();
  }

  function buildUI() {
    var style = document.createElement('style');
    style.id = 'pcb-style';
    style.textContent = CSS;
    document.head.appendChild(style);

    toggleBtn = document.createElement('button');
    toggleBtn.type = 'button';
    toggleBtn.className = 'pcb-btn';
    toggleBtn.setAttribute('aria-label', 'Ouvrir l\'assistant du portfolio');
    toggleBtn.setAttribute('aria-expanded', 'false');
    toggleBtn.innerHTML = ICON + '<span class="pcb-badge" aria-hidden="true"></span>';

    panel = document.createElement('div');
    panel.className = 'pcb-panel';
    panel.setAttribute('role', 'dialog');
    panel.setAttribute('aria-modal', 'false');
    panel.setAttribute('aria-label', 'Assistant du portfolio');
    panel.setAttribute('aria-hidden', 'true');
    panel.innerHTML =
      '<div class="pcb-head">' +
        '<div class="pcb-av" aria-hidden="true">AB</div>' +
        '<div><div class="pcb-title">Assistant du portfolio</div>' +
        '<div class="pcb-sub">Reponses basees sur le contenu du site</div></div>' +
        '<button type="button" class="pcb-close" aria-label="Fermer l\'assistant">\u00D7</button>' +
      '</div>' +
      '<div class="pcb-log" role="log" aria-live="polite"></div>' +
      '<div class="pcb-chips"></div>' +
      '<form class="pcb-form" autocomplete="off">' +
        '<label class="pcb-sr" for="pcb-input" style="position:absolute;left:-9999px">Votre question</label>' +
        '<input id="pcb-input" class="pcb-input" type="text" placeholder="Posez votre question\u2026">' +
        '<button type="submit" class="pcb-send" aria-label="Envoyer">\u27A4</button>' +
      '</form>';

    document.body.appendChild(toggleBtn);
    document.body.appendChild(panel);

    log = panel.querySelector('.pcb-log');
    input = panel.querySelector('.pcb-input');

    var chips = panel.querySelector('.pcb-chips');
    SUGGESTIONS.forEach(function (s) {
      var c = document.createElement('button');
      c.type = 'button';
      c.className = 'pcb-chip';
      c.textContent = s;
      c.addEventListener('click', function () { ask(s); });
      chips.appendChild(c);
    });

    addMsg('Bonjour \uD83D\uDC4B Je suis l\'assistant de ce portfolio. Je reponds a vos questions a partir des informations publiees sur le site : parcours, formation, competences, creations et contact.', 'bot');

    toggleBtn.addEventListener('click', function () {
      if (panel.classList.contains('pcb-open')) { closePanel(); } else { openPanel(); }
    });
    panel.querySelector('.pcb-close').addEventListener('click', closePanel);
    panel.querySelector('.pcb-form').addEventListener('submit', function (e) {
      e.preventDefault();
      var v = input.value;
      input.value = '';
      ask(v);
    });
    log.addEventListener('click', function (e) {
      var a = e.target.closest ? e.target.closest('[data-pcb-goto]') : null;
      if (!a) { return; }
      e.preventDefault();
      var target = document.getElementById(a.getAttribute('data-pcb-goto'));
      if (target) {
        var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        target.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'start' });
        if (window.innerWidth < 520) { closePanel(); }
      }
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && panel.classList.contains('pcb-open')) { closePanel(); }
    });
  }

  function init() {
    buildKB();
    buildUI();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
