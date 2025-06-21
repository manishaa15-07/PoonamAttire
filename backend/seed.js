const mongoose = require('mongoose');
const Product = require('./models/Product');
const products = require('./data/products.json');

const seedDatabase = async () => {
    try {
        // Connect to MongoDB
        await mongoose.connect('mongodb://localhost:27017/poonam-ladies-wear', {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
        console.log('Connected to MongoDB');

        // Clear existing products
        await Product.deleteMany({});
        console.log('Cleared existing products');

        // Insert new products
        const insertedProducts = await Product.insertMany(products);
        console.log(`Successfully inserted ${insertedProducts.length} products`);

        // Log the first product to verify structure
        console.log('Sample product:', insertedProducts[0]);

        process.exit(0);
    } catch (error) {
        console.error('Error seeding database:', error);
        process.exit(1);
    }
};

seedDatabase(); 