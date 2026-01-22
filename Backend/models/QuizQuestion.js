import { mongoose } from '../db.js';

const QuizQuestionSchema = new mongoose.Schema({
  id: { type: Number, unique: true, index: true },
  question_text: String,
  step_order: Number,
  created_at: { type: Date, default: Date.now },
});

const QuizQuestion = mongoose.model('QuizQuestion', QuizQuestionSchema, 'quiz_questions');
export default QuizQuestion;
