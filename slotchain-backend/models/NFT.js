const mongoose = require('mongoose');

const nftSchema = new mongoose.Schema({
  tokenId: {
    type: String,
    required: true,
    unique: true
  },
  serialNumber: Number,
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  booking: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Booking',
    required: true
  },
  metadata: {
    name: String,
    description: String,
    image: String, // Before/After transformation image
    external_url: String,
    attributes: [{
      trait_type: String,
      value: String,
      display_type: String
    }]
  },
  nftType: {
    type: String,
    enum: ['transformation', 'loyalty', 'achievement', 'special_event'],
    default: 'transformation'
  },
  rarity: {
    type: String,
    enum: ['common', 'rare', 'epic', 'legendary'],
    default: 'common'
  },
  mintTransactionId: String,
  status: {
    type: String,
    enum: ['minting', 'minted', 'transferred'],
    default: 'minting'
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('NFT', nftSchema);
