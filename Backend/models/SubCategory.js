import { mongoose } from '../db.js';

const SubCategorySchema = new mongoose.Schema({
  id: { type: Number, unique: true, index: true },
  category_id: { type: Number, index: true },
  name: String,
  slug: { type: String, unique: true, index: true },
  created_at: { type: Date, default: Date.now },
});

const SubCategory = mongoose.model('SubCategory', SubCategorySchema, 'sub_categories');
export default SubCategory;
