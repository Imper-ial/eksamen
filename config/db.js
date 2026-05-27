const mongoose = require('mongoose');

// kobler til mongodb via mongoose
async function connectDB() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB tilkoblet');
  } catch (err) {
    console.error('Feil ved tilkobling til MongoDB:', err.message);
    // avslutter hvis databasen ikke svarer
    process.exit(1);
  }
}

module.exports = connectDB;
