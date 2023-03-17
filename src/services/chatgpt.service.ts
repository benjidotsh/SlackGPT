// Required for Node 16
import 'node-self';
import 'unfetch/polyfill';

import { ChatGPTAPI, ChatMessage, SendMessageOptions } from 'chatgpt';

export default class ChatGPTService {
  private api: ChatGPTAPI;

  constructor(apiKey: string) {
    this.api = new ChatGPTAPI({
      apiKey,
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
