import { mongoose } from '../db.js';

const CounterSchema = new mongoose.Schema({
  _id: { type: String, required: true },
  seq: { type: Number, default: 0 },
});

export const Counter = mongoose.model('Counter', CounterSchema, 'counters');

export async function getNextSequence(name) {
  const res = await Counter.findByIdAndUpdate(
    name,
    { $inc: { seq: 1 } },
    { new: true, upsert: true }
  ).lean();
  return res.seq;
}
