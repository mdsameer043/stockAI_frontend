import nodemailer from "nodemailer"

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT) || 587,
  secure: process.env.SMTP_SECURE === "true",
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
})

export async function sendOtpEmail(to: string, otp: string) {
  try {
    const info = await transporter.sendMail({
      from: process.env.EMAIL_FROM || "StockAI <no-reply@stockai.com>",
      to,
      subject: "Your StockAI Verification Code",
      text: `Your OTP for verification is: ${otp}. It will expire in 5 minutes.`,
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px; border: 1px solid #eee; border-radius: 8px;">
          <h2>🔐 Verify Your Email</h2>
          <p>Your OTP for StockAI verification is:</p>
          <h1 style="color:#2563eb; letter-spacing:4px;">${otp}</h1>
          <p>This code will expire in <b>5 minutes</b>.</p>
          <p>Ignore this message if you didn’t request verification.</p>
        </div>
      `,
    })
    console.log("✅ OTP email sent:", info.messageId)
  } catch (error) {
    console.error("❌ Error sending OTP email:", error)
  }
}
