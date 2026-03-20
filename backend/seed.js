const mongoose = require('mongoose');
const fs = require('fs');
const Question = require('./models/Question');
require('dotenv').config();

const seedDB = async () => {
    try {
        console.log('Connecting to MongoDB...');
        await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/neet-pyq');
        
        console.log('Reading questions from questions_dump.json...');
        const dumpPath = './questions_dump.json';
        if (!fs.existsSync(dumpPath)) {
            throw new Error('questions_dump.json not found! Run extractor first.');
        }
        const externalQuestions = JSON.parse(fs.readFileSync(dumpPath, 'utf-8'));
        
        console.log('Clearing old data...');
        await Question.deleteMany({});
        
        console.log(`Inserting ${externalQuestions.length} real/fact-based questions...`);
        
        const batchSize = 200;
        for (let i = 0; i < externalQuestions.length; i += batchSize) {
            const batch = externalQuestions.slice(i, i + batchSize);
            await Question.insertMany(batch);
            console.log(`Inserted ${Math.min(i + batchSize, externalQuestions.length)} / ${externalQuestions.length}`);
        }
        
        console.log('Database Seeded Successfully!');
        process.exit(0);
    } catch (err) {
        console.error('Error seeding database:', err);
        process.exit(1);
    }
};

seedDB();
