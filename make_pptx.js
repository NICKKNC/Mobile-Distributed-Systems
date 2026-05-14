const PptxGenJS = require('pptxgenjs');
const pptx = new PptxGenJS();

pptx.layout = 'LAYOUT_16x9';

// ── Palette ──────────────────────────────────────────────
const BG_DARK   = '1B2232';
const BG_MID    = '242D3F';
const BLUE      = '3B82F6';
const BLUE_LIGHT= '93C5FD';
const WHITE     = 'FFFFFF';
const GRAY      = '94A3B8';
const CARD      = '1E2D45';

// ── Helper: dark slide base ───────────────────────────────
function darkSlide(pptx) {
  const slide = pptx.addSlide();
  slide.addShape(pptx.ShapeType.rect, { x: 0, y: 0, w: '100%', h: '100%', fill: { color: BG_DARK } });
  return slide;
}

// ── Helper: accent bar top ────────────────────────────────
function accentBar(slide) {
  slide.addShape(pptx.ShapeType.rect, { x: 0, y: 0, w: '100%', h: 0.08, fill: { color: BLUE } });
}

// ── Helper: section title ─────────────────────────────────
function sectionTitle(slide, text) {
  slide.addText(text, {
    x: 0.5, y: 0.18, w: 9, h: 0.55,
    fontSize: 26, bold: true, color: WHITE, fontFace: 'Calibri',
  });
  slide.addShape(pptx.ShapeType.rect, { x: 0.5, y: 0.75, w: 1.2, h: 0.04, fill: { color: BLUE } });
}

// ── Helper: bullet list ───────────────────────────────────
function bullets(slide, items, x, y, w, h) {
  const rows = items.map(t => ({ text: t, options: { bullet: { type: 'bullet', indent: 20 }, paraSpaceAfter: 6 } }));
  slide.addText(rows, {
    x, y, w, h,
    fontSize: 15, color: 'CBD5E1', fontFace: 'Calibri', valign: 'top',
  });
}

// ── Helper: card box ──────────────────────────────────────
function card(slide, x, y, w, h, title, body, titleColor) {
  slide.addShape(pptx.ShapeType.roundRect, { x, y, w, h, fill: { color: CARD }, line: { color: '2D4A6B', width: 1 }, rectRadius: 0.12 });
  slide.addText(title, { x: x + 0.15, y: y + 0.12, w: w - 0.3, h: 0.32, fontSize: 13, bold: true, color: titleColor || BLUE_LIGHT, fontFace: 'Calibri' });
  slide.addText(body,  { x: x + 0.15, y: y + 0.44, w: w - 0.3, h: h - 0.55, fontSize: 12, color: 'CBD5E1', fontFace: 'Calibri', wrap: true });
}

// ════════════════════════════════════════════════════════
// SLIDE 1 — Κενή (συμπληρώνει ο χρήστης)
// ════════════════════════════════════════════════════════
darkSlide(pptx);

// ════════════════════════════════════════════════════════
// SLIDE 2 — Εισαγωγή
// ════════════════════════════════════════════════════════
{
  const s = darkSlide(pptx); accentBar(s);
  sectionTitle(s, 'Εισαγωγή & Στόχος Εργασίας');
  s.addText(
    'Η εργασία αφορά την ανάπτυξη μιας ολοκληρωμένης εφαρμογής διαδικτυακής κράτησης εισιτηρίων για θέατρα και κινηματογράφους. Ο χρήστης μπορεί να εγγραφεί, να συνδεθεί, να αναζητήσει θέατρα, να δει τις διαθέσιμες παραστάσεις και να ολοκληρώσει κράτηση.',
    { x: 0.5, y: 1.0, w: 9, h: 1.3, fontSize: 16, color: 'CBD5E1', fontFace: 'Calibri', wrap: true }
  );
  bullets(s, [
    'Πλήρης διαχείριση χρηστών (εγγραφή / σύνδεση / αποσύνδεση)',
    'Αναζήτηση και επιλογή θεάτρου από διεθνή λίστα',
    'Προβολή παραστάσεων με αναλυτικές πληροφορίες',
    'Σύστημα κρατήσεων με δυνατότητα ακύρωσης',
    'Ασφαλής επικοινωνία Frontend ↔ Backend μέσω JWT',
  ], 0.5, 2.4, 9, 2.2);
  s.addNotes(`Καλημέρα / Καλησπέρα σε όλους. Η εργασία μου αφορά την ανάπτυξη μιας ολοκληρωμένης εφαρμογής κράτησης εισιτηρίων για θέατρα και κινηματογράφους. Ονομάζεται CinemaPass.

Ο βασικός στόχος ήταν να δημιουργήσω μια πλήρη εφαρμογή από το μηδέν — δηλαδή να έχω Frontend, Backend και Βάση Δεδομένων που να επικοινωνούν μεταξύ τους.

Ο χρήστης μπορεί να εγγραφεί, να συνδεθεί με ασφάλεια, να βρει θέατρα, να δει παραστάσεις με λεπτομέρειες και να κάνει κράτηση εισιτηρίου — όλα μέσα από μία εφαρμογή.`);
}

