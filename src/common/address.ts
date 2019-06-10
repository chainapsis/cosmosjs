import { Amino, Type } from "ts-amino";
const { Field, DefineType } = Amino;
import bech32 from "bech32";
import { Address } from "../crypto";
import { Buffer } from "buffer/";
import { Bech32Config } from "../core/bech32Config";

let bech32Config: Bech32Config | undefined;
let globalBech32Config: Bech32Config | undefined;
const bech32ConfigStack: Bech32Config[] = [];

export function useGlobalBech32Config(config: Bech32Config | undefined) {
  globalBech32Config = config;
  if (bech32ConfigStack.length === 0) {
    bech32Config = config;
  }
}

/**
 * If bech32config is just global variable, it make conflicts when you use mutiple chain api in an application.
 * So, to overcome this, each config should be used in separated way.
 * Use Bech32 encoding, decoding within this function.
 * But if you just use only one chain api in general way, you can use [[useGlobalBech32Config]] for convenience
 */
export function useBech32Config(config: Bech32Config, fn: () => void) {
  bech32ConfigStack.push(config);
  bech32Config = config;
  fn();
  bech32ConfigStack.pop();
  bech32Config =
    bech32ConfigStack.length > 0
      ? bech32ConfigStack[bech32ConfigStack.length - 1]
      : globalBech32Config;
}

export async function useBech32ConfigPromise<T>(
  config: Bech32Config,
  fn: () => Promise<T>
): Promise<T> {
  bech32ConfigStack.push(config);
  bech32Config = config;
  const result = await fn();
  bech32ConfigStack.pop();
  bech32Config =
    bech32ConfigStack.length > 0
      ? bech32ConfigStack[bech32ConfigStack.length - 1]
      : globalBech32Config;

  return result;
}

@DefineType()
export class AccAddress {
  public static fromBech32(bech32Addr: string): AccAddress {
    if (!bech32Config) {
      throw new Error("bech32 config is null");
    }
    const { prefix: b32Prefix, words } = bech32.decode(bech32Addr);
    if (b32Prefix !== bech32Config.bech32PrefixAccAddr) {
      throw new Error("Prefix doesn't match");
    }
    return new AccAddress(bech32.fromWords(words));
  }

  @Field.Array(0, { type: Type.Uint8 })
  private address: Uint8Array;

  constructor(address: Uint8Array | Address) {
    this.address = address instanceof Address ? address.toBytes() : address;
  }

  public toBech32(): string {
    if (!bech32Config) {
      throw new Error("bech32 config is null");
    }
    const words = bech32.toWords(Buffer.from(this.address) as any);
    return bech32.encode(bech32Config.bech32PrefixAccAddr, words);
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
  public static fromBech32(bech32Addr: string): ValAddress {
    if (!bech32Config) {
      throw new Error("bech32 config is null");
    }
    const { prefix: b32Prefix, words } = bech32.decode(bech32Addr);
    if (b32Prefix !== bech32Config.bech32PrefixValAddr) {
      throw new Error("Prefix doesn't match");
    }
    return new ValAddress(bech32.fromWords(words));
  }

  @Field.Array(0, { type: Type.Uint8 })
  private address: Uint8Array;

  constructor(address: Uint8Array | Address) {
    this.address = address instanceof Address ? address.toBytes() : address;
  }

  public toBech32(): string {
    if (!bech32Config) {
      throw new Error("bech32 config is null");
    }
    const words = bech32.toWords(Buffer.from(this.address) as any);
    return bech32.encode(bech32Config.bech32PrefixValAddr, words);
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
  public static fromBech32(bech32Addr: string): ConsAddress {
    if (!bech32Config) {
      throw new Error("bech32 config is null");
    }
    const { prefix: b32Prefix, words } = bech32.decode(bech32Addr);
    if (b32Prefix !== bech32Config.bech32PrefixConsAddr) {
      throw new Error("Prefix doesn't match");
    }
    return new ConsAddress(bech32.fromWords(words));
  }

  @Field.Array(0, { type: Type.Uint8 })
  private address: Uint8Array;

  constructor(address: Uint8Array | Address) {
    this.address = address instanceof Address ? address.toBytes() : address;
  }

  public toBech32(): string {
    if (!bech32Config) {
      throw new Error("bech32 config is null");
    }
    const words = bech32.toWords(Buffer.from(this.address) as any);
    return bech32.encode(bech32Config.bech32PrefixConsAddr, words);
  }

  public toBytes(): Uint8Array {
    return new Uint8Array(this.address);
  }

  public marshalJSON(): Uint8Array {
    return Buffer.from(`"${this.toBech32()}"`, "utf8");
  }
}
