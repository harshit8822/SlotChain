const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const hederaService = require('./hederaService');

class PaymentService {
  async createStripePaymentIntent(amount, bookingId) {
    try {
      const paymentIntent = await stripe.paymentIntents.create({
        amount: Math.round(amount * 100),
        currency: 'usd',
        metadata: { bookingId: bookingId.toString() }
      });
      return {
        clientSecret: paymentIntent.client_secret,
        paymentIntentId: paymentIntent.id
      };
    } catch (error) {
      throw new Error(`Stripe payment creation failed: ${error.message}`);
    }
  }

  async confirmStripePayment(paymentIntentId) {
    try {
      const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);
      return paymentIntent.status === 'succeeded';
    } catch (error) {
      throw new Error(`Stripe payment confirmation failed: ${error.message}`);
    }
  }

  async processHederaPayment(fromAccountId, amount) {
    try {
      // Transfers HBAR from fromAccountId to operator account (your account)
      // Note: Normally user signs the transaction client-side; this simulates transfer for backend.
      const result = await hederaService.transferHbar(process.env.HEDERA_ACCOUNT_ID, amount);
      return result;
    } catch (error) {
      throw new Error(`Hedera payment processing failed: ${error.message}`);
    }
  }
}

module.exports = new PaymentService();
