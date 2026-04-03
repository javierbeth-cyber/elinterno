const fs = require('fs');
const path = require('path');

const datos = JSON.parse(fs.readFileSync('./datos.json', 'utf8'));
const empresaHtml = fs.readFileSync('./empresa.html', 'utf8');
const hoy = new Date().toISOString().split('T')[0];

// Extrae el CSS de empresa.html para reutilizarlo en las páginas generadas
const cssMatch = empresaHtml.match(/<style>([\s\S]*?)<\/style>/);
const CSS = cssMatch ? cssMatch[1] : '';

// ============================================================
// Funciones de renderizado (portadas desde empresa.html)
// ============================================================

const MESES = ['enero','febrero','marzo','abril','mayo','junio','julio','agosto','septiembre','octubre','noviembre','diciembre'];
const SUELDO_MAP = { 1: 'bajo el mercado', 2: 'bajo el mercado', 3: 'en el mercado', 4: 'sobre el mercado', 5: 'sobre el mercado' };
const SUELDO_OPTIONS = ['bajo el mercado', 'en el mercado', 'sobre el mercado'];
const CARRERA_MAP = { 1: 'pocas oportunidades', 2: 'pocas oportunidades', 3: 'moderado', 4: 'muchas oportunidades', 5: 'muchas oportunidades' };
const CARRERA_OPTIONS = ['pocas oportunidades', 'moderado', 'muchas oportunidades'];
const ESCALA_OPTIONS = ['Muy malo', 'Malo', 'Bueno', 'Muy bueno'];
const LOGOS_DARK = ['corporacion-3xi'];

const CARGO_PALABRAS = ['gerente','gerenta','subgerente','director','directora',
  'jefe','jefa','coordinador','coordinadora','supervisor','supervisora',
  'encargado','encargada','líder','lider','analista','desarrollador','desarrolladora',
  'programador','programadora','ingeniero','ingeniera','diseñador','diseñadora',
  'consultor','consultora','especialista','ejecutivo','ejecutiva',
  'ceo','cto','cfo','coo','cmo','ciso','vp','clevel','c-level','c level'];

function maskCargo(texto) {
  if (!texto) return { text: texto, masked: false };
  var re = new RegExp(
    '\\b(' + CARGO_PALABRAS.join('|') + ')e?s?\\b\\)?(?:\\s+(?:de|del|en|y|sr\\.?|jr\\.?|senior|junior|área|area))*(?:\\s+[A-ZÁÉÍÓÚÑa-záéíóúñ]+){0,3}',
    'gi'
  );
  var masked = false;
  var result = texto.replace(re, function() { masked = true; return '[cargo omitido]'; });
  return { text: result, masked: masked };
}

function escalaColor(val) {
  if (val === 'Muy bueno') return 'var(--green-text)';
  if (val === 'Bueno')     return '#16a34a';
  if (val === 'Malo')      return '#ca8a04';
  if (val === 'Muy malo')  return 'var(--red-text)';
  return 'inherit';
}

function subcatColor(label, val) {
  if (val === null || val === undefined) return 'inherit';
  if (label === 'Sueldo')      return val === 'sobre el mercado' ? 'var(--green-text)' : val === 'bajo el mercado' ? 'var(--red-text)' : '#ca8a04';
  if (label === 'Crecimiento') return val === 'muchas oportunidades' ? 'var(--green-text)' : val === 'pocas oportunidades' ? 'var(--red-text)' : '#ca8a04';
  return escalaColor(val);
}

function cualitativo(val, map) {
  if (!val && val !== 0) return null;
  if (typeof val === 'number') return map[val] || null;
  return val;
}

function stars(rating, size) {
  size = size || 20;
  if (!rating) return '';
  let html = '<div class="stars">';
  for (let i = 1; i <= 5; i++) {
    html += `<span class="star" style="font-size:${size}px">${i <= Math.round(rating) ? '⭐' : '☆'}</span>`;
  }
  html += '</div>';
  return html;
}

function formatFecha(fecha) {
  if (!fecha) return null;
  var parts = fecha.split('-');
  return parseInt(parts[2]) + ' de ' + MESES[parseInt(parts[1]) - 1] + ' de ' + parts[0];
}

