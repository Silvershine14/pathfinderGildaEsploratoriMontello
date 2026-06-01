// =====================================================
// PATHFINDER ONE-SHOT - MAIN JAVASCRIPT WITH FIREBASE
// =====================================================

// FIREBASE CONFIGURATION
const firebaseConfig = {
    apiKey: "AIzaSyB-2yDPXPOoGGjpbV44VfJYkNRfnezNUkE",
    authDomain: "gildaesploratorimontello.firebaseapp.com",
    projectId: "gildaesploratorimontello",
    storageBucket: "gildaesploratorimontello.firebasestorage.app",
    messagingSenderId: "512224002060",
    appId: "1:512224002060:web:a041a2b7a225dc3a952e29",
    measurementId: "G-KEWSJWLKX2"
};

// Firebase services (initialized after DOM loads)
let app, auth, db, storage;

// Cache for adventures loaded from Firestore
let allAdventuresData = [];

// DATI DI ESEMPIO (per fallback se Firestore è vuoto)
const adventures = [
    {
        id: 1,
        title: "La maschera del Barracuda",
        level: "3",
        duration: "3-4 ore",
        description: "La vita è molto dura nei ghetti di una grande città. Uniti dalle avversità e dall'ambizione, la vostra piccola banda di malviventi è sempre riuscita a rimanere fieramente indipendente. Ma era solo questione di tempo prima di commettere un passo falso. Volevate fare un colpo grosso, che vi avrebbe cambiato la vita, ma avete scelto la preda sbagliata e ora siete in debito con il Barracuda...",
        image: "assets/images/mascheraBarracuda.jpeg"
    },
    {
        id: 2,
        title: "Grosso guaio ad Absalom",
        level: "1",
        duration: "3 ore circa",
        description: "Vivere sempre nell'ombra è complicato quando sei una creatura scaltra e regale come un coboldo. Ora è tempo di portare onore e prestigio al tuo clan! Nella one shot potrai interpretare uno dei cinque coboldi del clan Artiglio Uncinato, inviati a cercare tesori in una stanza segreta scoperta dalla squadra di scavatori del clan. Quali terribili pericoli dovrete affrontare?",
        image: "assets/images/placeholder-2.jpg"
    },
    {
        id: 3,
        title: "Le Rovine dell'Arcimago",
        level: "7-9",
        duration: "6-7 ore",
        description: "Gli studi magici di un potente arcimago decaduto si ergono come una sfida mortale. Artefatti antichi e incantesimi perduti attendono chi osi affrontarli.",
        image: "assets/images/placeholder-3.jpg"
    }
];

const schede = [
    {
        id: 1,
        title: "Scheda personaggio editabile",
        level: "-",
        classe: "-",
        description: "Scheda pdf editabile",
        image: "assets/images/placeholder-1.jpg"
    },
    {
        id: 2,
        title: "Fede Oscura",
        level: "3",
        classe: "Chierico",
        description: "Scheda pdf di esempio",
        image: "assets/images/fedeOscura.jpg"
    },
    {
        id: 3,
        title: "Grande Esca",
        level: "3",
        classe: "Guerriero",
        description: "Scheda pdf di esempio",
        image: "assets/images/grandeEsca.jpg"
    },
    {
        id: 4,
        title: "Bum Bum",
        level: "3",
        classe: "Ranger",
        description: "Scheda pdf di esempio",
        image: "assets/images/bumBumM.jpg"
    }
];

// =====================================================
// UTILITY FUNCTIONS
// =====================================================

/**
 * Mostra un elemento
 */
function showElement(selector) {
    const element = document.querySelector(selector);
    if (element) element.style.display = 'block';
}

/**
 * Nascondi un elemento
 */
function hideElement(selector) {
    const element = document.querySelector(selector);
    if (element) element.style.display = 'none';
}

/**
 * Log messaggi di debug
 */
function log(message, data = null) {
    console.log(`[PATHFINDER] ${message}`, data || '');
}

/**
 * Helper UI: render a simple loading placeholder inside a container element
 */
function renderLoading(container, text = 'Caricamento...') {
    if (!container) return;
    container.innerHTML = `<div class="loading">⏳ ${text}</div>`;
}

/**
 * Restituisce un link di visualizzazione/download per un file Google Drive.
 * Accetta o un `driveUrl` completo o un `driveFileId` (id del file Drive).
 */
function buildDriveLink(driveUrlOrId, forDownload = false) {
    if (!driveUrlOrId) return null;
    // if it looks like a full URL, return as-is
    try {
        const url = new URL(driveUrlOrId);
        return url.href;
    } catch (_) {
        // not a full url, assume it's a fileId
        const fileId = driveUrlOrId;
        if (forDownload) {
            return `https://drive.google.com/uc?id=${fileId}&export=download`;
        }
        return `https://drive.google.com/file/d/${fileId}/view`;
    }
}

// =====================================================
// FIREBASE INITIALIZATION
// =====================================================

/**
 * Inizializza Firebase (chiamata al caricamento della pagina)
 */
function initializeFirebase() {
    try {
        // Initialize Firebase
        app = firebase.initializeApp(firebaseConfig);
        auth = firebase.auth();
        db = firebase.firestore();
        storage = firebase.storage();

        log('Firebase inizializzato correttamente');

        // Listener per cambio stato autenticazione
        auth.onAuthStateChanged((user) => {
            if (user) {
                log('Utente autenticato:', user.email);
            } else {
                log('Nessun utente autenticato');
            }
        });

        return true;
    } catch (error) {
        log('ERRORE inizializzazione Firebase:', error);
        return false;
    }
}

// =====================================================
// AUTHENTICATION WITH FIREBASE
// =====================================================

/**
 * Check se l'utente è loggato (Firebase)
 */
function isUserLoggedIn() {
    return auth && auth.currentUser !== null;
}

/**
 * Ottieni dati utente loggato (Firebase)
 */
function getCurrentUser() {
    if (!auth || !auth.currentUser) return null;

    return {
        uid: auth.currentUser.uid,
        email: auth.currentUser.email,
        displayName: auth.currentUser.displayName || auth.currentUser.email.split('@')[0]
    };
}

/**
 * Login con Firebase Authentication
 */
async function loginUser(email, password) {
    try {
        log('Tentativo di login con Firebase...');
        const userCredential = await auth.signInWithEmailAndPassword(email, password);
        const user = userCredential.user;

        log('Login Firebase riuscito:', user.email);

        return {
            uid: user.uid,
            email: user.email,
            displayName: user.displayName || user.email.split('@')[0]
        };
    } catch (error) {
        log('Errore login Firebase:', error.code, error.message);

        // Traduci errori Firebase in italiano
        let errorMessage = 'Errore durante il login';
        if (error.code === 'auth/user-not-found') {
            errorMessage = 'Utente non trovato. Registrati prima.';
        } else if (error.code === 'auth/wrong-password') {
            errorMessage = 'Password errata.';
        } else if (error.code === 'auth/invalid-email') {
            errorMessage = 'Email non valida.';
        } else if (error.code === 'auth/too-many-requests') {
            errorMessage = 'Troppi tentativi. Riprova più tardi.';
        }

        throw new Error(errorMessage);
    }
}

/**
 * Logout (Firebase)
 */
async function logoutUser() {
    try {
        await auth.signOut();
        log('Logout completato');
        window.location.href = 'index.html';
    } catch (error) {
        log('Errore logout:', error);
        alert('Errore durante il logout');
    }
}

/**
 * Registrazione con Firebase Authentication
 */
