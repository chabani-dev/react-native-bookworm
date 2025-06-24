import express from 'express';
import User from '../models/User.js';
import generateToken from '../utils/generateToken.js';

const router = express.Router();

// Login route
router.post('/login', async (req, res) => {
    try {
        const { username, password } = req.body;

        if (!username || !password) {
            return res.status(400).json({ message: 'Username and password are required' });
        }

        const user = await User.findOne({ username });
        if (!user) return res.status(401).json({ message: 'Invalid credentials' });

        const isMatch = await user.matchPassword(password); // Ajouter cette méthode dans le model
        if (!isMatch) return res.status(401).json({ message: 'Invalid credentials' });

        const token = generateToken(user._id);

        res.json({
            message: 'Login successful',
            token,
            user: {
                id: user._id,
                username: user.username,
                email: user.email,
                profilePicture: user.profilePicture,
            },
        });
    } catch (error) {
        res.status(500).json({ message: 'Error processing request', error: error.message });
    }
});

// Register route
router.post('/register', async (req, res) => {
    try {
        const { username, email, password } = req.body;

        if (!username || !email || !password) {
            return res.status(400).json({ message: 'All fields are required' });
        }

        if (username.length < 3) {
            return res.status(400).json({ message: 'Username must be at least 3 characters long' });
        }

        if (password.length < 6) {
            return res.status(400).json({ message: 'Password must be at least 6 characters long' });
        }

        if (await User.findOne({ username })) {
            return res.status(400).json({ message: 'Username already exists' });
        }

        if (await User.findOne({ email })) {
            return res.status(400).json({ message: 'Email already exists' });
        }

        const profilePicture = `https://api.dicebear.com/9.x/avataaars/svg?seed=${username}`;

        const user = new User({ username, email, password, profilePicture });

        await user.save();

        const token = generateToken(user._id);

        res.status(201).json({
            message: 'User created successfully',
            token,
            user: {
                id: user._id,
                username: user.username,
                email: user.email,
                profilePicture: user.profilePicture,
            },
        });

    } catch (error) {
        console.error('Error registering user:', error);
        res.status(500).json({ message: 'Error registering user', error: error.message });
    }
});

// Logout route
router.post('/logout', (req, res) => {
    res.json({ message: 'Logout successful' });
});

export default router;