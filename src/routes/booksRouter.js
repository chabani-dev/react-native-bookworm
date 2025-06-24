import express from 'express';
import Book from '../models/Books.js';
import cloudinary from '../lib/cloudinary.js';
import protectRoute from '../middleware/authMiddleware.js'; // Correction de la majuscule

const router = express.Router();

// 📌 Route pour récupérer tous les livres avec pagination
router.get('/', protectRoute, async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 5;
        const skip = (page - 1) * limit;

        const books = await Book.find()
            .sort({ createdAt: -1 }) // Correction de createAt → createdAt
            .skip(skip)
            .limit(limit)
            .populate('user', 'username profileImage');

        const totalBooks = await Book.countDocuments();

        if (books.length === 0) {
            return res.status(404).json({ message: 'No books found' });
        }

        res.json({
            books,
            currentPage: page,
            totalBooks,
            totalPages: Math.ceil(totalBooks / limit),
        });

    } catch (error) {
        console.error('Error retrieving books:', error);
        res.status(500).json({ message: 'Error retrieving books' });
    }
});

// 📌 Route pour ajouter un nouveau livre
router.post('/', protectRoute, async (req, res) => {
    const { title, author, caption, image } = req.body;

    if (!image || !title || !author || !caption) {
        return res.status(400).json({ message: 'All fields are required' });
    }

    try {
        const uploadResponse = await cloudinary.uploader.upload(image);
        const imageUrl = uploadResponse.secure_url;

        const newBook = new Book({
            title,
            author,
            caption,
            image: imageUrl,
            user: req.user._id,
        });

        await newBook.save();
        res.status(201).json(newBook);

    } catch (error) {
        console.error('Error uploading image to Cloudinary:', error);
        res.status(500).json({ message: 'Error adding book' });
    }
});

// 📌 Route pour mettre à jour un livre
router.put('/:id', protectRoute, async (req, res) => { // Ajout de protectRoute
    const { id } = req.params;
    const { title, author, caption } = req.body; // Correction de description → caption

    if (!title || !author || !caption) {
        return res.status(400).json({ message: 'All fields are required' });
    }

    try {
        const updatedBook = await Book.findByIdAndUpdate(id, { title, author, caption }, { new: true });

        if (!updatedBook) {
            return res.status(404).json({ message: 'Book not found' });
        }

        res.status(200).json(updatedBook);

    } catch (error) {
        res.status(500).json({ message: 'Error updating book' });
    }
});

// 📌 Route pour supprimer un livre
router.delete('/:id', protectRoute, async (req, res) => {
    const { id } = req.params;

    try {
        const deletedBook = await Book.findById(id);
        if (!deletedBook) {
            return res.status(404).json({ message: 'Book not found' });
        }

        // Vérifier si le livre appartient à l'utilisateur
        if (deletedBook.user.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: 'You are not authorized to delete this book' });
        }

        // Supprimer l'image de Cloudinary si elle existe
        if (deletedBook.image && deletedBook.image.includes('cloudinary')) {
            try {
                const public_id = deletedBook.image.split('/').pop().split('.')[0]; // Extraction correcte du public_id
                await cloudinary.uploader.destroy(public_id);
            } catch (error) {
                console.error('Error deleting image from Cloudinary:', error);
                return res.status(500).json({ message: 'Error deleting image from Cloudinary' });
            }
        }

        await deletedBook.deleteOne();
        res.status(200).json({ message: 'Book deleted successfully' });

    } catch (error) {
        res.status(500).json({ message: 'Error deleting book', error: error.message });
    }
});

export default router;
