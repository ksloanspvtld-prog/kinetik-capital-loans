import nodemailer from "nodemailer";

const EMAIL_USER = process.env.EMAIL_USER!;
const EMAIL_PASS = process.env.EMAIL_PASS!;

// ✅ Create transporter
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: EMAIL_USER,
    pass: EMAIL_PASS,
  },
});

// ============================================================
// 1. Send Verification Email
// ============================================================
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

// ============================================================
// 2. Send Welcome Email
// ============================================================
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

// ============================================================
// 3. Send Lead Confirmation Email
// ============================================================
export async function sendLeadConfirmationEmail(
  email: string,
  name: string,
  loanType: string,
  leadId: string
) {
  const baseUrl = process.env.NEXTAUTH_URL || "http://localhost:3000";
  const cleanBaseUrl = baseUrl.replace(/\/+$/, "");
  const dashboardUrl = `${cleanBaseUrl}/dashboard`;

  const mailOptions = {
    from: `"Kinetik Capital" <${EMAIL_USER}>`,
    to: email,
    subject: "✅ Loan Application Received – Kinetik Capital",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 10px;">
        <div style="text-align: center; padding: 20px 0; background: linear-gradient(135deg, #4F46E5, #7C3AED); border-radius: 10px 10px 0 0;">
          <h1 style="color: white; margin: 0;">Kinetik Capital</h1>
        </div>
        <div style="padding: 30px;">
          <h2>Hello ${name},</h2>
          <p style="color: #333; font-size: 16px; line-height: 1.6;">
            Thank you for applying for a <strong>${loanType}</strong> with Kinetik Capital.
          </p>
          <p style="color: #333; font-size: 16px; line-height: 1.6;">
            Your application has been received and is now under review. Our team will get back to you shortly.
          </p>
          <div style="text-align: center; margin: 30px 0;">
            <a href="${dashboardUrl}" style="background: linear-gradient(135deg, #4F46E5, #7C3AED); color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; font-weight: bold; display: inline-block;">
              Track Your Application →
            </a>
          </div>
          <p style="color: #999; font-size: 12px; margin-top: 20px; border-top: 1px solid #e0e0e0; padding-top: 20px;">
            Application ID: <strong>#${leadId.slice(-8)}</strong>
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

// ============================================================
// 4. Send Status Update Email
// ============================================================
export async function sendStatusUpdateEmail(
  email: string,
  name: string,
  loanType: string,
  status: string,
  leadId: string
) {
  const baseUrl = process.env.NEXTAUTH_URL || "http://localhost:3000";
  const cleanBaseUrl = baseUrl.replace(/\/+$/, "");
  const dashboardUrl = `${cleanBaseUrl}/dashboard`;

  const statusMessages: Record<string, string> = {
    Processing: "Your application is now being reviewed by our team.",
    Approved: "🎉 Congratulations! Your loan application has been approved.",
    Rejected: "We regret to inform you that your application could not be approved at this time.",
    Contacted: "Our team will contact you shortly for further details.",
    New: "Your application has been received and is pending review.",
  };

  const statusMessage = statusMessages[status] || "Your application status has been updated.";

  const mailOptions = {
    from: `"Kinetik Capital" <${EMAIL_USER}>`,
    to: email,
    subject: `📊 Loan Application Status Update – ${status}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 10px;">
        <div style="text-align: center; padding: 20px 0; background: linear-gradient(135deg, #4F46E5, #7C3AED); border-radius: 10px 10px 0 0;">
          <h1 style="color: white; margin: 0;">Kinetik Capital</h1>
        </div>
        <div style="padding: 30px;">
          <h2>Hello ${name},</h2>
          <p style="color: #333; font-size: 16px; line-height: 1.6;">
            Your loan application for <strong>${loanType}</strong> has been updated.
          </p>
          <div style="background: #f0fdf4; border: 1px solid #bbf7d0; border-radius: 8px; padding: 15px; margin: 20px 0;">
            <p style="font-size: 18px; font-weight: bold; color: #15803d; margin: 0;">
              Current Status: <span style="text-transform: uppercase;">${status}</span>
            </p>
            <p style="color: #333; margin-top: 10px;">${statusMessage}</p>
          </div>
          <div style="text-align: center; margin: 30px 0;">
            <a href="${dashboardUrl}" style="background: linear-gradient(135deg, #4F46E5, #7C3AED); color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; font-weight: bold; display: inline-block;">
              View Details →
            </a>
          </div>
          <p style="color: #999; font-size: 12px; margin-top: 20px; border-top: 1px solid #e0e0e0; padding-top: 20px;">
            Application ID: <strong>#${leadId.slice(-8)}</strong>
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

// ============================================================
// 5. Send Follow-up Reminder Email
// ============================================================
export async function sendFollowUpReminderEmail(
  email: string,
  name: string,
  loanType: string,
  followUpDate: string,
  leadId: string
) {
  const baseUrl = process.env.NEXTAUTH_URL || "http://localhost:3000";
  const cleanBaseUrl = baseUrl.replace(/\/+$/, "");
  const dashboardUrl = `${cleanBaseUrl}/dashboard`;

  const mailOptions = {
    from: `"Kinetik Capital" <${EMAIL_USER}>`,
    to: email,
    subject: "🔔 Follow-up Reminder – Kinetik Capital",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 10px;">
        <div style="text-align: center; padding: 20px 0; background: linear-gradient(135deg, #4F46E5, #7C3AED); border-radius: 10px 10px 0 0;">
          <h1 style="color: white; margin: 0;">Kinetik Capital</h1>
        </div>
        <div style="padding: 30px;">
          <h2>Hello ${name},</h2>
          <p style="color: #333; font-size: 16px; line-height: 1.6;">
            This is a friendly reminder regarding your <strong>${loanType}</strong> application.
          </p>
          <div style="background: #fef3c7; border: 1px solid #fcd34d; border-radius: 8px; padding: 15px; margin: 20px 0;">
            <p style="font-size: 16px; font-weight: bold; color: #92400e; margin: 0;">
              📅 Follow-up Date: <strong>${followUpDate}</strong>
            </p>
            <p style="color: #333; margin-top: 10px;">
              Please keep your documents ready and be available for the follow-up.
            </p>
          </div>
          <div style="text-align: center; margin: 30px 0;">
            <a href="${dashboardUrl}" style="background: linear-gradient(135deg, #4F46E5, #7C3AED); color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; font-weight: bold; display: inline-block;">
              View Details →
            </a>
          </div>
          <p style="color: #999; font-size: 12px; margin-top: 20px; border-top: 1px solid #e0e0e0; padding-top: 20px;">
            Application ID: <strong>#${leadId.slice(-8)}</strong>
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

// ============================================================
// 6. Send DSA Approval Email with Credentials (नवीन)
// ============================================================
export async function sendDSAAprovalEmail(
  email: string,
  name: string,
  password: string,
  dashboardLink: string
) {
  const mailOptions = {
    from: `"Kinetik Capital" <${EMAIL_USER}>`,
    to: email,
    subject: "🎉 Congratulations! Your DSA Partner Account is Approved",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 10px;">
        <div style="text-align: center; padding: 20px 0; background: linear-gradient(135deg, #4F46E5, #7C3AED); border-radius: 10px 10px 0 0;">
          <h1 style="color: white; margin: 0;">Kinetik Capital</h1>
        </div>
        <div style="padding: 30px;">
          <h2>Hello ${name},</h2>
          <p style="color: #333; font-size: 16px; line-height: 1.6;">
            We are pleased to inform you that your <strong>DSA Partner</strong> application has been <strong>approved</strong>! 🎉
          </p>
          <p style="color: #333; font-size: 16px; line-height: 1.6;">
            You can now access your DSA Panel using the credentials below:
          </p>
          <div style="background: #f0fdf4; border: 1px solid #bbf7d0; border-radius: 8px; padding: 15px; margin: 20px 0;">
            <p style="font-size: 16px; font-weight: bold; color: #15803d; margin: 0;">
              🔗 Dashboard Link:
            </p>
            <p style="color: #333; margin-top: 5px; word-break: break-all;">
              <a href="${dashboardLink}" style="color: #4F46E5;">${dashboardLink}</a>
            </p>
            <p style="font-size: 16px; font-weight: bold; color: #15803d; margin: 10px 0 0 0;">
              👤 User ID:
            </p>
            <p style="color: #333; margin-top: 5px;">
              <strong>${email}</strong>
            </p>
            <p style="font-size: 16px; font-weight: bold; color: #15803d; margin: 10px 0 0 0;">
              🔑 Password:
            </p>
            <p style="color: #333; margin-top: 5px;">
              <strong>${password}</strong>
            </p>
          </div>
          <p style="color: #666; font-size: 14px; line-height: 1.6;">
            Please <strong>change your password</strong> after your first login for security purposes.
          </p>
          <div style="text-align: center; margin: 30px 0;">
            <a href="${dashboardLink}" style="background: linear-gradient(135deg, #4F46E5, #7C3AED); color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; font-weight: bold; display: inline-block;">
              Go to DSA Panel →
            </a>
          </div>
          <p style="color: #999; font-size: 12px; margin-top: 20px; border-top: 1px solid #e0e0e0; padding-top: 20px;">
            This is an automated email. Please do not reply.
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