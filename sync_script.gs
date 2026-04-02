var GITHUB_TOKEN  = PropertiesService.getScriptProperties().getProperty('GITHUB_TOKEN');
var GITHUB_REPO   = 'javierbeth-cyber/elinterno';
var GITHUB_FILE   = 'datos.json';
var GITHUB_BRANCH = 'main';
var LOGO_MANIFEST = 'logos/manifest.json';

// Normalización de nombres: variación (lowercase) → nombre oficial
var NOMBRES = {
  // Lemontech (todas las variaciones → normalizar para que EMPRESAS_OCULTAS las filtre)
  'lemontech':                'Lemontech',
  'lemontech chile':          'Lemontech',
  'lemon tech':               'Lemontech',
  'lemon-tech':               'Lemontech',
  'lt':                       'Lemontech',
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
  // JICA Chile
  'jica chile-agencia japonesa de cooperación internacional': 'JICA Chile',
  'jica chile-agencia japonesa de cooperacion internacional': 'JICA Chile',
  'jica chile':               'JICA Chile',
  'jica':                     'JICA Chile',
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
  'bci':                      'BCI',
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
  'timix-chile':              null,
  'toteat':                   'https://www.google.com/s2/favicons?domain=toteat.com&sz=128',
  'touch':                    'https://i0.wp.com/touch.cl/wp-content/uploads/2022/05/logo-touch-verde.png?fit=1020%2C310&ssl=1',
  'autofact':                 'https://getonbrd-prod.s3.amazonaws.com/uploads/users/logo/668/Logo_AF_Reducido.png',
  'mining-tag':               'https://getonbrd-prod.s3.amazonaws.com/uploads/users/logo/7219/mining_tag.png',
  'santander-chile':          'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b8/Banco_Santander_Logotipo.svg/960px-Banco_Santander_Logotipo.svg.png',
  'softserve':                'https://upload.wikimedia.org/wikipedia/commons/thumb/1/13/SoftServe_logo_2017.svg/960px-SoftServe_logo_2017.svg.png',
  'jica-chile-agencia-japonesa-de-cooperacion-internacional': 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/5b/Japan_International_Cooperation_Agency_logo.svg/960px-Japan_International_Cooperation_Agency_logo.svg.png'
};

var RUBROS = {
  'corporacion-3xi':  'ONG',
  'hogar-de-cristo':  'ONG'
};

// Empresas ocultas del listado público (no se incluyen en datos.json)
var EMPRESAS_OCULTAS = [
  'lemontech',
  'lemontech-chile',
  'lemon-tech',
  'lt'
];

var COL = {
  timestamp:        0,
  empresa:          1,
  rubro:            2,
  tiempo:           3,
  sigue:            4,
  cal_general:      5,
  que_bien:         6,
  que_mal:          7,
  que_desearias:    8,
  recomienda:       9,
  // col 10 = confirmación términos (ignorada)
  sueldo:           11,
  carrera:          12,
  flexibilidad:     13,
  liderazgo:        14,
  cultura:          15,
  cargo:            16,
  area:             17,
  consejo_gerencia: 18
};

// =============================================
// HELPERS GITHUB
// =============================================

