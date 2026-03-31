var GITHUB_TOKEN  = PropertiesService.getScriptProperties().getProperty('GITHUB_TOKEN');
var GITHUB_REPO   = 'javierbeth-cyber/elinterno';
var GITHUB_FILE   = 'datos.json';
var GITHUB_BRANCH = 'main';
var LOGO_MANIFEST = 'logos/manifest.json';

// Normalización de nombres: variación (lowercase) → nombre oficial
var NOMBRES = {
  // Lirmi
  'lirmi':                    'Lirmi',
  'lirmi ':                   'Lirmi',
  // Latam
  'latam':                    'Latam Airlines',
  'latam airlines':           'Latam Airlines',
  'latam airline':            'Latam Airlines',
  'grupo latam':              'Latam Airlines',
  // Sonda
  'sonda':                    'Sonda S.A.',
  'sonda sa':                 'Sonda S.A.',
  'sonda s.a':                'Sonda S.A.',
  'sonda s.a.':               'Sonda S.A.',
  // Cencosud
  'cencosud':                 'Cencosud',
  // SMU
  'smu':                      'SMU S.A.',
  'smu sa':                   'SMU S.A.',
  'smu s.a':                  'SMU S.A.',
  'smu s.a.':                 'SMU S.A.',
  // SII
  'sii':                      'Serv. Impuestos Internos',
  'servicio de impuestos internos': 'Serv. Impuestos Internos',
  // Consalud
  'consalud':                 'Isapre Consalud',
  'isapre consalud':          'Isapre Consalud',
  // Escuela de Ingeniería UC
  'escuela de ingenieria, pontificia universidad catolica de chile': 'Escuela de Ing.UC',
  'escuela de ingeniería, pontificia universidad católica de chile': 'Escuela de Ing.UC',
  'escuela de ingenieria uc': 'Escuela de Ing.UC',
  'ingenieria uc':            'Escuela de Ing.UC',
  'puc ingenieria':           'Escuela de Ing.UC',
  // GeoVictoria
  'geovictoria':              'GeoVictoria',
  'geo victoria':             'GeoVictoria',
  // Sodexo
  'sodexo':                   'Sodexo',
  // Kibernum
  'kibernum':                 'Kibernum',
  // GTD
  'gtd':                      'GTD',
  'gtd telecom':              'GTD',
  // Líder BCI
  'lider bci':                'Líder BCI',
  'líder bci':                'Líder BCI',
  'bci':                      'Líder BCI',
  // Femsa
  'femsa':                    'Femsa',
  // Evertec
  'evertec':                  'Evertec',
};

