const argon2 = require('argon2');
const User = require('../models/User');

// vis login-skjema
exports.showLogin = (req, res) => {
  if (req.session && req.session.userId) {
    return res.redirect('/');
  }
  res.render('auth/login', {
    title: 'Logg inn',
    error: null,
    name: ''
  });
};

// behandle innsendt login-skjema
exports.login = async (req, res) => {
  const { name, password } = req.body;

  // validering
  if (!name || !password) {
    return res.status(400).render('auth/login', {
      title: 'Logg inn',
      error: 'Fullt navn og passord må fylles ut.',
      name: name || ''
    });
  }

  try {
    const user = await User.findOne({ name });

    // bruker finnes ikke
    if (!user) {
      return res.status(401).render('auth/login', {
        title: 'Logg inn',
        error: 'Feil navn eller passord.',
        name
      });
    }

    // sjekk passord mot hash
    const ok = await argon2.verify(user.passwordHash, password);
    if (!ok) {
      return res.status(401).render('auth/login', {
        title: 'Logg inn',
        error: 'Feil navn eller passord.',
        name
      });
    }

    // lagre brukeren i session
    req.session.userId = user._id;
    res.redirect('/');
  } catch (err) {
    console.error('Login-feil:', err.message);
    res.status(500).render('auth/login', {
      title: 'Logg inn',
      error: 'Noe gikk galt. Prøv igjen.',
      name: name || ''
    });
  }
};

// logg ut og slett session
exports.logout = (req, res) => {
  req.session.destroy(() => {
    res.redirect('/login');
  });
};
