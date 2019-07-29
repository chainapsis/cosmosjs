import { Amino } from "@node-a-team/ts-amino";
const { Field, Concrete, DefineStruct } = Amino;
import { Msg } from "../../core/tx";
import { AccAddress, ValAddress } from "../../common/address";

@Concrete("cosmos-sdk/MsgModifyWithdrawAddress")
@DefineStruct()
export class MsgSetWithdrawAddress extends Msg {
  @Field.Defined(0, {
    jsonName: "delegator_address"
  })
  public delegatorAddress: AccAddress;

  @Field.Defined(1, {
    jsonName: "withdraw_address"
  })
  public withdrawAddress: AccAddress;

  constructor(delegatorAddress: AccAddress, withdrawAddress: AccAddress) {
    super();
    this.delegatorAddress = delegatorAddress;
    this.withdrawAddress = withdrawAddress;
  }

  public getSigners(): AccAddress[] {
    return [this.delegatorAddress];
  }
}

@Concrete("cosmos-sdk/MsgWithdrawDelegationReward")
@DefineStruct()
export class MsgWithdrawDelegatorReward extends Msg {
  @Field.Defined(0, {
    jsonName: "delegator_address"
  })
  public delegatorAddress: AccAddress;

  @Field.Defined(1, {
    jsonName: "validator_address"
  })
  public validatorAddress: ValAddress;

  constructor(delegatorAddress: AccAddress, validatorAddress: ValAddress) {
    super();
    this.delegatorAddress = delegatorAddress;
    this.validatorAddress = validatorAddress;
  }

  public getSigners(): AccAddress[] {
    return [this.delegatorAddress];
  }
}

@Concrete("cosmos-sdk/MsgWithdrawValidatorCommission")
@DefineStruct()
export class MsgWithdrawValidatorCommission extends Msg {
  @Field.Defined(0, {
    jsonName: "validator_address"
  })
  public validatorAddress: ValAddress;

  constructor(validatorAddress: ValAddress) {
    super();
    this.validatorAddress = validatorAddress;
  }

  public getSigners(): AccAddress[] {
    return [new AccAddress(this.validatorAddress.toBytes())];
  }
}
