const mongoose = require('mongoose');
require('dotenv').config();

async function removeSkuConstraint() {
    try {
        await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/poonam-ladies-wear');
        console.log('Connected to MongoDB');

        const db = mongoose.connection.db;

        // Try to drop the SKU index if it exists
        try {
            await db.collection('products').dropIndex('sku_1');
            console.log('✅ Dropped SKU unique index');
        } catch (error) {
            console.log('ℹ️ SKU index not found or already removed');
        }

        // Also try to drop any other SKU-related indexes
        try {
            await db.collection('products').dropIndex('sku');
            console.log('✅ Dropped SKU index');
        } catch (error) {
            console.log('ℹ️ No additional SKU indexes found');
        }

        console.log('✅ SKU constraints removed successfully!');

    } catch (error) {
        console.error('❌ Error removing SKU constraint:', error);
    } finally {
        await mongoose.disconnect();
        console.log('Disconnected from MongoDB');
    }
}

removeSkuConstraint(); 