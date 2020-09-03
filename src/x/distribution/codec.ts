import { Codec } from "@chainapsis/ts-amino";
import {
  MsgSetWithdrawAddress,
  MsgWithdrawDelegatorReward,
  MsgWithdrawValidatorCommission
} from "./msgs";

export function registerCodec(codec: Codec) {
  codec.registerConcrete(
    "cosmos-sdk/MsgModifyWithdrawAddress",
    MsgSetWithdrawAddress.prototype
  );
  codec.registerConcrete(
    "cosmos-sdk/MsgWithdrawDelegationReward",
    MsgWithdrawDelegatorReward.prototype
  );
  codec.registerConcrete(
    "cosmos-sdk/MsgWithdrawValidatorCommission",
    MsgWithdrawValidatorCommission.prototype
  );
}
