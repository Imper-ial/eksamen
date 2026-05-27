const ActionLog = require('../models/ActionLog');
const Incident = require('../models/Incident');

// legg til et nytt tiltak/loggnotat på en hendelse
exports.create = async (req, res) => {
  const { message } = req.body;
  const incidentId = req.params.id;

  // valider at meldingen ikke er tom
  if (!message || !message.trim()) {
    return res.status(400).render('error', {
      title: 'Ugyldig tiltak',
      message: 'Tiltaket kan ikke være tomt.'
    });
  }

  try {
    // sjekk at hendelsen finnes
    const exists = await Incident.exists({ _id: incidentId });
    if (!exists) {
      return res.status(404).render('error', {
        title: 'Ikke funnet',
        message: 'Hendelsen finnes ikke.'
      });
    }

    await ActionLog.create({
      incident: incidentId,
      user: req.session.userId,
      message: message.trim()
    });

    res.redirect(`/incidents/${incidentId}`);
  } catch (err) {
    console.error('Feil ved lagring av tiltak:', err.message);
    res.status(500).render('error', {
      title: 'Serverfeil',
      message: 'Klarte ikke å lagre tiltaket.'
    });
  }
};
