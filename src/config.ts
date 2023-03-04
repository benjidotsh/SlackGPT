import * as dotenv from 'dotenv-safe';
import { cleanEnv, port, str } from 'envalid';

dotenv.config({
  allowEmptyValues: true,
});

export default cleanEnv(process.env, {
  NODE_ENV: str({
    default: 'development',
    choices: ['development', 'production'],
  }),
  PORT: port({ default: 3000 }),
  CRYPTO_KEY: str(),
  SLACK_SIGNING_SECRET: str(),
  SLACK_BOT_TOKEN: str(),
  SLACK_APP_TOKEN: str(),
  OPENAI_API_KEY: str(),
});