var LOGOS = {
  'amipass':                  'https://play-lh.googleusercontent.com/F_Ah6v9QvO_S4JLoYvkgfMafZOeJMAyDJGs8IdQTla3phQ7-Ves4mfUu3o9IlsMAwuM',
  'capitaria':                'https://www.google.com/s2/favicons?domain=capitaria.com&sz=128',
  'cencosud':                 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/dc/Cencosud_logo.svg/1280px-Cencosud_logo.svg.png',
  'chita-factoring':          'https://www.google.com/s2/favicons?domain=chita.cl&sz=128',
  'corporacion-3xi':          'https://www.google.com/s2/favicons?domain=3xi.cl&sz=128',
  'cristalchile':             'https://cristalchile.cl/wp-content/uploads/2026/01/Logo_CCH_Horizontal-color.svg',
  'cumplo-chile':             'https://8519019.fs1.hubspotusercontent-na1.net/hubfs/8519019/Cumplo-logo_verde.png',
  'deloitte':                 'https://www.google.com/s2/favicons?domain=deloitte.com&sz=128',
  'dinecom':                  'https://www.google.com/s2/favicons?domain=dinecom.cl&sz=128',
  'dispolab':                 'https://www.google.com/s2/favicons?domain=dispolab.cl&sz=128',
  'edarkstore':               'https://edarkstore.com/wp-content/uploads/2022/06/eds-1.svg',
  'enaex':                    'https://www.enaex.com/wp-content/themes/enaex/assets/img/commun/logo.svg',
  'entel':                    'https://www.google.com/s2/favicons?domain=entel.cl&sz=128',
  'escuela-de-ing-uc':        'https://www.google.com/s2/favicons?domain=uc.cl&sz=128',
  'evertec':                  'https://evertecinc.com/wp-content/uploads/2025/06/Group-1.png',
  'examedi':                  'https://examedi.cl/images/logo.webp',
  'femsa':                    'https://upload.wikimedia.org/wikipedia/commons/thumb/8/85/FEMSA_Logo.svg/1280px-FEMSA_Logo.svg.png',
  'fundacion-puerto-de-ideas':'https://puertodeideas.cl/wp-content/themes/puerto-ideas-corp/assets/img/logo-puerto-de-ideas-h2.svg',
  'geovictoria':              'https://www.geovictoria.com/hs-fs/hubfs/LOGO-GV.jpg?width=960&height=212&name=LOGO-GV.jpg',
  'global66':                 'https://www.google.com/s2/favicons?domain=global66.com&sz=128',
  'gtd':                      'https://www.gtd.cl/image/layout_set_logo?img_id=1607573',
  'hogar-de-cristo':          'https://www.google.com/s2/favicons?domain=hogardecristo.cl&sz=128',
  'isapre-consalud':          'https://www.consalud.cl/cs/groups/public/documents/document/z2xv/z29o/~edisp/~extract/IMGLOGOHOME~2~staticrendition/highresolution.png',
  'kibernum':                 'https://www.kibernum.com/wp-content/uploads/2023/03/Frame-1.png',
  'laboratorios-saval':       'https://www.google.com/s2/favicons?domain=savalcorp.com&sz=128',
  'latam-airlines':           'https://upload.wikimedia.org/wikipedia/commons/thumb/e/ea/Grupo_Latam_Airlines.svg/1280px-Grupo_Latam_Airlines.svg.png',
  'lemontech':                'https://www.google.com/s2/favicons?domain=lemontech.com&sz=128',
  'lider-bci':                'https://www.google.com/s2/favicons?domain=lider.cl&sz=128',
  'lirmi':                    'https://www.google.com/s2/favicons?domain=lirmi.com&sz=128',
  'mosaico':                  'https://www.google.com/s2/favicons?domain=mosaico.cl&sz=128',
  'copec':                    'https://www.google.com/s2/favicons?domain=copec.cl&sz=128',
  'evalueserve':              'https://www.google.com/s2/favicons?domain=evalueserve.com&sz=128',
  'falabella-com':            'https://play-lh.googleusercontent.com/YT_4_VeSUqz4i-Ih97Jy-k1mE2wlDOWoNLll3MBRRZ6KLPEChNS_4B16yeyHQ0jpy0U',
  'sodimac':                  'https://www.google.com/s2/favicons?domain=sodimac.cl&sz=128',
  'seguros-sura-chile':       'https://www.sura.cl/Style%20Library/KitSura/img/logo_sura.png',
  'serv-impuestos-internos':  'https://upload.wikimedia.org/wikipedia/commons/thumb/5/57/Logotipo_Servicio_de_Impuestos_Internos.svg/1280px-Logotipo_Servicio_de_Impuestos_Internos.svg.png',
  'smu-s-a':                  'https://www.google.com/s2/favicons?domain=smu.cl&sz=128',
  'sodexo':                   'https://edge.sitecorecloud.io/sodexofrance1-sodexocorpsites-prod-e74c/media/Project/Sodexo-Corp/Americas/CL/Media/Images/Logos---Icons-100-x-100/Sodexo_Logotype_Blue.png',
  'solcor':                   'https://solcorchile.com/wp-content/uploads/2021/04/BAJA_Logo-Solcor-Chile-positivo-horizontal-1024x283.png',
  'sonda-s-a':                'https://www.sonda.com/images/sondanewsitelibraries/sonda_2024/logos/logo-sonda.svg?sfvrsn=47ae5404_3',
  'talana':                   'https://www.google.com/s2/favicons?domain=talana.cl&sz=128',
  'termas-de-puyehue':        'https://www.google.com/s2/favicons?domain=puyehue.cl&sz=128',
  'achs':                     'https://www.google.com/s2/favicons?domain=achs.cl&sz=128',
  'banco-consorcio':          'https://www.google.com/s2/favicons?domain=bancoconsorcio.cl&sz=128',
  'echeverria-izquierdo':     'https://www.google.com/s2/favicons?domain=echeverria-izquierdo.cl&sz=128',
  'timix-chile':              'https://www.google.com/s2/favicons?domain=timix.la&sz=128',
  'universidad-alberto-hurtado': 'https://www.google.com/s2/favicons?domain=uahurtado.cl&sz=128',
  'toteat':                   'https://www.google.com/s2/favicons?domain=toteat.com&sz=128',
  'touch':                    'https://i0.wp.com/touch.cl/wp-content/uploads/2022/05/logo-touch-verde.png?fit=1020%2C310&ssl=1'
};

