const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/goaltracker';

// User Schema
const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    createdAt: { type: Date, default: Date.now }
});

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

async function initializeDatabase() {
    try {
        console.log('Initializing database...');
        
        await mongoose.connect(MONGODB_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log('Connected to MongoDB');

        // Clear existing data
        await User.deleteMany({});
        await Goal.deleteMany({});
        console.log('🧹 Database cleared and ready for use');

        console.log('✨ Database initialization complete!');
        
    } catch (error) {
        console.error('Database initialization error:', error);
    } finally {
        await mongoose.disconnect();
        console.log('Disconnected from MongoDB');
        process.exit(0);
    }
}

initializeDatabase();