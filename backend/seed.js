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
        
        console.log(`Filtering ${externalQuestions.length} real/fact-based questions...`);
        const validQuestions = externalQuestions.filter(q => {
            return q.subject && q.chapter && q.question && 
                   q.optionA && q.optionB && q.optionC && q.optionD && 
                   q.correctAnswer && q.year && q.difficulty;
        });
        
        console.log(`Skipped ${externalQuestions.length - validQuestions.length} invalid questions.`);
        console.log(`Inserting ${validQuestions.length} valid questions...`);
        
        const batchSize = 200;
        for (let i = 0; i < validQuestions.length; i += batchSize) {
            const batch = validQuestions.slice(i, i + batchSize);
            await Question.insertMany(batch);
            console.log(`Inserted ${Math.min(i + batchSize, validQuestions.length)} / ${validQuestions.length}`);
        }
        
        console.log('Database Seeded Successfully!');
        process.exit(0);
    } catch (err) {
        console.error('Error seeding database:', err);
        process.exit(1);
    }
};

seedDB();
