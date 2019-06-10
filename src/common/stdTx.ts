import { Tx, Msg, TxEncoder } from "../core/tx";
import { Amino, Type } from "ts-amino";
const {
  Field,
  Concrete,
  DefineStruct,
  DefineType,
  marshalBinaryLengthPrefixed,
  marshalJson
} = Amino;
import { Coin } from "./coin";
import bigInteger from "big-integer";
import { PubKey } from "../crypto";
import { Buffer } from "buffer/";
import { sortJSON } from "../utils/sortJson";

@Concrete("auth/StdTx")
@DefineStruct()
export class StdTx implements Tx {
  @Field.Slice(0, { type: Type.Interface }, { jsonName: "msg" })
  public msgs: Msg[];

  @Field.Defined(1)
  public fee: StdFee;

  @Field.Slice(2, { type: Type.Defined })
  public signatures: StdSignature[];

  @Field.String(3)
  public memo: string;

  constructor(
    msgs: Msg[],
    fee: StdFee,
    signatures: StdSignature[],
    memo: string = ""
  ) {
    this.msgs = msgs;
    this.fee = fee;
    this.signatures = signatures;
    this.memo = memo;
  }

  public getMsgs(): Msg[] {
    return this.msgs;
  }

  public validateBasic(): void {
    for (const msg of this.msgs) {
      msg.validateBasic();
    }
  }
}

const defaultTxEncoder: TxEncoder = (tx: Tx): Uint8Array => {
  return marshalBinaryLengthPrefixed(tx);
};

export { defaultTxEncoder };

@DefineStruct()
export class StdFee {
  @Field.Slice(0, { type: Type.Defined })
  public amount: Coin[];

  @Field.Uint64(1)
  public gas: bigInteger.BigInteger;

  constructor(amount: Coin[], gas: bigInteger.BigNumber) {
    this.amount = amount;
    if (typeof gas === "string") {
      this.gas = bigInteger(gas, 10);
    } else if (typeof gas === "number") {
      this.gas = bigInteger(gas);
    } else {
      this.gas = bigInteger(gas);
    }
  }
}

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
export class StdSignDoc {
  @Field.Uint64(0, { jsonName: "account_number" })
  public accountNumber: bigInteger.BigInteger;

  @Field.String(1, { jsonName: "chain_id" })
  public chainId: string;

  @Field.Slice(2, { type: Type.Defined }, { jsonName: "fee" })
  public feeRaw: RawMessage;

  @Field.String(3)
  public memo: string;

  @Field.Slice(4, { type: Type.Defined }, { jsonName: "msgs" })
  public msgsRaws: RawMessage[];

  @Field.Uint64()
  public sequence: bigInteger.BigInteger;

  constructor(
    accountNumber: bigInteger.BigNumber,
    chainId: string,
    fee: StdFee,
    memo: string,
    msgs: Msg[],
    sequence: bigInteger.BigNumber
  ) {
    if (typeof accountNumber === "string") {
      this.accountNumber = bigInteger(accountNumber, 10);
    } else if (typeof accountNumber === "number") {
      this.accountNumber = bigInteger(accountNumber);
    } else {
      this.accountNumber = bigInteger(accountNumber);
    }
    this.chainId = chainId;
    this.feeRaw = new RawMessage(Buffer.from(marshalJson(fee), "utf8"));
    this.memo = memo;

    this.msgsRaws = [];
    for (const msg of msgs) {
      this.msgsRaws.push(new RawMessage(msg.getSignBytes()));
    }

    if (typeof sequence === "string") {
      this.sequence = bigInteger(sequence, 10);
    } else if (typeof sequence === "number") {
      this.sequence = bigInteger(sequence);
    } else {
      this.sequence = bigInteger(sequence);
    }
  }

  public getSignBytes(): Uint8Array {
    return Buffer.from(sortJSON(marshalJson(this)), "utf8");
  }
}

@DefineStruct()
export class StdSignature {
  @Field.Interface(0, { jsonName: "pub_key" })
  public pubKey: PubKey;

  @Field.Slice(1, { type: Type.Uint8 })
  public signature: Uint8Array;

  constructor(pubKey: PubKey, signature: Uint8Array) {
    this.pubKey = pubKey;
    this.signature = signature;
  }
}