// ════════════════════════════════════════════════════════
// SLIDE 3 — Τεχνολογίες
// ════════════════════════════════════════════════════════
{
  const s = darkSlide(pptx); accentBar(s);
  sectionTitle(s, 'Τεχνολογίες που Χρησιμοποιήθηκαν');

  const techs = [
    { t: 'React Native / Expo',  b: 'Cross-platform mobile & web εφαρμογή. Expo Router για navigation.',        x: 0.4 },
    { t: 'TypeScript',           b: 'Στατική τυποποίηση για ασφαλέστερο και πιο συντηρήσιμο κώδικα.',           x: 3.5 },
    { t: 'Node.js / Express 5',  b: 'RESTful API Backend. Async/await, middleware, CORS.',                        x: 6.6 },
    { t: 'MariaDB',              b: 'Σχεσιακή βάση δεδομένων. Connection pooling μέσω mariadb npm package.',      x: 0.4 },
    { t: 'JWT & Bcrypt',         b: 'Ασφαλής αυθεντικοποίηση. Κρυπτογράφηση κωδικών & token-based auth.',        x: 3.5 },
    { t: 'Axios',                b: 'HTTP client με interceptors για αυτόματη αποστολή Authorization header.',     x: 6.6 },
  ];

  techs.slice(0, 3).forEach(t => card(s, t.x, 0.9, 2.8, 1.5, t.t, t.b, BLUE_LIGHT));
  techs.slice(3).forEach(t => card(s, t.x, 2.55, 2.8, 1.5, t.t, t.b, BLUE_LIGHT));
}

// ════════════════════════════════════════════════════════
// SLIDE 4 — Αρχιτεκτονική
// ════════════════════════════════════════════════════════
{
  const s = darkSlide(pptx); accentBar(s);
  sectionTitle(s, 'Αρχιτεκτονική Συστήματος');

  // Three boxes: Frontend | Backend | DB
  const boxes = [
    { label: 'FRONTEND', sub: 'Expo / React Native\nTypeScript\nAxios + Context API', x: 0.4 },
    { label: 'BACKEND',  sub: 'Node.js / Express 5\nREST API\nJWT Auth Middleware',   x: 3.7 },
    { label: 'DATABASE', sub: 'MariaDB\nConnection Pool\nParameterized Queries',       x: 7.0 },
  ];

  boxes.forEach(b => {
    s.addShape(pptx.ShapeType.roundRect, { x: b.x, y: 1.1, w: 2.8, h: 2.6, fill: { color: CARD }, line: { color: BLUE, width: 2 }, rectRadius: 0.15 });
    s.addText(b.label, { x: b.x, y: 1.3, w: 2.8, h: 0.45, align: 'center', fontSize: 15, bold: true, color: BLUE_LIGHT, fontFace: 'Calibri' });
    s.addShape(pptx.ShapeType.rect, { x: b.x + 0.3, y: 1.75, w: 2.2, h: 0.03, fill: { color: BLUE } });
    s.addText(b.sub, { x: b.x + 0.15, y: 1.85, w: 2.5, h: 1.6, align: 'center', fontSize: 13, color: 'CBD5E1', fontFace: 'Calibri', wrap: true });
  });

  // Arrows
  s.addShape(pptx.ShapeType.line, { x: 3.2, y: 2.4, w: 0.5, h: 0, line: { color: BLUE, width: 2 } });
  s.addShape(pptx.ShapeType.line, { x: 6.5, y: 2.4, w: 0.5, h: 0, line: { color: BLUE, width: 2 } });

  s.addText('HTTP / JSON', { x: 2.9, y: 3.75, w: 1.2, h: 0.3, align: 'center', fontSize: 11, color: GRAY, fontFace: 'Calibri' });
  s.addText('SQL Queries', { x: 6.1, y: 3.75, w: 1.2, h: 0.3, align: 'center', fontSize: 11, color: GRAY, fontFace: 'Calibri' });
}

