const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const cors = require('cors');
const path = require('path');
const nodemailer = require('nodemailer');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// MongoDB Connection
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:7017/goaltracker';
mongoose.connect(MONGODB_URI)
.then(() => console.log('Connected to MongoDB'))
.catch(err => console.error('MongoDB connection error:', err));

// Email Configuration
const transporter = nodemailer.createTransport({    service: 'gmail', 
    auth: {
        user: process.env.EMAIL_USER, 
        pass: process.env.EMAIL_PASSWORD 
    }
});

// Verify email configuration
transporter.verify((error, success) => {
    if (error) {
        console.error('Email configuration error:', error);
    } else {
        console.log('Email server is ready to send messages');
    }
});

// Email Templates
const getWelcomeEmailTemplate = (userName) => {
    return {
        subject: '🎯 Welcome to Goal Tracker Pro!',
        html: `
            <!DOCTYPE html>
            <html>
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Welcome to Goal Tracker Pro</title>
                <style>
                    body { 
                        font-family: 'Segoe UI', Arial, sans-serif; 
                        line-height: 1.6; 
                        color: #333; 
                        margin: 0; 
                        padding: 0; 
                        background-color: #f8fafc;
                    }
                    .container { 
                        max-width: 600px; 
                        margin: 0 auto; 
                        padding: 20px; 
                        background-color: #ffffff;
                        border-radius: 10px;
                        box-shadow: 0 4px 20px rgba(0,0,0,0.1);
                    }
                    .header { 
                        background: linear-gradient(135deg, #4f46e5 0%, #6366f1 100%); 
                        color: white; 
                        padding: 30px; 
                        text-align: center; 
                        border-radius: 10px 10px 0 0;
                        margin: -20px -20px 30px -20px;
                    }
                    .header h1 { 
                        margin: 0; 
                        font-size: 28px; 
                    }
                    .content { 
                        padding: 0 20px; 
                    }
                    .feature-box { 
                        background: #f8fafc; 
                        padding: 20px; 
                        margin: 20px 0; 
                        border-radius: 8px; 
                        border-left: 4px solid #4f46e5;
                    }
                    .cta-button { 
                        display: inline-block; 
                        background: linear-gradient(135deg, #4f46e5 0%, #6366f1 100%); 
                        color: white; 
                        padding: 15px 30px; 
                        text-decoration: none; 
                        border-radius: 8px; 
                        font-weight: bold;
                        margin: 20px 0;
                    }
                    .footer { 
                        text-align: center; 
                        margin-top: 40px; 
                        padding-top: 20px; 
                        border-top: 1px solid #e2e8f0; 
                        color: #64748b; 
                        font-size: 14px;
                    }
                    .emoji { font-size: 24px; }
                </style>
            </head>
            <body>
                <div class="container">
                    <div class="header">
                        <h1><span class="emoji">🎯</span> Welcome to Goal Tracker Pro!</h1>
                        <p style="margin: 10px 0 0 0; opacity: 0.9;">Your journey to success starts here</p>
                    </div>
                    
                    <div class="content">
                        <h2>Hello ${userName}! 👋</h2>
                        <p>Congratulations on taking the first step towards achieving your goals! We're excited to have you join our community of goal achievers.</p>
                        
                        <div class="feature-box">
                            <h3><span class="emoji">🚀</span> What you can do now:</h3>
                            <ul>
                                <li><strong>Create Goals:</strong> Set weekly or monthly goals with target days</li>
                                <li><strong>Track Progress:</strong> Mark daily progress and build streaks</li>
                                <li><strong>Visualize Success:</strong> View charts and analytics of your progress</li>
                                <li><strong>Stay Motivated:</strong> Monitor streaks and completion rates</li>
                            </ul>
                        </div>
                        
                        <div class="feature-box">
                            <h3><span class="emoji">💡</span> Pro Tips for Success:</h3>
                            <ul>
                                <li>Start with small, achievable goals</li>
                                <li>Be consistent - even small daily actions count</li>
                                <li>Use the progress charts to stay motivated</li>
                                <li>Celebrate your streaks and milestones</li>
                            </ul>
                        </div>
                        
                        <div class="feature-box">
                            <h3><span class="emoji">🔒</span> Your Data is Safe</h3>
                            <p>Your account is protected with encrypted passwords and secure authentication. We never share your personal information.</p>
                        </div>
                    </div>
                    
                    <div class="footer">
                        <p><strong>Goal Tracker Pro</strong> - Achieve More, Track Better</p>
                        <p>Need help? Contact us or visit our platform for support.</p>
                        <p style="font-size: 12px; color: #94a3b8;">
                            This email was sent because you registered for Goal Tracker Pro.<br>
                            If you didn't create this account, please ignore this email.
                        </p>
                    </div>
                </div>
            </body>
            </html>
        `,
        text: `
Welcome to Goal Tracker Pro, ${userName}!

Congratulations on taking the first step towards achieving your goals! We're excited to have you join our community of goal achievers.

What you can do now:
• Create Goals: Set weekly or monthly goals with target days
• Track Progress: Mark daily progress and build streaks  
• Visualize Success: View charts and analytics of your progress
• Stay Motivated: Monitor streaks and completion rates

Pro Tips for Success:
• Start with small, achievable goals
• Be consistent - even small daily actions count
• Use the progress charts to stay motivated
• Celebrate your streaks and milestones

Your Data is Safe:
Your account is protected with encrypted passwords and secure authentication. We never share your personal information.

Goal Tracker Pro - Achieve More, Track Better

Need help? Contact us or visit our platform for support.
        `
    };
};

