const mongoose = require('mongoose');
const Question = require('./models/Question');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

async function saveTopImage() {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/neet-pyq');
    
    const frequentImages = await Question.aggregate([
        { $match: { imageUrl: { $exists: true, $ne: null } } },
        { $group: { _id: '$imageUrl', count: { $sum: 1 } } },
        { $sort: { count: -1 } },
        { $limit: 1 }
    ]);

    if (frequentImages.length > 0) {
        const topImage = frequentImages[0]._id;
        if (topImage.startsWith('data:image/')) {
            const base64Data = topImage.split(',')[1];
            const buffer = Buffer.from(base64Data, 'base64');
            const outputPath = path.join(__dirname, 'top_image.png');
            fs.writeFileSync(outputPath, buffer);
            console.log(`Saved top image to ${outputPath}`);
        } else {
            console.log(`Top image is a URL: ${topImage}`);
        }
    }

    process.exit(0);
}

saveTopImage().catch(console.error);
