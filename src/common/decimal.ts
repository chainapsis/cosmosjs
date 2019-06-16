import bigInteger from "big-integer";
import { Amino, Type } from "ts-amino";
import { Int } from "./int";
const { Method, DefineStruct } = Amino;

@DefineStruct()
export class Dec {
  public static readonly precision: bigInteger.BigInteger = bigInteger(18);
  private static readonly precisionMultipliers: {
    [key: string]: bigInteger.BigInteger | undefined;
  };
  private static calcPrecisionMultiplier(
    prec: bigInteger.BigInteger
  ): bigInteger.BigInteger {
    if (prec.lt(bigInteger(0))) {
      throw new Error("Invalid prec");
    }
    if (prec.gt(Dec.precision)) {
      throw new Error("Too much precision");
    }
    if (Dec.precisionMultipliers[prec.toString()]) {
      return Dec.precisionMultipliers[prec.toString()]!;
    }

    const zerosToAdd = Dec.precision.minus(prec);
    const multiplier = bigInteger(10).pow(zerosToAdd);
    Dec.precisionMultipliers[prec.toString()] = multiplier;
    return multiplier;
  }

  private int: bigInteger.BigInteger;

  /**
   * Create a new Dec from integer with decimal place at prec
   * @param int - Parse a number | bigInteger | string into a Dec.
   * If int is string and contains dot(.), prec is ignored and automatically calculated.
   * @param prec - Precision
   */
  constructor(int: bigInteger.BigNumber | Int, prec: number = 0) {
    if (typeof int === "string") {
      if (int.indexOf(".") >= 0) {
        prec = int.length - int.indexOf(".") - 1;
        int = int.replace(".", "");
      }
      this.int = bigInteger(int);
    } else if (typeof int === "number") {
      this.int = bigInteger(int);
    } else if (int instanceof Int) {
      this.int = bigInteger(int.toString());
    } else {
      this.int = bigInteger(int);
    }

    this.int = this.int.multiply(Dec.calcPrecisionMultiplier(bigInteger(prec)));
  }

  @Method.AminoMarshaler({ type: Type.String })
  public marshalAmino(): string {
    return this.int.toString(10);
  }

  public marshalJSON(): string {
    return `"${this.int.toString(10)}"`;
  }
}
