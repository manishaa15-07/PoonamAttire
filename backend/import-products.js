const mongoose = require('mongoose');
const Product = require('./models/Product');
const products = require('./simple-products');
require('dotenv').config();

async function importProducts() {
    try {
        await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/poonam-ladies-wear');
        console.log('Connected to MongoDB');

        // Clear existing products
        await Product.deleteMany({});
        console.log('Cleared existing products');

        // Insert products
        const insertedProducts = await Product.insertMany(products);
        console.log(`✅ Successfully imported ${insertedProducts.length} products`);

        console.log('\nImported products:');
        insertedProducts.forEach(product => {
            console.log(`- ${product.name}: ₹${product.price} (Category: ${product.category})`);
        });

        console.log('\n✅ Products imported successfully!');

    } catch (error) {
        console.error('❌ Error importing products:', error);

        if (error.code === 11000) {
            console.error('Duplicate key error. This might be due to SKU field.');
            console.error('Please run the fix-product-model.js script first to remove SKU constraints.');
        }
    } finally {
        await mongoose.disconnect();
        console.log('Disconnected from MongoDB');
    }
}

importProducts(); 