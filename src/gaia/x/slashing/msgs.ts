import { Amino } from "@node-a-team/ts-amino";
const { Field, DefineStruct } = Amino;
import { Msg } from "../../../core/tx";
import { AccAddress, ValAddress } from "../../../common/address";

@DefineStruct()
export class MsgUnjail extends Msg {
  @Field.Defined(0, {
    jsonName: "address"
  })
  public validatorAddr: ValAddress;

  constructor(validatorAddr: ValAddress) {
    super();
    this.validatorAddr = validatorAddr;
  }

  public getSigners(): AccAddress[] {
    return [new AccAddress(this.validatorAddr.toBytes())];
  }
}
