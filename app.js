require('dotenv').config();

const express = require('express');
const path = require('path');
const session = require('express-session');

const connectDB = require('./config/db');
const indexRoutes = require('./routes/indexRoutes');
const authRoutes = require('./routes/authRoutes');
const adminRoutes = require('./routes/adminRoutes');
const incidentRoutes = require('./routes/incidentRoutes');
const { setCurrentUser } = require('./middleware/authMiddleware');

const app = express();
const PORT = process.env.PORT || 3000;

// koble til mongodb
connectDB();

// view engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// statisk mappe for css og bilder
app.use(express.static(path.join(__dirname, 'public')));

// les skjema-data fra forms
app.use(express.urlencoded({ extended: false }));

// sesjon for innlogging
app.use(session({
  secret: process.env.SESSION_SECRET || 'utrygg_fallback',
  resave: false,
  saveUninitialized: false
}));

// gjør innlogget bruker tilgjengelig i alle views
app.use(setCurrentUser);

// ruter
app.use('/', authRoutes);
app.use('/admin', adminRoutes);
app.use('/incidents', incidentRoutes);
app.use('/', indexRoutes);

// 404
app.use((req, res) => {
  res.status(404).render('error', {
    title: 'Side ikke funnet',
    message: 'Siden du leter etter finnes ikke.'
  });
});

// feilhåndtering
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).render('error', {
    title: 'Serverfeil',
    message: 'Noe gikk galt på serveren.'
  });
});

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server kjører på http://localhost:${PORT}`);
});
