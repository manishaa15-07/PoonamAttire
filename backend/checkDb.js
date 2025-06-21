const mongoose = require('mongoose');
const Product = require('./models/Product');

const checkDatabase = async () => {
    try {
        // Connect to MongoDB
        await mongoose.connect('mongodb://localhost:27017/poonam-ladies-wear', {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
        console.log('Connected to MongoDB');

        // Count total products
        const count = await Product.countDocuments();
        console.log('Total products in database:', count);

        // Get all products
        const products = await Product.find({});
        console.log('\nProducts in database:');
        products.forEach((product, index) => {
            console.log(`\n${index + 1}. ${product.name}`);
            console.log('Category:', product.category);
            console.log('Price:', product.price);
            console.log('Sizes:', product.sizes);
            console.log('Stock:', Object.fromEntries(product.stock));
        });

        process.exit(0);
    } catch (error) {
        console.error('Error checking database:', error);
        process.exit(1);
    }
};

checkDatabase(); 