const mongoose = require('mongoose');

const connectDB = (config) => {
    try {
        mongoose.connect(config.DB_URL);
    } catch (error) {
        console.error('Error connecting to database');
        throw error;
    }
}

module.exports = connectDB;