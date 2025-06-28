// const mongoose = require('mongoose');
// const dotenv = require('dotenv');
// const path = require('path');

// // Load environment variables

// const connectDB = async () => {
//     try {
//         if (!process.env.MONGODB_URI) {
//             throw new Error('MONGODB_URI is not defined in environment variables');
//         }

//         const conn = await mongoose.connect(process.env.MONGODB_URI, {
//             useNewUrlParser: true,
//             useUnifiedTopology: true
//         });

//         console.log(`MongoDB Connected: ${conn.connection.host}`);
//     } catch (error) {
//         console.error(`Error connecting to MongoDB: ${error.message}`);
//         process.exit(1);
//     }
// };

// module.exports = connectDB; 












// config/database.js
const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGODB_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });

        console.log(`🗄️  MongoDB Connected: ${conn.connection.host}`);
    } catch (error) {
        console.error('❌ Database connection failed:', error.message);
        process.exit(1);
    }
};

module.exports = connectDB;