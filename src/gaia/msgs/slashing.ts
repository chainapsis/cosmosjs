import { Amino } from "ts-amino";
const { Field, Concrete, DefineStruct } = Amino;
import { Msg } from "../../core/tx";
import { AccAddress, ValAddress } from "../../common/address";

@Concrete("cosmos-sdk/MsgUnjail")
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
