import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const bookSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true, // Title is required
    },
    caption: {
        type: String,
        required: true, // Caption is required
    },
    image: {
        type: String,
        required: true, // Image is required
    },
    rating: {
        type: Number,
        required: true, // Rating is required
        min: 0, // Minimum rating
        max: 5, // Maximum rating
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User", // Reference to the User model
        required: true, // User ID is required
    },
}, {
    timestamps: true, // Automatically manage createdAt and updatedAt fields
});
const Book = mongoose.model("Book", bookSchema);
export default Book;
