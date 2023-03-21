// Required for Node 16
import 'node-self';
import 'isomorphic-fetch';

import { ChatGPTAPI, ChatMessage, SendMessageOptions } from 'chatgpt';
import Keyv from 'keyv';
import KeyvRedis from '@keyv/redis';
import config from '../config.js';

export default class ChatGPTService {
  private api: ChatGPTAPI;

  constructor(apiKey: string) {
    this.api = new ChatGPTAPI({
      apiKey,
      messageStore: new Keyv({
        store: new KeyvRedis(config.REDIS_URL),
        namespace: 'chatgpt',
      }),
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
