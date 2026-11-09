/* Taawun Underpass 3D Progress Model - shared status sync (Firebase Firestore).
 *
 * Loaded after the model script in index.html. When firebase-config.js holds a
 * Firebase web config, every viewer sees the same statuses (live), and only
 * signed-in editors listed in the Firestore "editors" collection can change them.
 * When no config is set, the page behaves exactly as before (browser-only saves).
 *
 * Firestore layout
 *   projects/taawun-underpass          { statuses:{EL:{ACT:[status,date]}}, cutoff, updatedAt, updatedBy }
 *   projects/taawun-underpass/log/{id} { at, by, changes:[{el,act,from,to}] }   audit trail, append-only
 *   editors/{uid}                      { email }                                 who may edit
 */
(function () {
  'use strict';
  var CFG = window.FIREBASE_CONFIG;
  if (!CFG || !CFG.apiKey || /PASTE|YOUR_/i.test(CFG.apiKey)) return; // local-only mode

  var DOC_PATH = window.FIREBASE_PROJECT_DOC || 'projects/taawun-underpass';
  // Username sign-in: "ahmed" is stored in Firebase Authentication as "ahmed@taawun.local".
  // The address is never emailed; it only satisfies Firebase's email/password format.
  var USER_DOMAIN = window.FIREBASE_USER_DOMAIN || 'taawun.local';
  function toLogin(v) { v = v.trim(); return v.indexOf('@') < 0 ? v.toLowerCase() + '@' + USER_DOMAIN : v; }
  function shortName(em) { var sfx = '@' + USER_DOMAIN; return em && em.slice(-sfx.length) === sfx ? em.slice(0, -sfx.length) : em; }
  var SDK = 'https://www.gstatic.com/firebasejs/10.12.2/';
  var $ = function (id) { return document.getElementById(id); };

  // ---------- UI: header status pill, sign-in dialog, read-only styling ----------
  var css = document.createElement('style');
  css.textContent = [
    '#cloud{display:flex;align-items:center;gap:8px;font-size:11.5px;color:#C9D6D8}',
    '#cloud .dot{width:8px;height:8px;border-radius:50%;background:#7A8888;flex:none}',
    '#cloud.live .dot{background:#2E9E5B}#cloud.err .dot{background:#D7263D}',
    '#cloud button{font:inherit;font-size:11.5px;background:#EF6925;color:#fff;border:0;border-radius:3px;padding:3px 9px;cursor:pointer}',
    '#cloud button.ghost{background:transparent;border:1px solid #355056;color:#EAF2F4}',
    'body.ro .acts select,body.ro .acts input,body.ro #reg select,body.ro #reg input,body.ro #b-all,body.ro #b-none,body.ro #io-apply,body.ro #cutoff{pointer-events:none;opacity:.55}',
    '#cl-dlg{position:fixed;inset:0;background:rgba(17,37,40,.55);display:flex;align-items:center;justify-content:center;z-index:50}',
    '#cl-dlg form{background:var(--panel);color:var(--ink);border-top:3px solid #EF6925;border-radius:4px;padding:16px;width:min(340px,calc(100vw - 32px));display:flex;flex-direction:column;gap:8px}',
    '#cl-dlg h3{margin:0 0 4px;font-size:14px}',
    '#cl-dlg input{font:inherit;padding:6px 8px;border:1px solid var(--line);border-radius:3px;background:var(--bg);color:var(--ink)}',
    '#cl-dlg .row{display:flex;gap:8px;justify-content:flex-end;align-items:center;margin-top:4px}',
    '#cl-dlg .row a{margin-right:auto;font-size:11.5px;color:var(--accent2);cursor:pointer}',
    '#cl-dlg .msg{font-size:11.5px;color:#D7263D;min-height:1em}',
    '#cl-dlg button{font:inherit;border-radius:3px;padding:5px 12px;cursor:pointer;border:1px solid var(--line);background:var(--panel);color:var(--ink)}',
    '#cl-dlg button.p{background:#EF6925;border-color:#EF6925;color:#fff}'
  ].join('\n');
  document.head.appendChild(css);

  var pill = document.createElement('div');
  pill.id = 'cloud';
  pill.innerHTML = '<span class="dot"></span><span id="cl-txt">Connecting to shared database...</span><button id="cl-btn" hidden>Sign in to edit</button>';
  var cutBox = document.querySelector('header .cut');
  cutBox.parentNode.insertBefore(pill, cutBox);
  document.body.classList.add('ro');

  function setPill(text, cls) {
    $('cl-txt').textContent = text;
    pill.className = cls || '';
  }

  // ---------- state ----------
  var db, auth, ref, user = null, isEditor = false, docMissing = false;
  var synced = null, syncedCut = null, lastMeta = '';

  // Start from the statuses published in the file; the shared copy replaces them on first load.
  applyState(JSON.parse(PUBLISHED));
  var cutEl = $('cutoff');

  function focusIn(el) { return el && document.activeElement && el.contains(document.activeElement) && document.activeElement !== document.body; }
  function refreshUI() {
    recolor();
    if (!focusIn($('sel'))) renderSel();
    var dr = $('drawer');
    if (!dr.hidden && !focusIn($('reg'))) renderReg();
  }
  function revertToSynced() {
    if (synced) { applyState(synced); if (syncedCut !== null) cutEl.value = syncedCut; }
    refreshUI();
  }
  function fmtStamp(ts) {
    if (!ts || !ts.toDate) return '';
    var d = ts.toDate();
    var p = function (n) { return (n < 10 ? '0' : '') + n; };
    return fmtD(d.getFullYear() + '-' + p(d.getMonth() + 1) + '-' + p(d.getDate())) + ' ' + p(d.getHours()) + ':' + p(d.getMinutes());
  }
  function updatePill() {
    var btn = $('cl-btn');
    btn.hidden = false;
    if (user && isEditor) { btn.textContent = 'Sign out'; btn.className = 'ghost'; }
    else if (user) { btn.textContent = 'Sign out'; btn.className = 'ghost'; }
    else { btn.textContent = 'Sign in to edit'; btn.className = ''; }
    if (!synced && !docMissing) return;
    var who = user ? (isEditor ? ' · editing as ' + shortName(user.email) : ' · ' + shortName(user.email) + ' is not an editor (view only)') : ' · view only';
    if (docMissing) setPill('Shared database is empty' + (isEditor ? ' - initialising...' : ' - an editor must sign in once to initialise it') + who, 'err');
    else setPill('Shared statuses' + lastMeta + who, 'live');
  }

  // ---------- saving: replaces the model's browser-only save() ----------
  window.save = function () {
    if (!synced && !docMissing) { toast('Still connecting to the shared database - try again in a moment'); revertToSynced(); return; }
    if (!isEditor) { toast('Sign in as an editor to change statuses'); revertToSynced(); return; }
    var cur = exportState(), cut = cutEl.value, args = [], changes = [];
    Object.keys(cur).forEach(function (el) {
      Object.keys(cur[el]).forEach(function (act) {
        var a = cur[el][act], b = synced && synced[el] && synced[el][act];
        if (!b || a[0] !== b[0] || a[1] !== b[1]) {
          args.push(new firebase.firestore.FieldPath('statuses', el, act), a);
          changes.push({ el: el, act: act, from: b ? (b[0] + (b[1] ? ' ' + b[1] : '')) : '', to: a[0] + (a[1] ? ' ' + a[1] : '') });
        }
      });
    });
    if (cut !== syncedCut) { args.push('cutoff', cut); changes.push({ el: '', act: 'CUT-OFF', from: syncedCut || '', to: cut }); }
    if (!args.length) return;
    args.push('updatedAt', firebase.firestore.FieldValue.serverTimestamp(), 'updatedBy', user.email);
    var batch = db.batch();
    batch.update.apply(batch, [ref].concat(args));
    batch.set(ref.collection('log').doc(), { at: firebase.firestore.FieldValue.serverTimestamp(), by: user.email, changes: changes });
    synced = cur; syncedCut = cut;
    batch.commit().catch(function (err) { toast('Not saved: ' + err.message); });
  };

  function seed() {
    if (!docMissing || !isEditor) return;
    var base = JSON.parse(PUBLISHED);
    ref.set({ statuses: base, cutoff: cutEl.value || '', updatedAt: firebase.firestore.FieldValue.serverTimestamp(), updatedBy: user.email })
      .then(function () { toast('Shared database initialised from the published statuses'); })
      .catch(function (err) { setPill('Could not initialise shared database: ' + err.message, 'err'); });
  }

  // "Reset to published statuses" would overwrite everyone's data; in shared mode it reloads the shared copy instead.
  var oldReset = $('io-reset'), newReset = oldReset.cloneNode(true);
  newReset.textContent = 'Discard unsaved / reload shared statuses';
  oldReset.parentNode.replaceChild(newReset, oldReset);
  newReset.addEventListener('click', function () { revertToSynced(); toast('Reloaded shared statuses'); });

  // ---------- sign-in dialog ----------
  function openLogin() {
    var dlg = document.createElement('div');
    dlg.id = 'cl-dlg';
    dlg.innerHTML = '<form><h3>Editor sign-in</h3><input type="text" id="cl-em" placeholder="Username (or email)" autocomplete="username" autocapitalize="none" spellcheck="false" required>' +
      '<input type="password" id="cl-pw" placeholder="Password" autocomplete="current-password" required><div class="msg" id="cl-msg"></div>' +
      '<div class="row"><a id="cl-fg">Forgot password?</a><button type="button" id="cl-cx">Cancel</button><button class="p" type="submit">Sign in</button></div></form>';
    document.body.appendChild(dlg);
    var close = function () { dlg.remove(); };
    $('cl-em').focus();
    $('cl-cx').onclick = close;
    dlg.addEventListener('click', function (e) { if (e.target === dlg) close(); });
    $('cl-fg').onclick = function () {
      var raw = $('cl-em').value.trim(), em = toLogin(raw);
      if (!raw) { $('cl-msg').textContent = 'Type your username or email first.'; return; }
      if (shortName(em) !== em) { $('cl-msg').textContent = 'Username accounts have no mailbox - ask the site admin to reset your password.'; return; }
      auth.sendPasswordResetEmail(em).then(function () { $('cl-msg').style.color = '#2E9E5B'; $('cl-msg').textContent = 'Reset email sent.'; })
        .catch(function (err) { $('cl-msg').textContent = err.message; });
    };
    dlg.querySelector('form').addEventListener('submit', function (e) {
      e.preventDefault();
      $('cl-msg').textContent = '';
      auth.signInWithEmailAndPassword(toLogin($('cl-em').value), $('cl-pw').value).then(close)
        .catch(function () { $('cl-msg').textContent = 'Sign-in failed - check email and password.'; });
    });
  }
  $('cl-btn').addEventListener('click', function () { if (user) auth.signOut(); else openLogin(); });

  // ---------- connect ----------
  function load(src) {
    return new Promise(function (ok, fail) {
      var s = document.createElement('script'); s.src = SDK + src; s.onload = ok;
      s.onerror = function () { fail(new Error('could not load ' + src)); };
      document.head.appendChild(s);
    });
  }
  load('firebase-app-compat.js')
    .then(function () { return Promise.all([load('firebase-auth-compat.js'), load('firebase-firestore-compat.js')]); })
    .then(function () {
      firebase.initializeApp(CFG);
      db = firebase.firestore();
      auth = firebase.auth();
      ref = db.doc(DOC_PATH);

      auth.onAuthStateChanged(function (u) {
        user = u; isEditor = false;
        var done = function () { document.body.classList.toggle('ro', !isEditor); updatePill(); seed(); };
        if (!u) return done();
        db.doc('editors/' + u.uid).get().then(function (s) { isEditor = s.exists; }).catch(function () { isEditor = false; }).then(done);
      });

      ref.onSnapshot(function (snap) {
        if (!snap.exists) { docMissing = true; updatePill(); seed(); return; }
        docMissing = false;
        var d = snap.data();
        applyState(d.statuses || {});
        if (d.cutoff) cutEl.value = d.cutoff;
        synced = exportState(); syncedCut = cutEl.value;
        var st = fmtStamp(d.updatedAt);
        lastMeta = st ? ' · last update ' + st + (d.updatedBy ? ' by ' + shortName(d.updatedBy) : '') : '';
        refreshUI(); updatePill();
      }, function (err) {
        setPill('Cannot read shared statuses (' + err.code + ') - showing published statuses', 'err');
      });
    })
    .catch(function (err) { setPill('Shared database unavailable (' + err.message + ') - showing published statuses', 'err'); });
})();
