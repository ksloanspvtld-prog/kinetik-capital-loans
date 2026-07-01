import nodemailer from "nodemailer";

const EMAIL_USER = process.env.EMAIL_USER!;
const EMAIL_PASS = process.env.EMAIL_PASS!;

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: { user: EMAIL_USER, pass: EMAIL_PASS },
});

// ✅ Send Verification Email
export async function sendVerificationEmail(email: string, token: string, name: string) {
  const baseUrl = process.env.NEXTAUTH_URL || "http://localhost:3000";
  const cleanBaseUrl = baseUrl.replace(/\/+$/, "");
  const verificationUrl = `${cleanBaseUrl}/api/auth/verify?token=${token}`;

  const mailOptions = {
    from: `"Kinetik Capital" <${EMAIL_USER}>`,
    to: email,
    subject: "Verify Your Email Address",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 10px;">
        <div style="text-align: center; padding: 20px 0; background: linear-gradient(135deg, #4F46E5, #7C3AED); border-radius: 10px 10px 0 0;">
          <h1 style="color: white; margin: 0;">Kinetik Capital</h1>
        </div>
        <div style="padding: 30px;">
          <h2>Hello ${name},</h2>
          <p style="color: #333; font-size: 16px; line-height: 1.6;">
            Thank you for registering with Kinetik Capital. Please verify your email address to complete your registration.
          </p>
          <div style="text-align: center; margin: 30px 0;">
            <a href="${verificationUrl}" style="background: linear-gradient(135deg, #4F46E5, #7C3AED); color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; font-weight: bold; display: inline-block;">
              Verify Email Address
            </a>
          </div>
          <p style="color: #666; font-size: 14px; line-height: 1.6;">
            Or copy and paste this link in your browser:<br>
            <span style="color: #4F46E5; word-break: break-all;">${verificationUrl}</span>
          </p>
          <p style="color: #999; font-size: 12px; margin-top: 20px; border-top: 1px solid #e0e0e0; padding-top: 20px;">
            This link will expire in 24 hours. If you did not create an account, please ignore this email.
          </p>
        </div>
        <div style="text-align: center; padding: 20px; background: #f8f9fa; border-radius: 0 0 10px 10px; color: #666; font-size: 12px;">
          &copy; ${new Date().getFullYear()} Kinetik Capital. All Rights Reserved.
        </div>
      </div>
    `,
  };

  await transporter.sendMail(mailOptions);
}

// ✅ Send Welcome Email (वापरात नसेल तरी ठीक)
export async function sendWelcomeEmail(email: string, name: string) {
  const baseUrl = process.env.NEXTAUTH_URL || "http://localhost:3000";
  const cleanBaseUrl = baseUrl.replace(/\/+$/, "");

  const mailOptions = {
    from: `"Kinetik Capital" <${EMAIL_USER}>`,
    to: email,
    subject: "Welcome to Kinetik Capital! 🎉",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 10px;">
        <div style="text-align: center; padding: 20px 0; background: linear-gradient(135deg, #4F46E5, #7C3AED); border-radius: 10px 10px 0 0;">
          <h1 style="color: white; margin: 0;">Kinetik Capital</h1>
        </div>
        <div style="padding: 30px;">
          <h2>Welcome, ${name}! 🎉</h2>
          <p style="color: #333; font-size: 16px; line-height: 1.6;">
            Your account has been successfully verified. You can now:
          </p>
          <ul style="color: #333; font-size: 16px; line-height: 2;">
            <li>✅ Apply for loans</li>
            <li>✅ Compare interest rates</li>
            <li>✅ Track your applications</li>
            <li>✅ Get personalized loan offers</li>
          </ul>
          <div style="text-align: center; margin: 30px 0;">
            <a href="${cleanBaseUrl}/dashboard" style="background: linear-gradient(135deg, #4F46E5, #7C3AED); color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; font-weight: bold; display: inline-block;">
              Go to Dashboard →
            </a>
          </div>
        </div>
        <div style="text-align: center; padding: 20px; background: #f8f9fa; border-radius: 0 0 10px 10px; color: #666; font-size: 12px;">
          &copy; ${new Date().getFullYear()} Kinetik Capital. All Rights Reserved.
        </div>
      </div>
    `,
  };

  await transporter.sendMail(mailOptions);
}