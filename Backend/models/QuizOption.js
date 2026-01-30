import { mongoose } from '../db.js';

const QuizOptionSchema = new mongoose.Schema({
  id: { type: Number, unique: true, index: true },
  question_id: { type: Number, required: true, index: true },
  option_text: String,
  option_tag: String, // A, B, C, D
  order: Number,
  created_at: { type: Date, default: Date.now },
});

const QuizOption = mongoose.model('QuizOption', QuizOptionSchema, 'quiz_options');
export default QuizOption;
