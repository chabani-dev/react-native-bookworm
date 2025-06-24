import express from 'express';
import cors from 'cors';
import "dotenv/config";
import connectDB from './lib/db.js';
import booksRouter from './routes/booksRouter.js';
import userRouter from './routes/userRouter.js';

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(cors());

// Routes
app.use('/api/auth', userRouter);
app.use('/api/books', booksRouter);

// Démarrer le serveur après connexion à la DB
const startServer = async () => {
    try {
        await connectDB(); // Connexion à MongoDB
        app.listen(PORT, () => {
            console.log(`✅ Server is running on port ${PORT}`);
        });
    } catch (error) {
        console.error('❌ Database connection failed:', error);
        process.exit(1); // Arrêter le processus en cas d'échec
    }
};

startServer();