async function registerUser(email, password, name) {
    try {
        log('Tentativo di registrazione con Firebase...');

        // Crea l'utente in Firebase Auth
        const userCredential = await auth.createUserWithEmailAndPassword(email, password);
        const user = userCredential.user;

        log('Utente creato in Firebase Auth:', user.uid);

        // Aggiorna il profilo con il nome
        await user.updateProfile({
            displayName: name
        });

        log('Profilo aggiornato con displayName:', name);

        // Salva dati utente in Firestore
        await db.collection('users').doc(user.uid).set({
            email: email,
            displayName: name,
            role: 'player', // default role
            createdAt: firebase.firestore.FieldValue.serverTimestamp(),
            characters: []
        });

        log('Dati utente salvati in Firestore');

        return {
            uid: user.uid,
            email: user.email,
            displayName: name
        };
    } catch (error) {
        log('Errore registrazione Firebase:', error.code, error.message);

        // Traduci errori Firebase in italiano
        let errorMessage = 'Errore durante la registrazione';
        if (error.code === 'auth/email-already-in-use') {
            errorMessage = 'Questa email è già registrata. Fai il login.';
        } else if (error.code === 'auth/invalid-email') {
            errorMessage = 'Email non valida.';
        } else if (error.code === 'auth/weak-password') {
            errorMessage = 'La password deve essere di almeno 6 caratteri.';
        }

        throw new Error(errorMessage);
    }
}

// =====================================================
// ADVENTURES FUNCTIONS
// =====================================================

/**
 * Carica lista di avventure da Firestore
 */
async function loadAdventures() {
    const container = document.querySelector('.adventures-grid');
    if (!container) return;

    renderLoading(container, 'Caricamento avventure...');

    try {
        // Prova a caricare da Firestore
        const snapshot = await db.collection('oneshots').orderBy('createdAt', 'desc').get();

        if (snapshot.empty) {
            log('Nessuna avventura in Firestore, uso dati di esempio');
            // Usa dati di esempio
            allAdventuresData = adventures;
            renderAdventures(allAdventuresData);
        } else {
            const firestoreAdventures = [];
            snapshot.forEach(doc => {
                const data = doc.data() || {};
                // keep both docId (firestore document id) and id (possible legacy numeric/string id)
                firestoreAdventures.push({
                    docId: doc.id,
                    id: data.id || doc.id,
                    ...data
                });
            });
            allAdventuresData = firestoreAdventures;
            log('Avventure caricate da Firestore:', firestoreAdventures.length);
            renderAdventures(firestoreAdventures);
        }
    } catch (error) {
        log('Errore caricamento avventure da Firestore, uso dati di esempio:', error);
        renderAdventures(adventures);
    }
}

/**
 * Renderizza le avventure nel DOM
 */
function renderAdventures(adventuresList) {
    const container = document.querySelector('.adventures-grid');
    if (!container) return;

    container.innerHTML = '';

    if (adventuresList.length === 0) {
        container.innerHTML = '<p style="grid-column: 1/-1; text-align: center;">Nessuna avventura disponibile al momento.</p>';
        return;
    }

    adventuresList.forEach(adventure => {
        const card = document.createElement('div');
        card.className = 'adventure-card';
        // If the document has a direct driveUrl, expose a small download link on the card
        const quickDownload = adventure.driveUrl || adventure.driveFileId || adventure.fileId ?
            `<a href="${buildDriveLink(adventure.driveUrl || adventure.driveFileId || adventure.fileId)}" class="btn-secondary" target="_blank" rel="noopener">📥 Scarica Documentazione</a>` : '';

        card.innerHTML = `
            <h3>${adventure.title}</h3>
            <p class="adventure-meta">Livello ${adventure.level} • Durata ${adventure.duration}</p>
            <p>${adventure.description}</p>
            <a href="one-shots.html?id=${encodeURIComponent(adventure.docId || adventure.id)}" class="btn-secondary">Leggi di più</a>
            ${quickDownload}
        `;
        container.appendChild(card);
    });

    log('Avventure renderizzate:', adventuresList.length);
}

/**
 * Ottieni dettaglio di un'avventura per ID.
 * Cerca prima nella cache `allAdventuresData` (caricata da Firestore),
 * poi nel fallback `adventures` array. Supporta sia id numerici che stringhe
 * (Firestore doc ids).
 */
function getAdventureById(id) {
    if (!id) return null;
    const decoded = decodeURIComponent(id);

    // Try exact match on cached Firestore docId first, then on stored id field
    let found = allAdventuresData.find(a => String(a.docId || a.id) === String(decoded));
    if (found) return found;

    // Try match by numeric id in fallback data
    const numeric = parseInt(decoded);
    if (!isNaN(numeric)) {
        found = allAdventuresData.find(a => parseInt(a.id) === numeric || parseInt(a.docId) === numeric);
        if (found) return found;

        // fallback sample data
        return adventures.find(a => a.id === numeric) || null;
    }

    // Last resort: search sample adventures by string id
    return adventures.find(a => String(a.id) === String(decoded)) || null;
}

// =====================================================
// PAGE LOGIC
// =====================================================

/**
 * Inizializza HomePage
 */
function initHomePage() {
    log('Inizializzazione HomePage');
    loadAdventures();
}

/**
 * Inizializza pagina One-Shots
 */
async function initOneShots() {
    log('Inizializzazione pagina One-Shots');

    // Controlla se c'è un ID specifico nell'URL
    const params = new URLSearchParams(window.location.search);
    const adventureId = params.get('id');

    const container = document.querySelector('.adventures-grid');
    if (!container) return;

    if (adventureId) {
        // Try to get from cached adventures; if not present, fetch single doc from Firestore
        let adventure = getAdventureById(adventureId);

        if (!adventure) {
            try {
                // First try by document ID
                const doc = await db.collection('oneshots').doc(decodeURIComponent(adventureId)).get();
                if (doc.exists) {
                    adventure = { id: doc.id, ...doc.data() };
                } else {
                    // Fallback: some installs store a numeric/string `id` field inside the doc.
                    // Try a query by that field (legacyId support).
                    const decoded = decodeURIComponent(adventureId);
                    let q = await db.collection('oneshots').where('id', '==', decoded).limit(1).get();
                    if (q.empty) {
                        const numeric = parseInt(decoded);
                        if (!isNaN(numeric)) {
                            q = await db.collection('oneshots').where('id', '==', numeric).limit(1).get();
                        }
                    }
                    if (!q.empty) {
                        const d = q.docs[0];
                        adventure = { id: d.id, ...d.data() };
                    }
                }
            } catch (err) {
                log('Errore recupero one-shot singolo da Firestore:', err);
            }
        }

        if (adventure) {
            log('One-shot trovato per dettaglio:', adventure);
            // Build character sheets links from adventure data if available
            let sheetsHTML = '';

            // Common fields: driveUrl / driveFileId / fileId
            if (adventure.driveUrl || adventure.driveFileId || adventure.fileId) {
                const link = buildDriveLink(adventure.driveUrl || adventure.driveFileId || adventure.fileId);
                if (link) sheetsHTML = `<p><b>Schede personaggi:</b> <a href="${link}" target="_blank" rel="noopener">Scarica</a></p>`;
            }

            // If there is a `sheets` array, render each
            if (Array.isArray(adventure.sheets) && adventure.sheets.length > 0) {
                const items = adventure.sheets.map(s => {
                    const l = buildDriveLink(s.driveUrl || s.driveFileId || s.fileId);
                    return `<li>${s.title || 'Scheda'}${l ? ` - <a href="${l}" target="_blank" rel="noopener">Scarica</a>` : ''}</li>`;
                }).join('');
                sheetsHTML = `<p><b>Schede personaggi:</b></p><ul>${items}</ul>`;
            }

            // If there is a top-level driveUrl/driveFileId, always show a primary link
            const rawDrive = adventure.driveUrl || adventure.driveFileId || adventure.fileId || null;
            let primaryDriveLink = null;
            if (rawDrive) {
                primaryDriveLink = buildDriveLink(rawDrive) || rawDrive;
            }

            if (!sheetsHTML) {
                sheetsHTML = '<p style="color:#666;"><em>Nessuna scheda di personaggio disponibile per il download in questo documento.</em></p>';
            }

            if (!primaryDriveLink) {
                log('Nessun link Drive trovato per questa one-shot:', adventure);
            }

            container.innerHTML = `
                <div style="grid-column: 1 / -1;">
                    <h2>${adventure.title || 'One-shot'}</h2>
                    <p><strong>Livello:</strong> ${adventure.level || '—'}</p>
                    <p><strong>Durata:</strong> ${adventure.duration || '—'}</p>
                    <p>${adventure.description || ''}</p>
                    ${primaryDriveLink ? `<p><a href="${primaryDriveLink}" class="btn-secondary" target="_blank" rel="noopener">📥 Scarica documentazione</a></p>` : ''}
                    ${sheetsHTML}
                    <a href="one-shots.html" class="btn-secondary">← Torna alla lista</a>
                </div>
            `;
        } else {
            container.innerHTML = '<p style="text-align:center; padding:1rem;">One-shot non trovata.</p>';
        }
    } else {
        loadAdventures();
    }
}

