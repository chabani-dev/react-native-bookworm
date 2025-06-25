import express from 'express';
import cors from 'cors';
import "dotenv/config";
import connectDB from './lib/db.js';
import booksRouter from './routes/booksRouter.js';
import userRouter from './routes/userRouter.js';
// import job from './lib/cron.js';

const app = express();
const PORT = process.env.PORT || 3000;

// Vérifier si l'API_URL est définie pour le CRON job
// job.start();
// if (!process.env.API_URL) {
//     console.error('❌ API_URL is not defined. CRON job will not run.');
// }
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
