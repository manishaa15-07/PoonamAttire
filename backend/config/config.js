module.exports = {
    PORT: process.env.PORT || 5000,
    NODE_ENV: process.env.NODE_ENV || 'development',
    JWT_SECRET: process.env.JWT_SECRET || 'your-fallback-secret-key',
    JWT_EXPIRE: process.env.JWT_EXPIRE || '7d',

    // File upload settings
    MAX_FILE_SIZE: process.env.MAX_FILE_SIZE || 5 * 1024 * 1024, // 5MB
    UPLOAD_PATH: process.env.UPLOAD_PATH || './uploads/',

    // Pagination
    DEFAULT_PAGE_SIZE: 12,
    MAX_PAGE_SIZE: 50,

    // Shipping
    DEFAULT_SHIPPING_CHARGE: 50,
    FREE_SHIPPING_THRESHOLD: 1000,
};