// Function to send welcome email
async function sendWelcomeEmail(userEmail, userName) {
    try {
        const emailTemplate = getWelcomeEmailTemplate(userName);
        
        const mailOptions = {
            from: {
                name: 'Goal Tracker Pro',
                address: process.env.EMAIL_USER
            },
            to: userEmail,
            subject: emailTemplate.subject,
            html: emailTemplate.html,
            text: emailTemplate.text
        };

        const info = await transporter.sendMail(mailOptions);
        console.log(' Welcome email sent:', info.messageId);
        return true;
    } catch (error) {
        console.error('Email sending error:', error);
        return false;
    }
}

// User Schema
const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    createdAt: { type: Date, default: Date.now }
});

userSchema.pre('save', async function(next) {
    if (!this.isModified('password')) return next();
    this.password = await bcrypt.hash(this.password, 12);
    next();
});

userSchema.methods.comparePassword = async function(candidatePassword) {
    return await bcrypt.compare(candidatePassword, this.password);
};

const User = mongoose.model('User', userSchema);

// Goal Schema
const goalSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String },
    type: { type: String, enum: ['weekly', 'monthly'], required: true },
    targetDays: { type: Number, required: true },
    completedDays: { type: Number, default: 0 },
    status: { type: String, enum: ['active', 'completed'], default: 'active' },
    streak: { type: Number, default: 0 },
    endDate: { type: Date, required: true },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    progressHistory: [{
        date: { type: Date, default: Date.now },
        completed: { type: Boolean, default: true }
    }],
    createdAt: { type: Date, default: Date.now }
});

const Goal = mongoose.model('Goal', goalSchema);

// Authentication Middleware
const auth = async (req, res, next) => {
    try {
        const token = req.header('Authorization')?.replace('Bearer ', '');
        
        if (!token) {
            return res.status(401).json({ error: 'Access denied. No token provided.' });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
        const user = await User.findById(decoded.userId);
        
        if (!user) {
            return res.status(401).json({ error: 'Invalid token.' });
        }

        req.user = user;
        next();
    } catch (error) {
        res.status(401).json({ error: 'Invalid token.' });
    }
};


// Health Check
app.get('/api/health', (req, res) => {
    res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Register
app.post('/api/register', async (req, res) => {
    try {
        const { name, email, password } = req.body;

        // Validation
        if (!name || !email || !password) {
            return res.status(400).json({ error: 'All fields are required' });
        }

        if (password.length < 6) {
            return res.status(400).json({ error: 'Password must be at least 6 characters' });
        }

        // Check if user exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ error: 'User with this email already exists' });
        }

        // Create user
        const user = new User({ name, email, password });
        await user.save();

        // Send welcome email 
        sendWelcomeEmail(email, name).then(emailSent => {
            if (emailSent) {
                console.log(`Welcome email sent to ${email}`);
            } else {
                console.log(`⚠️ Failed to send welcome email to ${email}`);
            }
        });

        // Generate token
        const token = jwt.sign(
            { userId: user._id }, 
            process.env.JWT_SECRET || 'your-secret-key',
            { expiresIn: '7d' }
        );

        res.status(201).json({
            message: 'Registration successful! Welcome email sent.',
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email
            }
        });
    } catch (error) {
        console.error('Registration error:', error);
        res.status(500).json({ error: 'Server error during registration' });
    }
});

// Login
app.post('/api/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ error: 'Email and password are required' });
        }

        // Find user
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ error: 'Invalid email or password' });
        }

        // Check password
        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            return res.status(400).json({ error: 'Invalid email or password' });
        }

        // Generate token
        const token = jwt.sign(
            { userId: user._id }, 
            process.env.JWT_SECRET || 'your-secret-key',
            { expiresIn: '7d' }
        );

        res.json({
            message: 'Login successful!',
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email
            }
        });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ error: 'Server error during login' });
    }
});

// Get Stats
app.get('/api/stats', auth, async (req, res) => {
    try {
        const goals = await Goal.find({ userId: req.user._id });
        
        const stats = {
            totalGoals: goals.length,
            completedGoals: goals.filter(g => g.status === 'completed').length,
            inProgressGoals: goals.filter(g => g.status === 'active').length,
            bestStreak: Math.max(...goals.map(g => g.streak), 0)
        };

        res.json({ stats });
    } catch (error) {
        console.error('Stats error:', error);
        res.status(500).json({ error: 'Error fetching stats' });
    }
});

// Get Goals
app.get('/api/goals', auth, async (req, res) => {
    try {
        const goals = await Goal.find({ userId: req.user._id }).sort({ createdAt: -1 });
        res.json({ goals });
    } catch (error) {
        console.error('Goals fetch error:', error);
        res.status(500).json({ error: 'Error fetching goals' });
    }
});

