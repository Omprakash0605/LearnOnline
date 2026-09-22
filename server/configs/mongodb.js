import mongoose from "mongoose";

//connect to the mongoDB database

const connectDB = async ()=>{
    mongoose.connection.on('connected', ()=> console.log('Database Connected'))
    mongoose.connection.on('error', (err)=> console.error('Database Connection Error:', err))
    try {
        await mongoose.connect(`${process.env.MONGODB_URI}/LMS`)
    } catch (error) {
        console.error("MongoDB initial connection error:", error.message);
    }
}

export default connectDB


