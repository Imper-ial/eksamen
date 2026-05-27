// seed-script som lager testbrukere for de tre rollene
require('dotenv').config();
const mongoose = require('mongoose');
const argon2 = require('argon2');
const User = require('./models/User');

const testUsers = [
  { username: 'snowcrashAdmin', password: 'admin!', role: 'admin' },
  { username: 'snowcrashIT',    password: 'admin!',    role: 'it' },
  { username: 'snowcrashDrift', password: 'admin!', role: 'drift' }
];

async function seed() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Tilkoblet MongoDB');

    for (const u of testUsers) {
      // hopper over hvis brukeren allerede finnes
      const existing = await User.findOne({ username: u.username });
      if (existing) {
        console.log(`Bruker '${u.username}' finnes allerede - hopper over`);
        continue;
      }

      const passwordHash = await argon2.hash(u.password);
      await User.create({
        username: u.username,
        passwordHash,
        role: u.role
      });
      console.log(`Opprettet bruker '${u.username}' (${u.role})`);
    }

    console.log('Seed ferdig');
  } catch (err) {
    console.error('Feil under seeding:', err.message);
  } finally {
    await mongoose.disconnect();
  }
}

seed();
