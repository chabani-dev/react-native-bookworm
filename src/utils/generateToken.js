import jwt from "jsonwebtoken";

/**
 * Generates a JWT token for the given user ID.
 * @param {string} id - The user's ID.
 * @returns {string} - The generated JWT token.
 */
const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: "30d",
    });
};

export default generateToken;