var RUBROS = {
  'corporacion-3xi':  'ONG',
  'hogar-de-cristo':  'ONG'
};

// COL se construye dinámicamente desde los headers de la hoja
function buildColMap(headerRow) {
  var map = {};
  // Helper: solo asigna si aún no está mapeado (primer match gana)
  function set(key, i) { if (map[key] === undefined) map[key] = i; }

  headerRow.forEach(function(h, i) {
    var s = String(h || '').toLowerCase().trim();
    if (!s) return;

    // Orden importa: patrones más específicos primero
    if (s.indexOf('marca') !== -1)                                          { set('timestamp', i);        return; }
    // empresa: debe contener "trabajas" o "trabajaste" para evitar match en otras preguntas
    if (s.indexOf('empresa') !== -1 && (s.indexOf('trabajas') !== -1 || s.indexOf('trabajaste') !== -1)) { set('empresa', i); return; }
    if (s.indexOf('rubro') !== -1)                                          { set('rubro', i);             return; }
    // área: debe contener "área" o "area" + "trabajas/trabajaste" para evitar false positives
    if ((s.indexOf('área') !== -1 || s.indexOf('area') !== -1) && (s.indexOf('trabajas') !== -1 || s.indexOf('trabajaste') !== -1)) { set('area', i); return; }
    if (s === 'cargo')                                                       { set('cargo', i);             return; }
    if (s.indexOf('tiempo') !== -1 && s.indexOf('marca') === -1)            { set('tiempo', i);            return; }
    if (s.indexOf('sigues') !== -1 || s.indexOf('sigues trabajando') !== -1){ set('sigue', i);             return; }
    // calificar ANTES que empresa para que "¿Cómo calificarías esta empresa..." no matchee empresa
    if (s.indexOf('calificar') !== -1)                                      { set('cal_general', i);       return; }
    if (s === 'sueldo')                                                      { set('sueldo', i);            return; }
    if (s.indexOf('desarrollo de carrera') !== -1 || s.indexOf('desarrollo') !== -1) { set('carrera', i); return; }
    // que_bien ANTES de cultura para evitar que "¿Qué está bien...? Cultura, beneficios..." matchee como cultura
    if (s.indexOf('está bien') !== -1 || s.indexOf('esta bien') !== -1)     { set('que_bien', i);          return; }
    // flexibilidad/liderazgo: indexOf en vez de === por si el header tiene texto extra tras cambio de tipo
    if (s.indexOf('flexibilidad') !== -1 && s.indexOf('está') === -1 && s.indexOf('esta') === -1) { set('flexibilidad', i); return; }
    if (s.indexOf('liderazgo') !== -1 && s.indexOf('está') === -1 && s.indexOf('esta') === -1)    { set('liderazgo', i);    return; }
    // cultura: requiere "cultura y" para matchear "Cultura y ambiente" pero no el texto ayuda de que_bien
    if (s.indexOf('cultura y') !== -1 || s === 'cultura')                   { set('cultura', i);           return; }
    if (s.indexOf('está mal') !== -1 || s.indexOf('esta mal') !== -1)       { set('que_mal', i);           return; }
    if (s.indexOf('desear') !== -1)                                          { set('que_desearias', i);     return; }
    if (s.indexOf('gerencia') !== -1)                                        { set('consejo_gerencia', i);  return; }
    // recomienda ANTES que empresa genérico
    if (s.indexOf('recomendar') !== -1)                                      { set('recomienda', i);        return; }
    if (s.indexOf('confirmo') !== -1)                                        { set('confirmacion', i);      return; }
  });

  Logger.log('ColMap detectado: ' + JSON.stringify(map));
  return map;
}

// Palabras capitalizadas que NO son nombres de personas (falsos positivos conocidos)
var PALABRAS_OK = {
  'Santiago': true, 'Chile': true, 'Región': true, 'Metropolitana': true,
  'Buenos': true, 'Aires': true, 'Latin': true, 'America': true, 'South': true,
  'North': true, 'Big': true, 'Four': true, 'Mesa': true, 'Negociadora': true,
  'La': true, 'Las': true, 'Los': true, 'San': true, 'Santa': true,
  'El': true, 'Del': true, 'De': true, 'En': true, 'Con': true,
  'Muy': true, 'Poco': true, 'Nada': true, 'Todo': true, 'Todos': true,
  'Recursos': true, 'Humanos': true, 'Gerencia': true, 'General': true,
  'Área': true, 'Area': true, 'Cultura': true, 'Empresa': true
};

