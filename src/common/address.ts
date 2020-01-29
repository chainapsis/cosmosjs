import { Amino, Type } from "@node-a-team/ts-amino";
const { Field, DefineType } = Amino;
import bech32 from "bech32";
import { Address } from "../crypto";
import { Buffer } from "buffer/";

@DefineType()
export class AccAddress {
  /**
   * Parse the address from bech32.
   * @param bech32Addr bech32 address string.
   * @param prefix If prefix is not provided, parse the address without verifying with suggested prefix.
   */
  public static fromBech32(bech32Addr: string, prefix?: string): AccAddress {
    if (prefix === "") {
      throw new Error("Empty bech32 prefix");
    }
    const { prefix: b32Prefix, words } = bech32.decode(bech32Addr);
    if (prefix != null && b32Prefix !== prefix) {
      throw new Error("Prefix doesn't match");
    }
    return new AccAddress(
      bech32.fromWords(words),
      prefix != null ? prefix : b32Prefix
    );
  }

  @Field.Array(0, { type: Type.Uint8 })
  private readonly address: Uint8Array;

  public readonly bech32Prefix: string;

  constructor(address: Uint8Array | Address, bech32Prefix: string) {
    if (!bech32Prefix) {
      throw new Error("Empty bech32 prefix");
    }

    this.address = address instanceof Address ? address.toBytes() : address;
    this.bech32Prefix = bech32Prefix;
  }

  public toBech32(): string {
    if (!this.bech32Prefix) {
      throw new Error("Empty bech32 prefix");
    }
    const words = bech32.toWords(Buffer.from(this.address) as any);
    return bech32.encode(this.bech32Prefix, words);
  }

  public toBytes(): Uint8Array {
    return new Uint8Array(this.address);
  }

  public marshalJSON(): Uint8Array {
    return Buffer.from(`"${this.toBech32()}"`, "utf8");
  }
}

@DefineType()
export class ValAddress {
  /**
   * Parse the address from bech32.
   * @param bech32Addr bech32 address string.
   * @param prefix If prefix is not provided, parse the address without verifying with suggested prefix.
   */
  public static fromBech32(bech32Addr: string, prefix?: string): ValAddress {
    if (prefix === "") {
      throw new Error("Empty bech32 prefix");
    }
    const { prefix: b32Prefix, words } = bech32.decode(bech32Addr);
    if (prefix != null && b32Prefix !== prefix) {
      throw new Error("Prefix doesn't match");
    }
    return new ValAddress(
      bech32.fromWords(words),
      prefix != null ? prefix : b32Prefix
    );
  }

  @Field.Array(0, { type: Type.Uint8 })
  private readonly address: Uint8Array;

  public readonly bech32Prefix: string;

  constructor(address: Uint8Array | Address, bech32Prefix: string) {
    if (!bech32Prefix) {
      throw new Error("Empty bech32 prefix");
    }

    this.address = address instanceof Address ? address.toBytes() : address;
    this.bech32Prefix = bech32Prefix;
  }

  public toBech32(): string {
    if (!this.bech32Prefix) {
      throw new Error("Empty bech32 prefix");
    }
    const words = bech32.toWords(Buffer.from(this.address) as any);
    return bech32.encode(this.bech32Prefix, words);
  }

  public toBytes(): Uint8Array {
    return new Uint8Array(this.address);
  }

  public marshalJSON(): Uint8Array {
    return Buffer.from(`"${this.toBech32()}"`, "utf8");
  }
}

@DefineType()
export class ConsAddress {
  /**
   * Parse the address from bech32.
   * @param bech32Addr bech32 address string.
   * @param prefix If prefix is not provided, parse the address without verifying with suggested prefix.
   */
  public static fromBech32(bech32Addr: string, prefix?: string): ConsAddress {
    if (prefix === "") {
      throw new Error("Empty bech32 prefix");
    }
    const { prefix: b32Prefix, words } = bech32.decode(bech32Addr);
    if (prefix != null && b32Prefix !== prefix) {
      throw new Error("Prefix doesn't match");
    }
    return new ConsAddress(
      bech32.fromWords(words),
      prefix != null ? prefix : b32Prefix
    );
  }

  @Field.Array(0, { type: Type.Uint8 })
  private readonly address: Uint8Array;

  public readonly bech32Prefix: string;

  constructor(address: Uint8Array | Address, bech32Prefix: string) {
    if (!bech32Prefix) {
      throw new Error("Empty bech32 prefix");
    }

    this.address = address instanceof Address ? address.toBytes() : address;
    this.bech32Prefix = bech32Prefix;
  }

  public toBech32(): string {
    if (!this.bech32Prefix) {
      throw new Error("Empty bech32 prefix");
    }
    const words = bech32.toWords(Buffer.from(this.address) as any);
    return bech32.encode(this.bech32Prefix, words);
  }

  public toBytes(): Uint8Array {
    return new Uint8Array(this.address);
  }

  public marshalJSON(): Uint8Array {
    return Buffer.from(`"${this.toBech32()}"`, "utf8");
  }
}
