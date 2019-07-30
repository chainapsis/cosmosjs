import { Amino, Type } from "@node-a-team/ts-amino";
const { Field, DefineStruct } = Amino;
import { Msg } from "../../core/tx";
import { AccAddress } from "../../common/address";
import { Coin } from "../../common/coin";
import { Int } from "../../common/int";

@DefineStruct()
export class MsgSend extends Msg {
  @Field.Defined(0, {
    jsonName: "from_address"
  })
  public fromAddress: AccAddress;

  @Field.Defined(1, {
    jsonName: "to_address"
  })
  public toAddress: AccAddress;

  @Field.Slice(
    2,
    { type: Type.Defined },
    {
      jsonName: "amount"
    }
  )
  public amount: Coin[];

  constructor(fromAddress: AccAddress, toAddress: AccAddress, amount: Coin[]) {
    super();
    this.fromAddress = fromAddress;
    this.toAddress = toAddress;
    this.amount = amount;
  }

  public getSigners(): AccAddress[] {
    return [this.fromAddress];
  }

  public validateBasic(): void {
    for (const coin of this.amount) {
      if (coin.amount.lte(new Int(0))) {
        throw new Error("Send amount is invalid");
      }
    }
  }
}