// Términos legalmente sensibles y sus reemplazos
var TERMINOS_SENSIBLES = [
  { re: /\bnepotismo\b/gi,       rep: 'favoritismo interno' },
  { re: /\bnepotista[s]?\b/gi,   rep: 'con favoritismo' },
  { re: /\bcorrupci[oó]n\b/gi,   rep: 'malas prácticas' },
  { re: /\bcorrupto[s]?\b/gi,    rep: 'deshonesto' },
  { re: /\bcorrupta[s]?\b/gi,    rep: 'deshonesta' },
  { re: /\bfraude[s]?\b/gi,      rep: 'irregularidades' },
  { re: /\bfraudulento[s]?\b/gi, rep: 'irregular' },
  { re: /\bfraudulenta[s]?\b/gi, rep: 'irregular' },
  { re: /\bilegal(es)?\b/gi,     rep: 'fuera de norma' },
  { re: /\bilegalmente\b/gi,     rep: 'de forma cuestionable' },
  { re: /\bestafa[s]?\b/gi,      rep: 'incumplimiento' },
  { re: /\bestafar\b/gi,         rep: 'incumplir' },
  { re: /\bladr[oó]n\b/gi,       rep: '[omitido]' },
  { re: /\bladrones\b/gi,        rep: '[omitido]' },
  { re: /\bdelito[s]?\b/gi,      rep: 'irregularidad' },
  { re: /\bdelictivo[s]?\b/gi,   rep: 'cuestionable' },
  { re: /\bdelictiva[s]?\b/gi,   rep: 'cuestionable' },
  // Acoso y hostigamiento
  { re: /\bacoso\s+laboral\b/gi,  rep: 'ambiente laboral negativo' },
  { re: /\bacoso\s+sexual\b/gi,   rep: 'ambiente laboral negativo' },
  { re: /\bhostigamiento\s+laboral\b/gi, rep: 'presión laboral excesiva' },
  // Demandas
  { re: /\bdemanda[s]?\b/gi,      rep: 'acciones legales' },
  { re: /\bdemandar\b/gi,         rep: 'tomar acciones legales' },
  { re: /\bdemandado[s]?\b/gi,    rep: 'con acciones legales en curso' },
  { re: /\bdemandada[s]?\b/gi,    rep: 'con acciones legales en curso' }
];

function filtrarTerminosSensibles(texto) {
  if (!texto) return texto;
  TERMINOS_SENSIBLES.forEach(function(t) {
    texto = texto.replace(t.re, t.rep);
  });
  return texto;
}

// Detecta y reemplaza secuencias de 2+ palabras capitalizadas que parezcan nombre de persona
function filtrarNombres(texto) {
  if (!texto) return texto;
  // Patrón: 2 o más palabras que empiezan con mayúscula seguidas
  return texto.replace(/\b([A-ZÁÉÍÓÚÑ][a-záéíóúñ]+)(\s+[A-ZÁÉÍÓÚÑ][a-záéíóúñ]+)+\b/g, function(match) {
    var palabras = match.split(/\s+/);
    // Si todas las palabras están en la lista de permitidas, no es nombre
    var todasOk = palabras.every(function(p) { return PALABRAS_OK[p]; });
    if (todasOk) return match;
    // Si tiene 2+ palabras y alguna NO está en la lista, probable nombre de persona
    return '[nombre omitido]';
  });
}

// Normaliza valores de escala: texto nuevo o número viejo → texto etiqueta
function normalizarEscala(val) {
  if (val === null || val === undefined || val === '') return null;
  var v = String(val).trim().toLowerCase();
  if (v === 'muy malo')  return 'Muy malo';
  if (v === 'malo')      return 'Malo';
  if (v === 'bueno')     return 'Bueno';
  if (v === 'muy bueno') return 'Muy bueno';
  var n = parseInt(v);
  if (isNaN(n)) return null;
  if (n === 1) return 'Muy malo';
  if (n === 2) return 'Malo';
  if (n === 3) return null;   // Opción A: sin equivalente, excluir
  if (n === 4) return 'Bueno';
  if (n === 5) return 'Muy bueno';
  return null;
}

function escalaANum(texto) {
  if (texto === 'Muy malo')  return 1;
  if (texto === 'Malo')      return 2;
  if (texto === 'Bueno')     return 3;
  if (texto === 'Muy bueno') return 4;
  return null;
}

function avgEscala(resenas, campo) {
  var vals = resenas
    .map(function(r) { return escalaANum(r[campo]); })
    .filter(function(v) { return v !== null; });
  if (!vals.length) return null;
  return Math.round(vals.reduce(function(a, b) { return a + b; }, 0) / vals.length * 10) / 10;
}

