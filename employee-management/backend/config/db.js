const mongoose = require("mongoose");
const Employee = require("../models/Employee");

async function connectDB() {
    try {
        await mongoose.connect(process.env.MONGODB_URI);

        console.log("MongoDB connected successfully!");

        await Employee.syncIndexes();

        console.log("Database indexes synchronized.");
    } catch (error) {
        console.error("MongoDB connection failed:", error.message);
        process.exit(1);
    }
}

module.exports = connectDB;