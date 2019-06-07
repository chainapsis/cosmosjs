// tslint:disable-next-line:no-var-requires
const bip39 = require("bip39");
// tslint:disable-next-line:no-var-requires
const bip32 = require("bip32");
import { Buffer } from "buffer/";
import { PrivKey, PrivKeySecp256k1 } from "../crypto";

export type RNG = <
  T extends
    | Int8Array
    | Int16Array
    | Int32Array
    | Uint8Array
    | Uint16Array
    | Uint32Array
    | Uint8ClampedArray
    | Float32Array
    | Float64Array
    | DataView
    | null
>(
  array: T
) => T;

export function generateWallet(
  rng: RNG,
  path: string = `m/44'/118'/0'/0/0`,
  password: string = "",
  strength: number = 256
): { privKey: PrivKey; mnemonic: string } {
  const mnemonic = generateSeed(rng, strength);
  const privKey = generateWalletFromMnemonic(mnemonic, path, password);

  return {
    privKey,
    mnemonic
  };
}

export function generateWalletFromMnemonic(
  mnemonic: string,
  path: string = `m/44'/118'/0'/0/0`,
  password: string = ""
): PrivKey {
  // bip39.validateMnemonic(mnemonic);

  const seed = bip39.mnemonicToSeedSync(mnemonic, password);
  const masterKey = bip32.fromSeed(seed);
  const hd = masterKey.derivePath(path);

  const privateKey = hd.privateKey;
  if (!privateKey) {
    throw new Error("null hd key");
  }
  return new PrivKeySecp256k1(privateKey);
}

export function generateSeed(rng: RNG, strength: number = 128): string {
  if (strength % 32 !== 0) {
    throw new TypeError("invalid entropy");
  }
  let bytes = new Uint8Array(strength / 8);
  bytes = rng(bytes);
  return bip39.entropyToMnemonic(Buffer.from(bytes).toString("hex"));
}
