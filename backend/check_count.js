const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });

async function checkCount() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    // Use a generic schema since we just need the count
    const Question = mongoose.model('Question', new mongoose.Schema({}, { strict: false }));
    const count = await Question.countDocuments();
    console.log(`CURRENT_DB_COUNT: ${count}`);
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

checkCount();
