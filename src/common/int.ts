import bigInteger from "big-integer";
import { Amino, Type } from "ts-amino";
const { Method, DefineStruct } = Amino;

@DefineStruct()
export class Int {
  private int: bigInteger.BigInteger;

  /**
   * @param int - Parse a number | bigInteger | string into a bigInt.
   * Remaing parameters only will be used when type of int is string.
   * @param base - Default base is 10.
   * @param alphabet - Default alphabet is "0123456789abcdefghijklmnopqrstuvwxyz".
   * @param caseSensitive - Defaults to false.
   */
  constructor(
    int: bigInteger.BigNumber,
    base?: bigInteger.BigNumber,
    alphabet?: string,
    caseSensitive?: boolean
  ) {
    if (typeof int === "string") {
      this.int = bigInteger(int, base, alphabet, caseSensitive);
    } else if (typeof int === "number") {
      this.int = bigInteger(int);
    } else {
      this.int = bigInteger(int);
    }
  }

  @Method.AminoMarshaler({ type: Type.String })
  public marshalAmino(): string {
    return this.int.toString(10);
  }
}

@DefineStruct()
export class Uint {
  private uint: bigInteger.BigInteger;

  /**
   * @param uint - Parse a number | bigInteger | string into a bigUint.
   * Remaing parameters only will be used when type of int is string.
   * @param base - Default base is 10.
   * @param alphabet - Default alphabet is "0123456789abcdefghijklmnopqrstuvwxyz".
   * @param caseSensitive - Defaults to false.
   */
  constructor(
    uint: bigInteger.BigNumber,
    base?: bigInteger.BigNumber,
    alphabet?: string,
    caseSensitive?: boolean
  ) {
    if (typeof uint === "string") {
      this.uint = bigInteger(uint, base, alphabet, caseSensitive);
    } else if (typeof uint === "number") {
      this.uint = bigInteger(uint);
    } else {
      this.uint = bigInteger(uint);
    }

    if (this.uint.isNegative()) {
      throw new TypeError("Uint should not be negative");
    }
  }

  @Method.AminoMarshaler({ type: Type.String })
  public marshalAmino(): string {
    return this.uint.toString(10);
  }
}