function bloque(tipo, icono, label, texto) {
  if (!texto) return '';
  return `<div class="bloque bloque-${tipo}"><div class="bloque-label">${icono} ${label}</div><div class="bloque-text">${texto}</div></div>`;
}

function badgeRecomienda(val) {
  if (!val) return '';
  var v = String(val).toLowerCase();
  if (v.startsWith('s')) return `<span class="badge-sigue badge-sigue-si">✓ Lo recomienda para trabajar ahí</span>`;
  if (v.startsWith('d')) return `<span class="badge-sigue" style="background:#fefce8;border:1px solid #fef08a;color:#854d0e;">↔ Su recomendación depende del perfil</span>`;
  return `<span class="badge-sigue badge-sigue-no">No lo recomienda para trabajar ahí</span>`;
}

function dominante(arr, options) {
  var counts = {};
  options.forEach(function(o) { counts[o] = 0; });
  arr.forEach(function(v) { if (v && counts[v] !== undefined) counts[v]++; });
  var max = 0, winner = null;
  options.forEach(function(o) { if (counts[o] > max) { max = counts[o]; winner = o; } });
  return { winner: winner, counts: counts, total: arr.filter(Boolean).length };
}

function renderDistribucion(id, options, counts, total) {
  var html = '<div class="dist-wrap" id="dist-' + id + '">';
  options.forEach(function(o) {
    var c = counts[o] || 0;
    var pct = total > 0 ? Math.round(c / total * 100) : 0;
    html += '<div class="dist-row"><span class="dist-row-label">' + o + '</span><div class="dist-bar-bg"><div class="dist-bar-fill" style="width:' + pct + '%"></div></div><span class="dist-count">' + c + '</span></div>';
  });
  return html + '</div>';
}

