import { Amino } from "@node-a-team/ts-amino";
const { Field, Concrete, DefineStruct } = Amino;
import { Msg } from "../../core/tx";
import { AccAddress, ValAddress } from "../../common/address";
import { Coin } from "../../common/coin";
import { Int } from "../../common/int";
import { Dec } from "../../common/decimal";
import { PubKey } from "../../crypto";

@DefineStruct()
export class Description {
  @Field.String(0, {
    jsonName: "moniker"
  })
  public moniker: string;

  @Field.String(1, {
    jsonName: "identity"
  })
  public identity: string;

  @Field.String(2, {
    jsonName: "website"
  })
  public website: string;

  @Field.String(3, {
    jsonName: "details"
  })
  public details: string;

  constructor(
    moniker: string,
    identity: string,
    website: string,
    details: string
  ) {
    this.moniker = moniker;
    this.identity = identity;
    this.website = website;
    this.details = details;
  }
}

@DefineStruct()
export class CommissionMsg {
  @Field.Defined(0, {
    jsonName: "rate"
  })
  public rate: Dec;

  @Field.Defined(1, {
    jsonName: "max_rate"
  })
  public maxRate: Dec;

  @Field.Defined(2, {
    jsonName: "max_change_rate"
  })
  public maxChangeRate: Dec;

  constructor(rate: Dec, maxRate: Dec, maxChangeRate: Dec) {
    this.rate = rate;
    this.maxRate = maxRate;
    this.maxChangeRate = maxChangeRate;
  }
}

@Concrete("cosmos-sdk/MsgCreateValidator")
@DefineStruct()
export class MsgCreateValidator extends Msg {
  @Field.Defined(0, {
    jsonName: "description"
  })
  public description: Description;

  @Field.Defined(1, {
    jsonName: "commission"
  })
  public commission: CommissionMsg;

  @Field.Defined(2, {
    jsonName: "min_self_delegation"
  })
  public minSelfDelegation: Int;

  @Field.Defined(3, {
    jsonName: "delegator_address"
  })
  public delegatorAddress: AccAddress;

  @Field.Defined(4, {
    jsonName: "validator_address"
  })
  public validatorAddress: ValAddress;

  @Field.Interface(5, {
    jsonName: "pubkey"
  })
  public pubKey: PubKey;

  @Field.Defined(6, {
    jsonName: "value"
  })
  public value: Coin;

  constructor(
    description: Description,
    commission: CommissionMsg,
    minSelfDelegation: Int,
    delegatorAddress: AccAddress,
    validatorAddress: ValAddress,
    pubKey: PubKey,
    value: Coin
  ) {
    super();
    this.description = description;
    this.commission = commission;
    this.minSelfDelegation = minSelfDelegation;
    this.delegatorAddress = delegatorAddress;
    this.validatorAddress = validatorAddress;
    this.pubKey = pubKey;
    this.value = value;
  }

  public getSigners(): AccAddress[] {
    const addr = [this.delegatorAddress];

    if (
      this.delegatorAddress.toBytes().toString() !==
      this.validatorAddress.toBytes().toString()
    ) {
      addr.push(new AccAddress(this.validatorAddress.toBytes()));
    }

    return addr;
  }
}

@Concrete("cosmos-sdk/MsgEditValidator")
@DefineStruct()
export class MsgEditValidator extends Msg {
  @Field.Defined(0, {
    jsonName: "description"
  })
  public description: Description;

  @Field.Defined(1, {
    jsonName: "address"
  })
  public validatorAddress: ValAddress;

  @Field.Defined(2, {
    jsonName: "commission_rate"
  })
  public commisionRate: Dec;

  @Field.Defined(3, {
    jsonName: "min_self_delegation"
  })
  public minSelfDelegation: Int;

  constructor(
    description: Description,
    validatorAddress: ValAddress,
    commisionRate: Dec,
    minSelfDelegation: Int
  ) {
    super();
    this.description = description;
    this.validatorAddress = validatorAddress;
    this.commisionRate = commisionRate;
    this.minSelfDelegation = minSelfDelegation;
  }

  public getSigners(): AccAddress[] {
    return [new AccAddress(this.validatorAddress.toBytes())];
  }
}

@Concrete("cosmos-sdk/MsgDelegate")
@DefineStruct()
export class MsgDelegate extends Msg {
  @Field.Defined(0, {
    jsonName: "delegator_address"
  })
  public delegatorAddress: AccAddress;

  @Field.Defined(1, {
    jsonName: "validator_address"
  })
  public validatorAddress: ValAddress;

  @Field.Defined(2, {
    jsonName: "amount"
  })
  public amount: Coin;

  constructor(
    delegatorAddress: AccAddress,
    validatorAddress: ValAddress,
    amount: Coin
  ) {
    super();
    this.delegatorAddress = delegatorAddress;
    this.validatorAddress = validatorAddress;
    this.amount = amount;
  }

  public getSigners(): AccAddress[] {
    return [this.delegatorAddress];
  }
}

@Concrete("cosmos-sdk/MsgBeginRedelegate")
@DefineStruct()
export class MsgBeginRedelegate extends Msg {
  @Field.Defined(0, {
    jsonName: "delegator_address"
  })
  public delegatorAddress: AccAddress;

  @Field.Defined(1, {
    jsonName: "validator_src_address"
  })
  public validatorSrcAddress: ValAddress;

  @Field.Defined(2, {
    jsonName: "validator_dst_address"
  })
  public validatorDstAddress: ValAddress;

  @Field.Defined(3, {
    jsonName: "amount"
  })
  public amount: Coin;

  constructor(
    delegatorAddress: AccAddress,
    validatorSrcAddress: ValAddress,
    validatorDstAddress: ValAddress,
    amount: Coin
  ) {
    super();
    this.delegatorAddress = delegatorAddress;
    this.validatorSrcAddress = validatorSrcAddress;
    this.validatorDstAddress = validatorDstAddress;
    this.amount = amount;
  }

  public getSigners(): AccAddress[] {
    return [this.delegatorAddress];
  }
}

@Concrete("cosmos-sdk/MsgUndelegate")
@DefineStruct()
export class MsgUndelegate extends Msg {
  @Field.Defined(0, {
    jsonName: "delegator_address"
  })
  public delegatorAddress: AccAddress;

  @Field.Defined(1, {
    jsonName: "validator_address"
  })
  public validatorAddress: ValAddress;

  @Field.Defined(2, {
    jsonName: "amount"
  })
  public amount: Coin;

  constructor(
    delegatorAddress: AccAddress,
    validatorAddress: ValAddress,
    amount: Coin
  ) {
    super();
    this.delegatorAddress = delegatorAddress;
    this.validatorAddress = validatorAddress;
    this.amount = amount;
  }

  public getSigners(): AccAddress[] {
    return [this.delegatorAddress];
  }
}
