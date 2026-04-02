// Importa Firebase
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.0/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.7.0/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.7.0/firebase-firestore.js";

// Inizializza Firebase (usa le credenziali che hai ottenuto)
  const firebaseConfig = {
    apiKey: "AIzaSyB-2yDPXPOoGGjpbV44VfJYkNRfnezNUkE",
    authDomain: "gildaesploratorimontello.firebaseapp.com",
    projectId: "gildaesploratorimontello",
    storageBucket: "gildaesploratorimontello.firebasestorage.app",
    messagingSenderId: "512224002060",
    appId: "1:512224002060:web:a041a2b7a225dc3a952e29",
    measurementId: "G-KEWSJWLKX2"
  };

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);


// =====================================================
// PATHFINDER ONE-SHOT - MAIN JAVASCRIPT
// =====================================================

// DATI DI ESEMPIO (sostituirai con Firebase in futuro)
const adventures = [
    {
        id: 1,
        title: "Il Sigillo Rotto",
        level: "1-3",
        duration: "4-5 ore",
        description: "Una tomba antica è stata profanata. I non-morti emergono dalle ombre. I vostri eroici avventurieri devono affrontare questa minaccia prima che la città cada nel caos.",
        image: "assets/images/placeholder-1.jpg"
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

// =====================================================
// AUTHENTICATION (PLACEHOLDER)
// =====================================================

/**
 * Check se l'utente è loggato (da localStorage, provvisorio)
 */
function isUserLoggedIn() {
    return localStorage.getItem('pathfinder_user') !== null;
}

/**
 * Ottieni dati utente loggato
 */
function getCurrentUser() {
    const userJSON = localStorage.getItem('pathfinder_user');
    return userJSON ? JSON.parse(userJSON) : null;
}

/**
 * Login (placeholder, senza Firebase per ora)
 */
function loginUser(email, password) {
    // NOTA: Questo è un placeholder. In produzione userai Firebase Authentication
    const user = {
        email: email,
        name: email.split('@')[0],
        loginTime: new Date().toISOString()
    };
    localStorage.setItem('pathfinder_user', JSON.stringify(user));
    log('Utente loggato:', user);
    return user;
}

/**
 * Logout
 */
function logoutUser() {
    localStorage.removeItem('pathfinder_user');
    log('Utente disconnesso');
    window.location.href = 'index.html';
}

/**
 * Registrazione (placeholder)
 */
function registerUser(email, password, name) {
    // NOTA: Questo è un placeholder. In produzione userai Firebase Authentication
    const user = {
        email: email,
        name: name,
        registrationTime: new Date().toISOString()
    };
    localStorage.setItem('pathfinder_user', JSON.stringify(user));
    log('Utente registrato:', user);
    return user;
}

// =====================================================
// ADVENTURES FUNCTIONS
// =====================================================

/**
 * Carica lista di avventure
 */
function loadAdventures() {
    const container = document.querySelector('.adventures-grid');
    if (!container) return;

    container.innerHTML = '';

    adventures.forEach(adventure => {
        const card = document.createElement('div');
        card.className = 'adventure-card';
        card.innerHTML = `
            <h3>${adventure.title}</h3>
            <p class="adventure-meta">Livello ${adventure.level} • ${adventure.duration}</p>
            <p>${adventure.description}</p>
            <a href="one-shots.html?id=${adventure.id}" class="btn-secondary">Leggi di più</a>
        `;
        container.appendChild(card);
    });

    log('Avventure caricate:', adventures.length);
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
        window.location.href = 'dashboard.html';
        return;
    }

    const loginForm = document.getElementById('loginForm');
    const registerForm = document.getElementById('registerForm');

    if (loginForm) {
        loginForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const email = document.getElementById('loginEmail').value;
            const password = document.getElementById('loginPassword').value;
            
            if (email && password) {
                loginUser(email, password);
                alert('Login effettuato! Benvenuto.');
                window.location.href = 'dashboard.html';
            }
        });
    }

    if (registerForm) {
        registerForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const email = document.getElementById('registerEmail').value;
            const password = document.getElementById('registerPassword').value;
            const name = document.getElementById('registerName').value;
            
            if (email && password && name) {
                registerUser(email, password, name);
                alert('Registrazione effettuata! Benvenuto nella comunità.');
                window.location.href = 'dashboard.html';
            }
        });
    }
}

/**
 * Inizializza pagina Dashboard
 */
function initDashboard() {
    log('Inizializzazione Dashboard');

    // Controlla se loggato, altrimenti reindirizza
    if (!isUserLoggedIn()) {
        window.location.href = 'login.html';
        return;
    }

    const user = getCurrentUser();
    const userInfo = document.querySelector('.user-info');
    
    if (userInfo && user) {
        userInfo.innerHTML = `
            <h3>Benvenuto, ${user.name}!</h3>
            <p>Email: ${user.email}</p>
            <p>Loggato da: ${new Date(user.loginTime).toLocaleDateString('it-IT')}</p>
        `;
    }

    // Carica personaggi (placeholder)
    loadCharacters();
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
        },
        {
            name: "Sylvaria Moonwhisper",
            class: "Maga",
            level: 4,
            ancestry: "Elfo"
        },
        {
            name: "Thorne Swiftblade",
            class: "Ladro",
            level: 5,
            ancestry: "Umano"
        }
    ];

    container.innerHTML = '';

    characters.forEach((char, index) => {
        const card = document.createElement('div');
        card.className = 'character-card';
        card.innerHTML = `
            <h3>${char.name}</h3>
            <div class="character-meta">
                <p><strong>Classe:</strong> ${char.class}</p>
                <p><strong>Livello:</strong> ${char.level}</p>
                <p><strong>Stirpe:</strong> ${char.ancestry}</p>
            </div>
            <a href="#" class="btn-secondary">Visualizza Scheda</a>
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

    // Determina quale pagina è attualmente attiva
    const currentPage = window.location.pathname;

    if (currentPage.includes('index.html') || currentPage === '/' || currentPage.endsWith('/')) {
        initHomePage();
    } else if (currentPage.includes('one-shots.html')) {
        initOneShots();
    } else if (currentPage.includes('login.html')) {
        initLoginPage();
    } else if (currentPage.includes('dashboard.html')) {
        initDashboard();
    }
});

// =====================================================
// UTILITÀ PER FUTURE INTEGRAZIONI FIREBASE
// ===================================================== 

/*
// ISTRUZIONI PER AGGIUNGERE FIREBASE:
// 
// 1. Nella sezione <head> dell'HTML, aggiungi:
//    <script src="https://www.gstatic.com/firebasejs/10.7.0/firebase-app.js"></script>
//    <script src="https://www.gstatic.com/firebasejs/10.7.0/firebase-auth.js"></script>
//    <script src="https://www.gstatic.com/firebasejs/10.7.0/firebase-firestore.js"></script>
//
// 2. In questo file, sotto questo commento, aggiungi il config Firebase
//
// 3. Sostituisci le funzioni di login/register/loadAdventures con versioni Firebase
//
// Contattami quando sei pronto per integrare Firebase!
*/

log('Script caricato correttamente');