// ════════════════════════════════════════════════════════
// SLIDE 5 — Βάση Δεδομένων
// ════════════════════════════════════════════════════════
{
  const s = darkSlide(pptx); accentBar(s);
  sectionTitle(s, 'Σχεδιασμός Βάσης Δεδομένων');

  const tables = [
    { name: 'users',    fields: 'user_id (PK)\nname\nemail\npassword (hashed)',                 x: 0.4,  y: 1.0 },
    { name: 'theatres', fields: 'theatre_id (PK)\nname\nlocation\ndescription',                 x: 2.75, y: 1.0 },
    { name: 'shows',    fields: 'show_id (PK)\ntheatre_id (FK)\ntitle · description\nprice · date · location · duration', x: 5.1,  y: 1.0 },
    { name: 'bookings', fields: 'booking_id (PK)\nuser_id (FK)\nshow_id (FK)\nbooking_date',    x: 7.45, y: 1.0 },
  ];

  tables.forEach(t => {
    s.addShape(pptx.ShapeType.roundRect, { x: t.x, y: t.y, w: 2.2, h: 2.1, fill: { color: CARD }, line: { color: BLUE, width: 1.5 }, rectRadius: 0.1 });
    s.addShape(pptx.ShapeType.roundRect, { x: t.x, y: t.y, w: 2.2, h: 0.45, fill: { color: BLUE }, line: { color: BLUE, width: 1.5 }, rectRadius: 0.1 });
    s.addText(t.name, { x: t.x, y: t.y + 0.06, w: 2.2, h: 0.35, align: 'center', fontSize: 13, bold: true, color: WHITE, fontFace: 'Calibri' });
    s.addText(t.fields, { x: t.x + 0.1, y: t.y + 0.55, w: 2.0, h: 1.4, fontSize: 11.5, color: 'CBD5E1', fontFace: 'Calibri', wrap: true });
  });

  s.addText('Σχέσεις: users → bookings → shows → theatres  (Foreign Keys)', {
    x: 0.4, y: 3.25, w: 9.2, h: 0.4, fontSize: 13, color: BLUE_LIGHT, fontFace: 'Calibri', bold: true,
  });
}

// ════════════════════════════════════════════════════════
// SLIDE 6 — Authentication
// ════════════════════════════════════════════════════════
{
  const s = darkSlide(pptx); accentBar(s);
  sectionTitle(s, 'Αυθεντικοποίηση Χρηστών');

  const left = [
    '1.  Εγγραφή: ο χρήστης στέλνει name, email, password',
    '2.  Ο server κρυπτογραφεί τον κωδικό με bcrypt (10 rounds)',
    '3.  Έλεγχος αν το email υπάρχει ήδη στη βάση',
    '4.  Αποθήκευση χρήστη στον πίνακα users',
    '',
    '5.  Σύνδεση: ο server αναζητά τον χρήστη με email',
    '6.  Σύγκριση κωδικού με bcrypt.compare()',
    '7.  Δημιουργία JWT token (24h expiry)',
    '8.  Το token αποθηκεύεται στο AuthContext',
    '9.  Κάθε επόμενο request στέλνει: Authorization: Bearer <token>',
  ];

  bullets(s, left, 0.5, 1.0, 5.8, 3.5);

  card(s, 6.5, 1.0, 3.1, 1.4, 'JWT Payload', '{ id: user_id }\nExpires: 24h\nSecret: env variable', BLUE_LIGHT);
  card(s, 6.5, 2.55, 3.1, 1.4, 'Auth Middleware', 'Προστατεύει:\nPOST /bookings\nGET /my-bookings\nDELETE /bookings/:id', BLUE_LIGHT);
}

// ════════════════════════════════════════════════════════
// SLIDE 7 — Οθόνη Θεάτρων
// ════════════════════════════════════════════════════════
{
  const s = darkSlide(pptx); accentBar(s);
  sectionTitle(s, 'Οθόνη Θεάτρων');

  bullets(s, [
    'Φόρτωση θεάτρων από GET /theatres με αυτόματο loading indicator',
    'Live αναζήτηση (filter) ανά όνομα ή τοποθεσία',
    'Pull-to-refresh για ανανέωση της λίστας',
    'Κάθε κάρτα εμφανίζει: Όνομα, Πόλη, CTA "Παραστάσεις →"',
    'Tap σε κάρτα → πλοήγηση στις παραστάσεις του θεάτρου',
    'Retry button σε περίπτωση σφάλματος σύνδεσης',
  ], 0.5, 1.0, 5.6, 3.0);

  s.addText('Διαθέσιμα Θέατρα:', { x: 6.3, y: 1.0, w: 3.2, h: 0.4, fontSize: 13, bold: true, color: BLUE_LIGHT, fontFace: 'Calibri' });
  const theatres = ['Odeon de Paris', 'La Scala Milano', 'Globe Theatre London', 'Burgtheater Wien', 'Broadway Palace NY'];
  theatres.forEach((t, i) => {
    s.addShape(pptx.ShapeType.roundRect, { x: 6.3, y: 1.45 + i * 0.57, w: 3.2, h: 0.48, fill: { color: CARD }, line: { color: '2D4A6B', width: 1 }, rectRadius: 0.08 });
    s.addText(t, { x: 6.45, y: 1.5 + i * 0.57, w: 2.9, h: 0.35, fontSize: 12.5, color: WHITE, fontFace: 'Calibri' });
  });
}