function renderResumen(emp) {
  var resenas = emp.resenas || [];
  var sueldoVals  = resenas.map(function(r) { return cualitativo(r.sueldo, SUELDO_MAP); });
  var carreraVals = resenas.map(function(r) { return cualitativo(r.carrera, CARRERA_MAP); });
  var flexVals    = resenas.map(function(r) { return r.flexibilidad; });
  var liVals      = resenas.map(function(r) { return r.liderazgo; });
  var cultVals    = resenas.map(function(r) { return r.cultura; });
  var sdato    = dominante(sueldoVals,  SUELDO_OPTIONS);
  var cdato    = dominante(carreraVals, CARRERA_OPTIONS);
  var flexDato = dominante(flexVals,    ESCALA_OPTIONS);
  var liDato   = dominante(liVals,      ESCALA_OPTIONS);
  var cultDato = dominante(cultVals,    ESCALA_OPTIONS);

  function cualHtml(label, dato, distId, options) {
    if (!dato.winner) return '';
    var subtext = dato.total > 1 ? dato.counts[dato.winner] + ' de ' + dato.total + ' opinan esto' : '';
    var winnerDisplay = dato.winner.charAt(0).toUpperCase() + dato.winner.slice(1);
    return '<div class="resumen-item"><span class="resumen-label">' + label + '</span><span class="badge-cualitativo">' + winnerDisplay + '</span>' +
      (subtext ? '<span class="badge-cualitativo-sub" onclick="toggleDist(\'' + distId + '\')">' + subtext + ' ▾</span>' : '') +
      renderDistribucion(distId, options, dato.counts, dato.total) + '</div>';
  }

  var total = resenas.length;
  var recSi     = resenas.filter(function(r) { return r.recomienda && String(r.recomienda).toLowerCase().startsWith('s'); }).length;
  var recDepende = resenas.filter(function(r) { return r.recomienda && String(r.recomienda).toLowerCase().startsWith('d'); }).length;
  var recNo     = resenas.filter(function(r) { return r.recomienda && String(r.recomienda).toLowerCase().startsWith('n'); }).length;
  var totalRec  = recSi + recDepende + recNo;
  var sigue     = resenas.filter(function(r) { return r.sigue && String(r.sigue).toLowerCase().startsWith('s'); }).length;
  var pctSigue  = total > 0 ? Math.round(sigue / total * 100) : null;

  var conBien = resenas.filter(function(r) { return r.que_bien; });
  var conMal  = resenas.filter(function(r) { return r.que_mal; });
  var highlightBien = emp.resumen_bien ? maskCargo(emp.resumen_bien).text : (conBien.length ? maskCargo(conBien[0].que_bien).text : null);
  var highlightMal  = emp.resumen_mal  ? maskCargo(emp.resumen_mal).text  : (conMal.length  ? maskCargo(conMal[0].que_mal).text   : null);
  var usaIA = !!(emp.resumen_bien || emp.resumen_mal) && resenas.length > 1;

  var gridItems = '';
  gridItems += cualHtml('Sueldo',       sdato,    'sueldo',       SUELDO_OPTIONS);
  gridItems += cualHtml('Crecimiento',  cdato,    'carrera',      CARRERA_OPTIONS);
  gridItems += cualHtml('Flexibilidad', flexDato, 'flexibilidad', ESCALA_OPTIONS);
  gridItems += cualHtml('Liderazgo',    liDato,   'liderazgo',    ESCALA_OPTIONS);
  gridItems += cualHtml('Cultura',      cultDato, 'cultura',      ESCALA_OPTIONS);

  var statsHtml = '';
  if (totalRec > 0) {
    if (recSi     > 0) statsHtml += '<div class="resumen-stat-item"><strong>' + recSi     + ' de ' + totalRec + '</strong> lo recomiendan para trabajar ahí</div>';
    if (recDepende > 0) statsHtml += '<div class="resumen-stat-item"><strong>' + recDepende + ' de ' + totalRec + '</strong> ' + (recDepende === 1 ? 'dice' : 'dicen') + ' que su recomendación depende del perfil</div>';
    if (recNo     > 0) statsHtml += '<div class="resumen-stat-item"><strong>' + recNo     + ' de ' + totalRec + '</strong> no lo recomiendan para trabajar ahí</div>';
  }
  if (pctSigue !== null) statsHtml += '<div class="resumen-stat-item"><strong>' + pctSigue + '%</strong> sigue trabajando ahí</div>';

  var highlightsHtml = '';
  if (highlightBien || highlightMal) {
    var labelBien = usaIA ? '✅ Lo que más valoran*' : '✅ Lo que más valoran';
    var labelMal  = usaIA ? '❌ Principal queja*'    : '❌ Principal queja';
    highlightsHtml = '<div class="highlights">';
    if (highlightBien) highlightsHtml += '<div class="highlight-card highlight-card-bien"><div class="highlight-label">' + labelBien + '</div><div class="highlight-text">' + highlightBien + '</div></div>';
    if (highlightMal)  highlightsHtml += '<div class="highlight-card highlight-card-mal"><div class="highlight-label">'  + labelMal  + '</div><div class="highlight-text">' + highlightMal  + '</div></div>';
    highlightsHtml += '</div>';
    if (usaIA) highlightsHtml += '<div class="resumen-ia-note">* Resumen generado con IA a partir de ' + resenas.length + ' reseñas</div>';
  }

  return '<div class="resumen"><div class="resumen-title">Resumen</div><div class="resumen-grid">' + gridItems + '</div>' +
    (statsHtml ? '<div class="resumen-stats">' + statsHtml + '</div>' : '') + highlightsHtml + '</div>';
}

