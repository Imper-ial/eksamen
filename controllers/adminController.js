const argon2 = require('argon2');
const User = require('../models/User');

const ALLOWED_ROLES = ['admin', 'it', 'drift'];

// vis liste over brukere
exports.listUsers = async (req, res) => {
  try {
    const users = await User.find().sort({ username: 1 });
    res.render('admin/users', {
      title: 'Brukere',
      users
    });
  } catch (err) {
    console.error('Feil ved henting av brukere:', err.message);
    res.status(500).render('error', {
      title: 'Serverfeil',
      message: 'Klarte ikke å hente brukere.'
    });
  }
};

// vis skjema for å opprette bruker
exports.showCreateUser = (req, res) => {
  res.render('admin/create-user', {
    title: 'Opprett bruker',
    error: null,
    username: '',
    role: ''
  });
};

// opprett ny bruker
exports.createUser = async (req, res) => {
  const { username, password, role } = req.body;

  // validering
  if (!username || !password || !role) {
    return res.status(400).render('admin/create-user', {
      title: 'Opprett bruker',
      error: 'Alle felt må fylles ut.',
      username: username || '',
      role: role || ''
    });
  }

  if (!ALLOWED_ROLES.includes(role)) {
    return res.status(400).render('admin/create-user', {
      title: 'Opprett bruker',
      error: 'Ugyldig rolle.',
      username,
      role: ''
    });
  }

  try {
    const existing = await User.findOne({ username });
    if (existing) {
      return res.status(400).render('admin/create-user', {
        title: 'Opprett bruker',
        error: 'Brukernavnet finnes allerede.',
        username,
        role
      });
    }

    const passwordHash = await argon2.hash(password);
    await User.create({ username, passwordHash, role });
    res.redirect('/admin/users');
  } catch (err) {
    console.error('Feil ved opprettelse av bruker:', err.message);
    res.status(500).render('admin/create-user', {
      title: 'Opprett bruker',
      error: 'Noe gikk galt. Prøv igjen.',
      username: username || '',
      role: role || ''
    });
  }
};
