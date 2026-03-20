const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const pdfkit = require('pdfkit');
const fs = require('fs');
const path = require('path');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const Question = require('./models/Question');
const User = require('./models/User');
const os = require('os');
require('dotenv').config();

const app = express();

// Request Logger Middleware
app.use((req, res, next) => {
    console.log(`${new Date().toISOString()} - ${req.method} ${req.url} - Origin: ${req.get('origin')}`);
    next();
});

const corsOptions = {
    origin: (origin, callback) => {
        const frontendUrl = process.env.FRONTEND_URL?.replace(/\/$/, '');
        const allowedOrigins = [
            'http://localhost:5173',
            'http://localhost:5000',
            frontendUrl
        ].filter(Boolean);
        
        // Allow requests with no origin (like mobile apps) or if the origin is in our allowed list
        // We compare without trailing slashes to be safe
        const normalizedOrigin = origin?.replace(/\/$/, '');
        
        if (!origin || allowedOrigins.includes(normalizedOrigin)) {
            callback(null, true);
        } else {
            console.log('CORS Blocked for Origin:', origin);
            console.log('Allowed Origins were:', allowedOrigins);
            callback(new Error('Not allowed by CORS'));
        }
    },
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true
};

app.use(cors(corsOptions));
app.use(express.json());

// Email Configuration
const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    secure: false, // Use STARTTLS
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    },
    tls: {
        rejectUnauthorized: false // Often needed in cloud environments
    }
});

mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/neet-pyq')
    .then(() => console.log('MongoDB Connected'))
    .catch(err => console.log(err));

// Auth Routes
app.post('/api/auth/register', async (req, res) => {
    const { name, email, password } = req.body;
    console.log('--- Register Attempt Started (DIAGNOSTIC MODE) ---');
    console.log('Email:', email);

    // INSTANT RESPONSE to bypass gateway timeouts
    res.status(201).json({ 
        message: 'Processing registration... Please check back in a moment.',
        diagnostic: true
    });

    // Background work starts here
    (async () => {
        try {
            console.log('BG: Searching for existing user...');
            let user = await User.findOne({ email });
            
            if (user && user.isVerified) {
                console.log('BG: User already exists and is verified.');
                return;
            }

            console.log('BG: Hashing password...');
            const hashedPassword = await bcrypt.hash(password, 8); // Reduced salt rounds for speed

            const otp = Math.floor(100000 + Math.random() * 900000).toString();
            const otpExpire = new Date(Date.now() + 10 * 60 * 1000);

            if (user) {
                console.log('BG: Updating unverified user...');
                user.name = name;
                user.password = hashedPassword;
                user.otp = otp;
                user.otpExpire = otpExpire;
            } else {
                console.log('BG: Creating new user...');
                user = new User({
                    name,
                    email,
                    password: hashedPassword,
                    otp,
                    otpExpire
                });
            }

            console.log('BG: Saving to MongoDB...');
            await user.save();
            console.log('BG: User saved! OTP:', otp);

            if (process.env.EMAIL_USER && process.env.EMAIL_PASS) {
                console.log('BG: Attempting to send email...');
                const emailHtml = `
                    <div style="font-family: sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
                        <h2 style="color: #4A90E2; text-align: center;">Verify Your Email</h2>
                        <p>Hello ${name},</p>
                        <p>Use this code: ${otp}</p>
                    </div>
                `;
                const mailOptions = {
                    from: process.env.EMAIL_USER,
                    to: email,
                    subject: `${otp} is your verification code`,
                    html: emailHtml
                };
                transporter.sendMail(mailOptions)
                    .then(() => console.log('BG: Email sent successfully!'))
                    .catch(err => console.error('BG: Email error:', err));
            }
        } catch (err) {
            console.error('BG: Critical Registration Error:', err);
        }
    })();
});

app.post('/api/auth/verify-otp', async (req, res) => {
    const { email, otp } = req.body;
    try {
        const user = await User.findOne({ email });
        if (!user) return res.status(400).json({ error: 'User not found' });
        if (user.isVerified) return res.status(400).json({ error: 'Email already verified' });
        
        if (user.otp !== otp) return res.status(400).json({ error: 'Invalid OTP' });
        if (user.otpExpire < new Date()) return res.status(400).json({ error: 'OTP expired' });

        user.isVerified = true;
        user.otp = undefined;
        user.otpExpire = undefined;
        await user.save();

        res.json({ message: 'Email verified successfully! You can now login.' });
    } catch (err) {
        console.error('OTP Verification Error:', err);
        res.status(500).json({ error: err.message });
    }
});

