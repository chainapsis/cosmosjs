import { Amino, Type } from "ts-amino";
const { Field, DefineType } = Amino;
import bech32 from "bech32";

@DefineType()
export class Address {
  public static fromBech32(prefix: string, bech32Addr: string): Address {
    const { prefix: b32Prefix, words } = bech32.decode(bech32Addr);
    if (b32Prefix !== prefix) {
      throw new Error("Prefix doesn't match");
    }
    return new Address(bech32.fromWords(words));
  }

  @Field.Array(0, { type: Type.Uint8 })
  private address: Uint8Array;

  constructor(address: Uint8Array) {
    this.address = address;
  }

  public toBech32(prefix: string): string {
    const words = bech32.toWords(Buffer.from(this.address) as any);
    return bech32.encode(prefix, words);
  }

  public toBytes(): Uint8Array {
    return this.address;
  }
}

export interface PubKey {
  toAddress(): Address;
  toBytes(): Uint8Array;
  verify(msg: Uint8Array, sig: Uint8Array): boolean;
  equals(pubKey: PubKey): boolean;
}

export interface PrivKey {
  toBytes(): Uint8Array;
  sign(msg: Uint8Array): Uint8Array;
  toPubKey(): PubKey;
  equals(privKey: PrivKey): boolean;
}
