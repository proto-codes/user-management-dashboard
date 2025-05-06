import mongoose, { Schema, models } from 'mongoose';

const UserSchema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  role: { type: String, enum: ['admin', 'user'], default: 'user' },
  status: { type: String, enum: ['active', 'inactive'], default: 'active' },
  password: { type: String, required: true }, // bcrypt hashed
  profilePhoto: { type: String, default: '' }
}, {
  timestamps: true
});

export default models.User || mongoose.model('User', UserSchema);
