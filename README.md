# TheatrePass 🎭

Ολοκληρωμένη εφαρμογή κράτησης εισιτηρίων για θέατρα και κινηματογράφους. Αναπτύχθηκε με React Native (Expo) στο frontend και Node.js/Express στο backend, με MariaDB ως βάση δεδομένων.

---

## Λειτουργικότητα

- **Εγγραφή & Σύνδεση** — Ασφαλής αυθεντικοποίηση με JWT tokens και κρυπτογράφηση κωδικών μέσω bcrypt
- **Λίστα Θεάτρων** — Αναζήτηση και φιλτράρισμα θεάτρων ανά όνομα ή τοποθεσία, με pull-to-refresh
- **Παραστάσεις** — Προβολή παραστάσεων κάθε θεάτρου με τίτλο, αίθουσα, ημερομηνία και τιμή
- **Info Modal** — Κουμπί ⓘ σε κάθε παράσταση ανοίγει bottom sheet με αναλυτικές πληροφορίες (διάρκεια, ηλικιακή κατηγορία, περιγραφή)
- **Κρατήσεις** — Κράτηση εισιτηρίου με αποτροπή διπλής κράτησης
- **Διαχείριση Κρατήσεων** — Προβολή και ακύρωση κρατήσεων από ειδική καρτέλα
- **Προφίλ** — Εμφάνιση στοιχείων χρήστη και αποσύνδεση

---

## Τεχνολογίες

| Επίπεδο | Τεχνολογία |
|---------|-----------|
| Frontend | React Native, Expo, TypeScript, Expo Router |
| Backend | Node.js, Express 5 |
| Βάση Δεδομένων | MariaDB |
| Αυθεντικοποίηση | JWT, Bcrypt |
| HTTP Client | Axios |

---

## Δομή Project

```
theatre_project/
├── frontend/          # React Native / Expo εφαρμογή
│   └── app/
│       ├── (tabs)/    # Tab screens (Θέατρα, Κρατήσεις, Προφίλ)
│       ├── context/   # AuthContext (JWT + user state)
│       ├── login.tsx
│       ├── register.tsx
│       ├── shows.tsx
│       └── api.ts
├── backend/           # Node.js / Express API
│   ├── server.js
│   ├── seed.sql       # Δεδομένα βάσης (5 θέατρα, 15 παραστάσεις)
│   └── .env.example
└── make_pptx.js       # Παραγωγή PowerPoint παρουσίασης
```

---

## Οδηγίες Εγκατάστασης

### Προαπαιτούμενα

- [Node.js](https://nodejs.org/) v18+
- [XAMPP](https://www.apachefriends.org/) (για MariaDB)
- [Expo Go](https://expo.dev/client) στο κινητό σου ή Android Emulator

---

### 1. Κλωνοποίηση Repository

```bash
git clone https://github.com/<username>/theatre_project.git
cd theatre_project
```

---

### 2. Ρύθμιση Βάσης Δεδομένων

1. Άνοιξε το **XAMPP** και εκκίνησε την υπηρεσία **MySQL/MariaDB**
2. Άνοιξε το phpMyAdmin (http://localhost/phpmyadmin)
3. Δημιούργησε νέα βάση με όνομα `theatre_booking`
4. Εισήγαγε τα δεδομένα:

```bash
mysql -u root -p theatre_booking < backend/seed.sql
```

---

### 3. Ρύθμιση Backend

```bash
cd backend
npm install
```

Δημιούργησε αρχείο `.env` στον φάκελο `backend/`:

```env
DB_HOST=127.0.0.1
DB_USER=root
DB_PASS=your_password
DB_NAME=theatre_booking
DB_PORT=3306
PORT=3000
JWT_SECRET=your_secret_key_here
```

Εκκίνηση server:

```bash
node server.js
```

Ο server τρέχει στο `http://0.0.0.0:3000`

---

### 4. Ρύθμιση Frontend

```bash
cd frontend
npm install
```

Στο αρχείο `frontend/app/api.ts`, άλλαξε το `API_BASE_URL` με την IP της μηχανής σου:

```ts
export const API_BASE_URL = 'http://<η-IP-σου>:3000';
```

> Για να βρεις την IP σου: `ipconfig` (Windows) → IPv4 Address

Εκκίνηση εφαρμογής:

```bash
npx expo start
```

Σκάναρε το QR code με την εφαρμογή **Expo Go** στο κινητό σου.

---

### 5. (Προαιρετικό) Παραγωγή PowerPoint

```bash
cd ..
node make_pptx.js
```

Δημιουργείται το αρχείο `TheatrePass_Presentation.pptx` στην επιφάνεια εργασίας.

---
## API Endpoints

| Method | Endpoint | Περιγραφή | Auth |
|--------|----------|-----------|------|
| POST | `/register` | Εγγραφή νέου χρήστη | ❌ |
| POST | `/login` | Σύνδεση, επιστρέφει JWT | ❌ |
| GET | `/theatres` | Λίστα θεάτρων | ❌ |
| GET | `/theatres/:id/shows` | Παραστάσεις θεάτρου | ❌ |
| POST | `/bookings` | Νέα κράτηση | ✅ |
| GET | `/my-bookings` | Κρατήσεις χρήστη | ✅ |
| DELETE | `/bookings/:id` | Ακύρωση κράτησης | ✅ |

---

## Διαθέσιμα Θέατρα (Seed Data)

| Θέατρο | Πόλη | Παραστάσεις |
|--------|------|-------------|
| Odeon de Paris | Paris | Les Misérables, Phantom of the Opera, Cyrano de Bergerac |
| La Scala Milano | Milano | La Traviata, Rigoletto, Madama Butterfly |
| Globe Theatre London | London | Hamlet, A Midsummer Night's Dream, Macbeth |
| Burgtheater Wien | Wien | Faust I, Don Carlos, The Cherry Orchard |
| Broadway Palace NY | New York | Chicago, West Side Story, Hamilton |
