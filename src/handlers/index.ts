import Bolt from '@slack/bolt';

interface ActionHandler {
  name: string;
  type: 'action';
  handler: Bolt.Middleware<Bolt.SlackActionMiddlewareArgs<Bolt.SlackAction>>;
}

interface EventHandler<EventType extends string> {
  name: EventType;
  type: 'event';
  handler: Bolt.Middleware<Bolt.SlackEventMiddlewareArgs<EventType>>;
}

export type Handler<EventType extends string | undefined = undefined> =
  EventType extends string ? EventHandler<EventType> : ActionHandler;

export { default as appHomeOpenedHandler } from './app_home_opened.handler.js';
export { default as appMentionHandler } from './app_mention.handler.js';
export { default as appUninstalledHandler } from './app_uninstalled.handler.js';
export { default as setOpenaiApiKeyHandler } from './set_openai_api_key.handler.js';
