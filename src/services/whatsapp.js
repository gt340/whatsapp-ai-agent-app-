import twilio from 'twilio';

const client = twilio(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
);

const TWILIO_WHATSAPP_NUMBER = process.env.TWILIO_WHATSAPP_NUMBER || 'whatsapp:+14155238886';

export async function sendWhatsAppTextMessage({ to, text }) {
  const message = await client.messages.create({
    from: TWILIO_WHATSAPP_NUMBER,
    to: `whatsapp:${to}`,
    body: text,
  });
  console.log(`Message sent to ${to}: ${message.sid}`);
  return message;
}

export function parseIncomingWhatsAppMessages(body) {
  const from = body.From?.replace('whatsapp:', '') || null;
  const text = body.Body || null;

  if (!from || !text) return [];

  return [{ from, text }];
}