/**
 * Inizializza pagina Login
 */
function initLoginPage() {
    log('Inizializzazione pagina Login');

    // Se già loggato, reindirizza a dashboard
    if (isUserLoggedIn()) {
        log('Utente già loggato, reindirizzo a dashboard');
        window.location.href = 'dashboard.html';
        return;
    }

    const loginForm = document.getElementById('loginForm');
    const registerForm = document.getElementById('registerForm');

    log('Form trovati - Login:', !!loginForm, 'Register:', !!registerForm);

    if (loginForm) {
        log('Collegamento evento submit al loginForm');
        loginForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            log('Submit del form di login intercettato');

            const email = document.getElementById('loginEmail').value;
            const password = document.getElementById('loginPassword').value;

            log('Dati login:', { email, password: password ? '***' : 'vuoto' });

            if (email && password) {
                try {
                    await loginUser(email, password);
                    log('Login completato con successo');
                    alert('Login effettuato! Benvenuto.');
                    window.location.href = 'dashboard.html';
                } catch (error) {
                    log('Errore durante il login:', error);
                    alert(error.message || 'Errore durante il login. Controlla la console.');
                }
            } else {
                alert('Per favore inserisci email e password');
            }
        });
    } else {
        log('ERRORE: loginForm non trovato!');
    }

    if (registerForm) {
        log('Collegamento evento submit al registerForm');
        registerForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            log('Submit del form di registrazione intercettato');

            const email = document.getElementById('registerEmail').value;
            const password = document.getElementById('registerPassword').value;
            const name = document.getElementById('registerName').value;

            log('Dati registrazione:', { email, name, password: password ? '***' : 'vuoto' });

            if (email && password && name) {
                try {
                    await registerUser(email, password, name);
                    log('Registrazione completata con successo');
                    alert('Registrazione effettuata! Benvenuto nella comunità.');
                    window.location.href = 'dashboard.html';
                } catch (error) {
                    log('Errore durante la registrazione:', error);
                    alert(error.message || 'Errore durante la registrazione. Controlla la console.');
                }
            } else {
                alert('Per favore compila tutti i campi');
            }
        });
    } else {
        log('ERRORE: registerForm non trovato!');
    }

    log('Inizializzazione login completata');
}

/**
 * Inizializza pagina Dashboard
 */
/** Inizializza pagina Dashboard CON WAIT sull'autenticazione */
function initDashboard() {
    log('Inizializzazione Dashboard');

    // Mostra “Caricamento...” fino a che non abbiamo informazioni certe
    const userInfo = document.querySelector('.user-info');
    if (userInfo) userInfo.innerHTML = "<h3>Caricamento profilo...</h3>";
    // Use onAuthStateChanged to wait until Firebase finishes restoring the session
    auth.onAuthStateChanged(async function (user) {
        if (!user) {
            // Non autenticato, reindirizza a login
            log('Utente NON autenticato, torno su login');
            window.location.href = 'login.html';
            return;
        }

        log('Utente autenticato:', user.email);

        // Show basic user info
        if (userInfo) {
            userInfo.innerHTML = `
                <h3>Benvenuto, ${user.displayName || user.email.split('@')[0]}!</h3>
                <p>Email: ${user.email}</p>
                <p>Ultimo accesso: ${new Date(user.metadata.lastSignInTime).toLocaleString('it-IT')}</p>
            `;
        }

        // Fetch user profile from Firestore to get the role and other metadata
        try {
            const userDoc = await db.collection('users').doc(user.uid).get();
            const profile = userDoc.exists ? userDoc.data() : { role: 'player', displayName: user.displayName };
            const role = profile.role || 'player';

            log('Profilo utente caricato da Firestore:', { uid: user.uid, role });

            // Render UI based on role
            renderRoleUI(role, user.uid);

            // Load default sections
            loadCharacters();
            loadSessions();
            loadMessages();

            // Role-specific data
            if (role === 'master' || role === 'admin') {
                loadNPCs();
                loadAllSheets();
            }

            // Load documents section for all roles (will filter inside)
            loadDocuments();

            if (role === 'admin') {
                loadAllUsers();
            }

        } catch (err) {
            log('Errore caricamento profilo utente:', err);
            // Fallback: treat as player
            renderRoleUI('player', user.uid);
            loadCharacters();
            loadMessages();
        }
    });
}

/**
 * Mostra/nasconde sezioni della dashboard in base al ruolo
 */
function renderRoleUI(role, uid) {
    log('Renderizzazione UI per ruolo:', role);

    const npcSection = document.getElementById('npc-section');
    const allSheetsSection = document.getElementById('all-sheets-section');
    const adminPanel = document.getElementById('admin-panel');

    // Reset
    if (npcSection) npcSection.style.display = 'none';
    if (allSheetsSection) allSheetsSection.style.display = 'none';
    if (adminPanel) adminPanel.style.display = 'none';

    if (role === 'player') {
        // Players only see their character grid and adventures (default)
        log('Utente PLAYER: mostro solo le schede personali');
    } else if (role === 'master') {
        // Masters see NPCs and all sheets
        if (npcSection) npcSection.style.display = 'block';
        if (allSheetsSection) allSheetsSection.style.display = 'block';
        log('Utente MASTER: mostro NPC e tutte le schede');
    } else if (role === 'admin') {
        // Admins see everything, including admin panel
        if (npcSection) npcSection.style.display = 'block';
        if (allSheetsSection) allSheetsSection.style.display = 'block';
        if (adminPanel) adminPanel.style.display = 'block';
        log('Utente ADMIN: mostro tutte le funzionalità');
    }
}

/**
 * Carica NPC - esempio (sostituire con chiamata Firestore se disponibile)
 */
const _userProfileCache = {};

async function fetchUserProfile(uid) {
    if (!uid) return null;
    if (_userProfileCache[uid]) return _userProfileCache[uid];
    try {
        const doc = await db.collection('users').doc(uid).get();
        if (!doc.exists) return null;
        const data = doc.data();
        _userProfileCache[uid] = data;
        return data;
    } catch (err) {
        log('Errore fetchUserProfile:', err);
        return null;
    }
}


///**
// * Carica NPC da Firestore. Solo master/admin possono vedere gli NPC.
// */
//async function loadNPCs() {
//    const container = document.getElementById('npc-grid');
//    if (!container) return;

//    renderLoading(container, 'Caricamento NPC...');

//    const current = auth.currentUser;
//    if (!current) {
//        container.innerHTML = '<p>Utente non autenticato</p>';
//        return;
//    }

//    try {
//        const profileDoc = await db.collection('users').doc(current.uid).get();
//        const role = profileDoc.exists ? (profileDoc.data().role || 'player') : 'player';

//        if (!(role === 'master' || role === 'admin')) {
//            container.innerHTML = '<p>Accesso negato agli NPC</p>';
//            return;
//        }

//        const snapshot = await db.collection('npcs').orderBy('name', 'desc').get();

//        if (snapshot.empty) {
//            container.innerHTML = '<p>Nessun NPC presente.</p>';
//            return;
//        }

//        container.innerHTML = '';
//        snapshot.forEach(doc => {
//            const npc = doc.data();
//            const el = document.createElement('div');
//            el.className = 'character-card';
//            el.innerHTML = `
//                <h4>${npc.name || 'NPC senza nome'}</h4>
//                <p><b>Classe:</b> ${npc.class || '—'}</p>
//                <p><b>Stirpe:</b> ${npc.ancestry || '—'}</p>
//                <p><b>Livello:</b> ${npc.level || '—'}</p>
//                <p><b>Note:</b> ${npc.desc || ''}</p>
//                <p><b>Scheda:</b> <a href="${npc.driveUrl || ''}" target="_blank">clicca</a></p>
//            `;
//            container.appendChild(el);
//        });

