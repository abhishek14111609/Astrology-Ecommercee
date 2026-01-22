import { mongoose } from '../db.js';
import Product from '../models/Product.js';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

// Configure dotenv
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, '../.env') });

const images = {
    ruby: "https://images.unsplash.com/photo-1615655406736-b37c4d898e6f?auto=format&fit=crop&w=800&q=80",
    emerald: "https://images.unsplash.com/photo-1606293926075-69a00dbfde81?auto=format&fit=crop&w=800&q=80",
    sapphire: "https://images.unsplash.com/photo-1599643478518-17488fbbcd75?auto=format&fit=crop&w=800&q=80",
    diamond: "https://images.unsplash.com/photo-1610375461246-83df859d849d?auto=format&fit=crop&w=800&q=80",
    pearl: "https://images.unsplash.com/photo-1621768536097-a6566a96dd76?auto=format&fit=crop&w=800&q=80",
    coral: "https://images.unsplash.com/photo-1589903308904-1010c2294adc?auto=format&fit=crop&w=800&q=80",
    yellow_sapphire: "https://images.unsplash.com/photo-1584305574647-03a2686e694d?auto=format&fit=crop&w=800&q=80",
    default: "https://images.unsplash.com/photo-1617050541961-949243bf794d?auto=format&fit=crop&w=800&q=80"
};

const getImageForProduct = (name) => {
    const lowerName = name.toLowerCase();
    if (lowerName.includes('ruby') || lowerName.includes('manik')) return images.ruby;
    if (lowerName.includes('emerald') || lowerName.includes('panna')) return images.emerald;
    if (lowerName.includes('blue sapphire') || lowerName.includes('neelam')) return images.sapphire;
    if (lowerName.includes('yellow sapphire') || lowerName.includes('pukhraj')) return images.yellow_sapphire;
    if (lowerName.includes('diamond') || lowerName.includes('heera')) return images.diamond;
    if (lowerName.includes('pearl') || lowerName.includes('moti')) return images.pearl;
    if (lowerName.includes('coral') || lowerName.includes('moonga')) return images.coral;
    return images.default;
};

const updateImages = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected to DB');

        const products = await Product.find({});
        console.log(`Found ${products.length} products`);

        let updatedCount = 0;
        for (const product of products) {
            const newImage = getImageForProduct(product.name);
            product.image_url = newImage;
            await product.save();
            // console.log(`Updated ${product.name} with ${newImage}`);
            updatedCount++;
        }

        console.log(`Successfully updated images for ${updatedCount} products`);
        process.exit(0);
    } catch (error) {
        console.error('Error updating images:', error);
        process.exit(1);
    }
};

updateImages();