app.post('/api/auth/resend-otp', async (req, res) => {
    const { email } = req.body;
    try {
        const user = await User.findOne({ email });
        if (!user) return res.status(400).json({ error: 'User not found' });
        if (user.isVerified) return res.status(400).json({ error: 'Email already verified' });

        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        user.otp = otp;
        user.otpExpire = new Date(Date.now() + 10 * 60 * 1000);
        await user.save();

        const emailHtml = `
            <div style="font-family: sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
                <h2 style="color: #4A90E2; text-align: center;">New Verification Code</h2>
                <p>Hello ${user.name},</p>
                <p>You requested a new verification code. Use the code below to verify your email address. This code is valid for 10 minutes.</p>
                <div style="background: #f4f4f4; padding: 20px; text-align: center; font-size: 32px; font-weight: bold; letter-spacing: 5px; color: #333; margin: 20px 0; border-radius: 5px;">
                    ${otp}
                </div>
            </div>
        `;

        if (process.env.EMAIL_USER && process.env.EMAIL_PASS) {
            const mailOptions = {
                from: process.env.EMAIL_USER,
                to: email,
                subject: `${otp} is your new NEET PYQ Maker code`,
                html: emailHtml
            };
            await transporter.sendMail(mailOptions);
        } else {
            console.log('New OTP for', email, ':', otp);
        }

        res.json({ message: 'New OTP sent to your email.' });
    } catch (err) {
        console.error('Resend OTP Error:', err);
        res.status(500).json({ error: err.message });
    }
});

app.post('/api/auth/login', async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ email });
        if (!user) return res.status(400).json({ error: 'Invalid credentials' });
        if (!user.isVerified) return res.status(400).json({ error: 'Please verify your email first' });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ error: 'Invalid credentials' });

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET || 'secret', { expiresIn: '7d' });
        res.json({ token, user: { id: user._id, name: user.name, email: user.email } });
    } catch (err) {
        console.error('Login Error:', err);
        res.status(500).json({ error: err.message });
    }
});

app.get('/api/version', (req, res) => res.json({ version: '1.0.1' }));

// Subjects list
const subjects = ['Physics', 'Chemistry', 'Biology'];

// Chapters data
const chaptersData = {
    'Physics': [
        'Physical World', 'Units and Measurements', 'Motion in a Straight Line', 'Motion in a Plane',
        'Laws of Motion', 'Work Energy and Power', 'System of Particles and Rotational Motion', 'Gravitation',
        'Mechanical Properties of Solids', 'Mechanical Properties of Fluids', 'Thermal Properties of Matter',
        'Thermodynamics', 'Kinetic Theory', 'Oscillations', 'Waves', 'Electric Charges and Fields',
        'Electrostatic Potential and Capacitance', 'Current Electricity', 'Moving Charges and Magnetism',
        'Magnetism and Matter', 'Electromagnetic Induction', 'Alternating Current', 'Electromagnetic Waves',
        'Ray Optics and Optical Instruments', 'Wave Optics', 'Dual Nature of Radiation and Matter',
        'Atoms', 'Nuclei', 'Semiconductor Electronics', 'Communication Systems'
    ],
    'Chemistry': [
        'Some Basic Concepts of Chemistry', 'Structure of Atom', 'States of Matter', 'Chemical Thermodynamics',
        'Solutions', 'Equilibrium', 'Redox Reactions', 'Chemical Kinetics', 'Surface Chemistry',
        'Organic Chemistry Basic Principles and Techniques', 'Hydrocarbons', 'Haloalkanes and Haloarenes',
        'Alcohols Phenols and Ethers', 'Aldehydes Ketones and Carboxylic Acids', 'Amines', 'Biomolecules',
        'Polymers', 'Chemistry in Everyday Life', 'Classification of Elements and Periodicity',
        'Chemical Bonding and Molecular Structure', 'Hydrogen', 's-Block Elements', 'p-Block Elements',
        'd and f Block Elements', 'Coordination Compounds', 'Environmental Chemistry'
    ],
    'Biology': [
        'The Living World', 'Biological Classification', 'Plant Kingdom', 'Morphology of Flowering Plants',
        'Anatomy of Flowering Plants', 'Plant Growth and Development', 'Cell The Unit of Life',
        'Biomolecules', 'Cell Cycle and Cell Division', 'Photosynthesis in Higher Plants', 'Respiration in Plants',
        'Animal Kingdom', 'Structural Organisation in Animals', 'Digestion and Absorption',
        'Breathing and Exchange of Gases', 'Body Fluids and Circulation', 'Excretory Products and their Elimination',
        'Locomotion and Movement', 'Neural Control and Coordination', 'Chemical Coordination and Integration',
        'Reproduction in Organisms', 'Human Reproduction', 'Reproductive Health',
        'Principles of Inheritance and Variation', 'Molecular Basis of Inheritance',
        'Biotechnology Principles and Processes', 'Biotechnology and its Applications',
        'Organisms and Populations', 'Ecosystem', 'Biodiversity and Conservation', 'Environmental Issues'
    ]
};

