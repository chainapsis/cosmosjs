import { Amino } from "ts-amino";
const { Field, DefineStruct } = Amino;
import { Int } from "./int";

@DefineStruct()
export class Coin {
  @Field.String(0)
  public denom: string;

  @Field.Defined(1)
  public amount: Int;

  constructor(denom: string, amount: Int) {
    this.denom = denom;
    this.amount = amount;
  }
}
