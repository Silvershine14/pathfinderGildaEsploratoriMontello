# ⚡ Quick Start – Metti Online il Sito in 30 Minuti

Questa è la versione **ultra-veloce** dei passaggi. Se rimani bloccato, leggi **GUIDA_NETLIFY_PATHFINDER.md**.

---

## Step 1️⃣ – Preparare i File (5 minuti)

### Su Windows:
1. Crea una cartella `pathfinder-oneshot` sul Desktop
2. Dentro, crea 3 sottocartelle: `css`, `js`, `assets`
3. Dentro `assets`, crea `images`

### Su Mac/Linux:
```bash
mkdir pathfinder-oneshot
cd pathfinder-oneshot
mkdir -p css js assets/images
```

### Copia i File:
- `index.html` → nella root (non dentro nessuna cartella)
- `one-shots.html` → nella root
- `login.html` → nella root
- `dashboard.html` → nella root
- `style.css` → dentro la cartella `css/`
- `main.js` → dentro la cartella `js/`
- Immagini (opzionale) → dentro `assets/images/`

**Risultato finale:**
```
pathfinder-oneshot/
├── index.html
├── one-shots.html
├── login.html
├── dashboard.html
├── css/
│   └── style.css
├── js/
│   └── main.js
└── assets/
    └── images/
```

✅ **Fatto!** Struttura pronta.

---

## Step 2️⃣ – Creare Account GitHub (5 minuti)

1. Vai a https://github.com/signup
2. Compila:
   - **Email:** la tua email
   - **Password:** una password sicura
   - **Username:** il tuo nome (es. `DarioFabbri`)
3. Verifica email
4. ✅ **Account creato!**

---

## Step 3️⃣ – Creare Repository GitHub (5 minuti)

1. Accedi a GitHub (https://github.com)
2. Clicca il **"+"** in alto a destra → **"New repository"**
3. Compila:
   - **Repository name:** `pathfinder-oneshot`
   - **Visibility:** `Public`
   - Spunta **"Add a README file"**
4. Clicca **"Create repository"**
5. ✅ **Repository creato!**

---

## Step 4️⃣ – Caricare i File su GitHub (5 minuti)

1. Nel repository che hai appena creato, clicca il pulsante verde **"Code"**
2. Clicca **"Upload files"**
3. **Trascina** i tuoi file dal computer (intera cartella `pathfinder-oneshot`)
4. In fondo clicca **"Commit changes"**
5. ✅ **File caricati!**

---

## Step 5️⃣ – Creare Account Netlify (5 minuti)

1. Vai a https://netlify.com/signup
2. Clicca **"Sign up with GitHub"**
3. Autorizza Netlify per accedere a GitHub
4. ✅ **Account Netlify creato!**

---

## Step 6️⃣ – Deployare il Sito (5 minuti)

1. Accedi a Netlify (https://app.netlify.com)
2. Clicca il pulsante blu grande **"New site from Git"**
3. Seleziona **"GitHub"**
4. Scegli il repository `pathfinder-oneshot`
5. Clicca **"Deploy site"**
6. Attendi 30 secondi...
7. ✅ **Il sito è online!**

Netlify ti mostrerà un link tipo: `https://pathfinder-oneshot-abc123.netlify.app`

**Clicca il link → Il tuo sito è LIVE! 🎉**

---

## ✨ Congratulazioni!

Il tuo sito è online gratuitamente e completamente funzionante!

### Cosa puoi fare ora:

1. **Personalizzare il contenuto:**
   - Modifica i file `.html` direttamente su GitHub (matita/edit)
   - Aggiungi le tue avventure in `js/main.js`
   - Carica immagini in `assets/images/`

2. **Aggiornare il sito:**
   - Ogni volta che modifichi un file su GitHub
   - Netlify aggiorna automaticamente il sito online
   - Aspetta 30-60 secondi e ricarica il browser

3. **Aggiungere un dominio personalizzato (opzionale):**
   - Su Netlify → **Site settings** → **Domain management**
   - Aggiungi il tuo dominio (compra da GoDaddy, Aruba, etc.)
   - Netlify ti mostrerà come collegarlo

4. **Aggiungere Firebase (opzionale, per database vero):**
   - Leggi la sezione "Integrare Firebase" in **GUIDA_NETLIFY_PATHFINDER.md**

---

## 🆘 Se Qualcosa Non Funziona

| Problema | Soluzione |
|----------|-----------|
| Il sito non si carica | Verifica che `index.html` sia nella **root**, non in una cartella |
| CSS/JS non caricano | Controlla i percorsi: `css/style.css` e `js/main.js` |
| Netlify mostra errore | Vai a **Deploys** → visualizza il log d'errore |
| Login non funziona | Apri **Console** del browser (F12) e cerca gli errori |

---

## 📞 Prossimi Passi

1. ✅ Sito online
2. ⬜ Personalizzare contenuto (titoli, avventure, immagini)
3. ⬜ Aggiungere dominio personalizzato (opzionale)
4. ⬜ Integrare Firebase per vero database (opzionale)

**Dimmi quando sei arrivato al passo 1 e ti aiuto con il resto!** 🚀

---

**Tempo totale: 30 minuti. Costo: €0. Risultato: Un sito web professionale online!** 🎲⚔️