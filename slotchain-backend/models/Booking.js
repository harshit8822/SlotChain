const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  salon: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Salon',
    required: true
  },
  stylist: {
    name: String,
    specialties: [String]
  },
  services: [{
    name: String,
    category: String,
    duration: Number,
    price: Number
  }],
  bookingDate: {
    type: Date,
    required: true
  },
  timeSlot: {
    start: String, // "09:00"
    end: String    // "10:30"
  },
  customerPreferences: {
    hairLength: String,
    stylePreference: String,
    colorPreference: String,
    allergies: [String],
    specialRequests: String
  },
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'in_progress', 'completed', 'cancelled', 'no_show'],
    default: 'pending'
  },
  paymentStatus: {
    type: String,
    enum: ['pending', 'paid', 'failed', 'refunded'],
    default: 'pending'
  },
  paymentMethod: {
    type: String,
    enum: ['stripe', 'hedera'],
    required: true
  },
  transactionHash: String,
  stripePaymentIntentId: String,
  totalAmount: {
    type: Number,
    required: true
  },
  discount: {
    amount: Number,
    code: String,
    reason: String
  },
  nftMinted: {
    type: Boolean,
    default: false
  },
  nftTokenId: String,
  beforePhotos: [String], // URLs
  afterPhotos: [String], // URLs
  customerRating: {
    rating: { type: Number, min: 1, max: 5 },
    review: String,
    date: Date
  },
  loyaltyPointsEarned: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Booking', bookingSchema);
