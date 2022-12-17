import * as dotenv from 'dotenv';
import { cleanEnv, port, str } from 'envalid';

dotenv.config();

export default cleanEnv(process.env, {
  PORT: port({ default: 3000 }),
  SLACK_SIGNING_SECRET: str(),
  SLACK_BOT_TOKEN: str(),
  SLACK_APP_TOKEN: str(),
});