//    } catch (err) {
//        log('Errore caricamento NPC da Firestore:', err);
//        container.innerHTML = '<p>Errore caricamento NPC</p>';
//    }
//}


/**
 * Variabili globali per il filtro e i preferiti
 */
let allNPCsData = []; // Mantiene una copia di tutti gli NPC
let favoriteNPCs = new Set(); // Set di ID preferiti
let showOnlyFavorites = false; // Flag per mostrare solo preferiti

/**
 * Carica i preferiti dal localStorage
 */
function loadFavorites() {
    const saved = localStorage.getItem('npc-favorites');
    if (saved) {
        try {
            const array = JSON.parse(saved);
            favoriteNPCs = new Set(array);
        } catch (e) {
            console.error('Errore caricamento preferiti:', e);
            favoriteNPCs = new Set();
        }
    }
}

/**
 * Salva i preferiti nel localStorage
 */
function saveFavorites() {
    localStorage.setItem('npc-favorites', JSON.stringify([...favoriteNPCs]));
}

/**
 * Aggiunge o rimuove un NPC dai preferiti
 */
function toggleFavorite(npcId) {
    if (favoriteNPCs.has(npcId)) {
        favoriteNPCs.delete(npcId);
    } else {
        favoriteNPCs.add(npcId);
    }
    saveFavorites();

    // Aggiorna la visualizzazione
    filterNPCs();
}

/**
 * Carica NPC da Firestore e li renderizza come stat block Pathfinder 2e
 * Supporta filtri, ricerca e preferiti
 */
async function loadNPCs() {
    const container = document.getElementById('npc-grid');
    if (!container) return;

    // Carica i preferiti
    loadFavorites();

    renderLoading(container, 'Caricamento NPC...');

    const current = auth.currentUser;
    if (!current) {
        container.innerHTML = '<p>Utente non autenticato</p>';
        return;
    }

    try {
        // Verifica ruolo utente
        const profileDoc = await db.collection('users').doc(current.uid).get();
        const role = profileDoc.exists ? (profileDoc.data().role || 'player') : 'player';

        if (!(role === 'master' || role === 'admin')) {
            container.innerHTML = '<p>Accesso negato agli NPC</p>';
            return;
        }

        // Carica NPC da Firestore
        const snapshot = await db.collection('npcs').orderBy('name', 'asc').get();

        if (snapshot.empty) {
            container.innerHTML = '<p style="text-align: center; padding: 2rem;">Nessun NPC presente. Gli stat block appariranno qui quando verranno aggiunti.</p>';
            return;
        }

        // Salva i dati per il filtro
        allNPCsData = [];
        snapshot.forEach(doc => {
            allNPCsData.push({
                id: doc.id,
                ...doc.data()
            });
        });

        // Inizializza i controlli di filtro
        initializeNPCFilters(container);

        // Renderizza gli NPC
        renderNPCsWithFilters(allNPCsData, container);

        log('NPC caricati e renderizzati:', snapshot.size);

    } catch (err) {
        log('Errore caricamento NPC da Firestore:', err);
        container.innerHTML = `<p style="color: red; text-align: center;">Errore caricamento NPC: ${err.message}</p>`;
    }
}

/**
 * Inizializza i controlli di filtro e ricerca
 */
function initializeNPCFilters(container) {
    const parent = container.parentElement;

    // Rimuovi i filtri precedenti se esistono
    const existingControls = parent.querySelector('.npc-controls');
    if (existingControls) {
        existingControls.remove();
    }

    // Estrai valori unici dai dati
    const levels = [...new Set(allNPCsData.map(npc => npc.level))].sort((a, b) => parseInt(a) - parseInt(b));

    const alignments = [...new Set(allNPCsData.map(npc => {
        const traits = (npc.traits || '').split(',');
        return traits.find(t => ['ne', 'le', 'ce', 'ng', 'n', 'cg', 'ln', 'lg', 'cn'].includes(t.trim().toLowerCase())) || '';
    }).filter(x => x))];

    const types = [...new Set(allNPCsData.map(npc => {
        const traits = (npc.traits || '').split(',');
        return traits.find(t => ['humanoid', 'beast', 'construct', 'dragon', 'fey', 'undead', 'aberration', 'elemental', 'plant', 'ooze'].includes(t.trim().toLowerCase())) || '';
    }).filter(x => x))];

    const groups = [...new Set(allNPCsData.map(npc => npc.group).filter(g => g))].sort();

    // Crea il container dei controlli
    const controlsDiv = document.createElement('div');
    controlsDiv.className = 'npc-controls';

    controlsDiv.innerHTML = `
    <div class="npc-search-container">
      <input 
        type="text" 
        id="npc-search" 
        class="npc-search-input" 
        placeholder="🔍 Cerca per nome NPC..."
      >
    </div>
    
    <select id="npc-level-filter" class="npc-filter-select">
      <option value="">Tutti i Livelli</option>
      ${levels.map(level => `<option value="${level}">Livello ${level}</option>`).join('')}
    </select>
    
    <select id="npc-alignment-filter" class="npc-filter-select">
      <option value="">Allineamento</option>
      ${alignments.map(align => `<option value="${align.toUpperCase()}">${align.toUpperCase()}</option>`).join('')}
    </select>
    
    <select id="npc-type-filter" class="npc-filter-select">
      <option value="">Tipo Creatura</option>
      ${types.map(type => `<option value="${type.toLowerCase()}">${type.charAt(0).toUpperCase() + type.slice(1)}</option>`).join('')}
    </select>
    
    <select id="npc-group-filter" class="npc-filter-select">
      <option value="">Tutti i Gruppi</option>
      ${groups.map(group => `<option value="${group}">${group}</option>`).join('')}
    </select>
    
    <button id="npc-clear-btn" class="npc-clear-filters">Resetta</button>
  `;

    parent.insertBefore(controlsDiv, container);

    // Aggiungi gli event listener
    document.getElementById('npc-search').addEventListener('input', () => filterNPCs());
    document.getElementById('npc-level-filter').addEventListener('change', () => filterNPCs());
    document.getElementById('npc-alignment-filter').addEventListener('change', () => filterNPCs());
    document.getElementById('npc-type-filter').addEventListener('change', () => filterNPCs());
    document.getElementById('npc-group-filter').addEventListener('change', () => filterNPCs());

    document.getElementById('npc-clear-btn').addEventListener('click', () => {
        document.getElementById('npc-search').value = '';
        document.getElementById('npc-level-filter').value = '';
        document.getElementById('npc-alignment-filter').value = '';
        document.getElementById('npc-type-filter').value = '';
        document.getElementById('npc-group-filter').value = '';
        showOnlyFavorites = false;
        filterNPCs();
    });
}

/**
 * Filtra gli NPC in base ai criteri selezionati
 */
function filterNPCs() {
    const searchValue = document.getElementById('npc-search')?.value.toLowerCase() || '';
    const levelValue = document.getElementById('npc-level-filter')?.value || '';
    const alignmentValue = document.getElementById('npc-alignment-filter')?.value || '';
    const typeValue = document.getElementById('npc-type-filter')?.value || '';
    const groupValue = document.getElementById('npc-group-filter')?.value || '';

    const filtered = allNPCsData.filter(npc => {
        // Filtro preferiti
        if (showOnlyFavorites && !favoriteNPCs.has(npc.id)) {
            return false;
        }

        // Filtro ricerca per nome
        const matchSearch = searchValue === '' || npc.name.toLowerCase().includes(searchValue);

        // Filtro per livello
        const matchLevel = levelValue === '' || npc.level === levelValue;

        // Filtro per allineamento
        const traits = (npc.traits || '').split(',').map(t => t.trim().toLowerCase());
        const matchAlignment = alignmentValue === '' || traits.includes(alignmentValue.toLowerCase());

        // Filtro per tipo
        const matchType = typeValue === '' || traits.includes(typeValue.toLowerCase());

        // Filtro per gruppo
        const matchGroup = groupValue === '' || npc.group === groupValue;

        return matchSearch && matchLevel && matchAlignment && matchType && matchGroup;
    });

    const container = document.getElementById('npc-grid');
    renderNPCsWithFilters(filtered, container);

    // Aggiorna info risultati
    updateResultsInfo(filtered.length, allNPCsData.length);
}

