/* Taawun Underpass 3D Progress Model - export the 3D model with current statuses to DXF.
 *
 * DXF (AutoCAD R12 format) opens directly in AutoCAD / Civil 3D / BricsCAD; use Save As > DWG there.
 * - Units: metres. CAD X = chainage, CAD Y + = LHS (facing Sharjah), CAD Z = level relative to top of wall (0.00).
 * - Every element is a group of 3DFACEs on its own layer, named STATUS_ELEMENT, e.g. CON_UL4-WALL-L,
 *   so a layer filter such as CON_* isolates all concrete-complete elements.
 * - Status prefixes: NS not started, RFT / FW / CON = steel fixing / formwork / concrete complete,
 *   RFT-IP / FW-IP / CON-IP = that stage in progress (lighter shade), HD on hold.
 * - Edges between faces of the same flat surface are made invisible so the drawing shows clean outlines.
 * Loaded after the model script; adds an "Export DXF (CAD)" button to the bottom-left tools.
 */
(function () {
  'use strict';
  // Handle-free AutoCAD R12 skeleton (header, VPORT/LTYPE/LAYER/STYLE/VIEW/UCS/APPID/DIMSTYLE tables, BLOCKS).
  var TPL = "0\nSECTION\n2\nHEADER\n9\n$ACADVER\n1\nAC1009\n9\n$DWGCODEPAGE\n3\nANSI_1252\n9\n$INSBASE\n10\n0.0\n20\n0.0\n30\n0.0\n9\n$EXTMIN\n10\n@@EXTMIN_X@@\n20\n@@EXTMIN_Y@@\n30\n@@EXTMIN_Z@@\n9\n$EXTMAX\n10\n@@EXTMAX_X@@\n20\n@@EXTMAX_Y@@\n30\n@@EXTMAX_Z@@\n9\n$LIMMIN\n10\n@@LIMMIN_X@@\n20\n@@LIMMIN_Y@@\n9\n$LIMMAX\n10\n@@LIMMAX_X@@\n20\n@@LIMMAX_Y@@\n9\n$ORTHOMODE\n70\n0\n9\n$REGENMODE\n70\n1\n9\n$FILLMODE\n70\n1\n9\n$DRAGMODE\n70\n2\n9\n$QTEXTMODE\n70\n0\n9\n$MIRRTEXT\n70\n1\n9\n$OSMODE\n70\n20583\n9\n$LTSCALE\n40\n1.0\n9\n$ATTMODE\n70\n1\n9\n$TEXTSIZE\n40\n2.5\n9\n$TRACEWID\n40\n1.0\n9\n$TEXTSTYLE\n7\nStandard\n9\n$CLAYER\n8\n0\n9\n$CELTYPE\n6\nByLayer\n9\n$CECOLOR\n62\n256\n9\n$DIMSCALE\n40\n1.0\n9\n$DIMASZ\n40\n2.5\n9\n$DIMEXO\n40\n0.625\n9\n$DIMDLI\n40\n3.75\n9\n$DIMRND\n40\n0.0\n9\n$DIMDLE\n40\n0.0\n9\n$DIMEXE\n40\n1.25\n9\n$DIMTP\n40\n0.0\n9\n$DIMTM\n40\n0.0\n9\n$DIMTXT\n40\n2.5\n9\n$DIMCEN\n40\n2.5\n9\n$DIMTSZ\n40\n0.0\n9\n$DIMTOL\n70\n0\n9\n$DIMLIM\n70\n0\n9\n$DIMTIH\n70\n0\n9\n$DIMTOH\n70\n0\n9\n$DIMSE1\n70\n0\n9\n$DIMSE2\n70\n0\n9\n$DIMTAD\n70\n1\n9\n$DIMZIN\n70\n8\n9\n$DIMBLK\n1\n\n9\n$DIMASO\n70\n1\n9\n$DIMSHO\n70\n1\n9\n$DIMPOST\n1\n\n9\n$DIMAPOST\n1\n\n9\n$DIMALT\n70\n0\n9\n$DIMALTD\n70\n3\n9\n$DIMALTF\n40\n0.03937007874\n9\n$DIMLFAC\n40\n1.0\n9\n$DIMTOFL\n70\n1\n9\n$DIMTVP\n40\n0.0\n9\n$DIMTIX\n70\n0\n9\n$DIMSOXD\n70\n0\n9\n$DIMSAH\n70\n0\n9\n$DIMBLK1\n1\n\n9\n$DIMBLK2\n1\n\n9\n$DIMSTYLE\n2\nISO-25\n9\n$DIMCLRD\n70\n0\n9\n$DIMCLRE\n70\n0\n9\n$DIMCLRT\n70\n0\n9\n$DIMTFAC\n40\n1.0\n9\n$DIMGAP\n40\n0.625\n9\n$COORDS\n70\n1\n9\n$ATTDIA\n70\n0\n9\n$ATTREQ\n70\n1\n9\n$HANDLING\n70\n0\n9\n$LUNITS\n70\n2\n9\n$LUPREC\n70\n4\n9\n$SKETCHINC\n40\n1.0\n9\n$FILLETRAD\n40\n10.0\n9\n$AUNITS\n70\n0\n9\n$AUPREC\n70\n2\n9\n$MENU\n1\n.\n9\n$ELEVATION\n40\n0.0\n9\n$PELEVATION\n40\n0.0\n9\n$THICKNESS\n40\n0.0\n9\n$LIMCHECK\n70\n0\n9\n$CHAMFERA\n40\n0.0\n9\n$CHAMFERB\n40\n0.0\n9\n$SKPOLY\n70\n0\n9\n$TDCREATE\n40\n2461355.4335879628\n9\n$TDUPDATE\n40\n2461355.4335879628\n9\n$TDINDWG\n40\n0.0\n9\n$TDUSRTIMER\n40\n0.0\n9\n$USRTIMER\n70\n1\n9\n$ANGBASE\n50\n0.0\n9\n$ANGDIR\n70\n0\n9\n$PDMODE\n70\n0\n9\n$PDSIZE\n40\n0.0\n9\n$PLINEWID\n40\n0.0\n9\n$SPLFRAME\n70\n0\n9\n$SPLINETYPE\n70\n6\n9\n$SPLINESEGS\n70\n8\n9\n$SURFTAB1\n70\n6\n9\n$SURFTAB2\n70\n6\n9\n$SURFTYPE\n70\n6\n9\n$SURFU\n70\n6\n9\n$SURFV\n70\n6\n9\n$UCSNAME\n2\n\n9\n$UCSORG\n10\n0.0\n20\n0.0\n30\n0.0\n9\n$UCSXDIR\n10\n1.0\n20\n0.0\n30\n0.0\n9\n$UCSYDIR\n10\n0.0\n20\n1.0\n30\n0.0\n9\n$PUCSNAME\n2\n\n9\n$PUCSORG\n10\n0.0\n20\n0.0\n30\n0.0\n9\n$PUCSXDIR\n10\n1.0\n20\n0.0\n30\n0.0\n9\n$PUCSYDIR\n10\n0.0\n20\n1.0\n30\n0.0\n9\n$USERI1\n70\n0\n9\n$USERI2\n70\n0\n9\n$USERI3\n70\n0\n9\n$USERI4\n70\n0\n9\n$USERI5\n70\n0\n9\n$USERR1\n40\n0.0\n9\n$USERR2\n40\n0.0\n9\n$USERR3\n40\n0.0\n9\n$USERR4\n40\n0.0\n9\n$USERR5\n40\n0.0\n9\n$WORLDVIEW\n70\n1\n9\n$SHADEDGE\n70\n3\n9\n$SHADEDIF\n70\n70\n9\n$TILEMODE\n70\n1\n9\n$MAXACTVP\n70\n64\n9\n$PLIMCHECK\n70\n0\n9\n$PEXTMIN\n10\n1e+20\n20\n1e+20\n30\n1e+20\n9\n$PEXTMAX\n10\n-1e+20\n20\n-1e+20\n30\n-1e+20\n9\n$PLIMMIN\n10\n0.0\n20\n0.0\n9\n$PLIMMAX\n10\n420.0\n20\n297.0\n9\n$UNITMODE\n70\n0\n9\n$VISRETAIN\n70\n1\n9\n$PLINEGEN\n70\n0\n9\n$PSLTSCALE\n70\n1\n0\nENDSEC\n0\nSECTION\n2\nTABLES\n0\nTABLE\n2\nVPORT\n70\n1\n0\nVPORT\n2\n*Active\n70\n0\n10\n0.0\n20\n0.0\n11\n1.0\n21\n1.0\n12\n@@VC_X@@\n22\n@@VC_Y@@\n13\n0.0\n23\n0.0\n14\n0.5\n24\n0.5\n15\n0.5\n25\n0.5\n16\n0.0\n26\n0.0\n36\n1.0\n17\n0.0\n27\n0.0\n37\n0.0\n40\n@@VH@@\n41\n2.5\n42\n50.0\n43\n0.0\n44\n0.0\n50\n0.0\n51\n0.0\n71\n0\n72\n1000\n73\n1\n74\n3\n75\n0\n76\n0\n77\n0\n78\n0\n0\nENDTAB\n0\nTABLE\n2\nLTYPE\n70\n3\n0\nLTYPE\n2\nByBlock\n70\n0\n3\n\n72\n65\n73\n0\n40\n0.0\n0\nLTYPE\n2\nByLayer\n70\n0\n3\n\n72\n65\n73\n0\n40\n0.0\n0\nLTYPE\n2\nContinuous\n70\n0\n3\n\n72\n65\n73\n0\n40\n0.0\n0\nENDTAB\n0\nTABLE\n2\nLAYER\n70\n@@NLAYERS@@\n0\nLAYER\n2\n0\n70\n0\n62\n7\n6\nContinuous\n0\nLAYER\n2\nDefpoints\n70\n0\n62\n7\n6\nContinuous\n@@LAYERS@@\n0\nENDTAB\n0\nTABLE\n2\nSTYLE\n70\n1\n0\nSTYLE\n2\nStandard\n70\n0\n40\n0.0\n41\n1.0\n50\n0.0\n71\n0\n42\n2.5\n3\ntxt\n4\n\n0\nENDTAB\n0\nTABLE\n2\nVIEW\n70\n0\n0\nENDTAB\n0\nTABLE\n2\nUCS\n70\n0\n0\nENDTAB\n0\nTABLE\n2\nAPPID\n70\n1\n0\nAPPID\n2\nACAD\n70\n0\n0\nENDTAB\n0\nTABLE\n2\nDIMSTYLE\n70\n1\n0\nDIMSTYLE\n2\nStandard\n70\n0\n3\n\n4\n\n6\n\n7\n\n40\n1.0\n41\n2.5\n42\n0.625\n43\n3.75\n44\n1.25\n45\n0.0\n46\n0.0\n47\n0.0\n48\n0.0\n140\n2.5\n141\n2.5\n142\n0.0\n143\n0.03937007874\n144\n1.0\n145\n0.0\n146\n1.0\n147\n0.625\n71\n0\n72\n0\n73\n0\n74\n0\n75\n0\n76\n0\n77\n1\n78\n8\n170\n0\n171\n3\n172\n1\n173\n0\n174\n0\n175\n0\n176\n0\n177\n0\n178\n0\n0\nENDTAB\n0\nENDSEC\n0\nSECTION\n2\nBLOCKS\n0\nBLOCK\n8\n0\n2\n$Model_Space\n70\n0\n10\n0.0\n20\n0.0\n30\n0.0\n3\n$Model_Space\n1\n\n0\nENDBLK\n8\n0\n0\nBLOCK\n8\n0\n2\n$Paper_Space\n70\n0\n10\n0.0\n20\n0.0\n30\n0.0\n3\n$Paper_Space\n1\n\n0\nENDBLK\n8\n0\n0\nENDSEC\n0\nSECTION\n2\nENTITIES\n@@ENTITIES@@\n0\nENDSEC\n0\nEOF\n";
  if (typeof allMeshes === 'undefined' || typeof elState !== 'function') return;

  // ACI colours close to the on-screen palette (complete / in progress)
  var ACI = { NS: 9, RFT: 2, 'RFT-IP': 51, FW: 30, 'FW-IP': 31, CON: 3, 'CON-IP': 92, HD: 1 };
  var DESC = { NS: 'Not started', RFT: 'Steel fixing complete', 'RFT-IP': 'Steel fixing in progress', FW: 'Formwork complete',
    'FW-IP': 'Formwork in progress', CON: 'Concrete complete', 'CON-IP': 'Concrete in progress', HD: 'On hold' };
  var COS_FLAT = Math.cos(25 * Math.PI / 180); // same threshold as the on-screen edge lines

  function n4(v) { return (Math.round(v * 10000) / 10000).toString(); }
  function layerName(s) { return s.toUpperCase().replace(/[^A-Z0-9_$-]/g, '-').slice(0, 31); }
  function statusKey(e) { var st = elState(e); return st.ip ? st.k + '-IP' : st.k; }

  function buildDxf() {
    var out = [], layers = {};
    var g = function () { for (var i = 0; i < arguments.length; i += 2) out.push(arguments[i], arguments[i + 1]); };
    var addLayer = function (name, aci) { if (!layers[name]) layers[name] = aci; return name; };
    var v = new THREE.Vector3();

    // ---------- 3D faces, one layer per element ----------
    var ents = [], ext = [Infinity, Infinity, Infinity, -Infinity, -Infinity, -Infinity];
    allMeshes.forEach(function (m) {
      var e = EL[m.userData.el]; if (!e) return;
      var key = statusKey(e), lay = addLayer(layerName(key + '_' + e.id), ACI[key] || 7);
      m.updateMatrixWorld(true);
      var pos = m.geometry.getAttribute('position'), idx = m.geometry.getIndex();
      var nTri = idx ? idx.count / 3 : pos.count / 3, P = [], tris = [];
      var pt = function (i) { v.fromBufferAttribute(pos, i).applyMatrix4(m.matrixWorld); return [v.x, -v.z, v.y]; }; // three (x,y,z) -> CAD (x,-z,y)
      for (var t = 0; t < nTri; t++) {
        var a = pt(idx ? idx.getX(t * 3) : t * 3), b = pt(idx ? idx.getX(t * 3 + 1) : t * 3 + 1), c = pt(idx ? idx.getX(t * 3 + 2) : t * 3 + 2);
        var ux = b[0] - a[0], uy = b[1] - a[1], uz = b[2] - a[2], wx = c[0] - a[0], wy = c[1] - a[1], wz = c[2] - a[2];
        var nx = uy * wz - uz * wy, ny = uz * wx - ux * wz, nz = ux * wy - uy * wx, nl = Math.hypot(nx, ny, nz);
        if (nl < 1e-9) continue; // degenerate
        tris.push({ p: [a, b, c], n: [nx / nl, ny / nl, nz / nl] });
        [a, b, c].forEach(function (q) { for (var k = 0; k < 3; k++) { if (q[k] < ext[k]) ext[k] = q[k]; if (q[k] > ext[k + 3]) ext[k + 3] = q[k]; } });
      }
      // edge -> faces map, to hide edges inside a flat surface
      var key3 = function (p) { return n4(p[0]) + ',' + n4(p[1]) + ',' + n4(p[2]); };
      var edges = {};
      tris.forEach(function (tr, ti) {
        tr.k = tr.p.map(key3);
        for (var j = 0; j < 3; j++) { var k1 = tr.k[j], k2 = tr.k[(j + 1) % 3], ek = k1 < k2 ? k1 + '|' + k2 : k2 + '|' + k1; (edges[ek] = edges[ek] || []).push(ti); }
      });
      tris.forEach(function (tr) {
        var flags = 4; // edge 3 (v3-v4) is degenerate for a triangle
        var bits = [1, 2, 8]; // v1-v2, v2-v3, v3(=v4)-v1
        for (var j = 0; j < 3; j++) {
          var k1 = tr.k[j], k2 = tr.k[(j + 1) % 3], ek = k1 < k2 ? k1 + '|' + k2 : k2 + '|' + k1;
          var flat = edges[ek].some(function (oi) { var o = tris[oi]; if (o === tr) return false; return Math.abs(o.n[0] * tr.n[0] + o.n[1] * tr.n[1] + o.n[2] * tr.n[2]) > COS_FLAT; });
          if (flat) flags |= bits[j];
        }
        var p = tr.p;
        ents.push(['3DFACE', lay, [10, n4(p[0][0]), 20, n4(p[0][1]), 30, n4(p[0][2]), 11, n4(p[1][0]), 21, n4(p[1][1]), 31, n4(p[1][2]),
          12, n4(p[2][0]), 22, n4(p[2][1]), 32, n4(p[2][2]), 13, n4(p[2][0]), 23, n4(p[2][1]), 33, n4(p[2][2]), 70, flags]]);
      });
    });

    // ---------- text: segment IDs, chainages, title and legend ----------
    var text = function (lay, x, y, z, h, s, aci, centre) {
      var d = [10, n4(x), 20, n4(y), 30, n4(z), 40, n4(h), 1, String(s).replace(/[^\x20-\x7E]/g, '-'), 7, 'Standard'];
      var hw = String(s).length * h * (centre ? 0.5 : 1); if (x - (centre ? hw : 0) < ext[0]) ext[0] = x - (centre ? hw : 0); if (x + hw > ext[3]) ext[3] = x + hw; if (y - h < ext[1]) ext[1] = y - h; if (y + h > ext[4]) ext[4] = y + h;
      if (centre) d.push(72, 1, 11, n4(x), 21, n4(y), 31, n4(z));
      ents.push(['TEXT', lay, d, aci]);
    };
    var tSeg = addLayer('TXT-SEGMENT', 7), tCh = addLayer('TXT-CHAINAGE', 8), tTitle = addLayer('TXT-TITLE', 7), tLeg = addLayer('TXT-LEGEND', 7);
    LABELS.forEach(function (L) {
      if (L.kind === 'seg') text(tSeg, L.p.x, -L.p.z + 3, L.p.y, 3, L.text, 0, true);
      else if (L.kind === 'ch') text(tCh, L.p.x, -L.p.z - 3, L.p.y, 1.8, L.text, 0, true);
      else if (L.kind === 'dir') text(tSeg, L.p.x, -L.p.z, 0, 3.5, (L.p.x < 600 ? '< ' : '') + L.text.replace(/[^A-Za-z ]/g, '').trim() + (L.p.x < 600 ? '' : ' >'), 30, true);
    });
    var x0 = 448, y = 70, now = new Date(), p2 = function (n) { return (n < 10 ? '0' : '') + n; };
    var cut = cutD() || 'not set';
    var stamp = fmtD(now.getFullYear() + '-' + p2(now.getMonth() + 1) + '-' + p2(now.getDate())) + ' ' + p2(now.getHours()) + ':' + p2(now.getMinutes());
    [[4, 'AL TAAWUN STREET JN-13 STRUCTURAL UNDERPASS - 3D PROGRESS MODEL'],
     [2.2, 'Contract R2202 - Str. dwgs 690145CH-P1B-3001-JCB-STR-DRG Rev A (IFC 23-Apr-26)'],
     [2.2, 'Status cut-off: ' + cut + '    Exported: ' + stamp],
     [1.8, 'Units: metres. X = chainage, Y+ = LHS facing Sharjah, Z = level rel. top of wall (0.00). Layers: STATUS_ELEMENT (filter e.g. CON_*).']
    ].forEach(function (r) { text(tTitle, x0, y, 0, r[0], r[1]); y -= r[0] * 1.8; });
    y -= 1.5;
    ['NS', 'RFT', 'RFT-IP', 'FW', 'FW-IP', 'CON', 'CON-IP', 'HD'].forEach(function (k, i) {
      text(tLeg, x0 + (i % 4) * 60, y - Math.floor(i / 4) * 4, 0, 2.2, k + '  ' + DESC[k], ACI[k]);
    });

    // ---------- assemble: complete AutoCAD R12 skeleton (all standard tables, STANDARD text style, BLOCKS) ----------
    var names = Object.keys(layers).sort();
    names.forEach(function (n) { g(0, 'LAYER', 2, n, 70, 0, 62, layers[n], 6, 'Continuous'); });
    var lay = ''; for (var i = 0; i < out.length; i += 2) lay += out[i] + '\n' + out[i + 1] + '\n';
    out = []; ents.forEach(function (en) { g(0, en[0], 8, en[1]); if (en[3]) g(62, en[3]); var d = en[2]; for (var i = 0; i < d.length; i += 2) g(d[i], d[i + 1]); });
    var ent = ''; for (var i = 0; i < out.length; i += 2) ent += out[i] + '\n' + out[i + 1] + '\n';
    var pad = 20, cx = (ext[0] + ext[3]) / 2, cy = (ext[1] + ext[4]) / 2;
    var R = { EXTMIN_X: ext[0], EXTMIN_Y: ext[1], EXTMIN_Z: ext[2], EXTMAX_X: ext[3], EXTMAX_Y: ext[4], EXTMAX_Z: ext[5],
      LIMMIN_X: ext[0] - pad, LIMMIN_Y: ext[1] - pad, LIMMIN_Z: 0, LIMMAX_X: ext[3] + pad, LIMMAX_Y: ext[4] + pad, LIMMAX_Z: 0,
      VC_X: cx, VC_Y: cy, VH: (ext[4] - ext[1]) * 1.3, NLAYERS: names.length + 2 };
    var s = TPL.replace(/@@([A-Z_]+)@@\n/g, function (m, k) { return k === 'LAYERS' ? lay : k === 'ENTITIES' ? ent : m; })
      .replace(/@@([A-Z_]+)@@/g, function (m, k) { return k in R ? (typeof R[k] === 'number' ? n4(R[k]) : R[k]) : m; })
      .replace(/\n/g, '\r\n');
    return { text: s, faces: ents.filter(function (e) { return e[0] === '3DFACE'; }).length, layers: names.length };
  }

  function exportDxf() {
    var r = buildDxf();
    var cutIso = document.getElementById('cutoff').value, d = new Date(), p2 = function (n) { return (n < 10 ? '0' : '') + n; };
    var tag = cutIso ? 'CutOff-' + fmtD(cutIso) : 'Exported-' + fmtD(d.getFullYear() + '-' + p2(d.getMonth() + 1) + '-' + p2(d.getDate()));
    var blob = new Blob([r.text], { type: 'application/dxf' }), a = document.createElement('a');
    a.href = URL.createObjectURL(blob); a.download = 'Taawun_Underpass_3D_Progress-' + tag + '.dxf';
    document.body.appendChild(a); a.click(); setTimeout(function () { URL.revokeObjectURL(a.href); a.remove(); }, 1000);
    if (typeof toast === 'function') toast('DXF exported - ' + r.faces + ' faces on ' + r.layers + ' layers. Open in AutoCAD, Save As DWG.');
  }
  window.buildDxf = buildDxf;

  var tools = document.getElementById('tools'), after = document.getElementById('t-print');
  var btn = document.createElement('button'); btn.id = 't-dxf'; btn.textContent = 'Export DXF (CAD)';
  btn.title = 'Download the 3D model with current statuses as a DXF file for AutoCAD (Save As DWG there)';
  btn.addEventListener('click', exportDxf);
  if (tools) tools.insertBefore(btn, after ? after.nextSibling : null);
})();