function ghGet(path) {
  var res = UrlFetchApp.fetch(
    'https://api.github.com/repos/' + GITHUB_REPO + '/contents/' + path,
    { headers: { Authorization: 'token ' + GITHUB_TOKEN }, muteHttpExceptions: true }
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
  return res.getResponseCode() === 200 || res.getResponseCode() === 201;
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
// GEMINI — RESÚMENES IA
// =============================================

function callGemini(prompt) {
  var key = PropertiesService.getScriptProperties().getProperty('GEMINI_KEY');
  if (!key) { Logger.log('Sin GEMINI_KEY en Script Properties'); return null; }

  var url = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=' + key;
  var payload = {
    contents: [{ parts: [{ text: prompt }] }],
    generationConfig: { temperature: 0.3, maxOutputTokens: 1024 }
  };

  var res = UrlFetchApp.fetch(url, {
    method: 'post',
    headers: { 'Content-Type': 'application/json' },
    payload: JSON.stringify(payload),
    muteHttpExceptions: true
  });

  if (res.getResponseCode() !== 200) {
    Logger.log('Gemini error ' + res.getResponseCode() + ': ' + res.getContentText());
    return null;
  }

  var json = JSON.parse(res.getContentText());
  return json.candidates[0].content.parts[0].text;
}

function generarResumen(resenas) {
  var textos = resenas.map(function(r) {
    var parts = [];
    if (r.que_bien) parts.push('Positivo: ' + r.que_bien);
    if (r.que_mal)  parts.push('Negativo: ' + r.que_mal);
    return parts.join('\n');
  }).filter(Boolean).join('\n\n');

  var prompt =
    'Eres un asistente que sintetiza reseñas laborales anónimas de empleados chilenos.\n' +
    'Tengo estas reseñas:\n\n' + textos + '\n\n' +
    'Genera un resumen en español (1-2 oraciones cada uno):\n' +
    '- resumen_bien: sintetiza los aspectos positivos más mencionados. Si no hay nada positivo relevante, escribe null.\n' +
    '- resumen_mal: sintetiza los aspectos negativos más mencionados. Si no hay nada negativo relevante, escribe null.\n\n' +
    'Responde SOLO con JSON válido, sin markdown: {"resumen_bien": "...", "resumen_mal": "..."}';

  var text = callGemini(prompt);
  if (!text) return null;

  text = text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
  try {
    return JSON.parse(text);
  } catch(e) {
    Logger.log('Error parseando respuesta Gemini: ' + text);
    return null;
  }
}

// Ejecutar manualmente desde el editor para probar Gemini con Lirmi
function testGemini() {
  var datosData = ghGet(GITHUB_FILE);
  if (!datosData) { Logger.log('No se pudo leer datos.json'); return; }

  var empresa = datosData.content.find(function(e) { return e.nombre === 'Lirmi'; });
  if (!empresa) { Logger.log('No encontré Lirmi'); return; }

  Logger.log('Probando con: ' + empresa.nombre + ' (' + empresa.total_resenas + ' reseñas)');
  var resultado = generarResumen(empresa.resenas);
  Logger.log('Resultado Gemini: ' + JSON.stringify(resultado, null, 2));
}

// =============================================
// FILTROS DE CONTENIDO
// =============================================

var TERMINOS_SENSIBLES = [
  'nepotismo','corrupción','fraude','ilegal','estafa',
  'ladrón','delito','acoso laboral','acoso sexual',
  'hostigamiento laboral','demandar','demanda'
];

var CARGO_PALABRAS_FILTER = [
  'gerente','gerenta','subgerente','director','directora',
  'jefe','jefa','coordinador','coordinadora','supervisor','supervisora',
  'encargado','encargada','líder','lider','analista','desarrollador','desarrolladora',
  'programador','programadora','ingeniero','ingeniera','diseñador','diseñadora',
  'consultor','consultora','especialista','ejecutivo','ejecutiva',
  'ceo','cto','cfo','coo','cmo','ciso','vp'
];

function filtrarNombres(texto) {
  if (!texto) return texto;
  var re = new RegExp(
    '\\b(' + CARGO_PALABRAS_FILTER.join('|') + ')e?s?\\b\\)?(?:\\s+(?:de|del|en|y|sr\\.?|jr\\.?|senior|junior|área|area))*(?:\\s+[A-ZÁÉÍÓÚÑa-záéíóúñ]+){0,3}',
    'gi'
  );
  return texto.replace(re, '[cargo omitido]');
}

function filtrarTerminosSensibles(texto) {
  if (!texto) return texto;
  var lower = texto.toLowerCase();
  for (var i = 0; i < TERMINOS_SENSIBLES.length; i++) {
    if (lower.indexOf(TERMINOS_SENSIBLES[i]) !== -1) {
      var re = new RegExp(TERMINOS_SENSIBLES[i], 'gi');
      texto = texto.replace(re, '[contenido omitido]');
    }
  }
  return texto;
}

function filtrarTexto(texto) {
  if (!texto) return texto;
  return filtrarNombres(filtrarTerminosSensibles(texto));
}

// =============================================
// BUILD JSON
// =============================================

function buildJson() {
  // Cargar manifest de logos y datos existentes desde GitHub (una sola llamada cada uno)
  var manifestData = ghGet(LOGO_MANIFEST);
  var manifest = manifestData ? manifestData.content : {};

  // Leer datos.json actual para preservar resúmenes existentes
  var datosActuales = ghGet(GITHUB_FILE);
  var resumenesExistentes = {};
  if (datosActuales) {
    datosActuales.content.forEach(function(emp) {
      resumenesExistentes[emp.id] = {
        resumen_bien:   emp.resumen_bien   || null,
        resumen_mal:    emp.resumen_mal    || null,
        total_resenas:  emp.total_resenas  || 0
      };
    });
  }

  var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('Respuestas de formulario 1');
  var data  = sheet.getDataRange().getValues();
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

    if (EMPRESAS_OCULTAS.indexOf(id) !== -1) continue;

    if (!empresas[id]) {
      // Prioridad de logo: manifest del repo > LOGOS dict > datos.json existente > fallback DuckDuckGo
      var logo;
      var empExistente = datosActuales ? datosActuales.content.find(function(e) { return e.id === id; }) : null;
      if (manifest[id]) {
        logo = manifest[id];
      } else if (LOGOS[id] !== undefined) {
        logo = LOGOS[id];
      } else if (empExistente && empExistente.logo) {
        logo = empExistente.logo;
      } else {
        logo = 'https://icons.duckduckgo.com/ip3/' + id + '.cl.ico';
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

    var queBien      = filtrarTexto(String(row[COL.que_bien]      || '').trim()) || null;
    var queMal       = filtrarTexto(String(row[COL.que_mal]       || '').trim()) || null;
    var queDesearias = filtrarTexto(String(row[COL.que_desearias] || '').trim()) || null;
    var consejo      = filtrarTexto(String(row[COL.consejo_gerencia] || '').trim()) || null;

    resenaId++;
    empresas[id].resenas.push({
      id:               resenaId,
      fecha:            fecha,
      tiempo:           row[COL.tiempo]      || null,
      sigue:            row[COL.sigue]       || null,
      cal_general:      row[COL.cal_general] ? parseInt(row[COL.cal_general]) : null,
      sueldo:           row[COL.sueldo]      || null,
      carrera:          row[COL.carrera]     || null,
      flexibilidad:     row[COL.flexibilidad]|| null,
      liderazgo:        row[COL.liderazgo]   || null,
      cultura:          row[COL.cultura]     || null,
      que_bien:         queBien,
      que_mal:          queMal,
      que_desearias:    queDesearias,
      recomienda:       row[COL.recomienda]  || null,
      area:             String(row[COL.area]  || '').trim() || null,
      consejo_gerencia: consejo,
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
    emp.prom_flexibilidad = avg(emp.resenas.map(function(r){ return r.flexibilidad; }));
    emp.prom_liderazgo    = avg(emp.resenas.map(function(r){ return r.liderazgo; }));
    emp.prom_cultura      = avg(emp.resenas.map(function(r){ return r.cultura; }));

    var prev = resumenesExistentes[id] || {};

    if (emp.total_resenas === 1) {
      // Con una sola reseña: mostrar el comentario directo
      emp.resumen_bien = emp.resenas[0].que_bien || null;
      emp.resumen_mal  = emp.resenas[0].que_mal  || null;
    } else if (prev.resumen_bien || prev.resumen_mal) {
      if (prev.total_resenas === emp.total_resenas) {
        // Sin reseñas nuevas: conservar resumen existente
        emp.resumen_bien = prev.resumen_bien;
        emp.resumen_mal  = prev.resumen_mal;
      } else {
        // Llegó una reseña nueva: regenerar con Gemini
        Logger.log('Regenerando resumen (nueva reseña): ' + emp.nombre);
        var nuevo = generarResumen(emp.resenas);
        emp.resumen_bien = nuevo ? nuevo.resumen_bien : prev.resumen_bien;
        emp.resumen_mal  = nuevo ? nuevo.resumen_mal  : prev.resumen_mal;
      }
    } else {
      // Primera vez con +1 reseña: generar con Gemini
      Logger.log('Generando resumen (primera vez): ' + emp.nombre);
      var generado = generarResumen(emp.resenas);
      emp.resumen_bien = generado ? generado.resumen_bien : null;
      emp.resumen_mal  = generado ? generado.resumen_mal  : null;
    }

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
  var getSha = UrlFetchApp.fetch(apiUrl, {
    method: 'get',
    headers: { Authorization: 'token ' + GITHUB_TOKEN },
    muteHttpExceptions: true
  });
  var sha = null;
  if (getSha.getResponseCode() === 200) {
    sha = JSON.parse(getSha.getContentText()).sha;
  }

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
// TRIGGERS PRINCIPALES
// =============================================

function onFormSubmit() {
  var json = buildJson();
  pushToGitHub(json);
}

function syncManual() {
  onFormSubmit();
}

// =============================================
// BÚSQUEDA AUTOMÁTICA DE LOGOS (JOB NOCTURNO)
// =============================================

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
          return cb.getBlob();
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
          var imgRes = UrlFetchApp.fetch(match[1], { muteHttpExceptions: true });
          if (imgRes.getResponseCode() === 200) {
            Logger.log('  og:image OK: ' + domain);
            return imgRes.getBlob();
          }
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
    var blob = tryFindLogo(id);

    if (blob) {
      var ext      = getExtension(blob);
      var repoPath = 'logos/' + id + ext;
      var ok = ghPutBlob(repoPath, blob, 'Logo auto: ' + emp.nombre);
      if (ok) {
        manifest[id] = 'https://raw.githubusercontent.com/' + GITHUB_REPO + '/main/' + repoPath;
        encontrados++;
        Logger.log('✓ Logo guardado: ' + emp.nombre);
      } else {
        Logger.log('✗ Error al subir: ' + emp.nombre);
        sinLogo.push(emp.nombre);
      }
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