function renderResena(r) {
  var resSubcats = [
    { label: 'Sueldo',      val: cualitativo(r.sueldo, SUELDO_MAP) },
    { label: 'Crecimiento', val: cualitativo(r.carrera, CARRERA_MAP) },
    { label: 'Flex.',       val: r.flexibilidad },
    { label: 'Liderazgo',   val: r.liderazgo },
    { label: 'Cultura',     val: r.cultura },
  ].filter(function(c) { return c.val !== null && c.val !== undefined; });

  var queB = maskCargo(r.que_bien);
  var queM = maskCargo(r.que_mal);
  var queD = maskCargo(r.que_desearias);

  return `<div class="resena" id="resena-${r.id}">
      <div class="resena-header">
        ${stars(r.cal_general, 16)}
        ${r.cal_general ? `<span class="resena-rating">${r.cal_general}/5</span>` : ''}
        ${r.tiempo ? `<span class="resena-tiempo">${r.tiempo}</span>` : ''}
        ${r.area && r.area !== 'Prefiero no decirlo' ? `<span class="resena-tiempo">${r.area}</span>` : ''}
        ${r.sigue ? (String(r.sigue).toLowerCase().startsWith('s')
          ? `<span class="badge-sigue badge-sigue-si">Sigue trabajando ahí</span>`
          : `<span class="badge-sigue badge-sigue-no">Ya no trabaja ahí</span>`) : ''}
        ${r.recomienda ? badgeRecomienda(r.recomienda) : ''}
      </div>
      ${r.fecha ? `<div class="resena-publicado">Publicado en ${formatFecha(r.fecha)}</div>` : ''}
      ${resSubcats.length ? `<div class="resena-subcats">${resSubcats.map(function(c) { var vd = c.val ? String(c.val).charAt(0).toUpperCase() + String(c.val).slice(1) : c.val; return `<div class="resena-subcat">${c.label} <span style="color:${subcatColor(c.label, c.val)};font-weight:700">${vd}</span></div>`; }).join('')}</div>` : ''}
      ${bloque('bien',      '✅', 'Qué está bien',                queB.text)}
      ${bloque('mal',       '❌', 'Qué está mal',                 queM.text)}
      ${bloque('desearias', '💡', 'Qué desearías haber sabido',   queD.text)}
      ${bloque('gerencia',  '🎯', 'Consejo para la gerencia',     r.consejo_gerencia)}
      ${(queB.masked || queM.masked || queD.masked) ? '<div class="resena-masked-note">* Se ocultó una mención de cargo para proteger el anonimato</div>' : ''}
      <div class="resena-footer">
        <button class="btn-denunciar" onclick="abrirDenuncia(${r.id})">⚑ Denunciar</button>
        <button class="btn-voto" onclick="votar(${r.id}, this)">
          👍 Yo también lo viví &nbsp;<span class="voto-count"></span>
        </button>
      </div>
    </div>`;
}

// ============================================================
// Genera el HTML completo de una página de empresa
// ============================================================

