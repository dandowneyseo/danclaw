/**
 * DanClaw — AI Agent for Service Businesses
 * Built by Dan Downey | danclaw.ai | (916)826-9410
 * Runs on Raspberry Pi 5 via Telegram
 */

import * as fs from 'fs';
import * as path from 'path';
import * as os from 'os';
import TelegramBot from 'node-telegram-bot-api';
import { printSplash } from './splash/splash-cli';

// ─── Config ────────────────────────────────────────────────────────────────

const CONFIG_DIR = path.join(os.homedir(), '.danclaw');
const CONFIG_PATH = path.join(CONFIG_DIR, 'config.json');
const PROMPT_TEMPLATE = path.join(__dirname, '../src/config/system-prompt.template.txt');

interface DanClawConfig {
    setup_complete: boolean;
    business: {
      name: string;
      city_state: string;
      phone: string;
      website: string;
      type: string;
    };
    llm: {
      provider: string;
      api_key: string;
      model: string;
    };
    telegram: {
      bot_token: string;
      operator_chat_id: string;
    };
    danclaw: {
      version: string;
      support_phone: string;
      support_url: string;
    };
}

function loadConfig(): DanClawConfig | null {
    if (!fs.existsSync(CONFIG_PATH)) return null;
    try {
          return JSON.parse(fs.readFileSync(CONFIG_PATH, 'utf8'));
    } catch {
          return null;
    }
}

function buildSystemPrompt(config: DanClawConfig): string {
    let template = '';
    try {
          template = fs.readFileSync(PROMPT_TEMPLATE, 'utf8');
    } catch {
          template = fs.readFileSync(
                  path.join(__dirname, 'config/system-prompt.template.txt'), 'utf8'
                );
    }
    return template
      .replace(/{BUSINESS_NAME}/g, config.business.name)
      .replace(/{BUSINESS_TYPE}/g, config.business.type)
      .replace(/{CITY_STATE}/g, config.business.city_state)
      .replace(/{PHONE}/g, config.business.phone)
      .replace(/{WEBSITE}/g, config.business.website || 'Not provided');
}

// ─── LLM Router ─────────────────────────────────────────────────────────────

async function callLLM(
    config: DanClawConfig,
    systemPrompt: string,
    history: Array<{role: string; content: string}>
  ): Promise<string> {
    const { provider, api_key, model } = config.llm;

  if (provider === 'openai') {
        const { OpenAI } = await import('openai');
        const client = new OpenAI({ apiKey: api_key });
        const messages = [
          { role: 'system' as const, content: systemPrompt },
                ...history.map(m => ({ role: m.role as 'user' | 'assistant', content: m.content }))
              ];
        const res = await client.chat.completions.create({
                model: model || 'gpt-4o',
                messages,
                max_tokens: 500,
        });
        return res.choices[0]?.message?.content || 'Sorry, no response.';

  } else if (provider === 'anthropic') {
        const Anthropic = (await import('@anthropic-ai/sdk')).default;
        const client = new Anthropic({ apiKey: api_key });
        const res = await client.messages.create({
                model: model || 'claude-3-5-haiku-20241022',
                max_tokens: 500,
                system: systemPrompt,
                messages: history.map(m => ({ role: m.role as 'user' | 'assistant', content: m.content })),
        });
        return (res.content[0] as any).text || 'Sorry, no response.';

  } else if (provider === 'google') {
        const { GoogleGenerativeAI } = await import('@google/generative-ai');
        const genAI = new GoogleGenerativeAI(api_key);
        const gemModel = genAI.getGenerativeModel({ model: model || 'gemini-1.5-flash' });
        const chat = gemModel.startChat({
                history: history.slice(0, -1).map(m => ({
                          role: m.role === 'user' ? 'user' : 'model',
                          parts: [{ text: m.content }],
                })),
                systemInstruction: systemPrompt,
        });
        const result = await chat.sendMessage(history[history.length - 1].content);
        return result.response.text();

  } else if (provider === 'ollama') {
        const { Ollama } = await import('ollama');
        const ollama = new Ollama();
        const res = await ollama.chat({
                model: model || 'llama3',
                messages: [
                  { role: 'system', content: systemPrompt },
                          ...history.map(m => ({ role: m.role as 'user' | 'assistant', content: m.content })),
                        ],
        });
        return res.message.content;

  } else {
        return 'DanClaw is not configured yet. Please complete setup at http://danclaw.local';
  }
}

