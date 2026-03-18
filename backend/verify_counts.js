const mongoose = require('mongoose');
const Question = require('./models/Question');
require('dotenv').config();

async function run() {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/neet-pyq');
    
    const total = await Question.countDocuments();
    const withImages = await Question.countDocuments({ imageUrl: { $ne: null, $exists: true } });
    const cdnImages = await Question.countDocuments({ imageUrl: { $regex: /github\.io/ } });
    const base64Images = await Question.countDocuments({ imageUrl: { $regex: /^data:image/ } });

    console.log('--- Database Verification ---');
    console.log('Total Questions:', total);
    console.log('Questions with any imageUrl:', withImages);
    console.log('Questions with CDN Images (Diagrams):', cdnImages);
    console.log('Questions with Base64 Images (Possible Logo):', base64Images);

    if (withImages > 0) {
        const sample = await Question.findOne({ imageUrl: { $ne: null } });
        console.log('\nSample Image URL:', sample.imageUrl.substring(0, 100) + '...');
    }

    process.exit(0);
}

run().catch(console.error);
