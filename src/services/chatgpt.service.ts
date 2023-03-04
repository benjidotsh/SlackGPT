import { ChatGPTAPI, ChatMessage, SendMessageOptions } from 'chatgpt';
import config from '../config';

export default class ChatGPTService {
  private api: ChatGPTAPI;

  constructor() {
    this.api = new ChatGPTAPI({
      apiKey: config.OPENAI_API_KEY,
    });
  }

  sendMessage(
    message: string,
    options?: SendMessageOptions
  ): Promise<ChatMessage> {
    return this.api.sendMessage(message, {
      timeoutMs: 1 * 60 * 1000,
      ...options,
    });
  }
}
