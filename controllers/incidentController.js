const Incident = require('../models/Incident');
const User = require('../models/User');

const CATEGORIES = ['Vannlekkasje', 'Brannfare', 'IT-feil', 'Strøm', 'Annet'];
const PRIORITIES = ['Lav', 'Middels', 'Høy', 'Kritisk'];

// liste over alle hendelser
exports.list = async (req, res) => {
  try {
    const incidents = await Incident.find()
      .populate('assignedTo', 'username role')
      .populate('createdBy', 'username role')
      .sort({ createdAt: -1 });

    res.render('incidents/index', {
      title: 'Hendelser',
      incidents
    });
  } catch (err) {
    console.error('Feil ved henting av hendelser:', err.message);
    res.status(500).render('error', {
      title: 'Serverfeil',
      message: 'Klarte ikke å hente hendelser.'
    });
  }
};

// vis skjema for ny hendelse
exports.showCreate = async (req, res) => {
  try {
    const users = await User.find().select('username role').sort({ username: 1 });
    res.render('incidents/create', {
      title: 'Ny hendelse',
      error: null,
      users,
      categories: CATEGORIES,
      priorities: PRIORITIES,
      form: {
        title: '',
        description: '',
        category: '',
        priority: 'Middels',
        assignedTo: ''
      }
    });
  } catch (err) {
    console.error('Feil ved visning av skjema:', err.message);
    res.status(500).render('error', {
      title: 'Serverfeil',
      message: 'Klarte ikke å vise skjema.'
    });
  }
};

// opprett ny hendelse
exports.create = async (req, res) => {
  const { title, description, category, priority, assignedTo } = req.body;

  // valider at alle felt er fylt ut
  if (!title || !description || !category || !priority || !assignedTo) {
    const users = await User.find().select('username role').sort({ username: 1 });
    return res.status(400).render('incidents/create', {
      title: 'Ny hendelse',
      error: 'Alle felt må fylles ut.',
      users,
      categories: CATEGORIES,
      priorities: PRIORITIES,
      form: {
        title: title || '',
        description: description || '',
        category: category || '',
        priority: priority || 'Middels',
        assignedTo: assignedTo || ''
      }
    });
  }

  // valider kategori og kritikalitet
  if (!CATEGORIES.includes(category) || !PRIORITIES.includes(priority)) {
    const users = await User.find().select('username role').sort({ username: 1 });
    return res.status(400).render('incidents/create', {
      title: 'Ny hendelse',
      error: 'Ugyldig kategori eller kritikalitet.',
      users,
      categories: CATEGORIES,
      priorities: PRIORITIES,
      form: { title, description, category: '', priority: 'Middels', assignedTo }
    });
  }

  try {
    await Incident.create({
      title,
      description,
      category,
      priority,
      // status starter alltid som "Åpen"
      status: 'Åpen',
      assignedTo,
      createdBy: req.session.userId
    });
    res.redirect('/incidents');
  } catch (err) {
    console.error('Feil ved oppretting av hendelse:', err.message);
    const users = await User.find().select('username role').sort({ username: 1 });
    res.status(500).render('incidents/create', {
      title: 'Ny hendelse',
      error: 'Noe gikk galt. Prøv igjen.',
      users,
      categories: CATEGORIES,
      priorities: PRIORITIES,
      form: { title, description, category, priority, assignedTo }
    });
  }
};

// vis detaljer for én hendelse
exports.show = async (req, res) => {
  try {
    const incident = await Incident.findById(req.params.id)
      .populate('assignedTo', 'username role')
      .populate('createdBy', 'username role');

    if (!incident) {
      return res.status(404).render('error', {
        title: 'Ikke funnet',
        message: 'Hendelsen finnes ikke.'
      });
    }

    res.render('incidents/show', {
      title: incident.title,
      incident
    });
  } catch (err) {
    console.error('Feil ved henting av hendelse:', err.message);
    res.status(500).render('error', {
      title: 'Serverfeil',
      message: 'Klarte ikke å hente hendelsen.'
    });
  }
};
