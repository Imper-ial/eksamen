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
    username: ''
  });
};

// behandle innsendt login-skjema
exports.login = async (req, res) => {
  const { username, password } = req.body;

  //validering
  if (!username || !password) {
    return res.status(400).render('auth/login', {
      title: 'Logg inn',
      error: 'Brukernavn og passord må fylles ut.',
      username: username || ''
    });
  }

  try {
    const user = await User.findOne({ username });

    // bruker finnes ikke
    if (!user) {
      return res.status(401).render('auth/login', {
        title: 'Logg inn',
        error: 'Feil brukernavn eller passord.',
        username
      });
    }

    // sjekk passord mot hash
    const ok = await argon2.verify(user.passwordHash, password);
    if (!ok) {
      return res.status(401).render('auth/login', {
        title: 'Logg inn',
        error: 'Feil brukernavn eller passord.',
        username
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
      username: username || ''
    });
  }
};

// logg ut og slett session
exports.logout = (req, res) => {
  req.session.destroy(() => {
    res.redirect('/login');
  });
};
