const Incident = require('../models/Incident');
const User = require('../models/User');
const ActionLog = require('../models/ActionLog');

const CATEGORIES = ['Vannlekkasje', 'Brannfare', 'IT-feil', 'Strøm', 'Annet'];
const PRIORITIES = ['Lav', 'Middels', 'Høy', 'Kritisk'];
const STATUSES = ['Åpen', 'Under arbeid', 'Løst'];

// liste over hendelser med valgfri filtrering via query params
exports.list = async (req, res) => {
  try {
    const { status, priority, category } = req.query;

    // bygg filter ut fra valgte query params
    const filter = {};
    if (status   && STATUSES.includes(status))     filter.status = status;
    if (priority && PRIORITIES.includes(priority)) filter.priority = priority;
    if (category && CATEGORIES.includes(category)) filter.category = category;

    const incidents = await Incident.find(filter)
      .populate('assignedTo', 'name role')
      .populate('createdBy', 'name role')
      .sort({ createdAt: -1 });

    res.render('incidents/index', {
      title: 'Hendelser',
      incidents,
      statuses: STATUSES,
      priorities: PRIORITIES,
      categories: CATEGORIES,
      filters: {
        status: status || '',
        priority: priority || '',
        category: category || ''
      }
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
    const users = await User.find().select('name role').sort({ name: 1 });
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
    const users = await User.find().select('name role').sort({ name: 1 });
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
    const users = await User.find().select('name role').sort({ name: 1 });
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
    const users = await User.find().select('name role').sort({ name: 1 });
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
      .populate('assignedTo', 'name role')
      .populate('createdBy', 'name role');

    if (!incident) {
      return res.status(404).render('error', {
        title: 'Ikke funnet',
        message: 'Hendelsen finnes ikke.'
      });
    }

    // hent brukere til ansvarlig-dropdown
    const users = await User.find().select('name role').sort({ name: 1 });

    // hent tiltaksloggen for hendelsen, nyeste først
    const logs = await ActionLog.find({ incident: incident._id })
      .populate('user', 'name role')
      .sort({ createdAt: -1 });

    res.render('incidents/show', {
      title: incident.title,
      incident,
      users,
      logs,
      statuses: STATUSES,
      priorities: PRIORITIES,
      error: null
    });
  } catch (err) {
    console.error('Feil ved henting av hendelse:', err.message);
    res.status(500).render('error', {
      title: 'Serverfeil',
      message: 'Klarte ikke å hente hendelsen.'
    });
  }
};

// oppdater status, kritikalitet og ansvarlig
exports.update = async (req, res) => {
  const { status, priority, assignedTo } = req.body;

  // enkel validering
  if (!STATUSES.includes(status) ||
      !PRIORITIES.includes(priority) ||
      !assignedTo) {
    return res.status(400).render('error', {
      title: 'Ugyldig data',
      message: 'Status, kritikalitet og ansvarlig må være gyldige verdier.'
    });
  }

  try {
    const incident = await Incident.findById(req.params.id);
    if (!incident) {
      return res.status(404).render('error', {
        title: 'Ikke funnet',
        message: 'Hendelsen finnes ikke.'
      });
    }

    incident.status = status;
    incident.priority = priority;
    incident.assignedTo = assignedTo;
    // save() trigger timestamps slik at updatedAt blir oppdatert
    await incident.save();

    res.redirect(`/incidents/${incident._id}`);
  } catch (err) {
    console.error('Feil ved oppdatering av hendelse:', err.message);
    res.status(500).render('error', {
      title: 'Serverfeil',
      message: 'Klarte ikke å oppdatere hendelsen.'
    });
  }
};
