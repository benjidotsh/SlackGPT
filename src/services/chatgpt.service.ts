import { ChatGPTAPIBrowser, ChatResponse } from 'chatgpt';
import Config from '../config.js';

const api = new ChatGPTAPIBrowser({
  email: Config.OPENAI_USERNAME,
  password: Config.OPENAI_PASSWORD,
});

await api.initSession();

export const send = (message: string): Promise<ChatResponse> =>
  api.sendMessage(message);
