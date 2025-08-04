const hederaService = require('./hederaService');
const NFT = require('../models/NFT');
const Booking = require('../models/Booking');

class NFTService {
  constructor() {
    this.collectionTokenId = process.env.HEDERA_TOKEN_ID;
  }

  async createTransformationNFT(bookingId) {
    try {
      const booking = await Booking.findById(bookingId).populate('user salon');

      if (!booking) throw new Error('Booking not found');

      const metadata = this.generateMetadata(booking);

      const mintResult = await hederaService.mintNFT(this.collectionTokenId, metadata);

      const nft = new NFT({
        tokenId: this.collectionTokenId,
        serialNumber: mintResult.serialNumber,
        owner: booking.user._id,
        booking: booking._id,
        metadata,
        nftType: 'transformation',
        rarity: this.calculateRarity(booking),
        mintTransactionId: mintResult.transactionId,
        status: 'minted'
      });

      await nft.save();

      booking.nftMinted = true;
      booking.nftTokenId = `${this.collectionTokenId}-${mintResult.serialNumber}`;
      await booking.save();

      return nft;
    } catch (error) {
      throw new Error(`NFT creation failed: ${error.message}`);
    }
  }

  generateMetadata(booking) {
    const servicesNames = booking.services.map(s => s.name).join(', ');
    const totalDuration = booking.services.reduce((sum, s) => sum + s.duration, 0);

    return {
      name: `SlotChain Transformation #${Date.now()}`,
      description: `Transformation at ${booking.salon.name}. Services: ${servicesNames}`,
      image: booking.afterPhotos?.[0] || "https://your-domain.com/default-transformation.png",
      external_url: `${process.env.FRONTEND_URL}/nft/${booking._id}`,
      attributes: [
        { trait_type: "Salon", value: booking.salon.name },
        { trait_type: "City", value: booking.salon.address.city },
        { trait_type: "Services", value: servicesNames },
        { trait_type: "Duration (minutes)", value: totalDuration, display_type: "number" },
        { trait_type: "Date", value: booking.bookingDate.toDateString() }
      ]
    };
  }

  calculateRarity(booking) {
    const totalAmount = booking.totalAmount;
    const servicesCount = booking.services.length;

    if (totalAmount > 200 && servicesCount > 2) return 'legendary';
    if (totalAmount > 150) return 'epic';
    if (servicesCount > 1) return 'rare';
    return 'common';
  }
}

module.exports = new NFTService();
