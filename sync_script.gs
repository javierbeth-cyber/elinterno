// v2
var GITHUB_TOKEN = '';
var GITHUB_REPO  = 'javierbeth-cyber/elinterno';
var GITHUB_FILE  = 'datos.json';
var GITHUB_BRANCH = 'main';

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
  'timix-chile':              null,
  'toteat':                   'https://www.google.com/s2/favicons?domain=toteat.com&sz=128',
  'touch':                    'https://i0.wp.com/touch.cl/wp-content/uploads/2022/05/logo-touch-verde.png?fit=1020%2C310&ssl=1'
};

var RUBROS = {
  'corporacion-3xi':  'ONG',
  'hogar-de-cristo':  'ONG'
};

var COL = {
  timestamp:    0,
  empresa:      1,
  rubro:        2,
  tiempo:       3,
  sigue:        4,
  cal_general:  5,
  que_bien:     6,
  que_mal:      7,
  que_desearias:8,
  recomienda:   9,
  sueldo:       11,
  carrera:      12,
  flexibilidad: 13,
  liderazgo:    14,
  cultura:      15
};

function avg(arr) {
  if (!arr) return null;
  var vals = arr.filter(function(v) { return v !== null && v !== undefined && v !== '' && !isNaN(parseFloat(v)); });
  if (!vals.length) return null;
  var sum = vals.reduce(function(a, b) { return a + parseFloat(b); }, 0);
  return Math.round((sum / vals.length) * 10) / 10;
}

function buildJson() {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('Respuestas de formulario 1');
  var data  = sheet.getDataRange().getValues();
  var empresas = {};
  var orden = [];
  var resenaId = 0;

  for (var i = 1; i < data.length; i++) {
    var row = data[i];
    var nombre = String(row[COL.empresa] || '').trim();
    if (!nombre) continue;

    // Normalizar nombre si existe en el diccionario
    var nombreNorm = NOMBRES[nombre.toLowerCase().trim()];
    if (nombreNorm) nombre = nombreNorm;

    var id = nombre.toLowerCase()
      .replace(/[áàä]/g,'a').replace(/[éèë]/g,'e')
      .replace(/[íìï]/g,'i').replace(/[óòö]/g,'o')
      .replace(/[úùü]/g,'u').replace(/[ñ]/g,'n')
      .replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'');

    if (!empresas[id]) {
      empresas[id] = {
        id: id,
        nombre: nombre,
        rubro: RUBROS[id] || String(row[COL.rubro] || '').trim(),
        logo: LOGOS[id] !== undefined ? LOGOS[id] : 'https://www.google.com/s2/favicons?domain=' + id + '.cl&sz=128',
        resenas: []
      };
      orden.push(id);
    }

    // Formatear fecha como YYYY-MM-DD
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
      id:            resenaId,
      fecha:         fecha,
      tiempo:        row[COL.tiempo]       || null,
      sigue:         row[COL.sigue]        || null,
      cal_general:   row[COL.cal_general]  ? parseInt(row[COL.cal_general])  : null,
      sueldo:        row[COL.sueldo]        || null,
      carrera:       row[COL.carrera]       || null,
      flexibilidad:  row[COL.flexibilidad] ? parseInt(row[COL.flexibilidad]) : null,
      liderazgo:     row[COL.liderazgo]    ? parseInt(row[COL.liderazgo])    : null,
      cultura:       row[COL.cultura]      ? parseInt(row[COL.cultura])      : null,
      que_bien:      String(row[COL.que_bien]      || '').trim() || null,
      que_mal:       String(row[COL.que_mal]       || '').trim() || null,
      que_desearias: String(row[COL.que_desearias] || '').trim() || null,
      recomienda:    row[COL.recomienda]   || null,
      votos:         0
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
    emp.prom_sueldo       = null; // cualitativo, calculado client-side
    emp.prom_carrera      = null; // cualitativo, calculado client-side
    emp.prom_flexibilidad = avg(emp.resenas.map(function(r){ return r.flexibilidad; }));
    emp.prom_liderazgo    = avg(emp.resenas.map(function(r){ return r.liderazgo; }));
    emp.prom_cultura      = avg(emp.resenas.map(function(r){ return r.cultura; }));
    return emp;
  });

  result.sort(function(a, b) { return a.nombre.localeCompare(b.nombre); });
  return JSON.stringify(result, null, 2);
}

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

function onFormSubmit() {
  var json = buildJson();
  pushToGitHub(json);
}

function syncManual() {
  onFormSubmit();
}