app.get('/api/subjects', (req, res) => res.json(subjects));

app.get('/api/chapters', (req, res) => {
    const subject = req.query.subject;
    res.json(chaptersData[subject] || []);
});

app.post('/api/generate-paper', async (req, res) => {
    const { subject, chapters, count, difficulty, years } = req.body;
    
    let query = { subject };
    if (chapters && chapters.length > 0) query.chapter = { $in: chapters };
    if (difficulty) query.difficulty = difficulty;
    if (years && years.length > 0) query.year = { $in: years };

    try {
        const questions = await Question.aggregate([
            { $match: query },
            { $sample: { size: parseInt(count) || 10 } }
        ]);
        res.json(questions);
    } catch (err) {
        console.error('Paper Generation Error:', err);
        res.status(500).json({ error: err.message });
    }
});

app.post('/api/generate-pdf', async (req, res) => {
    const { questions, metadata } = req.body;
    const doc = new pdfkit();
    const tempDir = path.join(os.tmpdir(), 'neet-pyq-temp');
    const filename = `neet_paper_${Date.now()}.pdf`;
    const filepath = path.join(tempDir, filename);
    const keyFilename = `neet_key_${Date.now()}.pdf`;
    const keyFilepath = path.join(tempDir, keyFilename);

    if (!fs.existsSync(tempDir)) {
        fs.mkdirSync(tempDir, { recursive: true });
    }

    const generateDoc = (isKey) => {
        const pdf = new pdfkit();
        const stream = fs.createWriteStream(isKey ? keyFilepath : filepath);
        pdf.pipe(stream);

        pdf.fontSize(20).text('NEET Practice PYQ Paper', { align: 'center' });
        if (isKey) pdf.text('Answer Key', { align: 'center' });
        pdf.moveDown();
        
        pdf.fontSize(12).text(`Subject: ${metadata.subject}`);
        pdf.text(`Total Questions: ${questions.length}`);
        pdf.moveDown();

        questions.forEach((q, index) => {
            pdf.fontSize(12).text(`${index + 1}. ${q.question}`);
            if (!isKey) {
                pdf.text(`A. ${q.optionA}`);
                pdf.text(`B. ${q.optionB}`);
                pdf.text(`C. ${q.optionC}`);
                pdf.text(`D. ${q.optionD}`);
            } else {
                pdf.text(`Correct Answer: ${q.correctAnswer}`);
                if (q.explanation) pdf.text(`Explanation: ${q.explanation}`);
            }
            pdf.moveDown();
        });

        pdf.end();
        return new Promise(resolve => stream.on('finish', resolve));
    };

    await Promise.all([generateDoc(false), generateDoc(true)]);
    res.json({ paperId: filename, keyId: keyFilename });
});

app.get('/api/download-pdf/:filename', (req, res) => {
    const tempDir = path.join(os.tmpdir(), 'neet-pyq-temp');
    const filepath = path.join(tempDir, req.params.filename);
    if (fs.existsSync(filepath)) {
        res.download(filepath);
    } else {
        res.status(404).json({ error: 'File not found' });
    }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
