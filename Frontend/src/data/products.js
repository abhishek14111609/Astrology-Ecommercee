
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
        image: "https://images.unsplash.com/photo-1617050541961-949243bf794d?auto=format&fit=crop&w=800&q=80",
        description: "A beautifully accumulated brass pooja thali set including diya, agarbatti stand, and roli chawal katori. Perfect for daily worship and festive occasions.",
        images: [
            "https://images.unsplash.com/photo-1617050541961-949243bf794d?auto=format&fit=crop&w=800&q=80"
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
        image: "https://images.unsplash.com/photo-1602405389670-3d843da5259c?auto=format&fit=crop&w=800&q=80",
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
        image: "https://images.unsplash.com/photo-1608552684807-681e59265f24?auto=format&fit=crop&w=800&q=80",
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
        image: "https://images.unsplash.com/photo-1567645169542-d6aee70af43f?auto=format&fit=crop&w=800&q=80",
        isNew: true,
        description: "A stunning natural Amethyst cluster known for its spiritual protection and purification properties.",
        images: [
            "https://images.unsplash.com/photo-1567645169542-d6aee70af43f?auto=format&fit=crop&w=800&q=80"
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
        image: "https://images.unsplash.com/photo-1599643477877-530eb83abc8e?auto=format&fit=crop&w=800&q=80",
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
        image: "https://images.unsplash.com/photo-1610375461369-d612b729f3d9?auto=format&fit=crop&w=800&q=80",
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
        image: "https://images.unsplash.com/photo-1567591414240-e1758c978051?auto=format&fit=crop&w=800&q=80",
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
        image: "https://images.unsplash.com/photo-1608092806283-29a3a98555e6?auto=format&fit=crop&w=800&q=80",
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
        image: "https://images.unsplash.com/photo-1605650172600-e792c306cd10?auto=format&fit=crop&w=800&q=80",
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
        image: "https://images.unsplash.com/photo-1515696955266-4f67e13219a8?auto=format&fit=crop&w=800&q=80",
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
        image: "https://images.unsplash.com/photo-1589903308904-1010c2294adc?auto=format&fit=crop&w=800&q=80",
        isNew: true,
        discount: 50,
        description: "Original Italian Red Coral (Moonga) gemstone certified by lab. Bringing energy, vitality, and ambition to the wearer.",
        images: [
            "https://images.unsplash.com/photo-1589903308904-1010c2294adc?auto=format&fit=crop&w=800&q=80"
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
        image: "https://images.unsplash.com/photo-1615655406736-b37c4d898e6f?auto=format&fit=crop&w=800&q=80",
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
        image: "https://images.unsplash.com/photo-1510375971434-2e8c287bd5b7?auto=format&fit=crop&w=800&q=80",
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
        image: "https://images.unsplash.com/photo-1586523098522-82ab78775438?auto=format&fit=crop&w=800&q=80",
        description: "Protective Evil Eye wall hanging to ward off negative energy.",
        images: [],
        sku: "HD-EE-014",
        availability: "In Stock"
    }

];