// =============================================
// HELPERS GITHUB
// =============================================

function ghGet(path) {
  var res = UrlFetchApp.fetch(
    'https://api.github.com/repos/' + GITHUB_REPO + '/contents/' + path,
    {
      headers: { Authorization: 'token ' + GITHUB_TOKEN },
      muteHttpExceptions: true
    }
  );
  if (res.getResponseCode() !== 200) return null;
  var data = JSON.parse(res.getContentText());
  var decoded = Utilities.newBlob(Utilities.base64Decode(data.content.replace(/\n/g, ''))).getDataAsString();
  return { content: JSON.parse(decoded), sha: data.sha };
}

function ghPutJson(path, content, message, sha) {
  var payload = {
    message: message,
    content: Utilities.base64Encode(JSON.stringify(content, null, 2), Utilities.Charset.UTF_8),
    branch:  GITHUB_BRANCH
  };
  if (sha) payload.sha = sha;
  var res = UrlFetchApp.fetch(
    'https://api.github.com/repos/' + GITHUB_REPO + '/contents/' + path,
    {
      method:  'put',
      headers: { Authorization: 'token ' + GITHUB_TOKEN, 'Content-Type': 'application/json' },
      payload: JSON.stringify(payload),
      muteHttpExceptions: true
    }
  );
  return res.getResponseCode() === 200 || res.getResponseCode() === 201;
}

function ghPutBlob(path, blob, message) {
  var apiUrl = 'https://api.github.com/repos/' + GITHUB_REPO + '/contents/' + path;
  var getSha = UrlFetchApp.fetch(apiUrl, {
    headers: { Authorization: 'token ' + GITHUB_TOKEN },
    muteHttpExceptions: true
  });
  var sha = getSha.getResponseCode() === 200 ? JSON.parse(getSha.getContentText()).sha : null;
  var payload = {
    message: message,
    content: Utilities.base64Encode(blob.getBytes()),
    branch:  GITHUB_BRANCH
  };
  if (sha) payload.sha = sha;
  var res = UrlFetchApp.fetch(apiUrl, {
    method:  'put',
    headers: { Authorization: 'token ' + GITHUB_TOKEN, 'Content-Type': 'application/json' },
    payload: JSON.stringify(payload),
    muteHttpExceptions: true
  });
  var code = res.getResponseCode();
  if (code !== 200 && code !== 201) {
    Logger.log('ghPutBlob error (' + code + '): ' + res.getContentText());
  }
  return code === 200 || code === 201;
}

// =============================================
// HELPERS GENERALES
// =============================================

function avg(arr) {
  if (!arr) return null;
  var vals = arr.filter(function(v) { return v !== null && v !== undefined && v !== '' && !isNaN(parseFloat(v)); });
  if (!vals.length) return null;
  var sum = vals.reduce(function(a, b) { return a + parseFloat(b); }, 0);
  return Math.round((sum / vals.length) * 10) / 10;
}

function getExtension(blob) {
  var ct = (blob.getContentType() || '').toLowerCase();
  if (ct.indexOf('svg') !== -1)  return '.svg';
  if (ct.indexOf('jpeg') !== -1 || ct.indexOf('jpg') !== -1) return '.jpg';
  if (ct.indexOf('webp') !== -1) return '.webp';
  return '.png';
}

// =============================================
// GEMINI — RESUMEN DE RESEÑAS
// =============================================

function generarResumen(textos, tipo) {
  if (!textos || !textos.length) return null;
  if (textos.length === 1) return textos[0]; // con 1 reseña no hace falta resumir

  var key = PropertiesService.getScriptProperties().getProperty('GEMINI_KEY');
  if (!key) return textos[0];

  var prompt = tipo === 'bien'
    ? 'Eres un asistente que resume reseñas laborales. A continuación hay ' + textos.length + ' respuestas de trabajadores a la pregunta "¿Qué está bien en esta empresa?". Escribe un resumen en español de 1 a 2 oraciones que capture los puntos en común. Sin bullet points, sin títulos, solo el resumen. Si no hay puntos en común claros, elige el punto más representativo.\n\nReseñas:\n' + textos.map(function(t,i){ return (i+1)+'. '+t; }).join('\n')
    : 'Eres un asistente que resume reseñas laborales. A continuación hay ' + textos.length + ' respuestas de trabajadores a la pregunta "¿Qué está mal en esta empresa?". Escribe un resumen en español de 1 a 2 oraciones que capture las quejas en común. Sin bullet points, sin títulos, solo el resumen. Si no hay quejas en común claras, elige la más representativa.\n\nReseñas:\n' + textos.map(function(t,i){ return (i+1)+'. '+t; }).join('\n');

  try {
    var response = UrlFetchApp.fetch(
      'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=' + key,
      {
        method: 'post',
        contentType: 'application/json',
        payload: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: { maxOutputTokens: 150, temperature: 0.3 }
        }),
        muteHttpExceptions: true
      }
    );
    var json = JSON.parse(response.getContentText());
    var texto = json.candidates && json.candidates[0] &&
                json.candidates[0].content && json.candidates[0].content.parts &&
                json.candidates[0].content.parts[0].text;
    return texto ? texto.trim() : textos[0];
  } catch(e) {
    return textos[0]; // fallback silencioso
  }
}