// ─── Session Store ──────────────────────────────────────────────────────────

const sessions = new Map<number, Array<{role: string; content: string}>>();

function getHistory(chatId: number) {
    if (!sessions.has(chatId)) sessions.set(chatId, []);
    return sessions.get(chatId)!;
}

function addToHistory(chatId: number, role: string, content: string) {
    const history = getHistory(chatId);
    history.push({ role, content });
    // Keep last 20 messages to manage token usage
  if (history.length > 20) history.splice(0, history.length - 20);
}

// ─── Main ────────────────────────────────────────────────────────────────────

async function main() {
    printSplash();

  const config = loadConfig();

  if (!config || !config.setup_complete) {
        console.log('\n⚠️  DanClaw is not configured.');
        console.log('👉  Open your browser and go to: http://danclaw.local');
        console.log('    or: http://localhost:3000\n');

      // Start wizard server
      const { startWizardServer } = await import('./wizard-server');
        startWizardServer();
        return;
  }

  if (!config.telegram?.bot_token) {
        console.error('❌  No Telegram bot token found in config.');
        console.error('    Please re-run setup at http://danclaw.local');
        process.exit(1);
  }

  const systemPrompt = buildSystemPrompt(config);
    const bot = new TelegramBot(config.telegram.bot_token, { polling: true });
    const operatorId = config.telegram.operator_chat_id;

  console.log(`\n✅  DanClaw is running for: ${config.business.name}`);
    console.log(`📱  Telegram bot active — waiting for messages...\n`);

  // Handle /start command
  bot.onText(/\/start/, (msg) => {
        const chatId = msg.chat.id;
        sessions.delete(chatId); // fresh session
                 bot.sendMessage(chatId,
                                       `👋 Hi! You've reached ${config.business.name}.\n\nI'm your AI assistant. How can I help you today?`
                                     );
  });

  // Handle /reset command (operator only)
  bot.onText(/\/reset/, (msg) => {
        const chatId = msg.chat.id;
        sessions.delete(chatId);
        bot.sendMessage(chatId, '🔄 Session reset. Send a message to start again.');
  });

  // Handle /status command (operator only)
  bot.onText(/\/status/, (msg) => {
        const chatId = msg.chat.id;
        if (String(chatId) !== String(operatorId)) return;
        const activeSessions = sessions.size;
        bot.sendMessage(chatId,
                              `📊 DanClaw Status\n\n` +
                              `Business: ${config.business.name}\n` +
                              `Active sessions: ${activeSessions}\n` +
                              `LLM: ${config.llm.provider} / ${config.llm.model}\n` +
                              `Version: ${config.danclaw.version}\n` +
                              `Support: ${config.danclaw.support_url}`
                            );
  });

  // Handle all other messages
  bot.on('message', async (msg) => {
        if (!msg.text || msg.text.startsWith('/')) return;

             const chatId = msg.chat.id;
        const userText = msg.text;

             // Show typing indicator
             bot.sendChatAction(chatId, 'typing');

             addToHistory(chatId, 'user', userText);

             try {
                     const history = getHistory(chatId);
                     const reply = await callLLM(config, systemPrompt, history);
                     addToHistory(chatId, 'assistant', reply);

          await bot.sendMessage(chatId, reply);

          // If agent signals JOB READY, notify operator
          if (reply.includes('JOB READY') && operatorId) {
                    const senderName = msg.from?.first_name || 'Customer';
                    const notification =
                                `🚨 NEW JOB — ${config.business.name}\n\n` +
                                `From: ${senderName} (Chat ID: ${chatId})\n` +
                                `Message: ${userText}\n\n` +
                                `Agent summary:\n${reply.replace('JOB READY', '').trim()}`;
                    await bot.sendMessage(operatorId, notification);
          }

             } catch (err: any) {
                     console.error('LLM error:', err.message);
                     await bot.sendMessage(chatId,
                                                   `I'm having a technical issue right now. Please call us directly at ${config.business.phone}.`
                                                 );
             }
  });

  // Startup message to operator
  if (operatorId) {
        bot.sendMessage(operatorId,
                              `✅ DanClaw is online.\n\nBusiness: ${config.business.name}\nLLM: ${config.llm.provider}\nVersion: v${config.danclaw.version}\n\nReady to handle customers. 🚀`
                            ).catch(() => {});
  }
}

main().catch(console.error);
