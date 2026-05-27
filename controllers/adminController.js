const argon2 = require('argon2');
const User = require('../models/User');

const ALLOWED_ROLES = ['admin', 'it', 'drift'];

// vis liste over brukere
exports.listUsers = async (req, res) => {
  try {
    const users = await User.find().sort({ name: 1 });
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
    name: '',
    role: ''
  });
};

// opprett ny bruker
exports.createUser = async (req, res) => {
  const { name, password, role } = req.body;

  // validering
  if (!name || !password || !role) {
    return res.status(400).render('admin/create-user', {
      title: 'Opprett bruker',
      error: 'Alle felt må fylles ut.',
      name: name || '',
      role: role || ''
    });
  }

  if (!ALLOWED_ROLES.includes(role)) {
    return res.status(400).render('admin/create-user', {
      title: 'Opprett bruker',
      error: 'Ugyldig rolle.',
      name,
      role: ''
    });
  }

  try {
    const existing = await User.findOne({ name });
    if (existing) {
      return res.status(400).render('admin/create-user', {
        title: 'Opprett bruker',
        error: 'Navnet finnes allerede.',
        name,
        role
      });
    }

    const passwordHash = await argon2.hash(password);
    await User.create({ name, passwordHash, role });
    res.redirect('/admin/users');
  } catch (err) {
    console.error('Feil ved opprettelse av bruker:', err.message);
    res.status(500).render('admin/create-user', {
      title: 'Opprett bruker',
      error: 'Noe gikk galt. Prøv igjen.',
      name: name || '',
      role: role || ''
    });
  }
};