/**
 * Aggiorna le informazioni sui risultati
 */
function updateResultsInfo(results, total) {
    let infoDiv = document.querySelector('.npc-results-info');

    if (!infoDiv) {
        infoDiv = document.createElement('div');
        infoDiv.className = 'npc-results-info';
        document.querySelector('.npc-controls').parentElement.insertBefore(infoDiv, document.getElementById('npc-grid'));
    }

    let infoText = '';
    if (results === 0) {
        infoText = `<strong>Nessun NPC trovato</strong> - Prova a cambiare i filtri`;
    } else if (results === total) {
        infoText = `<strong>${results}</strong> NPC trovati`;
    } else {
        infoText = `<strong>${results}</strong> di <strong>${total}</strong> NPC corrispondono ai filtri`;
    }

    const favCount = favoriteNPCs.size;
    const favButton = `<button class="npc-favorites-toggle ${showOnlyFavorites ? 'active' : ''}" onclick="toggleFavoritesView()">
    ⭐ ${showOnlyFavorites ? 'Tutti gli NPC' : 'Solo Preferiti'} ${favCount > 0 ? `(${favCount})` : ''}
  </button>`;

    infoDiv.innerHTML = `
    <span>${infoText}</span>
    ${favCount > 0 ? favButton : ''}
  `;
}

/**
 * Toggle vista solo preferiti
 */
function toggleFavoritesView() {
    showOnlyFavorites = !showOnlyFavorites;
    filterNPCs();
}

/**
 * Renderizza gli NPC filtrati
 */
function renderNPCsWithFilters(npcsToRender, container) {
    container.innerHTML = '';

    if (npcsToRender.length === 0) {
        const noResults = document.createElement('div');
        noResults.className = 'npc-no-results';

        if (showOnlyFavorites && favoriteNPCs.size === 0) {
            noResults.innerHTML = `
        <h3>⭐ Nessun preferito ancora</h3>
        <p>Clicca sulla stella in alto a destra di uno stat block per aggiungerlo ai preferiti!</p>
      `;
        } else {
            noResults.innerHTML = `
        <h3>😔 Nessun NPC trovato</h3>
        <p>Prova ad aggiustare i criteri di ricerca o i filtri</p>
      `;
        }
        container.appendChild(noResults);
        return;
    }

    npcsToRender.forEach(npc => {
        if (npc.body) {
            renderStatBlock(container, npc);
        } else {
            renderLegacyNPC(container, npc);
        }
    });
}

/**
 * Renderizza un NPC in formato stat block Pathfinder 2e completo
 */
function renderStatBlock(container, npc) {
    const statBlock = document.createElement('div');
    statBlock.className = 'stat-block';

    const isFavorite = favoriteNPCs.has(npc.id);

    // Parse traits
    const traits = (npc.traits || '').split(',').map(t => t.trim()).filter(t => t);
    const traitsHTML = traits.map(trait => {
        let traitClass = 'trait-badge';

        if (['ne', 'le', 'ce', 'ng', 'n', 'cg', 'ln', 'lg', 'cn'].includes(trait.toLowerCase())) {
            traitClass += ' alignment-' + trait.toLowerCase();
        } else if (['tiny', 'small', 'medium', 'large', 'huge', 'gargantuan'].includes(trait.toLowerCase())) {
            traitClass += ' size';
        } else if (['humanoid', 'beast', 'construct', 'dragon', 'fey', 'undead', 'aberration', 'elemental', 'plant', 'ooze'].includes(trait.toLowerCase())) {
            traitClass += ' type';
        } else {
            traitClass += ' subtype';
        }

        return `<span class="${traitClass}">${trait.toUpperCase()}</span>`;
    }).join('');

    // Parse del body
    const bodyLines = (npc.body || '').split('\n').filter(line => line.trim());
    let topSection = [];
    let middleSection = [];
    let bottomSection = [];
    let currentSection = topSection;

    bodyLines.forEach(line => {
        if (line.trim() === '-') {
            if (currentSection === topSection) {
                currentSection = middleSection;
            } else if (currentSection === middleSection) {
                currentSection = bottomSection;
            }
        } else {
            currentSection.push(line);
        }
    });

    const formatActionSymbols = (text) => {
        return text
            .replace(/\(a\)/g, '<span class="action-icon">◆</span>')
            .replace(/\(aa\)/g, '<span class="action-icon">◆◆</span>')
            .replace(/\(aaa\)/g, '<span class="action-icon">◆◆◆</span>')
            .replace(/\(r\)/g, '<span class="action-icon">↻</span>')
            .replace(/\(f\)/g, '<span class="action-icon">⚡</span>');
    };

    const formatSection = (lines) => {
        return lines.map(line => {
            const formatted = formatActionSymbols(line);
            return `<p class="stat-line">${formatted}</p>`;
        }).join('');
    };

    statBlock.innerHTML = `
    <button class="npc-favorite-btn ${isFavorite ? 'is-favorite' : ''}" 
            onclick="toggleFavorite('${npc.id}')" 
            title="${isFavorite ? 'Rimuovi dai preferiti' : 'Aggiungi ai preferiti'}">
      ${isFavorite ? '⭐' : '☆'}
    </button>
    
    <div class="stat-block-header">
      <h3>${npc.name || 'NPC senza nome'}</h3>
      <span class="stat-block-level">Creature ${npc.level || '?'}</span>
    </div>
    
    ${traits.length > 0 ? `
    <div class="stat-block-traits">
      ${traitsHTML}
      ${npc.group ? `<span class="stat-block-group-badge">📋 ${npc.group}</span>` : ''}
    </div>
    ` : ''}
    
    <div class="stat-block-body">
      <div class="stat-block-section">
        ${formatSection(topSection)}
      </div>
      
      ${middleSection.length > 0 ? `
        <hr class="stat-block-separator">
        <div class="stat-block-section">
          ${formatSection(middleSection)}
        </div>
      ` : ''}
      
      ${bottomSection.length > 0 ? `
        <hr class="stat-block-separator">
        <div class="stat-block-section">
          ${formatSection(bottomSection)}
        </div>
      ` : ''}
    </div>
  `;

    container.appendChild(statBlock);
}

/**
 * Renderizza un NPC in formato legacy
 */
function renderLegacyNPC(container, npc) {
    const card = document.createElement('div');
    card.className = 'character-card';

    const isFavorite = favoriteNPCs.has(npc.id);

    card.innerHTML = `
    <button class="npc-favorite-btn ${isFavorite ? 'is-favorite' : ''}" 
            onclick="toggleFavorite('${npc.id}')" 
            title="${isFavorite ? 'Rimuovi dai preferiti' : 'Aggiungi ai preferiti'}">
      ${isFavorite ? '⭐' : '☆'}
    </button>
    
    <h4>${npc.name || 'NPC senza nome'}</h4>
    <p><b>Classe:</b> ${npc.class || '—'}</p>
    <p><b>Stirpe:</b> ${npc.ancestry || '—'}</p>
    <p><b>Livello:</b> ${npc.level || '—'}</p>
    ${npc.group ? `<p><b>Gruppo:</b> ${npc.group}</p>` : ''}
    <p><b>Note:</b> ${npc.desc || ''}</p>
    ${npc.driveUrl ? `<p><b>Scheda:</b> <a href="${npc.driveUrl}" target="_blank">clicca</a></p>` : ''}
    <p style="margin-top: 1rem; padding: 0.5rem; background: #fff3cd; border-radius: 4px; font-size: 0.85rem;">
      <em>Nota: Questo NPC usa il formato legacy. Per visualizzarlo come stat block, aggiorna i dati su Firestore.</em>
    </p>
  `;
    container.appendChild(card);
}


