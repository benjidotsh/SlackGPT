import { ChatGPTAPI, ChatMessage, SendMessageOptions } from 'chatgpt';
import Config from '../config.js';

const api = new ChatGPTAPI({
  apiKey: Config.OPENAI_API_KEY,
});

export const sendMessage = (
  message: string,
  options?: SendMessageOptions,
): Promise<ChatMessage> =>
  api.sendMessage(message, { timeoutMs: 1 * 60 * 1000, ...options });
