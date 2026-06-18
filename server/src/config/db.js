const mongoose = require('mongoose');

const connectDB = async (retries = 5, delay = 5000) => {
    if (!process.env.MONGO_URI) {
        console.error('MONGO_URI environment variable is not defined!');
        process.exit(1);
    }

    for (let i = 1; i <= retries; i++) {
        try {
            const conn = await mongoose.connect(process.env.MONGO_URI, {
                serverSelectionTimeoutMS: 10000,
            });
            console.log(`MongoDB Connected: ${conn.connection.host}`);
            return;
        } catch (error) {
            console.error(`DB Connection attempt ${i}/${retries} failed: ${error.message}`);
            if (i < retries) {
                console.log(`Retrying in ${delay / 1000}s...`);
                await new Promise((res) => setTimeout(res, delay));
            } else {
                console.error('All DB connection attempts failed. Exiting.');
                process.exit(1);
            }
        }
    }
};

module.exports = connectDB;
