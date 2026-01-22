import { mongoose } from '../db.js';

const ProductSchema = new mongoose.Schema({
  id: { type: Number, unique: true, index: true },
  name: String,
  slug: { type: String, unique: true, index: true },
  description: String,
  price: Number,
  category_id: { type: Number, index: true },
  sub_category_id: { type: Number, index: true },
  zodiac_sign: String,
  image_url: String,
  is_bestseller: { type: Boolean, default: false },
  tags: { type: [String], default: [] },
  stock: { type: Number, default: 0 },
  created_at: { type: Date, default: Date.now },
});

const Product = mongoose.model('Product', ProductSchema, 'products');
export default Product;
