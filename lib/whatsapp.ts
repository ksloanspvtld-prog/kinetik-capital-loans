// lib/whatsapp.ts – WhatsApp Business API Integration

const WHATSAPP_ACCESS_TOKEN = process.env.WHATSAPP_ACCESS_TOKEN;
const WHATSAPP_PHONE_NUMBER_ID = process.env.WHATSAPP_PHONE_NUMBER_ID;

export async function sendWhatsAppMessage(to: string, message: string) {
  try {
    const response = await fetch(
      `https://graph.facebook.com/v18.0/${WHATSAPP_PHONE_NUMBER_ID}/messages`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${WHATSAPP_ACCESS_TOKEN}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          messaging_product: "whatsapp",
          to,
          type: "text",
          text: { body: message },
        }),
      }
    );

    const data = await response.json();
    console.log("✅ WhatsApp message sent:", data);
    return { success: true, data };
  } catch (error) {
    console.error("❌ WhatsApp send error:", error);
    return { success: false, error };
  }
}

// ✅ Send Lead Confirmation WhatsApp Message
export async function sendLeadConfirmationWhatsApp(
  mobile: string,
  name: string,
  loanType: string,
  leadId: string
) {
  const message = `✅ Thank you ${name} for applying for ${loanType} with Kinetik Capital.
  
📋 Application ID: #${leadId.slice(-8)}
⏳ Status: Under Review

📱 Track your application: https://kinetik-capital-loans.vercel.app/dashboard

We'll contact you soon!`;

  return sendWhatsAppMessage(`91${mobile}`, message);
}

// ✅ Send Status Update WhatsApp Message
export async function sendStatusUpdateWhatsApp(
  mobile: string,
  name: string,
  loanType: string,
  status: string
) {
  const statusEmojis: Record<string, string> = {
    New: "📋",
    Contacted: "📞",
    Processing: "⚙️",
    Approved: "🎉",
    Rejected: "❌",
  };

  const emoji = statusEmojis[status] || "📊";

  const message = `${emoji} ${name}, your ${loanType} application status is: ${status}.

📱 Track: https://kinetik-capital-loans.vercel.app/dashboard

- Kinetik Capital`;

  return sendWhatsAppMessage(`91${mobile}`, message);
}