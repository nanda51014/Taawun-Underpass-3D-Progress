/* Firebase web-app config for the shared status database.
 *
 * Leave as null to run the model in browser-only mode (no shared database).
 * To switch on shared statuses, replace null with the config object from
 * Firebase console > Project settings > General > Your apps > SDK setup and configuration > Config.
 * It looks like this (these values are not secret - the security rules protect the data):
 *
 * window.FIREBASE_CONFIG = {
 *   apiKey: "AIza...",
 *   authDomain: "your-project.firebaseapp.com",
 *   projectId: "your-project",
 *   storageBucket: "your-project.appspot.com",
 *   messagingSenderId: "1234567890",
 *   appId: "1:1234567890:web:abc123"
 * };
 */
window.FIREBASE_CONFIG = null;