// =============================================
// BUILD JSON
// =============================================

function buildJson() {
  // Cargar manifest de logos desde el repo (una sola llamada)
  var manifestData = ghGet(LOGO_MANIFEST);
  var manifest = manifestData ? manifestData.content : {};

  var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('Respuestas de formulario 1');
  var data  = sheet.getDataRange().getValues();
  var COL   = buildColMap(data[0]);
  var empresas = {};
  var orden = [];
  var resenaId = 0;

  for (var i = 1; i < data.length; i++) {
    var row = data[i];
    var nombre = String(row[COL.empresa] || '').trim();
    if (!nombre) continue;

    var nombreNorm = NOMBRES[nombre.toLowerCase().trim()];
    if (nombreNorm) nombre = nombreNorm;

    var id = nombre.toLowerCase()
      .replace(/[áàä]/g,'a').replace(/[éèë]/g,'e')
      .replace(/[íìï]/g,'i').replace(/[óòö]/g,'o')
      .replace(/[úùü]/g,'u').replace(/[ñ]/g,'n')
      .replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'');

    if (!empresas[id]) {
      // Prioridad de logo: manifest del repo > LOGOS dict > null (muestra letra en el frontend)
      var logo;
      if (manifest[id] !== undefined) {
        logo = manifest[id];  // null en manifest = sin logo (muestra placeholder)
      } else if (LOGOS[id] !== undefined) {
        logo = LOGOS[id];
      } else {
        logo = null;
      }

      empresas[id] = {
        id: id,
        nombre: nombre,
        rubro: RUBROS[id] || String(row[COL.rubro] || '').trim(),
        logo: logo,
        resenas: []
      };
      orden.push(id);
    }

    var fechaRaw = row[COL.timestamp];
    var fecha = null;
    if (fechaRaw) {
      var d = new Date(fechaRaw);
      var mm = ('0' + (d.getMonth() + 1)).slice(-2);
      var dd = ('0' + d.getDate()).slice(-2);
      fecha = d.getFullYear() + '-' + mm + '-' + dd;
    }

    resenaId++;
    empresas[id].resenas.push({
      id:               resenaId,
      fecha:            fecha,
      area:             COL.area             !== undefined ? (String(row[COL.area]             || '').trim() || null) : null,
      cargo:            COL.cargo            !== undefined ? (String(row[COL.cargo]            || '').trim() || null) : null,
      tiempo:           COL.tiempo           !== undefined ? (row[COL.tiempo]                  || null) : null,
      sigue:            COL.sigue            !== undefined ? (row[COL.sigue]                   || null) : null,
      cal_general:      COL.cal_general      !== undefined ? (row[COL.cal_general] ? parseInt(row[COL.cal_general]) : null) : null,
      sueldo:           COL.sueldo           !== undefined ? (row[COL.sueldo]                  || null) : null,
      carrera:          COL.carrera          !== undefined ? (row[COL.carrera]                 || null) : null,
      flexibilidad:     COL.flexibilidad     !== undefined ? normalizarEscala(row[COL.flexibilidad]) : null,
      liderazgo:        COL.liderazgo        !== undefined ? normalizarEscala(row[COL.liderazgo])    : null,
      cultura:          COL.cultura          !== undefined ? normalizarEscala(row[COL.cultura])      : null,
      que_bien:         COL.que_bien         !== undefined ? (filtrarTerminosSensibles(filtrarNombres(String(row[COL.que_bien]         || '').trim())) || null) : null,
      que_mal:          COL.que_mal          !== undefined ? (filtrarTerminosSensibles(filtrarNombres(String(row[COL.que_mal]          || '').trim())) || null) : null,
      que_desearias:    COL.que_desearias    !== undefined ? (filtrarTerminosSensibles(filtrarNombres(String(row[COL.que_desearias]    || '').trim())) || null) : null,
      consejo_gerencia: COL.consejo_gerencia !== undefined ? (filtrarTerminosSensibles(filtrarNombres(String(row[COL.consejo_gerencia] || '').trim())) || null) : null,
      recomienda:       COL.recomienda       !== undefined ? (row[COL.recomienda]              || null) : null,
      votos:            0
    });
  }

  var result = orden.map(function(id) {
    var emp = empresas[id];
    emp.resenas.sort(function(a, b) {
      if (!a.fecha) return 1;
      if (!b.fecha) return -1;
      return b.fecha.localeCompare(a.fecha);
    });
    emp.total_resenas     = emp.resenas.length;
    emp.promedio          = avg(emp.resenas.map(function(r){ return r.cal_general; }));
    emp.prom_sueldo       = null;
    emp.prom_carrera      = null;
    emp.prom_flexibilidad = avgEscala(emp.resenas, 'flexibilidad');
    emp.prom_liderazgo    = avgEscala(emp.resenas, 'liderazgo');
    emp.prom_cultura      = avgEscala(emp.resenas, 'cultura');

    var textosBien = emp.resenas.map(function(r){ return r.que_bien; }).filter(Boolean);
    var textosMal  = emp.resenas.map(function(r){ return r.que_mal;  }).filter(Boolean);
    emp.resumen_bien = generarResumen(textosBien, 'bien');
    emp.resumen_mal  = generarResumen(textosMal,  'mal');

    return emp;
  });

  result.sort(function(a, b) { return a.nombre.localeCompare(b.nombre); });
  return JSON.stringify(result, null, 2);
}