// ════════════════════════════════════════════════════════
// SLIDE 8 — Οθόνη Παραστάσεων
// ════════════════════════════════════════════════════════
{
  const s = darkSlide(pptx); accentBar(s);
  sectionTitle(s, 'Οθόνη Παραστάσεων & Info Modal');

  bullets(s, [
    'Φόρτωση παραστάσεων από GET /theatres/:id/shows',
    'Κάθε κάρτα: τίτλος, αίθουσα, ημ/νία, τιμή, κουμπί κράτησης',
    'Κουμπί ⓘ → άνοιγμα Info Modal (χωρίς αλλαγή σελίδας)',
    'Info Modal: poster header, chips (τιμή / διάρκεια / ηλικία), περιγραφή',
    'Κράτηση μέσα από το modal — άμεση οπτική επιβεβαίωση (πράσινο ✓)',
    'Αποτροπή διπλής κράτησης (backend & frontend validation)',
  ], 0.5, 1.0, 5.6, 2.8);

  s.addText('Info Modal περιέχει:', { x: 6.3, y: 1.0, w: 3.3, h: 0.38, fontSize: 13, bold: true, color: BLUE_LIGHT, fontFace: 'Calibri' });
  const info = ['🎬  Poster header με εικονίδιο', '💶  Τιμή εισιτηρίου', '⏱  Διάρκεια (λεπτά)', '🛡  Ηλικιακή κατηγορία', '📅  Ημερομηνία & ώρα', '📍  Αίθουσα / Σκηνή', '📝  Αναλυτική περιγραφή'];
  info.forEach((line, i) => {
    s.addText(line, { x: 6.3, y: 1.48 + i * 0.43, w: 3.3, h: 0.38, fontSize: 12, color: 'CBD5E1', fontFace: 'Calibri' });
  });
}

// ════════════════════════════════════════════════════════
// SLIDE 9 — Κρατήσεις & Προφίλ
// ════════════════════════════════════════════════════════
{
  const s = darkSlide(pptx); accentBar(s);
  sectionTitle(s, 'Κρατήσεις & Προφίλ Χρήστη');

  card(s, 0.4, 1.0, 4.4, 2.0, '🎟  Οθόνη Κρατήσεων',
    'Λίστα όλων των κρατήσεων του συνδεδεμένου χρήστη\nΕμφάνιση: τίτλος, θέατρο, ημ/νία, τιμή\nΔυνατότητα ακύρωσης με Alert επιβεβαίωσης\nΑυτόματη ανανέωση της λίστας μετά την ακύρωση', BLUE_LIGHT);

  card(s, 5.1, 1.0, 4.4, 2.0, '👤  Προφίλ',
    'Εμφάνιση avatar με αρχικά ονόματος\nΠληροφορίες: Όνομα & Email χρήστη\nΈκδοση εφαρμογής\nΚουμπί Αποσύνδεσης με επιβεβαίωση', BLUE_LIGHT);

  s.addText('Backend endpoints για κρατήσεις:', { x: 0.4, y: 3.15, w: 4.4, h: 0.35, fontSize: 13, bold: true, color: BLUE_LIGHT, fontFace: 'Calibri' });
  bullets(s, [
    'POST /bookings  →  Νέα κράτηση (απαιτεί token)',
    'GET /my-bookings  →  Λίστα κρατήσεων χρήστη',
    'DELETE /bookings/:id  →  Ακύρωση κράτησης',
  ], 0.5, 3.55, 9, 1.1);
}