/**
 * Carica tutte le schede (master/admin) - esempio
 */
async function loadAllSheets() {
    const container = document.getElementById('all-sheets-grid');
    if (!container) return;
    renderLoading(container, 'Caricamento schede...');

    const current = auth.currentUser;
    if (!current) {
        container.innerHTML = '<p>Utente non autenticato</p>';
        return;
    }

    try {
        const profileDoc = await db.collection('users').doc(current.uid).get();
        const role = profileDoc.exists ? (profileDoc.data().role || 'player') : 'player';

        let query;
        if (role === 'player') {
            // Players only see their own characters
            query = db.collection('characters').where('owner', '==', current.uid).orderBy('name', 'desc');
        } else {
            // Masters and Admins see all characters
            query = db.collection('characters').orderBy('name', 'desc');
        }

        const snapshot = await query.get();

        if (snapshot.empty) {
            container.innerHTML = '<p>Nessuna scheda trovata.</p>';
            return;
        }

        container.innerHTML = '';

        // For name resolution of owners, use cache
        for (const doc of snapshot.docs) {
            const ch = doc.data();
            let ownerLabel = ch.ownerDisplayName || ch.ownerEmail || ch.owner || '—';

            if (ch.owner && !ch.ownerDisplayName && typeof ch.owner === 'string' && ch.owner.length > 10) {
                // likely a uid - try to fetch profile
                const ownerProfile = await fetchUserProfile(ch.owner);
                if (ownerProfile) ownerLabel = ownerProfile.displayName || ownerProfile.email || ch.owner;
            }

            const el = document.createElement('div');
            el.className = 'character-card';
            el.innerHTML = `
                <h4>${ch.name || 'personaggio senza nome'}</h4>
                <p><b>Classe:</b> ${ch.class || '—'}</p>
                <p><b>Stirpe:</b> ${ch.ancestry || '—'}</p>
                <p><b>Livello:</b> ${ch.level || '—'}</p>
                <p><b>Note:</b> ${ch.desc || ''}</p>
                <p><b>Scheda:</b> <a href="${ch.driveUrl || ''}" target="_blank">clicca</a></p>
            `;
            container.appendChild(el);
        }

    } catch (err) {
        log('Errore caricamento schede da Firestore:', err);
        container.innerHTML = `<p>Errore caricamento schede: ${err && err.message ? err.message : 'errore sconosciuto'}</p>`;
    }
}

/**
 * Carica i documenti visibili all'utente in modo robusto.
 * Usa query separate per evitare errori di permessi sporadici.
 */
async function loadDocuments() {
    const container = document.getElementById('documents-grid');
    if (!container) return;

    renderLoading(container, 'Caricamento documenti...');

    const current = auth.currentUser;
    if (!current) {
        container.innerHTML = '<p>Utente non autenticato</p>';
        return;
    }

    try {
        // Ottieni il ruolo utente
        const profileDoc = await db.collection('users').doc(current.uid).get();
        const role = profileDoc.exists ? (profileDoc.data().role || 'player') : 'player';

        let visibleDocs = [];

        if (role === 'master' || role === 'admin') {
            // Master/admin: prova prima una query completa
            try {
                const snapshot = await db.collection('documents').orderBy('createdAt', 'desc').get();
                visibleDocs = snapshot.docs.map(d => ({ id: d.id, ...d.data() }));
                log('Documenti caricati (master/admin - query completa):', visibleDocs.length);
            } catch (err) {
                // Fallback: usa le stesse query filtrate dei player
                log('Query completa fallita per master/admin, uso query filtrate', err);
                visibleDocs = await loadDocumentsWithQueries(current.uid);
            }
        } else {
            // Player: usa sempre query separate e sicure
            visibleDocs = await loadDocumentsWithQueries(current.uid);
        }

        // Renderizza i risultati
        renderDocuments(visibleDocs, container);

    } catch (err) {
        log('Errore caricamento documenti:', err);
        showError(container, 'Errore caricamento documenti: ' + (err.message || 'Errore sconosciuto'));
    }
}

/**
 * Carica documenti usando query separate (sicuro per player e fallback per master/admin)
 */
async function loadDocumentsWithQueries(uid) {
    const queries = [];

    // Query 1: Documenti pubblici
    queries.push(
        db.collection('documents').where('visibility', '==', 'public').get()
    );

    // Query 2: Documenti di cui sono owner
    queries.push(
        db.collection('documents').where('owner', '==', uid).get()
    );

    // Query 3: Documenti in cui sono in allowedUids
    queries.push(
        db.collection('documents').where('allowedUids', 'array-contains', uid).get()
    );

    // Query 4-N: Documenti accessibili tramite i miei personaggi
    try {
        const charsSnap = await db.collection('characters').where('owner', '==', uid).get();
        const charIds = charsSnap.empty ? [] : charsSnap.docs.map(d => d.id);

        for (const cid of charIds) {
            queries.push(
                db.collection('documents').where('allowedCharacterIds', 'array-contains', cid).get()
            );
        }
    } catch (charErr) {
        log('Errore recupero personaggi per documenti:', charErr);
    }

    // Esegui tutte le query in parallelo
    const results = await Promise.allSettled(queries);

    // Raccogli tutti i documenti unici (deduplicazione per ID)
    const docsMap = new Map();

    results.forEach(result => {
        if (result.status === 'fulfilled' && result.value && !result.value.empty) {
            result.value.docs.forEach(doc => {
                if (!docsMap.has(doc.id)) {
                    docsMap.set(doc.id, { id: doc.id, ...doc.data() });
                }
            });
        } else if (result.status === 'rejected') {
            log('Una query documenti è fallita:', result.reason);
        }
    });

    // Converti in array e ordina per data di creazione
    const docs = Array.from(docsMap.values()).sort((a, b) => {
        const ta = a.createdAt ? (a.createdAt.toMillis ? a.createdAt.toMillis() : 0) : 0;
        const tb = b.createdAt ? (b.createdAt.toMillis ? b.createdAt.toMillis() : 0) : 0;
        return tb - ta;
    });

    log('Documenti caricati (query filtrate):', docs.length);
    return docs;
}

/**
 * Renderizza i documenti nel container
 */
function renderDocuments(docs, container) {
    if (!docs || docs.length === 0) {
        container.innerHTML = '<p style="text-align:center; padding:2rem;">📄 Nessun documento disponibile al momento.</p>';
        return;
    }

    container.innerHTML = '';

    docs.forEach(doc => {
        const el = document.createElement('div');
        el.className = 'character-card';

        const link = buildDriveLink(doc.driveUrl || doc.driveFileId || doc.fileId);

        let accessNote = '';
        if (doc.visibility && doc.visibility !== 'public') {
            const visibilityLabel = doc.visibility === 'private' ? '🔒 Privato' : `🔐 ${doc.visibility}`;
            accessNote = `<p style="font-size: 0.85rem; color: #666;"><strong>${visibilityLabel}</strong></p>`;
        }

        if (Array.isArray(doc.allowedUids) && doc.allowedUids.length > 0) {
            accessNote += `<p style="font-size: 0.85rem; color: #666;">👥 Condiviso con ${doc.allowedUids.length} ${doc.allowedUids.length === 1 ? 'giocatore' : 'giocatori'}</p>`;
        }

        el.innerHTML = `
      <h4>${doc.title || 'Documento senza titolo'}</h4>
      ${doc.desc ? `<p style="margin: 0.5rem 0; color: #555;">${doc.desc}</p>` : ''}
      ${accessNote}
      ${link
                ? `<a href="${link}" class="btn-secondary" target="_blank" rel="noopener">📂 Apri Documento</a>`
                : `<span class="btn-secondary" style="opacity:0.5; cursor: not-allowed;">Documento non disponibile</span>`
            }
    `;

        container.appendChild(el);
    });

    log('Documenti renderizzati:', docs.length);
}

