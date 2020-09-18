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
      jsonName: "sent_funds"
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

@DefineStruct()
export class MsgInstantiateContract extends Msg {
  @Field.Defined(0, {
    jsonName: "sender"
  })
  public sender: AccAddress;

  @Field.Defined(1, {
    jsonName: "admin",
    jsonOmitEmpty: true
  })
  public admin: AccAddress;

  @Field.Uint64(2, {
    jsonName: "code_id"
  })
  public codeId: number;

  @Field.String(3, {
    jsonName: "label"
  })
  public label: string;

  @Field.Slice(4, { type: Type.Defined }, { jsonName: "init_msg" })
  public initMsg: RawMessage;

  @Field.Slice(
    5,
    { type: Type.Defined },
    {
      jsonName: "init_funds"
    }
  )
  public initFunds: Coin[];

  constructor(
    sender: AccAddress,
    admin: AccAddress,
    codeId: number,
    label: string,
    initMsg: object,
    initFunds: Coin[]
  ) {
    super();
    this.sender = sender;
    this.admin = admin;
    this.codeId = codeId;
    this.label = label;
    this.initMsg = new RawMessage(Buffer.from(JSON.stringify(initMsg), "utf8"));
    this.initFunds = initFunds;
  }

  public getSigners(): AccAddress[] {
    return [this.sender];
  }

  public validateBasic(): void {
    for (const coin of this.initFunds) {
      if (coin.amount.lte(new Int(0))) {
        throw new Error("Send amount is invalid");
      }
    }
  }
}
