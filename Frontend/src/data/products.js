
export const categories = [
    "All",
    "Pooja Essentials",
    "Healing Crystals",
    "Home Decor",
    "God Idols",
    "Festive Decor",
    "Rudraksha",
    "Gemstones"
];

export const products = [
    // Pooja Essentials
    {
        id: 1,
        name: "Premium Brass Pooja Thali Set",
        category: "Pooja Essentials",
        price: 1299,
        oldPrice: 1999,
        rating: 4.8,
        reviews: 215,
        image: "https://www.mypoojabox.in/cdn/shop/files/DSC00067_copy_ad351095-1d93-46d8-8f08-a7b85739ab79_713x.jpg?v=1767083108",
        description: "A beautifully accumulated brass pooja thali set including diya, agarbatti stand, and roli chawal katori. Perfect for daily worship and festive occasions.",
        images: [
            "https://www.mypoojabox.in/cdn/shop/files/DSC00067_copy_ad351095-1d93-46d8-8f08-a7b85739ab79_713x.jpg?v=1767083108",
            "https://www.mypoojabox.in/cdn/shop/files/DSC00067_copy_ad351095-1d93-46d8-8f08-a7b85739ab79_713x.jpg?v=1767083108"
        ],
        sku: "PE-BPT-001",
        availability: "In Stock"
    },
    {
        id: 2,
        name: "Pure Camphor (Kapoor) - 100g",
        category: "Pooja Essentials",
        price: 350,
        oldPrice: 450,
        rating: 4.9,
        reviews: 120,
        image: "https://www.mypoojabox.in/cdn/shop/files/DSC00067_copy_ad351095-1d93-46d8-8f08-a7b85739ab79_713x.jpg?v=1767083108",
        description: "100% pure camphor tablets for your daily pooja. Burns completely without leaving any residue.",
        images: [],
        sku: "PE-CAM-002",
        availability: "In Stock"
    },
    {
        id: 3,
        name: "Natural Incense Sticks (Rose)",
        category: "Pooja Essentials",
        price: 199,
        oldPrice: 299,
        rating: 4.5,
        reviews: 85,
        image: "https://www.mypoojabox.in/cdn/shop/files/DSC00067_copy_ad351095-1d93-46d8-8f08-a7b85739ab79_713x.jpg?v=1767083108", // Placeholder
        description: "Hand-rolled natural incense sticks with a soothing rose fragrance. Creates a divine atmosphere.",
        images: [],
        sku: "PE-INC-003",
        availability: "In Stock"
    },

    // Healing Crystals
    {
        id: 4,
        name: "Amethyst Crystal Cluster",
        category: "Healing Crystals",
        price: 1899,
        rating: 4.9,
        reviews: 142,
        image: "https://www.mypoojabox.in/cdn/shop/files/DSC00067_copy_ad351095-1d93-46d8-8f08-a7b85739ab79_713x.jpg?v=1767083108",
        isNew: true,
        description: "A stunning natural Amethyst cluster known for its spiritual protection and purification properties.",
        images: [
            "https://www.mypoojabox.in/cdn/shop/files/DSC00067_copy_ad351095-1d93-46d8-8f08-a7b85739ab79_713x.jpg?v=1767083108",
            "https://www.mypoojabox.in/cdn/shop/files/DSC00067_copy_ad351095-1d93-46d8-8f08-a7b85739ab79_713x.jpg?v=1767083108"
        ],
        sku: "HC-AME-004",
        availability: "In Stock"
    },
    {
        id: 5,
        name: "Rose Quartz Healing Bracelet",
        category: "Healing Crystals",
        price: 699,
        oldPrice: 999,
        rating: 4.7,
        reviews: 98,
        image: "https://www.mypoojabox.in/cdn/shop/files/DSC00067_copy_ad351095-1d93-46d8-8f08-a7b85739ab79_713x.jpg?v=1767083108",
        description: "Authentic Rose Quartz bracelet promoting love, self-love, and friendship.",
        images: [],
        sku: "HC-RQB-005",
        availability: "In Stock"
    },
    {
        id: 6,
        name: "Seven Chakra Pyramids Set",
        category: "Healing Crystals",
        price: 2499,
        oldPrice: 3500,
        rating: 4.8,
        reviews: 56,
        image: "https://www.mypoojabox.in/cdn/shop/files/DSC00067_copy_ad351095-1d93-46d8-8f08-a7b85739ab79_713x.jpg?v=1767083108", // Placeholder
        discount: 28,
        description: "Set of 7 crystal pyramids balancing your chakras and energy flow.",
        images: [],
        sku: "HC-SCP-006",
        availability: "In Stock"
    },

    // God Idols
    {
        id: 7,
        name: "Antique Brass Ganesha Idol",
        category: "God Idols",
        price: 3500,
        oldPrice: 4200,
        rating: 5.0,
        reviews: 180,
        image: "https://www.mypoojabox.in/cdn/shop/files/DSC00067_copy_ad351095-1d93-46d8-8f08-a7b85739ab79_713x.jpg?v=1767083108",
        description: "Exquisitely crafted brass Ganesha idol for your home temple or decor.",
        images: [],
        sku: "GI-GAN-007",
        availability: "In Stock"
    },
    {
        id: 8,
        name: "Marble Krishna Statue",
        category: "God Idols",
        price: 5500,
        oldPrice: 7000,
        rating: 4.9,
        reviews: 45,
        image: "https://www.mypoojabox.in/cdn/shop/files/DSC00067_copy_ad351095-1d93-46d8-8f08-a7b85739ab79_713x.jpg?v=1767083108", // Placeholder
        isNew: true,
        description: "Hand-carved white marble Krishna statue with gold painting work.",
        images: [],
        sku: "GI-KRI-008",
        availability: "Low Stock"
    },

    // Home Decor
    {
        id: 9,
        name: "Traditional Brass Urli",
        category: "Home Decor",
        price: 2100,
        oldPrice: 2800,
        rating: 4.6,
        reviews: 78,
        image: "https://www.mypoojabox.in/cdn/shop/files/DSC00067_copy_ad351095-1d93-46d8-8f08-a7b85739ab79_713x.jpg?v=1767083108", // Placeholder
        description: "Beautiful brass Urli for floating flowers and candles, adding a traditional touch to your home.",
        images: [],
        sku: "HD-URL-009",
        availability: "In Stock"
    },
    {
        id: 10,
        name: "Himalayan Salt Lamp",
        category: "Home Decor",
        price: 1299,
        oldPrice: 1599,
        rating: 4.8,
        reviews: 310,
        image: "https://www.mypoojabox.in/cdn/shop/files/DSC00067_copy_ad351095-1d93-46d8-8f08-a7b85739ab79_713x.jpg?v=1767083108", // Placeholder - look for salt lamp
        description: "Natural Himalayan Pink Salt Lamp that purifies the air and creates a warm ambiance.",
        images: [],
        sku: "HD-HSL-010",
        availability: "In Stock"
    },

    // Gemstones (Existing mock data integrated)
    {
        id: 11,
        name: "Natural Red Coral (Moonga)",
        category: "Gemstones",
        price: 2499,
        oldPrice: 4999,
        rating: 5,
        reviews: 128,
        image: "https://www.mypoojabox.in/cdn/shop/files/DSC00067_copy_ad351095-1d93-46d8-8f08-a7b85739ab79_713x.jpg?v=1767083108",
        isNew: true,
        discount: 50,
        description: "Original Italian Red Coral (Moonga) gemstone certified by lab. Bringing energy, vitality, and ambition to the wearer.",
        images: [
            "https://www.mypoojabox.in/cdn/shop/products/DSC_5029_900x.jpg?v=1596549393"
        ],
        sku: "GEM-RC-011",
        availability: "In Stock"
    },

    // Rudraksha
    {
        id: 12,
        name: "Certified Rudraksha Mala",
        category: "Rudraksha",
        price: 1599,
        oldPrice: 2199,
        rating: 4,
        reviews: 85,
        image: "https://www.mypoojabox.in/cdn/shop/files/DSC00067_copy_ad351095-1d93-46d8-8f08-a7b85739ab79_713x.jpg?v=1767083108",
        discount: 27,
        description: "Authentic 5 Mukhi Rudraksha mala for meditation and chanting.",
        images: [],
        sku: "RUD-MAL-012",
        availability: "In Stock"
    },

    // Festive Decor
    {
        id: 13,
        name: "Decorative Diya Set (Pack of 4)",
        category: "Festive Decor",
        price: 499,
        oldPrice: 799,
        rating: 4.5,
        reviews: 56,
        image: "https://www.mypoojabox.in/cdn/shop/files/DSC00067_copy_ad351095-1d93-46d8-8f08-a7b85739ab79_713x.jpg?v=1767083108", // Diwali-ish
        description: "Handcrafted terracotta diyas for Diwali and other festivals.",
        images: [],
        sku: "FD-Diy-013",
        availability: "In Stock"
    },
    {
        id: 14,
        name: "Evil Eye Wall Hanging",
        category: "Home Decor",
        price: 599,
        oldPrice: 999,
        rating: 4.8,
        reviews: 134,
        image: "https://www.mypoojabox.in/cdn/shop/files/DSC00067_copy_ad351095-1d93-46d8-8f08-a7b85739ab79_713x.jpg?v=1767083108", // Placeholder
        description: "Protective Evil Eye wall hanging to ward off negative energy.",
        images: [],
        sku: "HD-EE-014",
        availability: "In Stock"
    }

];
