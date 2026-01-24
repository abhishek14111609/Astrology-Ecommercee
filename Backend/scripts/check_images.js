import { mongoose } from '../db.js';
import Product from '../models/Product.js';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

// Configure dotenv
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, '../.env') });

const checkImages = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected to DB');

        const products = await Product.find({}).limit(5).lean();
        console.log('Checking first 5 products:');
        products.forEach(p => {
            console.log(`ID: ${p.id}, Name: ${p.name}`);
            console.log(`   image_url: '${p.image_url}'`); // Quote to see empty strings
            console.log(`   image:     '${p.image}'`);
        });

        process.exit(0);
    } catch (error) {
        console.error('Error:', error);
        process.exit(1);
    }
};

checkImages();
