import { Amino, Type } from "@chainapsis/ts-amino";
const { Field, DefineStruct, DefineType } = Amino;
import { Msg } from "../../core/tx";
import { AccAddress } from "../../common/address";
import { Coin } from "../../common/coin";
import { Int } from "../../common/int";

import { Buffer } from "buffer/";

@DefineType()
class RawMessage {
  @Field.Slice(0, { type: Type.Uint8 })
  public raw: Uint8Array;

  constructor(raw: Uint8Array) {
    this.raw = raw;
  }

  public marshalJSON(): string {
    return Buffer.from(this.raw).toString("utf8");
  }
}

@DefineStruct()
export class MsgExecuteContract extends Msg {
  @Field.Defined(0, {
    jsonName: "sender"
  })
  public sender: AccAddress;

  @Field.Defined(1, {
    jsonName: "contract"
  })
  public contract: AccAddress;

  @Field.Slice(2, { type: Type.Defined }, { jsonName: "msg" })
  public msg: RawMessage;

  @Field.Slice(
    3,
    { type: Type.Defined },
    {
      jsonName: "sent_funds",
      writeEmpty: true,
      emptyElements: true
    }
  )
  public sentFunds: Coin[];

  constructor(
    sender: AccAddress,
    contract: AccAddress,
    msg: object,
    sentFunds: Coin[]
  ) {
    super();
    this.sender = sender;
    this.contract = contract;
    this.msg = new RawMessage(Buffer.from(JSON.stringify(msg), "utf8"));
    this.sentFunds = sentFunds;
  }

  public getSigners(): AccAddress[] {
    return [this.sender];
  }

  public validateBasic(): void {
    for (const coin of this.sentFunds) {
      if (coin.amount.lte(new Int(0))) {
        throw new Error("Send amount is invalid");
      }
    }
  }
}
