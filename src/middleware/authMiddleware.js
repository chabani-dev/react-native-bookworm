import jwt from 'jsonwebtoken';
import User from '../models/User.js';

const protectRoute = async (req, res, next) => { // Correction de resizeBy → res
    try {
        // 📌 Récupérer le token depuis les headers
        const authHeader = req.header("Authorization");
        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return res.status(401).json({ message: 'Unauthorized, no token provided' });
        }

        const token = authHeader.split(" ")[1]; // Extraire le token correctement

        // 📌 Vérifier le token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // 📌 Trouver l'utilisateur
        const user = await User.findById(decoded.id).select('-password');
        if (!user) {
            return res.status(401).json({ message: 'Unauthorized, user not found' });
        }

        req.user = user; // Attacher l'utilisateur à la requête
        next(); // Passer à la prochaine middleware ou route

    } catch (error) {
        console.error('Token verification failed:', error);

        // 📌 Gestion des erreurs JWT
        if (error.name === 'JsonWebTokenError') {
            return res.status(401).json({ message: 'Unauthorized, invalid token' });
        } else if (error.name === 'TokenExpiredError') {
            return res.status(401).json({ message: 'Unauthorized, token expired' });
        }

        return res.status(500).json({ message: 'Internal server error' });
    }
};

export default protectRoute;
