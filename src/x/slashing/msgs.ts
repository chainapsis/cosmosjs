import { Amino } from "@chainapsis/ts-amino";
const { Field, DefineStruct } = Amino;
import { Msg } from "../../core/tx";
import { AccAddress, ValAddress } from "../../common/address";

@DefineStruct()
export class MsgUnjail extends Msg {
  @Field.Defined(0, {
    jsonName: "address"
  })
  public validatorAddr: ValAddress;

  public bech32PrefixAccAddr: string;

  constructor(validatorAddr: ValAddress, bech32PrefixAccAddr: string) {
    super();
    this.validatorAddr = validatorAddr;
    this.bech32PrefixAccAddr = bech32PrefixAccAddr;
  }

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  public validateBasic(): void {}

  public getSigners(): AccAddress[] {
    return [
      new AccAddress(this.validatorAddr.toBytes(), this.bech32PrefixAccAddr)
    ];
  }
}
