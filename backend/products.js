const products = [
    {
        name: "Elegant Silk Saree",
        description: "Beautiful traditional silk saree with intricate embroidery work. Perfect for special occasions and festivals. Made from pure silk with zari work.",
        price: 2500,
        images: [
            "https://images.unsplash.com/photo-1583394838336-acd977736f90?w=500",
            "https://images.unsplash.com/photo-1583394838336-acd977736f90?w=500"
        ],
        category: "Sarees",
        sizes: ["Free Size"],
        stock: new Map([
            ["Free Size", 50]
        ]),
        details: [
            "Pure Silk Material",
            "Handcrafted Embroidery",
            "Traditional Design",
            "Comfortable Fit",
            "Dry Clean Only"
        ],
        isActive: true
    },
    {
        name: "Designer Kurti Set",
        description: "Modern designer kurti with matching bottom. Perfect for casual and semi-formal occasions. Comfortable cotton blend fabric.",
        price: 1200,
        images: [
            "https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=500",
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
        details: [
            "Cotton Blend Fabric",
            "Modern Design",
            "Comfortable Fit",
            "Machine Washable",
            "Matching Bottom Included"
        ],
        isActive: true
    },
    {
        name: "Bridal Lehenga",
        description: "Stunning bridal lehenga with heavy work and embellishments. Perfect for weddings and special celebrations. Luxurious fabric with intricate details.",
        price: 15000,
        images: [
            "https://images.unsplash.com/photo-1583394838336-acd977736f90?w=500",
            "https://images.unsplash.com/photo-1583394838336-acd977736f90?w=500"
        ],
        category: "Lehengas",
        sizes: ["XS", "S", "M", "L", "XL"],
        stock: new Map([
            ["XS", 5],
            ["S", 8],
            ["M", 10],
            ["L", 6],
            ["XL", 4]
        ]),
        details: [
            "Heavy Embroidery Work",
            "Zari and Stone Work",
            "Luxurious Fabric",
            "Bridal Collection",
            "Dry Clean Only"
        ],
        isActive: true
    },
    {
        name: "Casual Dress",
        description: "Comfortable casual dress for daily wear. Perfect for office and casual outings. Easy to maintain and style.",
        price: 800,
        images: [
            "https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=500",
            "https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=500"
        ],
        category: "Gowns",
        sizes: ["S", "M", "L"],
        stock: new Map([
            ["S", 20],
            ["M", 25],
            ["L", 15]
        ]),
        details: [
            "Cotton Fabric",
            "Casual Design",
            "Easy to Maintain",
            "Machine Washable",
            "Versatile Styling"
        ],
        isActive: true
    },
    {
        name: "Anarkali Suit",
        description: "Elegant Anarkali suit with beautiful embroidery. Perfect for parties and special occasions. Flowy design with comfortable fit.",
        price: 3000,
        images: [
            "https://images.unsplash.com/photo-1583394838336-acd977736f90?w=500",
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
        details: [
            "Anarkali Design",
            "Embroidered Work",
            "Flowy Silhouette",
            "Party Wear",
            "Dry Clean Recommended"
        ],
        isActive: true
    },
    {
        name: "Traditional Saree",
        description: "Classic traditional saree with simple yet elegant design. Perfect for daily wear and small gatherings. Comfortable and easy to drape.",
        price: 1800,
        images: [
            "https://images.unsplash.com/photo-1583394838336-acd977736f90?w=500",
            "https://images.unsplash.com/photo-1583394838336-acd977736f90?w=500"
        ],
        category: "Sarees",
        sizes: ["Free Size"],
        stock: new Map([
            ["Free Size", 40]
        ]),
        details: [
            "Traditional Design",
            "Comfortable Fabric",
            "Easy to Drape",
            "Daily Wear",
            "Machine Washable"
        ],
        isActive: true
    },
    {
        name: "Designer Gown",
        description: "Stunning designer gown for special occasions. Elegant design with modern touches. Perfect for parties and celebrations.",
        price: 8000,
        images: [
            "https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=500",
            "https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=500"
        ],
        category: "Gowns",
        sizes: ["S", "M", "L"],
        stock: new Map([
            ["S", 8],
            ["M", 10],
            ["L", 6]
        ]),
        details: [
            "Designer Collection",
            "Elegant Design",
            "Party Wear",
            "Premium Fabric",
            "Dry Clean Only"
        ],
        isActive: true
    },
    {
        name: "Casual Kurti",
        description: "Simple and comfortable casual kurti for daily wear. Easy to style and maintain. Perfect for office and casual outings.",
        price: 600,
        images: [
            "https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=500",
            "https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=500"
        ],
        category: "Kurtis",
        sizes: ["S", "M", "L", "XL"],
        stock: new Map([
            ["S", 30],
            ["M", 35],
            ["L", 25],
            ["XL", 20]
        ]),
        details: [
            "Casual Design",
            "Comfortable Fit",
            "Easy Maintenance",
            "Machine Washable",
            "Versatile Styling"
        ],
        isActive: true
    },
    {
        name: "Wedding Lehenga",
        description: "Exquisite wedding lehenga with heavy work and traditional design. Perfect for wedding ceremonies and grand celebrations.",
        price: 25000,
        images: [
            "https://images.unsplash.com/photo-1583394838336-acd977736f90?w=500",
            "https://images.unsplash.com/photo-1583394838336-acd977736f90?w=500"
        ],
        category: "Lehengas",
        sizes: ["S", "M", "L", "XL"],
        stock: new Map([
            ["S", 3],
            ["M", 5],
            ["L", 3],
            ["XL", 2]
        ]),
        details: [
            "Wedding Collection",
            "Heavy Embroidery",
            "Traditional Design",
            "Premium Fabric",
            "Dry Clean Only"
        ],
        isActive: true
    },
    {
        name: "Office Suit",
        description: "Professional office suit with modern design. Perfect for corporate settings and formal occasions. Comfortable and stylish.",
        price: 2000,
        images: [
            "https://images.unsplash.com/photo-1583394838336-acd977736f90?w=500",
            "https://images.unsplash.com/photo-1583394838336-acd977736f90?w=500"
        ],
        category: "Suits",
        sizes: ["S", "M", "L", "XL"],
        stock: new Map([
            ["S", 15],
            ["M", 20],
            ["L", 12],
            ["XL", 10]
        ]),
        details: [
            "Professional Design",
            "Office Wear",
            "Comfortable Fit",
            "Easy Maintenance",
            "Machine Washable"
        ],
        isActive: true
    }
];

module.exports = products; 