// =============================================
// PUSH DATOS.JSON
// =============================================

function pushToGitHub(content) {
  var apiUrl = 'https://api.github.com/repos/' + GITHUB_REPO + '/contents/' + GITHUB_FILE;
  // Usar ghGet (sin auth) para obtener el SHA — funciona en repos públicos
  var current = ghGet(GITHUB_FILE);
  var sha = current ? current.sha : null;

  var payload = {
    message: 'Auto-sync desde Google Forms',
    content: Utilities.base64Encode(content, Utilities.Charset.UTF_8),
    branch:  GITHUB_BRANCH
  };
  if (sha) payload.sha = sha;

  var response = UrlFetchApp.fetch(apiUrl, {
    method: 'put',
    headers: {
      Authorization: 'token ' + GITHUB_TOKEN,
      'Content-Type': 'application/json'
    },
    payload: JSON.stringify(payload),
    muteHttpExceptions: true
  });

  var code = response.getResponseCode();
  if (code === 200 || code === 201) {
    Logger.log('OK: datos.json actualizado en GitHub');
  } else {
    Logger.log('Error: ' + response.getContentText());
  }
}

// =============================================
// SITEMAP
// =============================================

function buildSitemap(empresas) {
  var hoy = Utilities.formatDate(new Date(), 'America/Santiago', 'yyyy-MM-dd');
  var urls = [
    '  <url>\n    <loc>https://elinterno.com/</loc>\n    <lastmod>' + hoy + '</lastmod>\n    <changefreq>daily</changefreq>\n    <priority>1.0</priority>\n  </url>',
    '  <url>\n    <loc>https://elinterno.com/legal.html</loc>\n    <lastmod>' + hoy + '</lastmod>\n    <changefreq>monthly</changefreq>\n    <priority>0.3</priority>\n  </url>'
  ];
  empresas.forEach(function(emp) {
    urls.push('  <url>\n    <loc>https://elinterno.com/empresa.html?id=' + emp.id + '</loc>\n    <lastmod>' + hoy + '</lastmod>\n    <changefreq>weekly</changefreq>\n    <priority>0.8</priority>\n  </url>');
  });
  return '<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n' + urls.join('\n') + '\n</urlset>';
}

function pushSitemap(xml) {
  var apiUrl = 'https://api.github.com/repos/' + GITHUB_REPO + '/contents/sitemap.xml';
  var getSha = UrlFetchApp.fetch(apiUrl, { headers: { Authorization: 'token ' + GITHUB_TOKEN }, muteHttpExceptions: true });
  var sha = getSha.getResponseCode() === 200 ? JSON.parse(getSha.getContentText()).sha : null;
  var payload = { message: 'seo: sitemap auto-actualizado', content: Utilities.base64Encode(xml, Utilities.Charset.UTF_8), branch: GITHUB_BRANCH };
  if (sha) payload.sha = sha;
  var res = UrlFetchApp.fetch(apiUrl, { method: 'put', headers: { Authorization: 'token ' + GITHUB_TOKEN, 'Content-Type': 'application/json' }, payload: JSON.stringify(payload), muteHttpExceptions: true });
  var code = res.getResponseCode();
  Logger.log(code === 200 || code === 201 ? 'OK: sitemap.xml actualizado' : 'Error sitemap: ' + res.getContentText());
}

