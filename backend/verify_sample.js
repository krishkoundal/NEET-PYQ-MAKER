const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });

async function verifySample() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    const Question = mongoose.model('Question', new mongoose.Schema({
      question: String,
      optionA: String,
      optionB: String,
      optionC: String,
      optionD: String,
      correctAnswer: String,
      explanation: String
    }, { strict: false }));

    const samples = await Question.find({}).limit(5);
    console.log(JSON.stringify(samples, ['question', 'optionA', 'optionB', 'optionC', 'optionD', 'correctAnswer', 'explanation'], 2));
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

verifySample();
