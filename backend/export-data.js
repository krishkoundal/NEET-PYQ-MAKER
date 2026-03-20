const mongoose = require('mongoose');
const fs = require('fs');
const Question = require('./models/Question');
require('dotenv').config();

async function exportData() {
    try {
        console.log('Connecting to local MongoDB...');
        await mongoose.connect('mongodb://localhost:27017/neet-pyq');
        
        console.log('Fetching questions...');
        const questions = await Question.find({});
        console.log(`Found ${questions.length} questions.`);
        
        console.log('Writing to questions_dump.json...');
        fs.writeFileSync('./questions_dump.json', JSON.stringify(questions, null, 2));
        
        console.log('Export successful! File created: ./questions_dump.json');
        process.exit(0);
    } catch (error) {
        console.error('Export failed:', error);
        process.exit(1);
    }
}

exportData();
