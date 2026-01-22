import { mongoose } from '../db.js';

const UserSchema = new mongoose.Schema({
  id: { type: Number, unique: true, index: true },
  name: String,
  email: { type: String, unique: true, index: true },
  password: String,
  role: { type: String, default: 'user' },
  zodiac_sign: String,
  created_at: { type: Date, default: Date.now },
});

const User = mongoose.model('User', UserSchema, 'users');
export default User;
