// tslint:disable-next-line:no-var-requires
const bip39 = require("bip39");
// tslint:disable-next-line:no-var-requires
const bip32 = require("bip32");
import bech32 from "bech32";
// tslint:disable-next-line:no-submodule-imports
import { Buffer } from "buffer/";
import ripemd160 from "ripemd160";
import secp256k1 from "secp256k1";
import { sha256 } from "sha.js";

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

interface Wallet {
  publicKey: Uint8Array;
  privateKey: Uint8Array;
}

export function generateWallet(
  rng: RNG,
  path: string = `m/44'/118'/0'/0/0`,
  password: string = "",
  strength: number = 256
): { wallet: Wallet; mnemonic: string } {
  const mnemonic = generateSeed(rng, strength);
  const wallet = generateWalletFromMnemonic(mnemonic, path, password);

  return {
    wallet,
    mnemonic
  };
}

export function generateWalletFromMnemonic(
  mnemonic: string,
  path: string = `m/44'/118'/0'/0/0`,
  password: string = ""
): Wallet {
  // bip39.validateMnemonic(mnemonic);

  const seed = bip39.mnemonicToSeedSync(mnemonic, password);
  const masterKey = bip32.fromSeed(seed);
  const hd = masterKey.derivePath(path);

  const privateKey = hd.privateKey;
  if (!privateKey) {
    throw new Error("null hd key");
  }
  const publicKey = secp256k1.publicKeyCreate(privateKey, true);

  return {
    publicKey,
    privateKey
  };
}

export function generateSeed(rng: RNG, strength: number = 128): string {
  if (strength % 32 !== 0) {
    throw new TypeError("invalid entropy");
  }
  let bytes = new Uint8Array(strength / 8);
  bytes = rng(bytes);
  return bip39.entropyToMnemonic(Buffer.from(bytes).toString("hex"));
}

export function publicToAddress(publicKey: Uint8Array): Uint8Array {
  let hash = new sha256().update(publicKey).digest("latin1");
  hash = new ripemd160().update(hash, "latin1").digest("hex");

  return Buffer.from(hash, "hex");
}

export function publicToBech32Address(
  publicKey: Uint8Array,
  prefix: string
): string {
  const address = publicToAddress(publicKey);
  const words = bech32.toWords(Buffer.from(address) as any);
  return bech32.encode(prefix, words);
}
