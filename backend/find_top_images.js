const mongoose = require('mongoose');
const Question = require('./models/Question');
require('dotenv').config();

async function findFrequentImages() {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/neet-pyq');
    
    console.log('Finding most frequent image URLs...');
    const frequentImages = await Question.aggregate([
        { $match: { imageUrl: { $exists: true, $ne: null } } },
        { $group: { _id: '$imageUrl', count: { $sum: 1 } } },
        { $sort: { count: -1 } },
        { $limit: 10 }
    ]);

    console.log('Top 10 most frequent images:');
    frequentImages.forEach((img, i) => {
        console.log(`${i+1}. Count: ${img.count}`);
        console.log(`   URL: ${img._id.substring(0, 100)}${img._id.length > 100 ? '...' : ''}`);
    });

    if (frequentImages.length > 0) {
        const topImage = frequentImages[0]._id;
        const sample = await Question.findOne({ imageUrl: topImage });
        console.log('\nSample question with top image:');
        console.log(`Question: ${sample.question}`);
        console.log(`Chapter: ${sample.chapter}`);
    }

    process.exit(0);
}

findFrequentImages().catch(console.error);
