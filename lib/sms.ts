// lib/sms.ts – MSG91 SMS Integration

const MSG91_AUTH_KEY = process.env.MSG91_AUTH_KEY!;
const MSG91_SENDER_ID = process.env.MSG91_SENDER_ID || "KINETIK";

export async function sendSMS(to: string, message: string) {
  try {
    const mobile = to.replace("+91", "").trim();

    const response = await fetch("https://api.msg91.com/api/v5/flow/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        authkey: MSG91_AUTH_KEY,
      },
      body: JSON.stringify({
        sender: MSG91_SENDER_ID,
        mobiles: `91${mobile}`,
        message: message,
        route: "4", // Transactional
        country: "91",
      }),
    });

    const data = await response.json();
    console.log("✅ SMS sent:", data);
    return { success: true, data };
  } catch (error) {
    console.error("❌ SMS send error:", error);
    return { success: false, error };
  }
}

// ✅ Send Lead Confirmation SMS
export async function sendLeadConfirmationSMS(
  mobile: string,
  name: string,
  loanType: string,
  leadId: string
) {
  const msg = `Thank you ${name} for applying for ${loanType} with Kinetik Capital. Your application ID: #${leadId.slice(-8)}. Our team will contact you soon. - Kinetik Capital`;
  return sendSMS(mobile, msg);
}

// ✅ Send Status Update SMS
export async function sendStatusUpdateSMS(
  mobile: string,
  name: string,
  loanType: string,
  status: string
) {
  const msg = `${name}, your ${loanType} application status is: ${status}. Login to track: https://kinetik-capital-loans.vercel.app/dashboard - Kinetik Capital`;
  return sendSMS(mobile, msg);
}