function generatePage(emp) {
  const totalRes = emp.total_resenas || 0;
  const prom     = emp.promedio ? `Calificación ${emp.promedio}/5. ` : '';
  const metaDesc = `${prom}${totalRes} reseña${totalRes !== 1 ? 's' : ''} anónima${totalRes !== 1 ? 's' : ''} de empleados de ${emp.nombre}. Sueldo, liderazgo, cultura y ambiente laboral. Lo que no aparece en el aviso de trabajo.`;
  const pageUrl  = `https://elinterno.com/empresa/${emp.id}/`;
  const title    = `${emp.nombre} Chile — Cómo es trabajar ahí | El Interno`;

  // Logos: rutas relativas → absolutas desde raíz
  const logoSrc = emp.logo
    ? (emp.logo.startsWith('assets/') ? '/' + emp.logo : emp.logo)
    : null;
  const logoHtml = logoSrc
    ? `<img src="${logoSrc}" alt="${emp.nombre}" onerror="this.parentElement.innerHTML='<span class=empresa-logo-placeholder>${emp.nombre[0]}</span>'">`
    : `<span class="empresa-logo-placeholder">${emp.nombre[0]}</span>`;

  const isDark = LOGOS_DARK.includes(emp.id);

  // Empresa header pre-renderizado
  const empresaHeaderHtml = `<div class="empresa-header">
      <div class="empresa-header-inner">
        <div class="empresa-logo${isDark ? ' logo-dark' : ''}">${logoHtml}</div>
        <div class="empresa-info">
          <h1 class="empresa-nombre">${emp.nombre}</h1>
          <span class="empresa-rubro">${emp.rubro || 'Sin rubro'}</span>
          <div class="rating-row">
            ${stars(emp.promedio, 20)}
            ${emp.promedio ? `<span class="rating-big">${emp.promedio}</span>` : ''}
            <span class="rating-label">${totalRes} reseña${totalRes !== 1 ? 's' : ''}</span>
          </div>
        </div>
      </div>
    </div>`;

  // Main pre-renderizado
  let mainHtml = '';
  if (!emp.resenas || !emp.resenas.length) {
    mainHtml = '<p style="color:var(--text-muted)">Sin reseñas aún.</p>';
  } else {
    const ordenadas = emp.resenas.slice().sort(function(a, b) {
      var vDiff = (b.votos || 0) - (a.votos || 0);
      return vDiff !== 0 ? vDiff : (b.fecha || '').localeCompare(a.fecha || '');
    });
    mainHtml = renderResumen(emp) +
      `<div class="section-title">${totalRes} reseña${totalRes !== 1 ? 's' : ''}</div>` +
      ordenadas.map(renderResena).join('');
  }

  // IDs para Firebase
  const resenaIds = JSON.stringify((emp.resenas || []).map(function(r) { return r.id; }));

  // Schema.org
  const reviews = (emp.resenas || []).filter(function(r) { return r.que_bien || r.que_mal; });
  const schemaReviews = reviews.slice(0, 5).map(function(r) {
    return {
      "@type": "Review",
      "reviewRating": { "@type": "Rating", "ratingValue": r.cal_general, "bestRating": "5", "worstRating": "1" },
      "author": { "@type": "Person", "name": "Empleado anónimo" },
      "reviewBody": [r.que_bien, r.que_mal].filter(Boolean).join(' ').substring(0, 300)
    };
  });
  const schema = Object.assign(
    { "@context": "https://schema.org", "@type": "Organization", "name": emp.nombre, "url": pageUrl, "description": metaDesc },
    emp.rubro ? { "industry": emp.rubro } : {},
    (emp.promedio && totalRes) ? { "aggregateRating": { "@type": "AggregateRating", "ratingValue": emp.promedio, "bestRating": "5", "worstRating": "1", "reviewCount": totalRes } } : {},
    schemaReviews.length ? { "review": schemaReviews } : {}
  );

  return `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <!-- Google tag (gtag.js) -->
  <script async src="https://www.googletagmanager.com/gtag/js?id=G-FWBT3DHWVL"></script>
  <script>
    window.dataLayer = window.dataLayer || [];
    function gtag(){dataLayer.push(arguments);}
    gtag('js', new Date());
    gtag('config', 'G-FWBT3DHWVL');
  </script>
  <title>${title}</title>
  <meta name="description" content="${metaDesc}">
  <link rel="canonical" href="${pageUrl}">
  <meta name="robots" content="index, follow">
  <meta property="og:type" content="website">
  <meta property="og:site_name" content="El Interno">
  <meta property="og:title" content="${title}">
  <meta property="og:description" content="${metaDesc}">
  <meta property="og:image" content="https://elinterno.com/elinterno_og.png">
  <meta property="og:url" content="${pageUrl}">
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="${title}">
  <meta name="twitter:description" content="${metaDesc}">
  <meta name="twitter:image" content="https://elinterno.com/elinterno_og.png">
  <script type="application/ld+json">${JSON.stringify(schema)}</script>
  <!-- Firebase -->
  <script src="https://www.gstatic.com/firebasejs/10.12.0/firebase-app-compat.js"></script>
  <script src="https://www.gstatic.com/firebasejs/10.12.0/firebase-database-compat.js"></script>
  <script>
    firebase.initializeApp({
      apiKey: "AIzaSyC3R7v6LvQbEXQWHgdqpyZVwEhL_PNK9WE",
      authDomain: "elinterno-a7faf.firebaseapp.com",
      databaseURL: "https://elinterno-a7faf-default-rtdb.firebaseio.com",
      projectId: "elinterno-a7faf",
      storageBucket: "elinterno-a7faf.firebasestorage.app",
      messagingSenderId: "858193746758",
      appId: "1:858193746758:web:680222b013502d6f56a347"
    });
    var db = firebase.database();
  </script>
  <script src="https://cdn.jsdelivr.net/npm/@emailjs/browser@4/dist/email.min.js"></script>
  <script>emailjs.init('MUnJ77Rvo8jI56z3A');</script>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
  <style>${CSS}</style>
</head>
<body>

<header>
  <div class="header-inner">
    <a href="/" class="logo">
      <svg viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M2 14C2 14 7 6 14 6C21 6 26 14 26 14C26 14 21 22 14 22C7 22 2 14 2 14Z" stroke="white" stroke-width="1.8" fill="none"/>
        <circle cx="14" cy="14" r="4" stroke="white" stroke-width="1.8" fill="none"/>
        <circle cx="14" cy="14" r="1.5" fill="white"/>
      </svg>
      El Interno
    </a>
    <a href="https://docs.google.com/forms/d/1PE9o66InYWImPOK86dJK9kzq2BmRucWub5KOmPAEz04/viewform" target="_blank" class="btn-resena">
      Deja tu reseña
    </a>
  </div>
</header>

<div class="breadcrumb">
  <a href="/">← Todas las empresas</a>
</div>

<div id="empresa-header">${empresaHeaderHtml}</div>

<main class="main" id="main">${mainHtml}</main>

<!-- Modal denuncia -->
<div class="modal-overlay" id="modal-denuncia">
  <div class="modal">
    <h3>Denunciar reseña</h3>
    <p class="modal-empresa" id="modal-empresa-nombre"></p>
    <label for="denuncia-motivo">¿Por qué denuncias esta reseña? <span style="color:var(--red-text)">*</span></label>
    <textarea id="denuncia-motivo" placeholder="Ej: contiene información falsa, datos personales, lenguaje inapropiado..."></textarea>
    <label for="denuncia-email">Tu email de contacto <span style="color:var(--red-text)">*</span> <span style="color:var(--text-muted);font-weight:400">(solo para darte seguimiento, nunca lo compartiremos)</span></label>
    <input type="email" id="denuncia-email" placeholder="tuemail@ejemplo.com">
    <div class="modal-actions">
      <button class="btn-cancelar" onclick="cerrarDenuncia()">Cancelar</button>
      <button class="btn-enviar" id="btn-enviar-denuncia" onclick="enviarDenuncia()">Enviar denuncia</button>
    </div>
    <p class="modal-msg" id="modal-msg"></p>
  </div>
</div>

<footer>
  <p>ElInterno.com — Reseñas anónimas de empresas chilenas &nbsp;·&nbsp; <a href="/legal.html">Aviso legal</a> &nbsp;·&nbsp; <a href="mailto:hola@elinterno.com">hola@elinterno.com</a></p>
</footer>

<script>
  // IDs de reseñas para Firebase
  var RESENA_IDS = ${resenaIds};

  // Votos en localStorage
  function getVotosLocales() {
    try { return JSON.parse(localStorage.getItem('ei_votos') || '{}'); } catch { return {}; }
  }
  function saveVotosLocales(v) { localStorage.setItem('ei_votos', JSON.stringify(v)); }

  // Firebase: carga conteos reales y actualiza botones
  function cargarVotosFirebase(ids) {
    ids.forEach(function(id) {
      db.ref('votos/' + id).on('value', function(snap) {
        var count = snap.val() || 0;
        var btn = document.querySelector('#resena-' + id + ' .btn-voto');
        if (!btn) return;
        btn.querySelector('.voto-count').textContent = count > 0 ? count : '';
      });
    });
  }

  // Votar
  function votar(id, btn) {
    var votos = getVotosLocales();
    var ref = db.ref('votos/' + id);
    if (votos[id]) {
      ref.transaction(function(c) { return Math.max((c || 0) - 1, 0); });
      delete votos[id];
      saveVotosLocales(votos);
      btn.classList.remove('voted');
    } else {
      ref.transaction(function(c) { return (c || 0) + 1; });
      votos[id] = true;
      saveVotosLocales(votos);
      btn.classList.add('voted');
    }
  }

  // Distribución (toggle)
  function toggleDist(id) {
    var el = document.getElementById('dist-' + id);
    if (el) el.classList.toggle('open');
  }

  // Modal denuncia
  var _denunciaResenaId = null;
  function abrirDenuncia(resenaId) {
    _denunciaResenaId = resenaId;
    var nombreEl = document.querySelector('.empresa-nombre');
    document.getElementById('modal-empresa-nombre').textContent = nombreEl ? nombreEl.textContent : '';
    document.getElementById('denuncia-motivo').value = '';
    document.getElementById('denuncia-email').value = '';
    document.getElementById('modal-msg').textContent = '';
    document.getElementById('modal-msg').className = 'modal-msg';
    document.getElementById('btn-enviar-denuncia').disabled = false;
    document.getElementById('modal-denuncia').classList.add('active');
  }
  function cerrarDenuncia() {
    document.getElementById('modal-denuncia').classList.remove('active');
  }
  function enviarDenuncia() {
    var motivo = document.getElementById('denuncia-motivo').value.trim();
    var email  = document.getElementById('denuncia-email').value.trim();
    if (!motivo) {
      document.getElementById('modal-msg').textContent = 'Por favor describe el motivo.';
      document.getElementById('modal-msg').className = 'modal-msg err';
      return;
    }
    if (!email) {
      document.getElementById('modal-msg').textContent = 'Por favor ingresa tu email de contacto.';
      document.getElementById('modal-msg').className = 'modal-msg err';
      return;
    }
    var btn = document.getElementById('btn-enviar-denuncia');
    btn.disabled = true;
    btn.textContent = 'Enviando...';
    emailjs.send('service_cdst3m8', 'template_jrblvto', {
      empresa:        document.getElementById('modal-empresa-nombre').textContent,
      resena_id:      String(_denunciaResenaId),
      motivo:         motivo,
      email_contacto: email
    }).then(function() {
      document.getElementById('modal-msg').textContent = 'Denuncia enviada. La revisaremos pronto.';
      document.getElementById('modal-msg').className = 'modal-msg ok';
      btn.textContent = 'Enviado ✓';
      setTimeout(cerrarDenuncia, 2000);
    }, function() {
      document.getElementById('modal-msg').textContent = 'Error al enviar. Intenta de nuevo.';
      document.getElementById('modal-msg').className = 'modal-msg err';
      btn.disabled = false;
      btn.textContent = 'Enviar denuncia';
    });
  }
  document.getElementById('modal-denuncia').addEventListener('click', function(e) {
    if (e.target === this) cerrarDenuncia();
  });

  // Marcar votos previos del usuario
  (function() {
    var votos = getVotosLocales();
    RESENA_IDS.forEach(function(id) {
      if (votos[id]) {
        var btn = document.querySelector('#resena-' + id + ' .btn-voto');
        if (btn) btn.classList.add('voted');
      }
    });
  })();

  // Iniciar listeners de Firebase
  cargarVotosFirebase(RESENA_IDS);
</script>
<!-- Cloudflare Web Analytics --><script defer src='https://static.cloudflareinsights.com/beacon.min.js' data-cf-beacon='{"token": "92ebedcba9704991a813698660420866"}'></script><!-- End Cloudflare Web Analytics -->
</body>
</html>`;
}

