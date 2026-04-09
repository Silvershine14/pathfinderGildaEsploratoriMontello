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
        title: "La Scomparsa della Carovana",
        level: "4-6",
        duration: "5-6 ore",
        description: "Una carovana di mercanti è scomparsa sulla strada da nord. Banditi? Bestie selvagge? O qualcosa di più sinistro? Investigate il mistero e salvate i sopravvissuti.",
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
            renderAdventures(adventures);
        } else {
            const firestoreAdventures = [];
            snapshot.forEach(doc => {
                firestoreAdventures.push({
                    id: doc.id,
                    ...doc.data()
                });
            });
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
        card.innerHTML = `
            <h3>${adventure.title}</h3>
            <p class="adventure-meta">Livello ${adventure.level} • Durata ${adventure.duration}</p>
            <p>${adventure.description}</p>
            <a href="one-shots.html?id=${adventure.id}" class="btn-secondary">Leggi di più</a>
        `;
        container.appendChild(card);
    });

    log('Avventure renderizzate:', adventuresList.length);
}

/**
 * Ottieni dettaglio di un'avventura per ID
 */
function getAdventureById(id) {
    return adventures.find(a => a.id === parseInt(id));
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
function initOneShots() {
    log('Inizializzazione pagina One-Shots');
    
    // Controlla se c'è un ID specifico nell'URL
    const params = new URLSearchParams(window.location.search);
    const adventureId = params.get('id');

    const container = document.querySelector('.adventures-grid');
    if (!container) return;

    if (adventureId) {
        const adventure = getAdventureById(adventureId);
        if (adventure) {
            container.innerHTML = `
                <div style="grid-column: 1 / -1;">
                    <h2>${adventure.title}</h2>
                    <p><strong>Livello:</strong> ${adventure.level}</p>
                    <p><strong>Durata:</strong> ${adventure.duration}</p>
                    <p>${adventure.description}</p>
                    <a href="one-shots.html" class="btn-secondary">← Torna alla lista</a>
                </div>
            `;
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
    auth.onAuthStateChanged(async function(user) {
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
            loadMessages();

            // Role-specific data
            if (role === 'master' || role === 'admin') {
                loadNPCs();
                loadAllSheets();
            }

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

/**
 * Carica NPC da Firestore. Solo master/admin possono vedere gli NPC.
 */
async function loadNPCs() {
    const container = document.getElementById('npc-grid');
    if (!container) return;

    renderLoading(container, 'Caricamento NPC...');

    const current = auth.currentUser;
    if (!current) {
        container.innerHTML = '<p>Utente non autenticato</p>';
        return;
    }

    try {
        const profileDoc = await db.collection('users').doc(current.uid).get();
        const role = profileDoc.exists ? (profileDoc.data().role || 'player') : 'player';

        if (!(role === 'master' || role === 'admin')) {
            container.innerHTML = '<p>Accesso negato agli NPC</p>';
            return;
        }

        const snapshot = await db.collection('npcs').orderBy('createdAt', 'desc').get();

        if (snapshot.empty) {
            container.innerHTML = '<p>Nessun NPC presente.</p>';
            return;
        }

        container.innerHTML = '';
        snapshot.forEach(doc => {
            const npc = doc.data();
            const el = document.createElement('div');
            el.className = 'character-card';
            el.innerHTML = `
                <h4>${npc.name || 'NPC senza nome'}</h4>
                <p><b>Classe:</b> ${npc.class || '—'}</p>
                <p><b>Stirpe:</b> ${npc.ancestry || '—'}</p>
                <p><b>Livello:</b> ${npc.level || '—'}</p>
                <p><b>Note:</b> ${npc.desc || ''}</p>
                <p><b>Scheda:</b> <a href="${npc.driveUrl || ''}" target="_blank">clicca</a></p>
            `;
            container.appendChild(el);
        });

    } catch (err) {
        log('Errore caricamento NPC da Firestore:', err);
        container.innerHTML = '<p>Errore caricamento NPC</p>';
    }
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
            query = db.collection('characters').where('owner', '==', current.uid).orderBy('createdAt', 'desc');
        } else {
            // Masters and Admins see all characters
            query = db.collection('characters').orderBy('createdAt', 'desc');
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
 * Admin: carica la lista di tutti gli utenti per gestione ruoli
 */
async function loadAllUsers() {
    const container = document.getElementById('users-list');
    if (!container) return;

    renderLoading(container, 'Caricamento utenti...');

    try {
        const snapshot = await db.collection('users').orderBy('createdAt', 'asc').get();
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
function loadCharacters() {
    const container = document.querySelector('.character-grid');
    if (!container) return;

    // Dati di esempio
    const characters = [
        {
            name: "Baldur Ironforge",
            class: "Guerriero",
            level: 5,
            ancestry: "Nano"
            , driveFileId: '1a2B3cExampleFileId'
        },
        {
            name: "Sylvaria Moonwhisper",
            class: "Maga",
            level: 4,
            ancestry: "Elfo"
            , driveFileId: '1d4E5fExampleFileId'
        },
        {
            name: "Thorne Swiftblade",
            class: "Ladro",
            level: 5,
            ancestry: "Umano"
            , driveFileId: '1g6H7iExampleFileId'
        }
    ];

    container.innerHTML = '';

    characters.forEach((char, index) => {
        const card = document.createElement('div');
        card.className = 'character-card';

        const driveLink = buildDriveLink(char.driveUrl || char.driveFileId);

        card.innerHTML = `
            <h3>${char.name}</h3>
            <div class="character-meta">
                <p><strong>Classe:</strong> ${char.class}</p>
                <p><strong>Livello:</strong> ${char.level}</p>
                <p><strong>Stirpe:</strong> ${char.ancestry}</p>
            </div>
            ${driveLink ? `<a href="${driveLink}" class="btn-secondary" target="_blank" rel="noopener">Apri Scheda</a>` : `<a href="#" class="btn-secondary">Visualizza Scheda</a>`}
        `;
        container.appendChild(card);
    });

    log('Personaggi caricati:', characters.length);
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
