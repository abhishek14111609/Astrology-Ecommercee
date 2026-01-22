import { mongoose } from '../db.js';

const CategorySchema = new mongoose.Schema({
    id: { type: Number, unique: true, index: true },
    name: String,
    slug: { type: String, unique: true, index: true },
    image_url: String,
    created_at: { type: Date, default: Date.now },
});

const Category = mongoose.model('Category', CategorySchema, 'categories');
export default Category;
