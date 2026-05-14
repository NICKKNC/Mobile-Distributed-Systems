SET NAMES utf8mb4;

-- Theatres
INSERT INTO theatres (name, location, description) VALUES
  ('Odeon de Paris',       'Paris, Place de l''Odeon 1',        'Θεατρικός χώρος του 18ου αιώνα στην καρδιά του Παρισιού.'),
  ('La Scala Milano',      'Milano, Via Filodrammatici 2',      'Το πιο φημισμένο οπερατικό θέατρο στον κόσμο.'),
  ('Globe Theatre London', 'London, 21 New Globe Walk',         'Αναπαλαίωση του θεάτρου του Σαίξπηρ στο Southwark.'),
  ('Burgtheater Wien',     'Wien, Universitaetsring 2',         'Το εθνικό θέατρο της Αυστρίας, από τα παλαιότερα στην Ευρώπη.'),
  ('Broadway Palace NY',   'New York, 1681 Broadway',           'Εικονική σκηνή στο θρυλικό Broadway της Νέας Υόρκης.');

-- Shows for Odeon de Paris (theatre_id = 1)
INSERT INTO shows (theatre_id, title, description, duration, age_rating, price, date, location) VALUES
  (1, 'Les Miserables',         'Το επικό μιούζικαλ βασισμένο στο μυθιστόρημα του Victor Hugo.',       165, '12+', 38.00, '2026-06-14 20:00:00', 'Grande Salle'),
  (1, 'Phantom of the Opera',   'Η αθάνατη ιστορία αγάπης κάτω από την Opera de Paris.',               150, '12+', 42.00, '2026-06-21 19:30:00', 'Grande Salle'),
  (1, 'Cyrano de Bergerac',     'Η ρομαντική τραγωδία του Edmond Rostand με σπαθιά και ποίηση.',        125, '15+', 28.00, '2026-06-28 20:30:00', 'Petite Salle');

-- Shows for La Scala Milano (theatre_id = 2)
INSERT INTO shows (theatre_id, title, description, duration, age_rating, price, date, location) VALUES
  (2, 'La Traviata',            'Η αριστουργηματική όπερα του Giuseppe Verdi.',                         140, 'ALL', 55.00, '2026-06-12 19:00:00', 'Palco Centrale'),
  (2, 'Rigoletto',              'Σκοτεινή τραγωδία του Verdi με έναν κωμικό ως ήρωα.',                  125, '12+', 48.00, '2026-06-19 20:00:00', 'Palco Centrale'),
  (2, 'Madama Butterfly',       'Η συγκινητική όπερα του Puccini για έναν αδύνατο έρωτα.',              145, 'ALL', 52.00, '2026-06-26 19:30:00', 'Palco Laterale');

-- Shows for Globe Theatre London (theatre_id = 3)
INSERT INTO shows (theatre_id, title, description, duration, age_rating, price, date, location) VALUES
  (3, 'Hamlet',                 'Το αριστούργημα του Shakespeare για εκδίκηση και αμφιβολία.',           175, '15+', 36.00, '2026-06-13 18:30:00', 'Main Stage'),
  (3, 'A Midsummer Night Dream','Η μαγευτική κωμωδία του Shakespeare στο δάσος.',                       130, 'ALL', 32.00, '2026-06-20 20:00:00', 'Main Stage'),
  (3, 'Macbeth',                'Φιλοδοξία, εξουσία και εγκλήματα — ο Σαίξπηρ στο σκοτεινότερό του.', 140, '15+', 34.00, '2026-06-27 19:00:00', 'Yard Stage');

-- Shows for Burgtheater Wien (theatre_id = 4)
INSERT INTO shows (theatre_id, title, description, duration, age_rating, price, date, location) VALUES
  (4, 'Faust I',                'Το μεγαλειώδες έργο του Goethe για τη σύμβαση με τον διάβολο.',        180, '15+', 45.00, '2026-06-15 18:00:00', 'Grosses Haus'),
  (4, 'Don Carlos',             'Πολιτική τραγωδία του Schiller για ισπανική βασιλική αυλή.',            155, '12+', 40.00, '2026-06-22 19:30:00', 'Grosses Haus'),
  (4, 'The Cherry Orchard',     'Η χαρακτηριστική κωμωδία του Chekhov για αλλαγή και νοσταλγία.',       120, 'ALL', 35.00, '2026-06-29 20:00:00', 'Vestibül');

-- Shows for Broadway Palace NY (theatre_id = 5)
INSERT INTO shows (theatre_id, title, description, duration, age_rating, price, date, location) VALUES
  (5, 'Chicago',                'Το εμβληματικό μιούζικαλ για δολοφονία, δικαστήριο και δόξα.',         135, '15+', 65.00, '2026-06-16 20:00:00', 'Main Stage'),
  (5, 'West Side Story',        'Ο αιώνιος έρωτας ανάμεσα σε αντίπαλες συμμορίες της Νέας Υόρκης.',    155, '12+', 58.00, '2026-06-23 19:00:00', 'Main Stage'),
  (5, 'Hamilton',               'Το επαναστατικό hip-hop μιούζικαλ για τον ιδρυτή της Αμερικής.',       160, 'ALL', 72.00, '2026-06-30 20:30:00', 'VIP Loge');