// =============================================
// TRIGGERS PRINCIPALES
// =============================================

function onFormSubmit() {
  var json = buildJson();
  pushToGitHub(json);
  pushSitemap(buildSitemap(JSON.parse(json)));
}

function syncManual() {
  onFormSubmit();
}

// =============================================
// BÚSQUEDA AUTOMÁTICA DE LOGOS (JOB NOCTURNO)
// =============================================

// Retorna la URL del logo (no descarga la imagen)
function tryFindLogo(id) {
  var base = id.replace(/-/g, '');
  var domains = [id + '.cl', id + '.com', base + '.cl', base + '.com'];

  for (var i = 0; i < domains.length; i++) {
    var domain = domains[i];

    // Intento 1: Clearbit
    try {
      var cb = UrlFetchApp.fetch('https://logo.clearbit.com/' + domain, { muteHttpExceptions: true });
      if (cb.getResponseCode() === 200) {
        var ct = (cb.getHeaders()['Content-Type'] || '').toLowerCase();
        if (ct.indexOf('image') !== -1 && ct.indexOf('gif') === -1) {
          Logger.log('  Clearbit OK: ' + domain);
          return 'https://logo.clearbit.com/' + domain;
        }
      }
    } catch(e) {}

    // Intento 2: og:image del sitio
    try {
      var page = UrlFetchApp.fetch('https://' + domain, { muteHttpExceptions: true, followRedirects: true });
      if (page.getResponseCode() === 200) {
        var html = page.getContentText();
        var match = html.match(/<meta[^>]+property=["']og:image["'][^>]+content=["']([^"']+)["']/i)
                 || html.match(/<meta[^>]+content=["']([^"']+)["'][^>]+property=["']og:image["']/i);
        if (match && match[1] && match[1].indexOf('http') === 0) {
          Logger.log('  og:image OK: ' + domain);
          return match[1];
        }
      }
    } catch(e) {}
  }

  return null;
}

function buscarLogos() {
  var manifestData = ghGet(LOGO_MANIFEST);
  var manifest    = manifestData ? manifestData.content : {};
  var manifestSha = manifestData ? manifestData.sha    : null;

  var datosData = ghGet(GITHUB_FILE);
  if (!datosData) { Logger.log('No se pudo leer datos.json'); return; }
  var empresas = datosData.content;

  var encontrados = 0;
  var sinLogo = [];

  empresas.forEach(function(emp) {
    var id = emp.id;
    // Saltar si ya tiene logo en manifest o en LOGOS dict (con valor no-null)
    if (manifest[id] || (LOGOS[id] !== undefined && LOGOS[id] !== null)) return;

    Logger.log('Buscando logo: ' + emp.nombre + ' (id: ' + id + ')');
    var url = tryFindLogo(id);

    if (url) {
      manifest[id] = url;
      encontrados++;
      Logger.log('✓ Logo encontrado: ' + emp.nombre + ' → ' + url);
    } else {
      sinLogo.push(emp.nombre);
      Logger.log('✗ Sin logo: ' + emp.nombre);
    }
  });

  if (encontrados > 0) {
    ghPutJson(LOGO_MANIFEST, manifest, 'Logo manifest: ' + encontrados + ' nuevos', manifestSha);
    Logger.log('Manifest actualizado con ' + encontrados + ' logos nuevos.');
    Utilities.sleep(3000);
    syncManual();
    Logger.log('datos.json regenerado con logos nuevos.');
  }

  Logger.log('--- buscarLogos completo ---');
  Logger.log('Encontrados: ' + encontrados);
  Logger.log('Sin logo (' + sinLogo.length + '): ' + sinLogo.join(', '));
}

// Ejecutar una vez desde el editor para crear el trigger diario
function setupDailyTrigger() {
  ScriptApp.getProjectTriggers().forEach(function(t) {
    if (t.getHandlerFunction() === 'buscarLogos') ScriptApp.deleteTrigger(t);
  });
  ScriptApp.newTrigger('buscarLogos')
    .timeBased()
    .atHour(3)
    .everyDays(1)
    .create();
  Logger.log('Trigger diario creado: buscarLogos a las 03:00 hrs.');
}
