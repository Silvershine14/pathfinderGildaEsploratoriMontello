# 🎲 Pathfinder One-Shot – Sito Web

Un sito web moderno e completamente gratuito per una campagna di **one-shot Pathfinder 2e** con:
- ✅ Showcase di avventure
- ✅ Galleria immagini
- ✅ Sistema di login/registrazione
- ✅ Area personale per giocatori
- ✅ Visualizzazione schede personaggi

---

## 📂 Struttura dei File

```
pathfinder-oneshot/
├── index.html                 # Homepage
├── one-shots.html            # Lista avventure
├── login.html                # Login/Registrazione
├── dashboard.html            # Area personale
├── README.md                 # Questo file
│
├── css/
│   └── style.css            # Tutti gli stili del sito
│
├── js/
│   └── main.js              # Logica JavaScript
│
└── assets/
    └── images/              # Cartella per immagini
        ├── placeholder-1.jpg
        ├── placeholder-2.jpg
        ├── placeholder-3.jpg
        └── placeholder-4.jpg
```

---

## 🚀 Come Iniziare

### 1. Scaricare i File
Scarica tutti i file da questo repository nella tua cartella locale.

### 2. Creare la Struttura Locale
Se non l'hai già, crea la cartella `css`, `js` e `assets/images` come mostrato sopra.

### 3. Aggiungere Immagini
Metti le tue immagini (mappe, artwork, foto) nella cartella `assets/images/`.

### 4. Personalizzare il Contenuto
Modifica i file `.html` per aggiungere:
- Descrizioni delle tue one-shot
- Nomi, biografie, etc.
- Immagini personali

### 5. Caricare su GitHub
Segui la [Guida Completa Netlify](./GUIDA_NETLIFY_PATHFINDER.md) per:
1. Creare un account GitHub
2. Creare un repository
3. Caricare i file
4. Deployare su Netlify

---

## 🎨 Personalizzazione Veloce

### Cambiare i Colori
Apri `css/style.css` e modifica queste variabili all'inizio:

```css
:root {
    --color-primary: #8b4513;      /* Marrone (principale) */
    --color-secondary: #d4af37;    /* Oro (accenti) */
    --color-accent: #c41e3a;       /* Rosso (highlights) */
    --color-dark: #1a1a1a;         /* Nero (text) */
    --color-light: #f5f1e8;        /* Beige (background) */
}
```

### Cambiare il Titolo
Cerca `<h1>⚔️ Pathfinder One-Shot</h1>` in tutti gli HTML e modificalo.

### Aggiungere Avventure
In `js/main.js`, aggiungi un nuovo oggetto all'array `adventures`:

```javascript
{
    id: 4,
    title: "La tua nuova avventura",
    level: "1-3",
    duration: "4-5 ore",
    description: "Descrizione della tua avventura...",
    image: "assets/images/tua-immagine.jpg"
}
```

---

## 🔐 Login & Autenticazione (Placeholder)

**Nota importante:** Il sistema di login attualmente è un **placeholder** che usa `localStorage` (salvataggio locale nel browser).

Quando sei pronto, integrare **Firebase Authentication** per un vero sistema di login. Guarda la [guida Firebase nella Guida Netlify](./GUIDA_NETLIFY_PATHFINDER.md).

Per il momento:
- Puoi registrarti e fare login localmente
- I dati si salvano nel browser (non su server)
- Perfetto per testare!

---

## 📱 Responsive Design

Il sito è **100% responsive** e funziona perfettamente su:
- 📱 Mobile (iPhone, Android)
- 📱 Tablet
- 💻 Desktop

---

## 🔌 Integrare Firebase (Opzionale)

Per aggiungere un vero database e autenticazione cloud:

1. Vai su https://firebase.google.com
2. Crea un progetto Firebase
3. Aggiungi le credenziali in `js/main.js`
4. Segui le istruzioni nel codice per integrare Firestore e Authentication

[Vedi la guida completa in GUIDA_NETLIFY_PATHFINDER.md]

---

## 🌐 Hostare su Netlify (GRATUITO)

1. Carica questo repository su GitHub
2. Vai a https://netlify.com
3. Connetti il tuo repository GitHub
4. Clicca "Deploy"
5. **Fatto!** Il sito è online

**Non costa nulla.** Netlify offre hosting gratuito illimitato per siti statici come questo.

---

## 📋 Checklist per il Lancio

- [ ] Tutti i file HTML sono nella root
- [ ] Cartella `css/` con `style.css`
- [ ] Cartella `js/` con `main.js`
- [ ] Cartella `assets/images/` con le tue immagini
- [ ] Hai personalizzato il contenuto (titoli, descrizioni)
- [ ] Repository GitHub creato
- [ ] Netlify collegato a GitHub
- [ ] Sito online e funzionante

---

## 🤝 Supporto e Modifiche Future

Se hai domande o vuoi aggiungere funzionalità (es. commenti, forum, ecc.), contattami!

Funzionalità possibili da aggiungere:
- ✨ Sistema di commenti per le avventure
- ✨ Forum della comunità
- ✨ Statistiche dei giocatori
- ✨ Calendario sessioni
- ✨ Sistema di ricompense/achievement

---

## 📄 Licenza

Il sito è tuo! Personalizzalo come preferisci.

**Pathfinder** è un marchio registrato di **Paizo Inc.**

---

## 🎲 Buone Avventure!

Auguri con la tua campagna! Che i tuoi dadi siano sempre fortunati.

⚔️ **- Master**