/**
 * Admin: carica la lista di tutti gli utenti per gestione ruoli
 */
async function loadAllUsers() {
    const container = document.getElementById('users-list');
    if (!container) return;

    renderLoading(container, 'Caricamento utenti...');

    try {
        const snapshot = await db.collection('users').orderBy('displayName', 'asc').get();
        container.innerHTML = '';

        snapshot.forEach(doc => {
            const u = doc.data();
            const row = document.createElement('div');
            row.style.display = 'flex';
            row.style.alignItems = 'center';
            row.style.justifyContent = 'space-between';
            row.style.padding = '0.5rem 0';
            row.innerHTML = `
                <div>
                    <strong>${u.displayName || u.email}</strong> <br>
                    <small>${u.email}</small>
                </div>
                <div>
                    <select data-uid="${doc.id}" class="role-select">
                        <option value="player" ${u.role === 'player' ? 'selected' : ''}>Player</option>
                        <option value="master" ${u.role === 'master' ? 'selected' : ''}>Master</option>
                        <option value="admin" ${u.role === 'admin' ? 'selected' : ''}>Admin</option>
                    </select>
                </div>
            `;
            container.appendChild(row);
        });

        // Attach change handlers
        container.querySelectorAll('.role-select').forEach(sel => {
            sel.addEventListener('change', async (e) => {
                const newRole = e.target.value;
                const uid = e.target.getAttribute('data-uid');
                // show feedback: disable select while updating
                e.target.disabled = true;
                const original = e.target.value;
                try {
                    await changeUserRole(uid, newRole);
                } catch (_) {
                    // ignore - changeUserRole shows error
                } finally {
                    e.target.disabled = false;
                }
            });
        });

    } catch (err) {
        log('Errore caricamento utenti per admin:', err);
        container.innerHTML = `<p>Errore caricamento utenti: ${err && err.message ? err.message : 'errore sconosciuto'}</p>`;
    }
}

/**
 * Admin: cambia ruolo di un utente in Firestore
 */
async function changeUserRole(uid, newRole) {
    try {
        await db.collection('users').doc(uid).update({ role: newRole });
        log('Ruolo utente aggiornato:', { uid, newRole });
        alert('Ruolo aggiornato con successo');
        // refresh list
        loadAllUsers();
    } catch (err) {
        log('Errore aggiornamento ruolo utente:', err);
        alert('Errore aggiornamento ruolo: ' + err.message);
    }
}
async function postMessage(text) {
    const user = auth.currentUser;
    if (!user) return;

    await db.collection('messages').add({
        text: text.trim(),
        uid: user.uid,
        author: user.displayName || user.email.split('@')[0],
        createdAt: firebase.firestore.FieldValue.serverTimestamp()
    });
}

async function loadMessages() {
    const container = document.getElementById('messagesList');
    if (!container) return;
    renderLoading(container, 'Caricamento messaggi...');

    const snapshot = await db.collection('messages')
        .orderBy('createdAt', 'desc')
        .limit(20)
        .get();

    container.innerHTML = '';
    snapshot.forEach(doc => {
        const msg = doc.data();
        const date = msg.createdAt ? msg.createdAt.toDate().toLocaleString('it-IT') : '';
        container.innerHTML += `
            <div class="message-item">
                <strong>${msg.author}</strong> <span>${date}</span>
                <p>${msg.text}</p>
            </div>
        `;
    });
}

/**
 * Mostra un errore user-friendly nel container
 */
function showError(container, message) {
    if (typeof container === 'string') {
        container = document.querySelector(container);
    }

    if (!container) {
        console.error('Container non trovato per mostrare errore:', message);
        return;
    }

    container.innerHTML = `
    <div style="
      padding: 1.5rem; 
      background: #fee; 
      border: 2px solid #fcc; 
      border-radius: 8px; 
      text-align: center;
      color: #c33;
    ">
      <strong>⚠️ ${message}</strong>
      <p style="margin-top: 0.5rem; font-size: 0.9rem;">
        Prova a ricaricare la pagina. Se il problema persiste, contatta l'amministratore.
      </p>
    </div>
  `;
}

/**
 * Mostra un messaggio di successo
 */
function showSuccess(container, message) {
    if (typeof container === 'string') {
        container = document.querySelector(container);
    }

    if (!container) return;

    const successDiv = document.createElement('div');
    successDiv.style.cssText = `
    padding: 1rem; 
    background: #dfd; 
    border: 2px solid #9c9; 
    border-radius: 8px; 
    text-align: center;
    color: #363;
    margin-bottom: 1rem;
  `;
    successDiv.innerHTML = `<strong>✅ ${message}</strong>`;

    container.insertBefore(successDiv, container.firstChild);

    // Rimuovi dopo 3 secondi
    setTimeout(() => successDiv.remove(), 3000);
}



const messageForm = document.getElementById('messageForm');
if (messageForm) {
    messageForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const text = document.getElementById('messageText').value;
        if (!text.trim()) return;
        await postMessage(text);
        document.getElementById('messageText').value = '';
        loadMessages();
    });
}

/**
 * Carica personaggi della dashboard
 */
//async function loadCharacters() {
//const container = document.querySelector('.character-grid');
//if (!container) return;

//// Dati di esempio
//const characters = [
//    {
//        name: "Baldur Ironforge",
//        class: "Guerriero",
//        level: 5,
//        ancestry: "Nano"
//        , driveFileId: '1a2B3cExampleFileId'
//    },
//    {
//        name: "Sylvaria Moonwhisper",
//        class: "Maga",
//        level: 4,
//        ancestry: "Elfo"
//        , driveFileId: '1d4E5fExampleFileId'
//    },
//    {
//        name: "Thorne Swiftblade",
//        class: "Ladro",
//        level: 5,
//        ancestry: "Umano"
//        , driveFileId: '1g6H7iExampleFileId'
//    }
//];

//    container.innerHTML = '';

//    characters.forEach((char, index) => {
//        const card = document.createElement('div');
//        card.className = 'character-card';

//        const driveLink = buildDriveLink(char.driveUrl || char.driveFileId);

//        card.innerHTML = `
//            <h3>${char.name}</h3>
//            <div class="character-meta">
//                <p><strong>Classe:</strong> ${char.class}</p>
//                <p><strong>Livello:</strong> ${char.level}</p>
//                <p><strong>Stirpe:</strong> ${char.ancestry}</p>
//            </div>
//            ${driveLink ? `<a href="${driveLink}" class="btn-secondary" target="_blank" rel="noopener">Apri Scheda</a>` : `<a href="#" class="btn-secondary">Visualizza Scheda</a>`}
//        `;
//        container.appendChild(card);

//    });

//    log('Personaggi caricati:', characters.length);
//}

