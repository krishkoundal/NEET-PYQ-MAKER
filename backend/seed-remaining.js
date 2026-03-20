const mongoose = require('mongoose');
const fs = require('fs');
const Question = require('./models/Question');

const seedRemaining = async () => {
    try {
        console.log('Connecting to MongoDB (using hardcoded URI for final 192 docs)...');
        const uri = 'mongodb+srv://krishkoundal006_db_user:krishkoundal01@cluster0.1363tm1.mongodb.net/neet-pyq?retryWrites=true&w=majority&appName=Cluster0';
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
