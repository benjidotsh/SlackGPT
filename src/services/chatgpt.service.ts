import { ChatGPTAPIBrowser, ChatResponse, SendMessageOptions } from 'chatgpt';
import Config from '../config.js';

const api = new ChatGPTAPIBrowser({
  email: Config.OPENAI_USERNAME,
  password: Config.OPENAI_PASSWORD,
});

await api.initSession();

export const sendMessage = (
  message: string,
  options?: SendMessageOptions,
): Promise<ChatResponse> =>
  api.sendMessage(message, { timeoutMs: 1 * 60 * 1000, ...options });
