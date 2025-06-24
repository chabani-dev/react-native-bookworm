import mongoose from "mongoose";
import bcrypt from "bcryptjs";


const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
        minlength: 6, // Minimum length for password

    },
    profilePicture: {
        type: String,
        default: "", // Default to an empty string if no profile picture is provided
    },
}, {
    timestamps: true, // Automatically manage createdAt and updatedAt fields
});

userSchema.pre("save", async function (next) {
    if (!this.isModified("password")) return next(); // Only hash if password is modified

    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);

    next();
})

const User = mongoose.model("User", userSchema);
export default User;