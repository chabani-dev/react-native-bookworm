import mongoose from 'mongoose'
dotenv.config();
import dotenv from 'dotenv';
// Import dotenv to manage environment variables

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI, {

        })
        console.log(`MongoDB connected: ${mongoose.connection.host}`)
    } catch (error) {
        console.error('MongoDB connection failed:', error.message)
        process.exit(1) // Exit process with failure
    }
}
export default connectDB;