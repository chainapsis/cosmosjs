import { PrivKey } from "../crypto";
import { AccAddress, useBech32Config } from "../common/address";
import { generateWalletFromMnemonic, generateSeed, RNG } from "../utils/key";
import { Context } from "./context";
import { BIP44 } from "./bip44";

export interface Key {
  bech32Address: string;
  address: Uint8Array;
  algo: string;
  pubKey: Uint8Array;
}

export interface WalletProvider {
  /**
   * Request access to the user's accounts. Wallet can ask the user to approve or deny access. If user deny access, it will throw error.
   */
  enable(context: Context): Promise<void>;

  /**
   * Get array of keys that includes bech32 address string, address bytes and public key from wallet if user have approved the access.
   */
  getKeys(context: Context): Promise<Key[]>;

  /**
   * Request signature from matched address if user have approved the access.
   */
  sign(
    context: Context,
    bech32Address: string,
    message: Uint8Array
  ): Promise<Uint8Array>;
}

/**
 * Using the this in the browser is not secure and should only be used for development purposes.
 * Use a secure vault outside of the context of the webpage to ensure security when signing transactions in production.
 */
export class LocalWalletProvider implements WalletProvider {
  public static generateMnemonic(rng?: RNG): string {
    if (!rng) {
      throw new Error("You should set rng to generate seed");
    }
    return generateSeed(rng);
  }

  public static getPrivKeyFromMnemonic(
    bip44: BIP44,
    mnemonic: string,
    account: number = 0,
    index: number = 0
  ): PrivKey {
    return generateWalletFromMnemonic(
      mnemonic,
      bip44.pathString(account, index)
    );
  }
  private privKey?: PrivKey;

  constructor(
    private readonly mnemonic: string = "",
    private readonly account: number = 0,
    private readonly index: number = 0,
    private readonly rng?: RNG
  ) {
    if (this.mnemonic === "") {
      this.mnemonic = LocalWalletProvider.generateMnemonic(this.rng);
    }
  }

  enable(context: Context): Promise<void> {
    this.privKey = LocalWalletProvider.getPrivKeyFromMnemonic(
      context.get("bip44"),
      this.mnemonic,
      this.account,
      this.index
    );
    return Promise.resolve();
  }

  getKeys(context: Context): Promise<Key[]> {
    if (!this.privKey) {
      throw new Error("Not approved");
    }

    const pubKey = this.privKey.toPubKey();
    const address = this.privKey.toPubKey().toAddress();
    const bech32Address = useBech32Config(context.get("bech32Config"), () => {
      return new AccAddress(address).toBech32();
    });
    const key: Key = {
      bech32Address,
      address: address.toBytes(),
      algo: "secp256k1",
      pubKey: pubKey.serialize()
    };

    return Promise.resolve([key]);
  }

  sign(
    context: Context,
    bech32Address: string,
    message: Uint8Array
  ): Promise<Uint8Array> {
    if (!this.privKey) {
      throw new Error("Not approved");
    }
    const pubKey = this.privKey.toPubKey();
    const address = pubKey.toAddress();
    useBech32Config(context.get("bech32Config"), () => {
      const accAddress = new AccAddress(address);
      if (accAddress.toBech32() !== bech32Address) {
        throw new Error(`Unknown address: ${bech32Address}`);
      }
    });

    return Promise.resolve(this.privKey.sign(message));
  }
}
