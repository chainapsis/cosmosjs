import { PubKey, PrivKey } from "../crypto";
import { generateWalletFromMnemonic, generateSeed, RNG } from "../utils/key";

export interface WalletProvider {
  signIn(path: string): Promise<void>;
  getPubKey(address: Uint8Array): Promise<PubKey>;
  getSignerAccounts(): Promise<
    Array<{
      address: Uint8Array;
      pubKey: PubKey;
    }>
  >;
  sign(address: Uint8Array, message: Uint8Array): Promise<Uint8Array>;
}

/**
 * Using the this in the browser is not secure and should only be used for development purposes.
 * Use a secure vault outside of the context of the webpage to ensure security when signing transactions in production.
 */
export class LocalWalletProvider implements WalletProvider {
  private privKey?: PrivKey;

  constructor(private mnemonic: string = "", rng?: RNG) {
    if (this.mnemonic === "") {
      if (!rng) {
        throw new Error("You should set rng to generate seed");
      }
      this.mnemonic = generateSeed(rng);
    }
  }

  public signIn(path: string): Promise<void> {
    this.privKey = generateWalletFromMnemonic(this.mnemonic, path);
    return Promise.resolve();
  }

  public getPubKey(address: Uint8Array): Promise<PubKey> {
    if (!this.privKey) {
      throw new Error("Not signed in");
    }
    const pubKey = this.privKey.toPubKey();
    const addressFromPubKey = pubKey.toAddress().toBytes();
    if (address.toString() !== addressFromPubKey.toString()) {
      throw new Error("Unknown address");
    }
    return Promise.resolve(pubKey);
  }

  public getSignerAccounts(): Promise<
    Array<{
      address: Uint8Array;
      pubKey: PubKey;
    }>
  > {
    if (!this.privKey) {
      throw new Error("Not signed in");
    }
    const pubKey = this.privKey.toPubKey();
    const address = pubKey.toAddress().toBytes();
    return Promise.resolve([
      {
        address,
        pubKey
      }
    ]);
  }
  public sign(address: Uint8Array, message: Uint8Array): Promise<Uint8Array> {
    if (!this.privKey) {
      throw new Error("Not signed in");
    }
    const pubKey = this.privKey.toPubKey();
    const addressFromPubKey = pubKey.toAddress().toBytes();
    if (address.toString() !== addressFromPubKey.toString()) {
      throw new Error("Unknown address");
    }

    return Promise.resolve(this.privKey.sign(message));
  }
}
