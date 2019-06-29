import { PubKey, PrivKey } from "../crypto";
import { AccAddress, useBech32Config } from "../common/address";
import { generateWalletFromMnemonic, generateSeed, RNG } from "../utils/key";
import { Context } from "./context";

export interface WalletProvider {
  /**
   * Return path
   * @param index Addresses are numbered from index 0 in sequentially increasing manner. This number is used as child index in BIP32 derivation.
   * Public derivation is used at this level.
   * @param change Constant 0 is used for external chain and constant 1 for internal chain (also known as change addresses). External chain is used for addresses that are meant to be visible outside of the wallet (e.g. for receiving payments). Internal chain is used for addresses which are not meant to be visible outside of the wallet and is used for return transaction change.
   * Public derivation is used at this level.
   */
  signIn(context: Context, index: number, change?: number): Promise<void>;
  getPubKey(context: Context, address: Uint8Array): Promise<PubKey>;
  getSignerAccounts(
    context: Context
  ): Promise<
    Array<{
      address: Uint8Array;
      pubKey: PubKey;
    }>
  >;
  sign(
    context: Context,
    address: Uint8Array,
    message: Uint8Array
  ): Promise<Uint8Array>;
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

  public signIn(
    context: Context,
    index: number,
    change: number = 0
  ): Promise<void> {
    this.privKey = generateWalletFromMnemonic(
      this.mnemonic,
      context.get("bip44").pathString(index, change)
    );
    return Promise.resolve();
  }

  public getPubKey(context: Context, address: Uint8Array): Promise<PubKey> {
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

  public getSignerAccounts(
    context: Context
  ): Promise<
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

  public sign(
    context: Context,
    address: Uint8Array,
    message: Uint8Array
  ): Promise<Uint8Array> {
    if (!this.privKey) {
      throw new Error("Not signed in");
    }
    const pubKey = this.privKey.toPubKey();
    const addressFromPubKey = pubKey.toAddress().toBytes();
    if (address.toString() !== addressFromPubKey.toString()) {
      useBech32Config(context.get("bech32Config"), () => {
        throw new Error(
          `Unknown address: ${new AccAddress(address).toBech32()}`
        );
      });
    }

    return Promise.resolve(this.privKey.sign(message));
  }
}
