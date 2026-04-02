# Guida Completa: Creare e Deployare il Sito Pathfinder su Netlify

**Obiettivo finale:** Un sito online completamente gratuito per le tue one-shot Pathfinder, updatable in tempo reale.

**Tempo totale:** 30-45 minuti (prima volta), poi 2 minuti per ogni update.

**Costo:** €0

---

## PARTE 1: Setup Iniziale (15 minuti)

### Passaggio 1.1 – Creare un Account GitHub (5 minuti)

GitHub è il luogo dove caricherai i file del tuo sito. Netlify leggerà da lì e creerà il sito online.

**Cosa fare:**
1. Vai su https://github.com
2. Clicca **"Sign up"** (in alto a Inserisci:
   - Email (qualsiasi, quella che usi normalmente)
   - Password (sicura)
   - Username (il tuo nome utente GitHub, es. `DarioFabbriRPA` o `pathfinder-master`)
4. Completa la verifica email
5. **Fine!** Hai un account GitHub

**Note:**
- Lo username GitHub sarà visibile nei tuoi link (es. `github.com/tuousername`)
- Puoi usare il nome che preferisci

---

### Passaggio 1.2 – Creare un Repository GitHub (5 minuti)

Un "repository" è una cartella online dove GitHub tiene traccia di tutti i tuoi file.

**Cosa fare:**
1. Dopo esserti registrato, vai su https://github.com (home)
2. Clicca il **"+"** in alto a destra → **"New repository"**
3. Compila il form:
   - **Repository name:** `pathfinder-oneshot` (o il nome che preferisci)
   - **Description:** "Sito web per one-shot Pathfinder 2e" (facoltativo)
   - **Visibility:** Seleziona **"Public"** (così chiunque può vederlo online)
   - **Initialize this repository with:** Spunta **"Add a README file"**
4. Clicca **"Create repository"**
5. **Fine!** Hai il tuo repository GitHub

**Cosa vedi ora:**
- Una pagina con scritto "pathfinder-oneshot" in alto
- Un file `README.md` già presente
- Un pulsante verde **"Code"**

---

### Passaggio 1.3 – Creare un Account Netlify (5 minuti)

Netlify è il servizio che pubblica il tuo sito online.

**Cosa fare:**
1. Vai su https://www.netlify.com
2. Clicca **"Sign up"** (in alto a destra)
3. Seleziona **"GitHub"** per registrarti con il tuo account GitHub
4. GitHub ti chiederà di autorizzare Netlify → clicca **"Authorize Netlify"**
5. Completa il form su Netlify (nome, email, ecc.)
6. **Fine!** Sei registrato su Netlify

**Note:**
- Netlify avrà accesso al tuo account GitHub per leggere i tuoi repository
- Non ti chiederà la password GitHub (usa OAuth, è sicuro)

---

## PARTE 2: Preparare i File del Sito (10 minuti)

Ora devi creare i file HTML/CSS/JavaScript che formeranno il sito.

### Passaggio 2.1 – Creare la Struttura del Progetto Localmente

Sul tuo computer, crea una cartella per il progetto:

```
pathfinder-oneshot/
├── index.html (homepage)
├── one-shots.html (lista one-shot)
├── login.html (login/registrazione)
├── dashboard.html (area personale)
├── css/
│   └── style.css (tutti gli stili)
├── js/
│   └── main.js (logica JavaScript)
└── assets/
    ├── images/ (immagini, galleria, etc.)
    └── images/logo.png (logo del sito)
```

**Come crearla:**

**Su Windows:**
1. Apri Esplora File
2. Vai dove vuoi (es. Desktop)
3. Clicca destro → **"Nuova cartella"**
4. Nomina la cartella `pathfinder-oneshot`
5. Entra nella cartella
6. Crea le sottocartelle: `css`, `js`, `assets/images`

**Su Mac/Linux:**
```bash
mkdir pathfinder-oneshot
cd pathfinder-oneshot
mkdir css js assets/images
```

---

### Passaggio 2.2 – Scaricare i File Starter (5 minuti)

Ho preparato per te i file starter del sito. Devi:

1. **Scarica** o copia i file HTML/CSS/JS che ti fornirò dopo questa guida
2. Mettili nella cartella `pathfinder-oneshot` che hai creato
3. Organizza così:
   - `index.html` nella root
   - `one-shots.html` nella root
   - `login.html` nella root
   - `dashboard.html` nella root
   - Tutti i file CSS dentro `css/`
   - Tutti i file JS dentro `js/`
   - Immagini dentro `assets/images/`

---

## PARTE 3: Caricare i File su GitHub (10 minuti)

### Opzione A – GUI (più facile, no command line)

**Cosa fare:**

1. Vai su https://github.com e accedi
2. Vai al tuo repository `pathfinder-oneshot`
3. Clicca il pulsante verde **"Code"** → **"Upload files"**
4. Una nuova pagina si apre con scritto *"Drag files here to add them to your repository"*
5. **Trascina** dalla tua cartella `pathfinder-oneshot` (sul tuo computer) TUTTI i file/cartelle:
   - `index.html`
   - `one-shots.html`
   - `login.html`
   - `dashboard.html`
   - cartella `css/`
   - cartella `js/`
   - cartella `assets/`
6. In fondo alla pagina, clicca **"Commit changes"**
7. **Fine!** I file sono su GitHub

---

### Opzione B – Command Line (per chi conosce git)

Se usi il terminale:

```bash
# Vai nella cartella del progetto
cd pathfinder-oneshot

# Inizializza il repository locale
git init

# Aggiungi il repository remoto (sostituisci USERNAME e REPO)
git remote add origin https://github.com/USERNAME/pathfinder-oneshot.git

# Aggiungi tutti i file
git add .

# Crea il primo commit
git commit -m "Commit iniziale: struttura base del sito"

# Fai il push su GitHub
git push -u origin main
```

---

## PARTE 4: Connettere GitHub a Netlify e Deploy (10 minuti)

### Passaggio 4.1 – Login a Netlify

1. Vai su https://netlify.com
2. Accedi con il tuo account GitHub
3. Vedrai la dashboard principale di Netlify

---

### Passaggio 4.2 – Creare un Nuovo Sito da GitHub

1. Sulla dashboard di Netlify, clicca il pulsante **"New site from Git"** (grande, al centro)
2. Netlify ti chiede: **"Where do you want to build from?"**
3. Seleziona **"GitHub"**
4. Una finestra pop-up di GitHub si apre per autorizzare Netlify
5. Clicca **"Authorize Netlify"**

---

### Passaggio 4.3 – Selezionare il Repository

1. Netlify ti mostra l'elenco dei tuoi repository GitHub
2. **Cerca** e **clicca** su `pathfinder-oneshot`
3. Clicca su di esso

---

### Passaggio 4.4 – Configurare il Deploy

Una nuova pagina si apre con il titolo **"Deploy settings"**

**Controlla questi campi:**

- **Branch to deploy:** Dovrebbe essere `main` ✅ (lascia così)
- **Build command:** Lascia vuoto (il tuo sito non ha bisogno di compilazione)
- **Publish directory:** Inserisci `.` oppure lascia vuoto (significa che la root è il sito)

**Fatto!** Clicca il pulsante blu grande **"Deploy site"**

---

### Passaggio 4.5 – Attendere il Deploy

Netlify inizia a "costruire" il sito. Vedrai una schermata con scritto:
- "Building site..."
- Alcuni step di compilazione
- Infine: "Your site is live!" ✅

**Il sito è online!**

---

## PARTE 5: Accedere al Sito Online (2 minuti)

### Passaggio 5.1 – Trovare il Link del Sito

Dopo il deploy:
1. Netlify ti mostra un link tipo: `https://pathfinder-oneshot-abc123.netlify.app`
2. Clicca sul link per visitare il tuo sito online
3. **Fatto!** Il sito è live

**Notes:**
- Il link ha un nome casuale (es. `abc123`)
- Puoi cambiarlo nelle impostazioni di Netlify (vedi sezione "Dominio personalizzato")

---

## PARTE 6: Aggiornare il Sito (Automatic Deploy)

**Il bello di Netlify:** Ogni volta che modifichi i file su GitHub, il sito si aggiorna AUTOMATICAMENTE.

### Come aggiornare il sito:

**Opzione 1 – Dalla GUI di GitHub:**

1. Vai a https://github.com → tuo repository
2. Clicca su un file per modificarlo (es. `index.html`)
3. Clicca la **matita** (edit) in alto a destra
4. Modifica il file come preferisci
5. In fondo, clicca **"Commit changes"**
6. **Automaticamente**, Netlify:
   - Legge il nuovo file
   - Ricompila il sito
   - Lo aggiorna online
7. In 30-60 secondi, il sito è aggiornato ✅

**Opzione 2 – Da Command Line (se usi git):**

```bash
# Modifica i file localmente nel tuo editor
# (es. Visual Studio Code, Sublime Text, etc.)

# Una volta soddisfatto, salva tutto e:
git add .
git commit -m "Aggiunto contenuto one-shot #1"
git push origin main

# Netlify automaticamente facsederà il deploy
```

---

## PARTE 7: Dominio Personalizzato (Opzionale, 5 minuti)

Se non hai un dominio personalizzato:
- Il sito usa `https://pathfinder-oneshot-abc123.netlify.app` (gratuito)
- Funziona perfettamente!

Se vuoi un dominio come `pathfinder-oneshot.it`:

### Opzione 1 – Dominio Netlify Gratuito

Netlify può comprarti un dominio `.com` / `.net` / etc. (costa ~12 EUR/anno)

1. Su Netlify, vai a **Site settings** → **Domain management**
2. Clicca **"Add a custom domain"**
3. Digita il dominio che vuoi (es. `pathfinder-oneshot.com`)
4. Netlify verifica se è disponibile
5. Se sì, puoi comprarlo direttamente da Netlify (pagamento con carta)

### Opzione 2 – Dominio da Provider Esterno

Se hai già un dominio (comprato da GoDaddy, Aruba, etc.):

1. Su Netlify, vai a **Site settings** → **Domain management**
2. Clicca **"Add a custom domain"**
3. Inserisci il dominio
4. Netlify ti dà le istruzioni per puntare il dominio a Netlify (modifica DNS)
5. Segui le istruzioni dal tuo provider (GoDaddy, Aruba, etc.)
6. In 5-30 minuti, il dominio è attivo

---

## PARTE 8: Aggiungere Firebase (Database e Login)

Una volta che il sito è online, puoi aggiungere:
- Login/registrazione
- Database per schede personaggi
- Storage per PDF e immagini

### Passaggio 8.1 – Creare un Progetto Firebase

1. Vai su https://firebase.google.com
2. Clicca **"Accedi"** → usa il tuo Google Account (creane uno se non lo hai)
3. Clicca **"Vai a console"** oppure **"Create a project"**
4. Compila:
   - **Project name:** `pathfinder-oneshot`
   - **Enable Google Analytics:** Facoltativo
5. Clicca **"Create project"**
6. Firebase crea il progetto (2-3 secondi)

---

### Passaggio 8.2 – Ottenere le Credenziali Firebase

1. Nella console Firebase, vai a **Project settings** (icona ingranaggio in alto)
2. Scorri fino a **"Your apps"**
3. Clicca **"Web App"** (simbolo `</>`), poi **"Register app"**
4. Dai un nome all'app (es. `pathfinder-web`)
5. Firebase ti genera un blocco di codice tipo:

```javascript
const firebaseConfig = {
  apiKey: "AIzaSy...",
  authDomain: "pathfinder-oneshot.firebaseapp.com",
  projectId: "pathfinder-oneshot",
  storageBucket: "pathfinder-oneshot.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abc123def456"
};
```

7. **Copia questo codice** e salvalo in un file di testo (lo userai nel tuo sito)

---

### Passaggio 8.3 – Abilitare Authentication su Firebase

1. Nella console Firebase, vai a **Authentication** (menu a sinistra)
2. Clicca **"Get started"**
3. Clicca **"Email/Password"**
4. Attiva **"Enable"** e salva
5. **Fine!** L'autenticazione è pronta

---

### Passaggio 8.4 – Creare il Firestore Database

1. Nella console Firebase, vai a **Firestore Database** (menu a sinistra)
2. Clicca **"Create database"**
3. Seleziona:
   - Location: **Europe (eur3)** (più vicino all'Italia)
   - Regole di sicurezza: **Start in production mode**
4. Clicca **"Create"**
5. **Fine!** Il database è pronto

---

## PARTE 9: Integrare Firebase nel Tuo Sito

Nel tuo file `js/main.js`, aggiungi questo codice all'inizio:

```javascript
// Importa Firebase
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.0/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.7.0/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.7.0/firebase-firestore.js";

// Inizializza Firebase (usa le credenziali che hai ottenuto)
const firebaseConfig = {
  apiKey: "SOSTITUISCI_CON_IL_TUO_VALORE",
  authDomain: "pathfinder-oneshot.firebaseapp.com",
  projectId: "pathfinder-oneshot",
  storageBucket: "pathfinder-oneshot.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abc123def456"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
```

---

## PARTE 10: Checklist Finale

Quando tutto è fatto, assicurati di:

- ✅ Account GitHub creato
- ✅ Repository `pathfinder-oneshot` creato
- ✅ File del sito caricati su GitHub
- ✅ Account Netlify creato
- ✅ Repository collegato a Netlify
- ✅ Deploy completato
- ✅ Sito online e raggiungibile
- ✅ (Opzionale) Firebase configurato
- ✅ (Opzionale) Dominio personalizzato aggiunto

---

## PARTE 11: Troubleshooting

### Il sito non si carica
**Causa:** File non trovati o percorsi sbagliati

**Soluzione:**
1. Verifica che il file `index.html` sia nella **root** (non dentro una cartella)
2. Negli HTML, quando citi CSS/JS, usa percorsi corretti:
   ```html
   <!-- GIUSTO -->
   <link rel="stylesheet" href="css/style.css">
   <script src="js/main.js"></script>
   
   <!-- SBAGLIATO -->
   <link rel="stylesheet" href="/css/style.css"> <!-- il "/" è sbagliato -->
   ```

### Netlify non aggiorna il sito dopo il commit
**Causa:** Netlify non ha notato il commit

**Soluzione:**
1. Vai su Netlify → **Deploys**
2. Clicca **"Trigger deploy"** manualmente
3. Seleziona **"Deploy site"**
4. Attendi 30 secondi

### Firebase non funziona
**Causa:** Credenziali sbagliate o regole di sicurezza

**Soluzione:**
1. Verifica che le credenziali Firebase in `main.js` siano copiate esattamente
2. Nella console Firebase, vai a **Firestore** → **Rules**
3. Modifica così:
   ```
   rules_version = '2';
   service cloud.firestore {
     match /databases/{database}/documents {
       match /{document=**} {
         allow read, write: if request.auth != null;
       }
     }
   }
   ```

---

## Riepilogo Tempi

| Fase | Tempo |
|------|-------|
| GitHub account + repository | 10 min |
| Preparare file locali | 5 min |
| Caricare su GitHub | 5 min |
| Netlify account + deploy | 10 min |
| **TOTALE PRIMA VOLTA** | **30 min** |
| Aggiornamenti futuri | 2 min (push → auto-deploy) |

---

## Supporto Rapido

**Se rimani bloccato:**

1. **Netlify Deploy Log:** Clicca su **Deploys** → vedrai i log dell'errore
2. **Console Browser:** Premi F12 → vai a **Console** per vedere errori JavaScript
3. **GitHub:** Controlla che i file siano caricati correttamente

---

**Pronto? Voglio che cominci! 🚀**

Fammi sapere quando hai:
1. Creato l'account GitHub ✅
2. Creato il repository ✅
3. E ti darò i file HTML/CSS/JS pronti da caricare!