async function loadCharacters() {
    const container = document.querySelector('.character-grid');
    if (!container) return;

    renderLoading(container, 'Caricamento personaggi...');

    const current = auth.currentUser;
    if (!current) {
        container.innerHTML = '<p>Utente non autenticato</p>';
        return;
    }

    try {
        // Recupera il ruolo dell'utente
        const profileDoc = await db.collection('users').doc(current.uid).get();
        const role = profileDoc.exists ? (profileDoc.data().role || 'player') : 'player';

        let snapshot;
        if (role === 'player') {
            // I player vedono SOLO i propri personaggi
            snapshot = await db.collection('characters')
                .where('owner', '==', current.uid)
                .get();
        } else {
            // Master e Admin vedono tutti i personaggi
            snapshot = await db.collection('characters').get();
        }

        if (snapshot.empty) {
            container.innerHTML = '<p style="text-align: center; padding: 2rem;">Nessun personaggio trovato. Contatta il master per aggiungere il tuo personaggio.</p>';
            return;
        }

        // Ordina i risultati lato client per createdAt (dal più recente)
        const characters = snapshot.docs
            .map(doc => ({ id: doc.id, ...doc.data() }))
            .sort((a, b) => {
                const dateA = a.createdAt?.toMillis() || 0;
                const dateB = b.createdAt?.toMillis() || 0;
                return dateB - dateA;
            });

        container.innerHTML = '';

        // Risolvi gli owner UID in nomi
        for (const char of characters) {
            let ownerLabel = char.ownerDisplayName || '—';

            // Se c'è un owner UID ma non c'è ownerDisplayName, fai la query
            if (char.owner && !char.ownerDisplayName) {
                const ownerProfile = await fetchUserProfile(char.owner);
                if (ownerProfile) {
                    ownerLabel = ownerProfile.displayName || ownerProfile.email || char.owner;
                }
            }

            const card = document.createElement('div');
            card.className = 'character-card';
            const driveLink = buildDriveLink(char.driveUrl || char.driveFileId);

            card.innerHTML = `
                <h3>${char.name || 'Personaggio senza nome'}</h3>
                <div class="character-meta">
                    <p><strong>Stirpe:</strong> ${char.ancestry || '—'}</p>
                    <p><strong>Classe:</strong> ${char.class || '—'}</p>
                    <p><strong>Livello:</strong> ${char.level || '—'}</p>
                    <p><strong>Giocatore:</strong> ${ownerLabel}</p>
                </div>
                ${char.desc ? `<p><small>${char.desc}</small></p>` : ''}
                ${driveLink ?
                    `<a href="${driveLink}" class="btn-secondary" target="_blank" rel="noopener">Apri Scheda</a>` :
                    `<span class="btn-secondary" style="opacity: 0.5; cursor: not-allowed;">Scheda non disponibile</span>`
                }
            `;
            container.appendChild(card);
        }

        log('Personaggi caricati:', characters.length);

    } catch (err) {
        log('Errore caricamento personaggi da Firestore:', err);
        container.innerHTML = `<p style="color: red; text-align: center;">Errore caricamento personaggi: ${err.message}</p>`;
    }
}


/**
 * Carica la cronologia delle sessioni visibili all'utente.
 * Regole:
 * - master/admin vedono tutte le sessioni
 * - player vede solo le sessioni in cui è incluso (resource.data.players contains uid)
 */
async function loadSessions() {
    const container = document.getElementById('sessions-grid');
    if (!container) return;
    renderLoading(container, 'Caricamento sessioni...');

    const current = auth.currentUser;
    if (!current) {
        container.innerHTML = '<p>Utente non autenticato</p>';
        return;
    }

    try {
        const profileDoc = await db.collection('users').doc(current.uid).get();
        const role = profileDoc.exists ? (profileDoc.data().role || 'player') : 'player';

        let sessions = [];

        if (role === 'master' || role === 'admin') {
            // Try server-side ordering for masters/admins first. If Firestore requires
            // an index for some reason, fall back to a safe client-side ordering.
            try {
                const snap = await db.collection('sessions').orderBy('date', 'desc').get();
                sessions = snap.empty ? [] : snap.docs.map(d => ({ id: d.id, ...d.data() }));
            } catch (err) {
                log('Query sessions (master/admin) failed, falling back to unordered fetch:', err);
                // If there's an index requirement, retry without orderBy and sort client-side
                const snap = await db.collection('sessions').get();
                sessions = snap.empty ? [] : snap.docs.map(d => ({ id: d.id, ...d.data() }));
                sessions.sort((a, b) => {
                    const ta = a.date ? (a.date.toMillis ? a.date.toMillis() : (a.date.seconds ? a.date.seconds * 1000 : 0)) : 0;
                    const tb = b.date ? (b.date.toMillis ? b.date.toMillis() : (b.date.seconds ? b.date.seconds * 1000 : 0)) : 0;
                    return tb - ta;
                });
            }
        } else {
            // player: carica solo sessioni dove è incluso
            // Avoid requiring a composite index by not combining array-contains with orderBy.
            // Fetch matching sessions and sort client-side by date (newest first).
            try {
                const snap = await db.collection('sessions').where('players', 'array-contains', current.uid).get();
                sessions = snap.empty ? [] : snap.docs.map(d => ({ id: d.id, ...d.data() }));
            } catch (err) {
                // If this fails with an index error (rare), inform user and try a full fetch as fallback.
                log('Query sessions (player) failed:', err);
                // If Firestore suggests creating an index, include link in the UI
                let msg = 'Errore caricamento sessioni.';
                if (err && err.message && err.message.includes('requires an index')) {
                    const m = err.message.match(/https:\/\/console\.firebase\.google\.com\/[^"]+/);
                    const idxLink = m ? m[0] : null;
                    if (idxLink) msg += ` Crea l'indice qui: ${idxLink}`;
                }
                container.innerHTML = `<p style="color: red; text-align: center;">${msg}</p>`;
                return;
            }

            // Client-side sort to have newest sessions first.
            sessions.sort((a, b) => {
                const ta = a.date ? (a.date.toMillis ? a.date.toMillis() : (a.date.seconds ? a.date.seconds * 1000 : 0)) : 0;
                const tb = b.date ? (b.date.toMillis ? b.date.toMillis() : (b.date.seconds ? b.date.seconds * 1000 : 0)) : 0;
                return tb - ta;
            });
        }

        if (sessions.length === 0) {
            container.innerHTML = '<p style="text-align:center; padding:1rem;">Nessuna sessione trovata.</p>';
            return;
        }

        container.innerHTML = '';

        sessions.forEach(s => {
            const el = document.createElement('div');
            el.className = 'character-card';

            const dateStr = s.date ? (s.date.toDate ? s.date.toDate().toLocaleString('it-IT') : new Date(s.date).toLocaleString('it-IT')) : '';

            el.innerHTML = `
                <h4>${s.title || 'Sessione senza titolo'}</h4>
                <p><small>${dateStr}</small></p>
                ${s.summary ? `<p style="margin:0.5rem 0; color:#555;">${s.summary}</p>` : ''}
                ${s.handoutUrl ? `<a href="${buildDriveLink(s.handoutUrl || s.handoutFileId)}" class="btn-secondary" target="_blank" rel="noopener">📂 Handout</a>` : ''}
            `;

            container.appendChild(el);
        });

    } catch (err) {
        log('Errore caricamento sessioni da Firestore:', err);
        container.innerHTML = `<p style="color: red; text-align: center;">Errore caricamento sessioni: ${err && err.message ? err.message : 'errore sconosciuto'}</p>`;
    }
}



// =====================================================
// DOCUMENT READY / PAGE INITIALIZATION
// =====================================================

document.addEventListener('DOMContentLoaded', () => {
    log('Pagina caricata');

    // INIZIALIZZA FIREBASE PRIMA DI TUTTO
    const firebaseReady = initializeFirebase();

    if (!firebaseReady) {
        log('ERRORE: Firebase non è stato inizializzato correttamente');
        alert('Errore di connessione al server. Ricarica la pagina.');
        return;
    }

    // Aspetta un momento per assicurarsi che Firebase sia completamente pronto
    setTimeout(() => {
        // Determina quale pagina è attualmente attiva basandosi sugli elementi presenti
        // Questo approccio è più robusto del controllare window.location.pathname

        if (document.getElementById('loginForm')) {
            // Siamo sulla pagina di login
            initLoginPage();
        } else if (document.querySelector('.dashboard-container')) {
            // Siamo sulla dashboard
            initDashboard();
        } else if (document.querySelector('.hero')) {
            // Siamo su una pagina con hero (home o one-shots)
            const currentPage = window.location.pathname;
            if (currentPage.includes('one-shot') || window.location.search.includes('id=')) {
                initOneShots();
            } else {
                initHomePage();
            }
        }
    }, 100);
});

// =====================================================
// NOTA: INTEGRAZIONE FIREBASE
// =====================================================
// 
// Quando sarai pronto ad aggiungere Firebase per un vero database e autenticazione:
// 1. Aggiungi gli script Firebase nell'HTML
// 2. Inizializza Firebase con le tue credenziali
// 3. Sostituisci le funzioni localStorage con chiamate Firebase
// 
// Per ora il sistema usa localStorage (salvataggio locale nel browser)
// ed è perfetto per testare!
//
// =====================================================

log('Script caricato correttamente');
