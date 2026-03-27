require('dotenv').config();
const mongoose = require('mongoose');
const fs = require('fs');
const Question = require('./models/Question');

const seedRemaining = async () => {
    try {
        console.log('Connecting to MongoDB (using environment variable for production)...');
        const uri = process.env.MONGODB_URI;
        if (!uri) {
            throw new Error('MONGODB_URI is not defined in environment variables');
        }
        await mongoose.connect(uri);
        
        const count = await Question.countDocuments();
        console.log(`Current Atlas count: ${count}`);
        
        const dumpPath = './questions_dump.json';
        const externalQuestions = JSON.parse(fs.readFileSync(dumpPath, 'utf-8'));
        
        if (count >= externalQuestions.length) {
            console.log('All questions already seeded!');
            process.exit(0);
        }
        
        const remaining = externalQuestions.slice(count);
        console.log(`Inserting remaining ${remaining.length} questions...`);
        
        await Question.insertMany(remaining);
        
        const finalCount = await Question.countDocuments();
        console.log(`Final Atlas count: ${finalCount} / ${externalQuestions.length}`);
        
        console.log('Database Seeded Successfully!');
        process.exit(0);
    } catch (err) {
        console.error('Error seeding database:', err);
        process.exit(1);
    }
};

seedRemaining();
