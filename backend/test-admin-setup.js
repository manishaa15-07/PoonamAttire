const mongoose = require('mongoose');
const User = require('./models/User');
const Product = require('./models/Product');
const Order = require('./models/Order');
require('dotenv').config();

const connectDB = require('./config/db');

async function testAdminSetup() {
    try {
        console.log('🔗 Connecting to database...');
        await connectDB();

        console.log('📊 Checking database collections...');

        // Check users
        const userCount = await User.countDocuments();
        console.log(`👥 Total users: ${userCount}`);

        // Check admin users
        const adminCount = await User.countDocuments({ role: 'admin' });
        console.log(`👑 Admin users: ${adminCount}`);

        // Check products
        const productCount = await Product.countDocuments();
        console.log(`📦 Total products: ${productCount}`);

        // Check orders
        const orderCount = await Order.countDocuments();
        console.log(`📋 Total orders: ${orderCount}`);

        // Create test admin if none exists
        if (adminCount === 0) {
            console.log('🔧 Creating test admin user...');
            const testAdmin = new User({
                firstName: 'Admin',
                lastName: 'User',
                email: 'admin@test.com',
                password: 'admin123',
                role: 'admin'
            });

            await testAdmin.save();
            console.log('✅ Test admin created successfully');
            console.log('📧 Email: admin@test.com');
            console.log('🔑 Password: admin123');
        } else {
            console.log('✅ Admin users already exist');
            const admins = await User.find({ role: 'admin' }).select('firstName lastName email');
            admins.forEach(admin => {
                console.log(`👑 Admin: ${admin.firstName} ${admin.lastName} (${admin.email})`);
            });
        }

        // Test dashboard stats query
        console.log('📊 Testing dashboard stats...');
        const totalUsers = await User.countDocuments({ role: { $ne: 'admin' } });
        const totalProducts = await Product.countDocuments();
        const totalOrders = await Order.countDocuments();
        const totalRevenue = await Order.aggregate([
            { $match: { orderStatus: 'delivered' } },
            { $group: { _id: null, total: { $sum: '$total' } } }
        ]);

        console.log('📈 Dashboard stats:');
        console.log(`- Total users (non-admin): ${totalUsers}`);
        console.log(`- Total products: ${totalProducts}`);
        console.log(`- Total orders: ${totalOrders}`);
        console.log(`- Total revenue: ₹${totalRevenue[0]?.total || 0}`);

        console.log('✅ Admin setup test completed successfully!');

    } catch (error) {
        console.error('❌ Error in admin setup test:', error);
    } finally {
        mongoose.connection.close();
        console.log('🔌 Database connection closed');
    }
}

testAdminSetup(); 