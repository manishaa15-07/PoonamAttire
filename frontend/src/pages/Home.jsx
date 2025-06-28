import React from 'react';
import { Link } from 'react-router-dom';
import { Carousel } from 'react-responsive-carousel';
import 'react-responsive-carousel/lib/styles/carousel.min.css';

const carouselImages = [
    {
        src: 'https://img.perniaspopupshop.com/HOMEPAGE_IMAGES/WOMEN/20_Jun_25/Website-01-Women-Shararas-Ghararas-20-0625.gif',
        caption: 'Elegant Summer Collection',
    },
    {
        src: 'https://byshree.com/cdn/shop/articles/Trendy-Ethnic-Sets-Exploring-the-Latest-Ethnic-Wear-Online.jpg?v=1701161326&width=2048',
        caption: 'Trendy Casual Wear',
    },
    {
        src: 'https://popinfash.com/content/images/2021/09/9_20210908_134407_0008.jpg',
        caption: 'Party Gowns & More',
    },
    {
        src: 'https://wforwoman.com/cdn/shop/files/W_website_banner_MF_24_copy-29_53324f41-d865-4230-88e4-aa2e6350395f.jpg?v=1726572485&width=1500',
        caption: 'Chic Bottoms & Accessories',
    },
];

const Home = () => {
    const featuredProducts = [
        {
            id: 1,
            name: 'Summer Collection Dress',
            price: 1299,
            image: 'https://juniperfashion.com/cdn/shop/files/DSC_8493.jpg?v=1744781101&width=1000',
        },
        {
            id: 2,
            name: 'Casual Wear Set',
            price: 999,
            image: 'https://juniperfashion.com/cdn/shop/files/P1029D_MINT_5.jpg?v=1743491042&width=1000',
        },
        {
            id: 3,
            name: 'Party Wear Gown',
            price: 2499,
            image: 'https://www.aachho.com/cdn/shop/files/2_6d7d8016-9b61-4614-949c-e588c7f19dbd_720x.jpg?v=1748678089'
        }
    ];

    const categories = [
        { name: 'Dresses', image: 'https://5.imimg.com/data5/SELLER/Default/2023/4/298081329/GT/CK/TD/148854516/ladies-party-wear-gown-500x500.jpeg' },
        { name: 'Kurtis', image: 'https://sp-ao.shortpixel.ai/client/to_webp,q_glossy,ret_img,w_400,h_514/https://kurtifashion.com/wp-content/uploads/2023/02/Cotton-Long-Kurti-Set-1-sd2fss2-400x514.jpg' },
        {
            name: 'Bottoms', image: 'data:image/jpeg;base64,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'
        },
        {
            name: 'CropTop', image: 'https://cdn.shopify.com/s/files/1/0049/3649/9315/files/koskii-purple-printed-semicrepe-designer-readymadelehenga-gcfe0040766_purple_1_6_large.jpg?v=1729595563'
        }, {
            name: "Suit Sets", image: 'https://www.koskii.com/cdn/shop/files/Tile-Baner-Ready-Made-Sets.jpg?v=1750066613&width=720'
        },
        {
            name: 'Dress  Materials', image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRpqR-cjw4JBd0RhsYXm0FXbg45S0U_YWYm8g&s'
        }


    ];

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Carousel Section */}


            {/* Hero Section */}
            <div className="relative bg-gradient-to-r from-primary to-orange-400 text-white text-center overflow-hidden">
                <div className="relative z-10 max-w-7xl mx-auto py-24 px-4 sm:py-32 sm:px-6 lg:px-8">
                    <h1
                        className="text-4xl font-extrabold tracking-tight sm:text-5xl lg:text-6xl"
                        style={{ textShadow: '2px 2px 4px rgba(0,0,0,0.3)' }}
                    >
                        Poonam Ladies Wear
                    </h1>
                    <p
                        className="mt-6 max-w-2xl mx-auto text-xl"
                        style={{ textShadow: '1px 1px 2px rgba(0,0,0,0.3)' }}
                    >
                        Discover the latest trends in women's fashion
                    </p>
                </div>
                {/* Animated Wave */}
                <div className="wave-container">
                    <svg className="waves" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink"
                        viewBox="0 24 150 28" preserveAspectRatio="none" shapeRendering="auto">
                        <defs>
                            <path id="gentle-wave" d="M-160 44c30 0 58-18 88-18s 58 18 88 18 58-18 88-18 58 18 88 18 v44h-352z" />
                        </defs>
                        <g className="parallax">
                            <use xlinkHref="#gentle-wave" x="48" y="0" fill="rgba(255,255,255,0.7" />
                            <use xlinkHref="#gentle-wave" x="48" y="3" fill="rgba(255,255,255,0.5)" />
                            <use xlinkHref="#gentle-wave" x="48" y="5" fill="rgba(255,255,255,0.3)" />
                            <use xlinkHref="#gentle-wave" x="48" y="7" fill="#fff" />
                        </g>
                    </svg>
                </div>
            </div>




            <div className=" mx-auto pt-8 pb-4">
                <Carousel
                    showThumbs={false}
                    autoPlay
                    infiniteLoop
                    showStatus={false}
                    interval={3500}
                    className="rounded-lg overflow-hidden shadow-lg"
                >
                    {carouselImages.map((img, idx) => (
                        <div key={idx} className="relative">
                            <img src={img.src} alt={img.caption} className="object-cover h-[800px] w-full" />
                            <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-40 text-white text-xl font-semibold py-3 px-6">
                                {img.caption}
                            </div>
                        </div>
                    ))}
                </Carousel>
            </div>
            {/* Categories Section */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <h2 className="text-3xl font-extrabold text-center text-gray-900 mb-8">Shop by Category</h2>
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    {categories.map((category) => (
                        <Link
                            key={category.name}
                            to={`/products?category=${category.name.toLowerCase()}`}
                            className="group relative rounded-lg overflow-hidden"
                        >
                            <div className="aspect-w-1 aspect-h-1 w-full overflow-hidden rounded-lg bg-gray-200">
                                <img
                                    src={category.image}
                                    alt={category.name}
                                    className="h-full w-full object-cover object-center group-hover:opacity-75"
                                />
                            </div>
                            <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center">
                                <h3 className="text-2xl font-semibold text-white">{category.name}</h3>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>

            {/* Featured Products Section */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <h2 className="text-3xl font-extrabold text-gray-900 mb-8">Featured Products</h2>
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    {featuredProducts.map((product) => (
                        <Link
                            key={product.id}
                            to={`/product/${product.id}`}
                            className="group"
                        >
                            <div className="aspect-w-1 aspect-h-1 w-full overflow-hidden rounded-lg bg-gray-200">
                                <img
                                    src={product.image}
                                    alt={product.name}
                                    className="h-[500px] w-full object-cover object-center group-hover:opacity-75"
                                />
                            </div>
                            <div className="mt-4 flex justify-between">
                                <div>
                                    <h3 className="text-sm text-gray-700">{product.name}</h3>
                                </div>
                                <p className="text-sm font-medium text-gray-900">₹{product.price}</p>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>




            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <h2 className="text-3xl font-extrabold text-gray-900 mb-8 text-center">New Arrival</h2>
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    {featuredProducts.map((product) => (
                        <Link
                            key={product.id}
                            to={`/product/${product.id}`}
                            className="group"
                        >
                            <div className="aspect-w-1 aspect-h-1 w-full overflow-hidden rounded-lg bg-gray-200">
                                <img
                                    src={product.image}
                                    alt={product.name}
                                    className="h-[500px] w-full object-cover object-center group-hover:opacity-75"
                                />
                            </div>
                            <div className="mt-4 flex justify-between">
                                <div>
                                    <h3 className="text-sm text-gray-700">{product.name}</h3>
                                </div>
                                <p className="text-sm font-medium text-gray-900">₹{product.price}</p>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Home; 