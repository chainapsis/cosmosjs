import { Amino, Type } from "ts-amino";
const { Field, DefineType } = Amino;
import bech32 from "bech32";

@DefineType()
export class Address {
  @Field.Array(0, { type: Type.Uint8 })
  private address: Uint8Array;

  constructor(address: Uint8Array) {
    this.address = address;
  }

  public toBech32(prefix: string): string {
    const words = bech32.toWords(Buffer.from(this.address) as any);
    return bech32.encode(prefix, words);
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
