import * as dotenv from 'dotenv-safe';
import { cleanEnv, makeValidator, port, str, url } from 'envalid';

dotenv.config({ allowEmptyValues: true });

const encryptionKey = makeValidator((key) => {
  if (![16, 24, 32].includes(key.length))
    throw new Error(
      'Key must be 16 (128-bit), 24 (192-bit) or 32 (256-bit) characters'
    );

  if (key.length !== 32)
    console.warn(
      `Encryption key is only ${key.length} characters. (${
        key.length * 8
      }-bit)\n32 characters (256-bit) is recommended.`
    );

  return key;
});

export default cleanEnv(process.env, {
  NODE_ENV: str({
    default: 'development',
    choices: ['development', 'production'],
  }),
  CRYPTO_KEY: encryptionKey({
    desc: 'Key used for encryption and decryption',
    devDefault: '?D(G+KbPeShVmYp3s6v9y&B&E)H@McQf',
  }),
  SLACK_SIGNING_SECRET: str(),
  SLACK_CLIENT_ID: str(),
  SLACK_CLIENT_SECRET: str(),
  SLACK_STATE_SECRET: str({ devDefault: 'NcRfUjXn2r5u8x/A?D(G-KaPdSgVkYp3' }),
  PORT: port({ default: 3000 }),
  DATABASE_URL: url({
    devDefault: 'postgresql://postgres:postgres@localhost/slackgpt',
  }),
  LOG_LEVEL: str({
    default: 'warn',
    devDefault: 'debug',
    choices: ['error', 'warn', 'info', 'debug'],
  }),
});
