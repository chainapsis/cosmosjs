import { Amino, Type } from "@node-a-team/ts-amino";
const { Field, DefineStruct } = Amino;
import { Msg } from "../../core/tx";
import { AccAddress } from "../../common/address";
import { Coin } from "../../common/coin";
import { Int } from "../../common/int";
import bigInteger from "big-integer";
import { validateIdentifier } from "./utils";

@DefineStruct()
export class MsgTransfer extends Msg {
  @Field.String(0, {
    jsonName: "source_port"
  })
  public sourcePort: string;

  @Field.String(1, {
    jsonName: "source_channel"
  })
  public sourceChannel: string;

  @Field.Uint64(2, {
    jsonName: "destination_height"
  })
  public destHeight: bigInteger.BigInteger;

  @Field.Slice(
    3,
    { type: Type.Defined },
    {
      jsonName: "amount"
    }
  )
  public amount: Coin[];

  @Field.Defined(4, {
    jsonName: "sender"
  })
  public sender: AccAddress;

  @Field.String(5, {
    jsonName: "receiver"
  })
  public receiver: string;

  constructor(
    sourcePort: string,
    sourceChannel: string,
    destHeight: bigInteger.BigNumber,
    amount: Coin[],
    sender: AccAddress,
    receiver: string
  ) {
    super();
    this.sourcePort = sourcePort;
    this.sourceChannel = sourceChannel;

    if (typeof destHeight === "string") {
      this.destHeight = bigInteger(destHeight);
    } else if (typeof destHeight === "number") {
      this.destHeight = bigInteger(destHeight);
    } else {
      this.destHeight = bigInteger(destHeight);
    }

    this.amount = amount;
    this.sender = sender;
    this.receiver = receiver;
  }

  public getSigners(): AccAddress[] {
    return [this.sender];
  }

  public validateBasic(): void {
    if (this.destHeight.isNegative()) {
      throw new TypeError("Destination height should not be negative");
    }

    validateIdentifier(this.sourcePort, 2, 20);
    validateIdentifier(this.sourceChannel, 2, 20);

    for (const coin of this.amount) {
      if (coin.amount.lte(new Int(0))) {
        throw new Error("Send amount is invalid");
      }
    }
  }
}
