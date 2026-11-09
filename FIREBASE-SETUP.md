# Shared status database – Firebase setup

Once this is set up, the statuses on the live site are the same for everyone, updates show up live, and only named editors can change them. Every change is logged with who made it and when.

The site code is already in this repo. Until step 8 is done, the site runs exactly as before (statuses saved only in each viewer's browser).

**Time:** about 10 minutes. **Cost:** free (Spark plan). The free daily limits are 50,000 reads and 20,000 writes, far above what this site will use.

---

## 1. Create the project
1. Go to <https://console.firebase.google.com> and sign in with **nanda51014@gmail.com**.
2. **Create a project** → name it `taawun-underpass-progress` → Continue.
3. Turn **Google Analytics off** → **Create project** → Continue.

## 2. Create the database
1. Left menu → **Build → Firestore Database** → **Create database**.
2. Location: choose the region closest to the UAE that is listed (e.g. a Middle East region if offered; otherwise `europe-west`). **This cannot be changed later.**
3. Select **Start in production mode** → **Create**.

## 3. Paste the security rules
1. Firestore Database → **Rules** tab.
2. Delete everything there and paste the whole content of [`firestore.rules`](firestore.rules) from this repo.
3. **Publish**.

What the rules do:
- Anyone with the link can read the statuses.
- Only editors can change them.
- The change log can't be edited or deleted.
- The editor list can only be changed from the console.

## 4. Turn on sign-in
1. Left menu → **Build → Authentication** → **Get started**.
2. **Sign-in method** tab → **Email/Password** → switch on the first toggle only → **Save**.
3. **Settings** tab → **Authorized domains** → **Add domain** → `nanda51014.github.io` → Add.
4. Recommended: **Settings** tab → **User actions** → untick **Enable create (sign-up)** → Save. This stops strangers creating accounts. They couldn't edit anyway without step 6, but this keeps the user list clean.

## 5. Create the editor accounts
1. Authentication → **Users** tab → **Add user** → enter the editor's email and a temporary password → **Add user**.
2. In the user list, copy that person's **User UID** (the long code).
3. Repeat for each editor. Create your own account first.

Editors can change their password with the **Forgot password?** link on the site's sign-in box.

## 6. Give each account edit rights
1. Firestore Database → **Data** tab → **Start collection**.
2. Collection ID: `editors` → Next.
3. Document ID: **paste the User UID** from step 5.
4. Add a field: name `email`, type `string`, value = their email (this is only so you can tell who is who) → **Save**.
5. For each further editor: inside `editors` → **Add document** → same steps.

To remove an editor later, delete their document in `editors` and disable the user under Authentication.

## 7. Get the web config
1. Click the gear icon next to **Project Overview** → **Project settings** → **General** tab.
2. Under **Your apps**, click the **Web** icon `</>` → nickname `taawun-site` → leave Firebase Hosting **unticked** → **Register app**.
3. Copy the `firebaseConfig = { ... }` block it shows (apiKey, authDomain, projectId, …).

These values are not secret. Every Firebase website exposes them; the rules from step 3 are what protect the data.

## 8. Switch the site on
Either **send the config block to Claude** and it will commit it, or do it yourself:
1. On GitHub, open `firebase-config.js` → pencil icon (Edit).
2. Replace `window.FIREBASE_CONFIG = null;` with
   ```js
   window.FIREBASE_CONFIG = {
     apiKey: "...",
     authDomain: "...",
     projectId: "...",
     storageBucket: "...",
     messagingSenderId: "...",
     appId: "..."
   };
   ```
3. **Commit changes**. The site updates in 1–2 minutes.

## 9. First sign-in
1. Open <https://nanda51014.github.io/Taawun-Underpass-3D-Progress/> → **Sign in to edit** (top right) → your editor email and password.
2. On this first editor sign-in, the database is filled with the statuses published in `index.html`. The header then shows **Shared statuses · last update … by …**.
3. If you had already entered statuses in your own browser before switching on: before step 8, open **Progress register → Import / export JSON → Export JSON**. After you sign in, paste it back and press **Apply pasted JSON**. That pushes those statuses to everyone.

---

## How it behaves
| Who | What they see / can do |
|---|---|
| Anyone with the link | Live shared statuses; can rotate, filter, print and copy CSV; status fields are greyed out |
| Signed-in editor | Changes save straight to the database and appear on every open screen within a second or two |
| Signed in, but not in `editors` | Same as a viewer; the header says "not an editor" |

- **Audit trail:** each save writes an entry to `projects/taawun-underpass/log` with the time, the editor's email and each activity's before → after. You can view it in Firestore → Data.
- **Source of truth:** once switched on, the database statuses override the statuses inside `index.html`. Elements added in a new revision of the model start from the statuses in the file until someone edits them.
- **New revisions of `index.html`:** keep these two lines just before `</body>`, or the site falls back to browser-only mode:
  ```html
  <script src="firebase-config.js"></script>
  <script src="cloud-sync.js"></script>
  ```
- In shared mode, the register's "Reset to published statuses" button becomes **"Discard unsaved / reload shared statuses"**, so nobody can wipe everyone's data with one click.

## Files
| File | Purpose |
|---|---|
| `firebase-config.js` | Your project's web config (`null` = shared mode off) |
| `cloud-sync.js` | Live sync, editor sign-in, read-only lock for viewers, audit log |
| `firestore.rules` | Security rules to paste in step 3 (kept here as the record) |
