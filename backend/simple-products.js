const products = [
    {
        name: "Elegant Silk Saree",
        description: "Beautiful traditional silk saree with intricate embroidery work",
        price: 2500,
        images: [
            "https://images.unsplash.com/photo-1583394838336-acd977736f90?w=500"
        ],
        category: "Sarees",
        sizes: ["Free Size"],
        stock: new Map([["Free Size", 50]]),
        details: ["Pure Silk", "Handcrafted", "Traditional Design"],
        isActive: true
    },
    {
        name: "Designer Kurti Set",
        description: "Modern designer kurti with matching bottom",
        price: 1200,
        images: [
            "https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=500"
        ],
        category: "Kurtis",
        sizes: ["S", "M", "L", "XL"],
        stock: new Map([
            ["S", 25],
            ["M", 30],
            ["L", 20],
            ["XL", 15]
        ]),
        details: ["Cotton Blend", "Modern Design", "Comfortable"],
        isActive: true
    },
    {
        name: "Bridal Lehenga",
        description: "Stunning bridal lehenga with heavy work",
        price: 15000,
        images: [
            "https://images.unsplash.com/photo-1583394838336-acd977736f90?w=500"
        ],
        category: "Lehengas",
        sizes: ["S", "M", "L", "XL"],
        stock: new Map([
            ["S", 8],
            ["M", 10],
            ["L", 6],
            ["XL", 4]
        ]),
        details: ["Heavy Embroidery", "Bridal Collection", "Luxury"],
        isActive: true
    },
    {
        name: "Casual Dress",
        description: "Comfortable casual dress for daily wear",
        price: 800,
        images: [
            "https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=500"
        ],
        category: "Gowns",
        sizes: ["S", "M", "L"],
        stock: new Map([
            ["S", 20],
            ["M", 25],
            ["L", 15]
        ]),
        details: ["Casual Design", "Comfortable", "Easy to Maintain"],
        isActive: true
    },
    {
        name: "Anarkali Suit",
        description: "Elegant Anarkali suit with beautiful embroidery",
        price: 3000,
        images: [
            "https://images.unsplash.com/photo-1583394838336-acd977736f90?w=500"
        ],
        category: "Suits",
        sizes: ["S", "M", "L", "XL"],
        stock: new Map([
            ["S", 12],
            ["M", 15],
            ["L", 10],
            ["XL", 8]
        ]),
        details: ["Anarkali Design", "Embroidered", "Party Wear"],
        isActive: true
    }
];

module.exports = products; 