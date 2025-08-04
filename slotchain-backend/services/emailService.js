const nodemailer = require('nodemailer');

class EmailService {
  constructor() {
    this.transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: process.env.EMAIL_PORT,
      secure: false,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    });
  }

  async sendBookingConfirmation(email, booking) {
    const services = booking.services.map(s => s.name).join(', ');

    const mailOptions = {
      from: `"SlotChain" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "Booking Confirmed - SlotChain Hair & Beauty",
      html: `
      <h2>Booking Confirmed!</h2>
      <p>Your appointment at <strong>${booking.salon.name}</strong> has been confirmed.</p>
      <ul>
        <li>Services: ${services}</li>
        <li>Date: ${new Date(booking.bookingDate).toLocaleDateString()}</li>
        <li>Time: ${booking.timeSlot.start} - ${booking.timeSlot.end}</li>
        <li>Total: $${booking.totalAmount}</li>
      </ul>
      <p>Thank you for choosing SlotChain! You will also receive an exclusive NFT after your transformation.</p>
      `
    };

    try {
      await this.transporter.sendMail(mailOptions);
      return { success: true };
    } catch (error) {
      console.error('Email sending failed:', error);
      return { success: false, error: error.message };
    }
  }

  async sendNFTNotification(email, nft) {
    const mailOptions = {
      from: `"SlotChain" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "Your Transformation NFT is Ready!",
      html: `
      <h2>Congratulations!</h2>
      <p>Your unique transformation NFT (${nft.metadata.name}) has been minted on Hedera blockchain.</p>
      <p>Token ID: ${nft.tokenId} - Serial No: #${nft.serialNumber}</p>
      <p>View your NFT collection on SlotChain dashboard.</p>
      `
    };

    try {
      await this.transporter.sendMail(mailOptions);
      return { success: true };
    } catch (error) {
      console.error('NFT email sending failed:', error);
      return { success: false, error: error.message };
    }
  }
}

module.exports = new EmailService();
