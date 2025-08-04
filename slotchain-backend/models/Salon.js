const mongoose = require('mongoose');

const salonSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  address: {
    street: String,
    city: String,
    state: String,
    zipCode: String,
    country: { type: String, default: 'USA' }
  },
  contact: {
    phone: String,
    email: String,
    website: String
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  services: [{
    name: {
      type: String,
      required: true
    },
    category: {
      type: String,
      enum: ['haircut', 'styling', 'coloring', 'treatment', 'makeover', 'beard', 'facial'],
      required: true
    },
    duration: {
      type: Number,
      required: true // in minutes
    },
    price: {
      type: Number,
      required: true // in USD
    },
    description: String,
    forGender: {
      type: String,
      enum: ['male', 'female', 'unisex'],
      default: 'unisex'
    }
  }],
  stylists: [{
    name: String,
    specialties: [String],
    experience: Number, // years
    rating: {
      type: Number,
      default: 5.0,
      min: 0,
      max: 5
    }
  }],
  workingHours: {
    monday: { start: String, end: String, closed: Boolean },
    tuesday: { start: String, end: String, closed: Boolean },
    wednesday: { start: String, end: String, closed: Boolean },
    thursday: { start: String, end: String, closed: Boolean },
    friday: { start: String, end: String, closed: Boolean },
    saturday: { start: String, end: String, closed: Boolean },
    sunday: { start: String, end: String, closed: Boolean }
  },
  amenities: [{
    type: String,
    enum: ['wifi', 'parking', 'refreshments', 'music', 'magazines', 'air_conditioning']
  }],
  images: [String], // URLs to salon photos
  slotDuration: {
    type: Number,
    default: 30 // minutes
  },
  maxAdvanceBooking: {
    type: Number,
    default: 60 // days
  },
  rating: {
    average: { type: Number, default: 5.0 },
    totalReviews: { type: Number, default: 0 }
  },
  isActive: {
    type: Boolean,
    default: true
  },
  isVerified: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Salon', salonSchema);