// Get Single Goal
app.get('/api/goals/:id', auth, async (req, res) => {
    try {
        const goal = await Goal.findOne({ _id: req.params.id, userId: req.user._id });
        
        if (!goal) {
            return res.status(404).json({ error: 'Goal not found' });
        }

        res.json({ goal });
    } catch (error) {
        console.error('Goal fetch error:', error);
        res.status(500).json({ error: 'Error fetching goal' });
    }
});

// Create Goal
app.post('/api/goals', auth, async (req, res) => {
    try {
        const { title, description, type, targetDays, endDate } = req.body;

        if (!title || !type || !targetDays || !endDate) {
            return res.status(400).json({ error: 'Required fields missing' });
        }

        const goal = new Goal({
            title,
            description,
            type,
            targetDays,
            endDate: new Date(endDate),
            userId: req.user._id
        });

        await goal.save();
        res.status(201).json({ 
            message: 'Goal created successfully!',
            goal 
        });
    } catch (error) {
        console.error('Goal creation error:', error);
        res.status(500).json({ error: 'Error creating goal' });
    }
});

// Update Goal
app.put('/api/goals/:id', auth, async (req, res) => {
    try {
        const goal = await Goal.findOne({ _id: req.params.id, userId: req.user._id });
        
        if (!goal) {
            return res.status(404).json({ error: 'Goal not found' });
        }

        const { markProgress, status } = req.body;

        if (markProgress) {
            // Check if already marked today
            const today = new Date().toDateString();
            const lastProgress = goal.progressHistory[goal.progressHistory.length - 1];
            
            if (lastProgress && new Date(lastProgress.date).toDateString() === today) {
                return res.status(400).json({ error: 'Progress already marked for today' });
            }

            // Mark progress
            goal.completedDays += 1;
            goal.progressHistory.push({ date: new Date(), completed: true });
            
            // Update streak
            if (lastProgress) {
                const daysDiff = Math.floor((new Date() - new Date(lastProgress.date)) / (1000 * 60 * 60 * 24));
                if (daysDiff === 1) {
                    goal.streak += 1;
                } else if (daysDiff > 1) {
                    goal.streak = 1;
                }
            } else {
                goal.streak = 1;
            }

            // Auto-complete if target reached
            if (goal.completedDays >= goal.targetDays) {
                goal.status = 'completed';
            }
        }

        if (status) {
            goal.status = status;
        }

        await goal.save();
        res.json({ 
            message: markProgress ? 'Progress marked!' : 'Goal updated!',
            goal 
        });
    } catch (error) {
        console.error('Goal update error:', error);
        res.status(500).json({ error: 'Error updating goal' });
    }
});

// Delete Goal
app.delete('/api/goals/:id', auth, async (req, res) => {
    try {
        const goal = await Goal.findOneAndDelete({ _id: req.params.id, userId: req.user._id });
        
        if (!goal) {
            return res.status(404).json({ error: 'Goal not found' });
        }

        res.json({ message: 'Goal deleted successfully' });
    } catch (error) {
        console.error('Goal deletion error:', error);
        res.status(500).json({ error: 'Error deleting goal' });
    }
});

// Get Streak Data for Charts
app.get('/api/streak/:id', auth, async (req, res) => {
    try {
        const goal = await Goal.findOne({ _id: req.params.id, userId: req.user._id });
        
        if (!goal) {
            return res.status(404).json({ error: 'Goal not found' });
        }

        // Generate chart data for the last 14 days
        const labels = [];
        const data = [];
        const today = new Date();
        
        for (let i = 13; i >= 0; i--) {
            const date = new Date(today);
            date.setDate(date.getDate() - i);
            
            labels.push(date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }));
            
            // Count progress up to this date
            const progressCount = goal.progressHistory.filter(p => 
                new Date(p.date) <= date
            ).length;
            
            data.push(progressCount);
        }

        res.json({ labels, data });
    } catch (error) {
        console.error('Streak data error:', error);
        res.status(500).json({ error: 'Error fetching streak data' });
    }
});

// Test Email Endpoint 
app.post('/api/test-email', auth, async (req, res) => {
    try {
        const emailSent = await sendWelcomeEmail(req.user.email, req.user.name);
        
        if (emailSent) {
            res.json({ message: 'Test email sent successfully!' });
        } else {
            res.status(500).json({ error: 'Failed to send test email' });
        }
    } catch (error) {
        console.error('Test email error:', error);
        res.status(500).json({ error: 'Error sending test email' });
    }
});

// Serve frontend
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Error handling middleware
app.use((error, req, res, next) => {
    console.error('Server error:', error);
    res.status(500).json({ error: 'Internal server error' });
});

// Start server
app.listen(PORT, () => {
    console.log(`🚀 Goal Tracker Pro server running on port ${PORT}`);
    console.log(`📱 Frontend: http://localhost:${PORT}`);
    console.log(`🔗 API: http://localhost:${PORT}/api`);
    console.log('📧 Email service initialized');
});