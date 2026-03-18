const mongoose = require('mongoose');
const Question = require('./models/Question');
require('dotenv').config();

async function verify() {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/neet-pyq');
    
    const snippet = '<div class="listen-now-btn">Listen Now</div>';
    const textCount = await Question.countDocuments({ question: { $regex: snippet } });
    
    const frequentImages = await Question.aggregate([
        { $match: { imageUrl: { $exists: true, $ne: null, $regex: /^data:image/ } } },
        { $group: { _id: '$imageUrl', count: { $sum: 1 } } },
        { $sort: { count: -1 } },
        { $limit: 1 }
    ]);

    let logoRemaining = 0;
    if (frequentImages.length > 0 && frequentImages[0].count > 1000) {
        logoRemaining = frequentImages[0].count;
    }

    console.log('--- VERIFICATION RESULTS ---');
    console.log(`Questions still containing 'Listen Now' text: ${textCount}`);
    console.log(`Questions still containing the logo image: ${logoRemaining}`);
    
    if (textCount === 0 && logoRemaining === 0) {
        console.log('SUCCESS: All artifacts removed.');
    } else {
        console.log('FAILURE: Some artifacts still remain.');
    }

    process.exit(0);
}

verify().catch(console.error);
