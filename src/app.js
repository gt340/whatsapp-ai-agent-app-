import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { getReplyFromAgent } from './services/agent.js';
import { sendWhatsAppTextMessage, parseIncomingWhatsAppMessages } from './services/whatsapp.js';

dotenv.config();

const app = express();
const VERIFY_TOKEN = process.env.VERIFY_TOKEN || 'trustgodcompany';

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

app.get('/health', (_req, res) => {
  res.json({
    ok: true,
    app: 'TGC WhatsApp AI Agent',
    timestamp: new Date().toISOString()
  });
});

app.post('/webhook/whatsapp', async (req, res) => {
  try {
    const messages = parseIncomingWhatsAppMessages(req.body);
    for (const message of messages) {
      if (!message.from || !message.text) continue;
      const reply = await getReplyFromAgent({
        userPhone: message.from,
        userMessage: message.text
      });
      await sendWhatsAppTextMessage({
        to: message.from,
        text: reply
      });
    }
    res.set('Content-Type', 'text/xml');
    res.status(200).send('<Response></Response>');
  } catch (error) {
    console.error('Webhook error:', error);
    res.status(500).json({ error: 'Failed to process message.' });
  }
});

app.post('/api/test-reply', async (req, res) => {
  try {
    const { userMessage = 'Hello', userPhone = 'test-user' } = req.body || {};
    const reply = await getReplyFromAgent({ userPhone, userMessage });
    res.json({ reply });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default app;
