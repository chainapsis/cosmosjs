import { Amino, Type } from "@node-a-team/ts-amino";
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
    // Return uint8array newly, because address could have been made from buffer.
    return new Uint8Array(this.address);
  }
}

export interface PubKey {
  toAddress(): Address;
  /**
   * @returns Return amino encoded bytes (including prefix bytes for concrete type).
   */
  toBytes(): Uint8Array;
  /**
   * @returns Return bytes without type info.
   */
  serialize(): Uint8Array;
  verify(msg: Uint8Array, sig: Uint8Array): boolean;
  equals(pubKey: PubKey): boolean;
}

export interface PrivKey {
  /**
   * @returns Return amino encoded bytes (including prefix bytes for concrete type).
   */
  toBytes(): Uint8Array;
  /**
   * @returns Return bytes without type info.
   */
  serialize(): Uint8Array;
  sign(msg: Uint8Array): Uint8Array;
  toPubKey(): PubKey;
  equals(privKey: PrivKey): boolean;
}
