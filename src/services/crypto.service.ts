import crypto from 'crypto-js';
import config from '../config.js';

export default class CryptoService {
  /**
   * Encrypts a string using AES-256-CBC
   */
  static encrypt(data: string): string {
    return crypto.AES.encrypt(data, config.CRYPTO_KEY).toString();
  }

  /**
   * Decrypts a string using AES-256-CBC
   */
  static decrypt(data: string): string {
    return crypto.AES.decrypt(data, config.CRYPTO_KEY).toString(
      crypto.enc.Utf8
    );
  }
}