// ════════════════════════════════════════════════════════
// SLIDE 10 — Backend API
// ════════════════════════════════════════════════════════
{
  const s = darkSlide(pptx); accentBar(s);
  sectionTitle(s, 'Backend REST API Endpoints');

  const endpoints = [
    { m: 'POST',   e: '/register',          d: 'Εγγραφή νέου χρήστη. Bcrypt hash, duplicate check.',   auth: false },
    { m: 'POST',   e: '/login',             d: 'Σύνδεση. Επιστρέφει JWT token, user_id, name.',         auth: false },
    { m: 'GET',    e: '/theatres',          d: 'Λίστα όλων των θεάτρων.',                                auth: false },
    { m: 'GET',    e: '/theatres/:id/shows',d: 'Παραστάσεις συγκεκριμένου θεάτρου.',                    auth: false },
    { m: 'POST',   e: '/bookings',          d: 'Νέα κράτηση. Έλεγχος διπλοεγγραφής.',                  auth: true  },
    { m: 'GET',    e: '/my-bookings',       d: 'Κρατήσεις χρήστη (JOIN με shows & theatres).',           auth: true  },
    { m: 'DELETE', e: '/bookings/:id',      d: 'Ακύρωση κράτησης (μόνο ο ιδιοκτήτης).',                auth: true  },
  ];

  const mColors = { GET: '16A34A', POST: '2563EB', DELETE: 'DC2626' };

  endpoints.forEach((ep, i) => {
    const y = 0.98 + i * 0.53;
    s.addShape(pptx.ShapeType.roundRect, { x: 0.4, y, w: 9.2, h: 0.46, fill: { color: CARD }, line: { color: '2D4A6B', width: 1 }, rectRadius: 0.07 });
    s.addShape(pptx.ShapeType.roundRect, { x: 0.4, y: y + 0.06, w: 0.9, h: 0.32, fill: { color: mColors[ep.m] || BLUE }, rectRadius: 0.05 });
    s.addText(ep.m, { x: 0.4, y: y + 0.08, w: 0.9, h: 0.28, align: 'center', fontSize: 10, bold: true, color: WHITE, fontFace: 'Calibri' });
    s.addText(ep.e, { x: 1.38, y: y + 0.07, w: 2.5, h: 0.3, fontSize: 12, bold: true, color: BLUE_LIGHT, fontFace: 'Courier New' });
    s.addText(ep.d, { x: 4.0, y: y + 0.07, w: 4.5, h: 0.3, fontSize: 12, color: 'CBD5E1', fontFace: 'Calibri' });
    if (ep.auth) s.addText('🔒', { x: 8.8, y: y + 0.07, w: 0.5, h: 0.3, fontSize: 14 });
  });
}

// ════════════════════════════════════════════════════════
// SLIDE 11 — Ασφάλεια & Σύνοψη
// ════════════════════════════════════════════════════════
{
  const s = darkSlide(pptx); accentBar(s);
  sectionTitle(s, 'Ασφάλεια & Βασικά Χαρακτηριστικά');

  card(s, 0.4, 1.0, 4.3, 1.55, '🔐  Ασφάλεια',
    '• JWT token authentication (24h)\n• Bcrypt password hashing (10 rounds)\n• Parameterized SQL queries (SQL injection protection)\n• Duplicate booking prevention\n• Token stored in React Context', BLUE_LIGHT);

  card(s, 4.9, 1.0, 4.7, 1.55, '📱  UX & Navigation',
    '• Expo Router — file-based navigation\n• Tab bar: Θέατρα / Κρατήσεις / Προφίλ\n• Pull-to-refresh, retry buttons\n• Toast notifications για feedback\n• Info Modal χωρίς αλλαγή σελίδας', BLUE_LIGHT);

  card(s, 0.4, 2.7, 4.3, 1.55, '🗄  Βάση Δεδομένων',
    '• MariaDB 12.2 με Connection Pooling\n• 4 πίνακες με Foreign Keys\n• 5 διεθνή θέατρα, 15 παραστάσεις\n• JOIN queries για my-bookings\n• XAMPP τοπικό περιβάλλον', BLUE_LIGHT);

  card(s, 4.9, 2.7, 4.7, 1.55, '🚀  Deployment-Ready',
    '• .env για όλες τις ευαίσθητες τιμές\n• dotenv με __dirname path fix\n• CORS enabled για cross-origin\n• 0.0.0.0 bind για δικτυακή πρόσβαση\n• Modular component architecture', BLUE_LIGHT);
}

// ════════════════════════════════════════════════════════
// SLIDE 12 — Κενή (συμπληρώνει ο χρήστης)
// ════════════════════════════════════════════════════════
darkSlide(pptx);

// ── Save ────────────────────────────────────────────────
pptx.writeFile({ fileName: 'C:/Users/loizo/Desktop/CinemaPass_Presentation.pptx' })
  .then(() => console.log('✅  Αποθηκεύτηκε: CinemaPass_Presentation.pptx'))
  .catch(e => console.error('❌  Σφάλμα:', e));
