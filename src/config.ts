import * as dotenv from 'dotenv';
import { cleanEnv, makeValidator, str } from 'envalid';

dotenv.config();

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
  AWS_REGION: str({ default: 'eu-west-1', devDefault: 'localhost' }),
  CRYPTO_KEY: encryptionKey({
    desc: 'Key used for encryption and decryption',
    devDefault: '?D(G+KbPeShVmYp3s6v9y$B&E)H@McQf',
  }),
  SLACK_SIGNING_SECRET: str(),
  SLACK_CLIENT_ID: str(),
  SLACK_CLIENT_SECRET: str(),
  SLACK_STATE_SECRET: str({ devDefault: 'NcRfUjXn2r5u8x/A?D(G-KaPdSgVkYp3' }),
});
