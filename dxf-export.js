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
    var ents = [];
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
      var d = [10, n4(x), 20, n4(y), 30, n4(z), 40, n4(h), 1, s];
      if (aci) d.push(62, aci);
      if (centre) d.push(72, 1, 11, n4(x), 21, n4(y), 31, n4(z));
      ents.push(['TEXT', lay, d]);
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

    // ---------- assemble (AutoCAD R12 DXF) ----------
    g(0, 'SECTION', 2, 'HEADER', 9, '$ACADVER', 1, 'AC1009', 9, '$INSBASE', 10, '0.0', 20, '0.0', 30, '0.0', 0, 'ENDSEC');
    g(0, 'SECTION', 2, 'TABLES');
    g(0, 'TABLE', 2, 'LTYPE', 70, 1, 0, 'LTYPE', 2, 'CONTINUOUS', 70, 0, 3, 'Solid line', 72, 65, 73, 0, 40, '0.0', 0, 'ENDTAB');
    var names = Object.keys(layers).sort();
    g(0, 'TABLE', 2, 'LAYER', 70, names.length + 1, 0, 'LAYER', 2, '0', 70, 0, 62, 7, 6, 'CONTINUOUS');
    names.forEach(function (n) { g(0, 'LAYER', 2, n, 70, 0, 62, layers[n], 6, 'CONTINUOUS'); });
    g(0, 'ENDTAB', 0, 'ENDSEC', 0, 'SECTION', 2, 'ENTITIES');
    ents.forEach(function (en) { g(0, en[0], 8, en[1]); var d = en[2]; for (var i = 0; i < d.length; i += 2) g(d[i], d[i + 1]); });
    g(0, 'ENDSEC', 0, 'EOF');
    var s = '';
    for (var i = 0; i < out.length; i += 2) s += out[i] + '\r\n' + out[i + 1] + '\r\n';
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
