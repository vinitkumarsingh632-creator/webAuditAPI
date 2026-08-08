import { BrevoClient } from "@getbrevo/brevo";
import dotenv from "dotenv";

dotenv.config();

console.log("Brevo API key loaded:", !!process.env.BREVO_API_KEY);
console.log("Brevo sender:", process.env.BREVO_SENDER_EMAIL);

const brevo = new BrevoClient({
  apiKey: process.env.BREVO_API_KEY,
});

export async function sendOTP(email, otp) {
  const html = `
    <h2>WebAudit OTP</h2>
    <p>Your OTP is:</p>
    <h1>${otp}</h1>
    <p>This OTP will expire soon.</p>
  `;

  try {
    const result = await brevo.transactionalEmails.sendTransacEmail({
      sender: {
        email: process.env.BREVO_SENDER_EMAIL,
        name: "WebAudit",
      },
      to: [
        {
          email: email,
        },
      ],
      subject: "Your WebAudit OTP",
      htmlContent: html,
    });

    console.log("BREVO SUCCESS:", result);

    return result;
  } catch (error) {
    console.error("BREVO ERROR:", error);
    throw error;
  }
}