// ============================================================
// Genera todas las páginas
// ============================================================

let generadas = 0;
datos.forEach(function(emp) {
  const dir = path.join('empresa', emp.id);
  fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(path.join(dir, 'index.html'), generatePage(emp), 'utf8');
  generadas++;
});

console.log(`✓ ${generadas} páginas generadas en empresa/{id}/index.html`);

// ============================================================
// Genera /directorio/ — página estática con todos los links
// (ayuda a Googlebot a descubrir empresas sin depender de JS)
// ============================================================

(function generateDirectorio() {
  const empresasHtml = datos.map(function(emp) {
    const stars = emp.promedio ? `${emp.promedio}★` : '';
    const resenas = emp.total_resenas ? `${emp.total_resenas} reseña${emp.total_resenas !== 1 ? 's' : ''}` : 'Sin reseñas';
    return `    <li><a href="/empresa/${emp.id}/">${emp.nombre}</a> <span class="dir-meta">${[emp.rubro, stars, resenas].filter(Boolean).join(' · ')}</span></li>`;
  }).join('\n');

  const html = `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <!-- Google tag (gtag.js) -->
  <script async src="https://www.googletagmanager.com/gtag/js?id=G-FWBT3DHWVL"></script>
  <script>
    window.dataLayer = window.dataLayer || [];
    function gtag(){dataLayer.push(arguments);}
    gtag('js', new Date());
    gtag('config', 'G-FWBT3DHWVL');
  </script>
  <title>Directorio de empresas chilenas | El Interno</title>
  <meta name="description" content="Directorio completo de ${datos.length} empresas chilenas con reseñas anónimas de empleados. Consulta sueldos, cultura y ambiente laboral.">
  <link rel="canonical" href="https://elinterno.com/directorio/">
  <meta name="robots" content="index, follow">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
  <style>
    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
    body { font-family: 'Inter', sans-serif; background: #0f172a; color: #e2e8f0; min-height: 100vh; }
    header { background: #1e293b; border-bottom: 1px solid #334155; padding: 0 1.5rem; }
    .header-inner { max-width: 900px; margin: 0 auto; height: 56px; display: flex; align-items: center; justify-content: space-between; }
    .logo { display: flex; align-items: center; gap: 8px; color: #fff; text-decoration: none; font-weight: 700; font-size: 1.05rem; }
    .logo svg { width: 24px; height: 24px; }
    .btn-resena { background: #3b82f6; color: #fff; border-radius: 8px; padding: 7px 16px; font-size: 0.85rem; font-weight: 600; text-decoration: none; }
    .breadcrumb { max-width: 900px; margin: 1.5rem auto 0; padding: 0 1.5rem; font-size: 0.85rem; }
    .breadcrumb a { color: #94a3b8; text-decoration: none; }
    .container { max-width: 900px; margin: 1.5rem auto 3rem; padding: 0 1.5rem; }
    h1 { font-size: 1.5rem; font-weight: 700; margin-bottom: 0.4rem; }
    .subtitle { color: #94a3b8; font-size: 0.9rem; margin-bottom: 2rem; }
    ul { list-style: none; display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 0.5rem; }
    li a { color: #e2e8f0; text-decoration: none; font-weight: 500; }
    li a:hover { color: #3b82f6; }
    li { background: #1e293b; border: 1px solid #334155; border-radius: 8px; padding: 0.75rem 1rem; }
    .dir-meta { display: block; color: #64748b; font-size: 0.78rem; margin-top: 2px; }
  </style>
</head>
<body>
<header>
  <div class="header-inner">
    <a href="/" class="logo">
      <svg viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M2 14C2 14 7 6 14 6C21 6 26 14 26 14C26 14 21 22 14 22C7 22 2 14 2 14Z" stroke="white" stroke-width="1.8" fill="none"/>
        <circle cx="14" cy="14" r="4" stroke="white" stroke-width="1.8" fill="none"/>
        <circle cx="14" cy="14" r="1.5" fill="white"/>
      </svg>
      El Interno
    </a>
    <a href="https://docs.google.com/forms/d/1PE9o66InYWImPOK86dJK9kzq2BmRucWub5KOmPAEz04/viewform" target="_blank" class="btn-resena">
      Deja tu reseña
    </a>
  </div>
</header>
<div class="breadcrumb"><a href="/">← Todas las empresas</a></div>
<div class="container">
  <h1>Directorio de empresas</h1>
  <p class="subtitle">${datos.length} empresas chilenas con reseñas de empleados</p>
  <ul>
${empresasHtml}
  </ul>
</div>
<!-- Cloudflare Web Analytics --><script defer src='https://static.cloudflareinsights.com/beacon.min.js' data-cf-beacon='{"token": "92ebedcba9704991a813698660420866"}'></script><!-- End Cloudflare Web Analytics -->
</body>
</html>`;

  fs.mkdirSync('./directorio', { recursive: true });
  fs.writeFileSync('./directorio/index.html', html, 'utf8');
  console.log(`✓ directorio/index.html generado (${datos.length} empresas)`);
})();

// ============================================================
// Actualiza sitemap.xml con las nuevas URLs
// ============================================================

const urls = [
  `  <url>
    <loc>https://elinterno.com/</loc>
    <lastmod>${hoy}</lastmod>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
  </url>`,
  `  <url>
    <loc>https://elinterno.com/directorio/</loc>
    <lastmod>${hoy}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.7</priority>
  </url>`,
  `  <url>
    <loc>https://elinterno.com/legal.html</loc>
    <lastmod>${hoy}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.3</priority>
  </url>`,
  ...datos.map(function(emp) {
    return `  <url>
    <loc>https://elinterno.com/empresa/${emp.id}/</loc>
    <lastmod>${hoy}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>`;
  })
];

const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.join('\n')}
</urlset>`;

fs.writeFileSync('./sitemap.xml', sitemap, 'utf8');
console.log(`✓ sitemap.xml actualizado con URLs /empresa/{id}/`);
