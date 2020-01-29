import { Amino } from "@node-a-team/ts-amino";
const { Field, DefineStruct } = Amino;
import { Msg } from "../../core/tx";
import { AccAddress, ValAddress } from "../../common/address";

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

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  public validateBasic(): void {}

  public getSigners(): AccAddress[] {
    return [this.delegatorAddress];
  }
}

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

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  public validateBasic(): void {}

  public getSigners(): AccAddress[] {
    return [this.delegatorAddress];
  }
}

@DefineStruct()
export class MsgWithdrawValidatorCommission extends Msg {
  @Field.Defined(0, {
    jsonName: "validator_address"
  })
  public validatorAddress: ValAddress;

  public bech32PrefixAccAddr: string;

  constructor(validatorAddress: ValAddress, bech32PrefixAccAddr: string) {
    super();
    this.validatorAddress = validatorAddress;
    this.bech32PrefixAccAddr = bech32PrefixAccAddr;
  }

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  public validateBasic(): void {}

  public getSigners(): AccAddress[] {
    return [
      new AccAddress(this.validatorAddress.toBytes(), this.bech32PrefixAccAddr)
    ];
  }
}
