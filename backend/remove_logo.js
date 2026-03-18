const mongoose = require('mongoose');
const Question = require('./models/Question');
require('dotenv').config();

async function removeLogoAndText() {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/neet-pyq');
    
    console.log('Identifying logo image artifact...');
    const frequentImages = await Question.aggregate([
        { $match: { imageUrl: { $exists: true, $ne: null, $regex: /^data:image/ } } },
        { $group: { _id: '$imageUrl', count: { $sum: 1 } } },
        { $sort: { count: -1 } },
        { $limit: 1 }
    ]);

    let logoCount = 0;
    if (frequentImages.length > 0 && frequentImages[0].count > 1000) {
        const logoData = frequentImages[0]._id;
        console.log(`Targeting logo with count: ${frequentImages[0].count}`);
        const logoResult = await Question.updateMany(
            { imageUrl: logoData },
            { $set: { imageUrl: null } }
        );
        logoCount = logoResult.modifiedCount;
        console.log(`Removed logo from ${logoCount} questions.`);
    } else {
        console.log('No frequent logo image found.');
    }

    console.log('Identifying "Listen Now" text artifact...');
    const listenSnippet = '<div class="listen-now-btn">Listen Now</div>';
    
    // We need to remove the snippet from the question text
    // MongoDB doesn't have a built-in "replaceAll" for strings in updateMany easily without aggregation or $function (in newer versions)
    // But we can find them and iterate or use a simple regex if supported in update.
    
    const listenQuestions = await Question.find({ question: { $regex: listenSnippet } });
    console.log(`Found ${listenQuestions.length} questions with "Listen Now" snippet.`);

    let textUpdatedCount = 0;
    for (const q of listenQuestions) {
        const updatedQuestion = q.question.replace(listenSnippet, '').trim();
        await Question.updateOne({ _id: q._id }, { $set: { question: updatedQuestion } });
        textUpdatedCount++;
    }
    console.log(`Removed "Listen Now" snippet from ${textUpdatedCount} questions.`);

    console.log('\nFinal Summary:');
    console.log(`Logos removed: ${logoCount}`);
    console.log(`"Listen Now" snippets removed: ${textUpdatedCount}`);

    process.exit(0);
}

removeLogoAndText().catch(console.error);
