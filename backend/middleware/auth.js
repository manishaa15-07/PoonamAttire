const jwt = require('jsonwebtoken');
const User = require('../models/User');

// const auth = async (req, res, next) => {
//     try {
//         const token = req.header('Authorization')?.replace('Bearer ', '');

//         if (!token) {
//             throw new Error();
//         }

//         const decoded = jwt.verify(token, process.env.JWT_SECRET);
//         const user = await User.findOne({ _id: decoded.userId });

//         if (!user) {
//             throw new Error();
//         }

//         req.token = token;
//         req.user = user;
//         next();
//     } catch (error) {
//         res.status(401).json({ error: 'Please authenticate.' });
//     }
// };



const auth = async (req, res, next) => {
    try {
        const token = req.header('Authorization')?.replace('Bearer ', '');
        console.log('🔑 Token:', token);

        if (!token) {
            console.log('❌ Token not provided');
            return res.status(401).json({ error: 'Token not provided' });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        console.log('🔓 Decoded token:', decoded);

        const user = await User.findById(decoded.userId);
        if (!user) {
            console.log('❌ User not found in DB');
            return res.status(401).json({ error: 'User not found' });
        }

        req.token = token;
        req.user = user;
        next();
    } catch (error) {
        console.error('🔥 Auth error:', error.message);
        res.status(401).json({ error: 'Please authenticate.' });
    }
};

const adminAuth = async (req, res, next) => {
    try {
        await auth(req, res, () => {
            if (req.user.role !== 'admin') {
                throw new Error();
            }
            next();
        });
    } catch (error) {
        res.status(403).json({ error: 'Access denied. Admin only.' });
    }
};

module.exports = { auth, adminAuth };


