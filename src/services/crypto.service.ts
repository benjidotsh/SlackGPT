import crypto from 'crypto-js';
import config from '../config.js';

export default class CryptoService {
  static encrypt(text: string): string {
    return crypto.AES.encrypt(text, config.CRYPTO_KEY).toString();
  }

  static decrypt(text: string): string {
    return crypto.AES.decrypt(text, config.CRYPTO_KEY).toString(
      crypto.enc.Utf8
    );
  }
}
