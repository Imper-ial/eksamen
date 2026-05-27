// seed-script som lager testbrukere og eksempel-hendelser
require('dotenv').config();
const mongoose = require('mongoose');
const argon2 = require('argon2');
const User = require('./models/User');
const Incident = require('./models/Incident');

// 2 admin + 5 it + 20 drift = 27 brukere
const testUsers = [
  // admin
  { name: 'Christian Bjørndal', password: 'Admin123!', role: 'admin' },
  { name: 'Ingrid Solberg',     password: 'Admin123!', role: 'admin' },

  // it
  { name: 'Marius Haugen',  password: 'It123!', role: 'it' },
  { name: 'Sara Nilsen',    password: 'It123!', role: 'it' },
  { name: 'Jonas Berg',     password: 'It123!', role: 'it' },
  { name: 'Emilie Karlsen', password: 'It123!', role: 'it' },
  { name: 'Tobias Lund',    password: 'It123!', role: 'it' },

  // drift
  { name: 'Anders Johansen',     password: 'Drift123!', role: 'drift' },
  { name: 'Maria Pedersen',      password: 'Drift123!', role: 'drift' },
  { name: 'Ole Hansen',          password: 'Drift123!', role: 'drift' },
  { name: 'Nora Eriksen',        password: 'Drift123!', role: 'drift' },
  { name: 'Henrik Olsen',        password: 'Drift123!', role: 'drift' },
  { name: 'Sofie Larsen',        password: 'Drift123!', role: 'drift' },
  { name: 'Martin Kristiansen',  password: 'Drift123!', role: 'drift' },
  { name: 'Emma Andersen',       password: 'Drift123!', role: 'drift' },
  { name: 'William Bakken',      password: 'Drift123!', role: 'drift' },
  { name: 'Thea Gundersen',      password: 'Drift123!', role: 'drift' },
  { name: 'Daniel Moen',         password: 'Drift123!', role: 'drift' },
  { name: 'Julie Amundsen',      password: 'Drift123!', role: 'drift' },
  { name: 'Mathias Iversen',     password: 'Drift123!', role: 'drift' },
  { name: 'Malin Strand',        password: 'Drift123!', role: 'drift' },
  { name: 'Fredrik Dahl',        password: 'Drift123!', role: 'drift' },
  { name: 'Ida Holm',            password: 'Drift123!', role: 'drift' },
  { name: 'Adrian Lie',          password: 'Drift123!', role: 'drift' },
  { name: 'Hanna Vik',           password: 'Drift123!', role: 'drift' },
  { name: 'Sander Eide',         password: 'Drift123!', role: 'drift' },
  { name: 'Aurora Hagen',        password: 'Drift123!', role: 'drift' }
];

// eksempel-hendelser (assignedTo/createdBy henvises til brukernavn over)
const testIncidents = [
  {
    title: 'Vannlekkasje i teknisk rom',
    description: 'Stor vannlekkasje oppdaget i teknisk rom i kjelleren. Vann renner på gulvet.',
    category: 'Vannlekkasje',
    priority: 'Kritisk',
    status: 'Åpen',
    assignedToName: 'Anders Johansen',
    createdByName: 'Christian Bjørndal'
  },
  {
    title: 'Brannalarm gir feilvarsler',
    description: 'Brannalarmen på rådhuset utløses uten grunn flere ganger om dagen.',
    category: 'Brannfare',
    priority: 'Høy',
    status: 'Under arbeid',
    assignedToName: 'Maria Pedersen',
    createdByName: 'Ingrid Solberg'
  },
  {
    title: 'Nettverksproblemer på rådhuset',
    description: 'Tregt nettverk og periodiske utfall i hele rådhuset siden i morges.',
    category: 'IT-feil',
    priority: 'Høy',
    status: 'Åpen',
    assignedToName: 'Marius Haugen',
    createdByName: 'Sara Nilsen'
  },
  {
    title: 'Strømbrudd i administrasjonsbygg',
    description: 'Strømmen er borte i hele administrasjonsbygget. Nødstrøm fungerer.',
    category: 'Strøm',
    priority: 'Kritisk',
    status: 'Under arbeid',
    assignedToName: 'Ole Hansen',
    createdByName: 'Christian Bjørndal'
  },
  {
    title: 'Printer virker ikke på servicetorget',
    description: 'Hovedprinteren på servicetorget gir feilmelding ved alle utskrifter.',
    category: 'IT-feil',
    priority: 'Lav',
    status: 'Åpen',
    assignedToName: 'Jonas Berg',
    createdByName: 'Emilie Karlsen'
  },
  {
    title: 'Lekkasje ved hovedinngang',
    description: 'Vann siver inn ved hovedinngangen når det regner kraftig.',
    category: 'Vannlekkasje',
    priority: 'Middels',
    status: 'Under arbeid',
    assignedToName: 'Nora Eriksen',
    createdByName: 'Henrik Olsen'
  },
  {
    title: 'Defekt adgangskontroll',
    description: 'Kortleseren ved bakinngangen slipper ikke inn ansatte med gyldig kort.',
    category: 'Annet',
    priority: 'Høy',
    status: 'Åpen',
    assignedToName: 'Sofie Larsen',
    createdByName: 'Ingrid Solberg'
  },
  {
    title: 'Ustabil WiFi i møterom',
    description: 'WiFi i møterom 3 mistet forbindelsen flere ganger under møte.',
    category: 'IT-feil',
    priority: 'Middels',
    status: 'Løst',
    assignedToName: 'Tobias Lund',
    createdByName: 'Martin Kristiansen'
  }
];

async function seedUsers() {
  for (const u of testUsers) {
    // hopper over hvis brukeren allerede finnes (sjekker på navn)
    const existing = await User.findOne({ name: u.name });
    if (existing) {
      console.log(`Bruker '${u.name}' finnes allerede - hopper over`);
      continue;
    }

    const passwordHash = await argon2.hash(u.password);
    await User.create({
      name: u.name,
      passwordHash,
      role: u.role
    });
    console.log(`Opprettet bruker '${u.name}' (${u.role})`);
  }
}

async function seedIncidents() {
  for (const i of testIncidents) {
    // hopper over hvis hendelsen allerede finnes (sjekker på tittel)
    const existing = await Incident.findOne({ title: i.title });
    if (existing) {
      console.log(`Hendelse '${i.title}' finnes allerede - hopper over`);
      continue;
    }

    const assignedTo = await User.findOne({ name: i.assignedToName });
    const createdBy  = await User.findOne({ name: i.createdByName });

    if (!assignedTo || !createdBy) {
      console.warn(`Mangler bruker for '${i.title}' - hopper over`);
      continue;
    }

    await Incident.create({
      title: i.title,
      description: i.description,
      category: i.category,
      priority: i.priority,
      status: i.status,
      assignedTo: assignedTo._id,
      createdBy: createdBy._id
    });
    console.log(`Opprettet hendelse '${i.title}' (${i.category}, ${i.priority})`);
  }
}

async function seed() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Tilkoblet MongoDB');

    await seedUsers();
    await seedIncidents();

    console.log('Seed ferdig');
  } catch (err) {
    console.error('Feil under seeding:', err.message);
  } finally {
    await mongoose.disconnect();
  }
}

seed();
