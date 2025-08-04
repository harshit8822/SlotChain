const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true
  },
  password: {
    type: String,
    required: true,
    minlength: 6
  },
  phone: {
    type: String,
    required: true
  },
  dateOfBirth: {
    type: Date
  },
  gender: {
    type: String,
    enum: ['male', 'female', 'other'],
    required: true
  },
  hairType: {
    type: String,
    enum: ['straight', 'wavy', 'curly', 'coily']
  },
  preferredServices: [{
    type: String
  }],
  hederaAccountId: {
    type: String,
    default: null
  },
  walletAddress: {
    type: String,
    default: null
  },
  role: {
    type: String,
    enum: ['customer', 'salon_owner', 'admin'],
    default: 'customer'
  },
  isVerified: {
    type: Boolean,
    default: false
  },
  loyaltyPoints: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

userSchema.methods.comparePassword = async function(password) {
  return await bcrypt.compare(password, this.password);
};

module.exports = mongoose.model('User', userSchema);
