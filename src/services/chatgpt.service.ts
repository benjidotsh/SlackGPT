// Required for Node 16
import 'node-self';
import fetch, { RequestInfo, RequestInit, Response } from 'node-fetch';

import { ChatGPTAPI, ChatMessage, SendMessageOptions } from 'chatgpt';

// Required for Node 16
declare global {
  function fetch(
    url: URL | RequestInfo,
    init?: RequestInit | undefined
  ): Promise<Response>;
}

if (!globalThis.fetch) globalThis.fetch = fetch;

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
