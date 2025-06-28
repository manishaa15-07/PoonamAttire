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
        const token = req.header('Authorization')?.replace('Bearer ', '');
        console.log('🔑 Admin Token:', token);

        if (!token) {
            console.log('❌ Admin token not provided');
            return res.status(401).json({ error: 'Token not provided' });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        console.log('🔓 Admin decoded token:', decoded);

        const user = await User.findById(decoded.userId);
        if (!user) {
            console.log('❌ Admin user not found in DB');
            return res.status(401).json({ error: 'User not found' });
        }

        if (user.role !== 'admin') {
            console.log('❌ User is not admin:', user.role);
            return res.status(403).json({ error: 'Access denied. Admin only.' });
        }

        console.log('✅ Admin authenticated:', user._id);
        req.token = token;
        req.user = user;
        next();
    } catch (error) {
        console.error('🔥 Admin auth error:', error.message);
        res.status(401).json({ error: 'Please authenticate.' });
    }
};

module.exports = { auth, adminAuth };

