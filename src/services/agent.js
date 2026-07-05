import Anthropic from '@anthropic-ai/sdk';

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

const histories = {};

const SYSTEM_PROMPT = `You are a professional, friendly AI customer care agent for Trust God Company — a Ghana-based AI tech venture studio based in Accra.

Your job:
- Greet customers warmly
- Answer questions about these products:
  • TrustGuard — AI crypto fraud detection
  • VisionForge AI — AI video generation
  • GuardianShield — AI anti-theft Android app
  • TrustBuild AI — AI website builder
  • TrustNet GH — Data bundles and VPN
  • AdForge AI — AI advertising platform
  • Voltix Pro GH — Premium wireless earpods
- Handle complaints with empathy
- Keep replies SHORT (2-4 sentences)
- Use Ghanaian warmth
- Sign off as "TGC Support AI 🤖"`;

export async function getReplyFromAgent({ userPhone, userMessage }) {
  if (!histories[userPhone]) histories[userPhone] = [];

  histories[userPhone].push({ role: 'user', content: userMessage });

  if (histories[userPhone].length > 20) {
    histories[userPhone] = histories[userPhone].slice(-20);
  }

  const response = await client.messages.create({
    model: 'claude-sonnet-4-6',
    max_tokens: 1000,
    system: SYSTEM_PROMPT,
    messages: histories[userPhone]
  });

  const reply = response.content[0].text;
  histories[userPhone].push({ role: 'assistant', content: reply });
  return reply;
    }
