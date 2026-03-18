const mongoose = require('mongoose');
const Question = require('./models/Question');
require('dotenv').config();

async function finalReport() {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/neet-pyq');
    
    const total = await Question.countDocuments();
    const withImage = await Question.countDocuments({ imageUrl: { $exists: true, $ne: null } });
    const withListen = await Question.countDocuments({ question: /listen-now-btn/i });
    
    console.log('--- FINAL DATABASE REPORT ---');
    console.log(`Total questions: ${total}`);
    console.log(`Questions with legitimate diagrams: ${withImage}`);
    console.log(`Questions with "Listen Now" (should be 0): ${withListen}`);
    
    // Sample a question that still has an image to be sure it's valid
    if (withImage > 0) {
        const sample = await Question.findOne({ imageUrl: { $exists: true, $ne: null } });
        console.log('\nSample legitimate diagram question:');
        console.log(`ID: ${sample._id}`);
        console.log(`Question: ${sample.question.substring(0, 100)}...`);
        console.log(`Image URL Type: ${sample.imageUrl.startsWith('data:') ? 'Base64' : 'URL'}`);
    }

    process.exit(0);
}

finalReport().catch(console.error);
