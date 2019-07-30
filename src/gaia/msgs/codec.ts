import { Codec } from "@node-a-team/ts-amino";
import { MsgSend } from "./bank";
import {
  MsgSetWithdrawAddress,
  MsgWithdrawDelegatorReward,
  MsgWithdrawValidatorCommission
} from "./distribution";
import { MsgSubmitProposal, MsgDeposit, MsgVote } from "./gov";
import { MsgUnjail } from "./slashing";
import {
  MsgCreateValidator,
  MsgEditValidator,
  MsgDelegate,
  MsgBeginRedelegate,
  MsgUndelegate
} from "./staking";

export function registerCodec(codec: Codec) {
  codec.registerConcrete("cosmos-sdk/MsgSend", MsgSend.prototype);
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
  codec.registerConcrete(
    "cosmos-sdk/MsgSubmitProposal",
    MsgSubmitProposal.prototype
  );
  codec.registerConcrete("cosmos-sdk/MsgDeposit", MsgDeposit.prototype);
  codec.registerConcrete("cosmos-sdk/MsgVote", MsgVote.prototype);
  codec.registerConcrete("cosmos-sdk/MsgUnjail", MsgUnjail.prototype);
  codec.registerConcrete(
    "cosmos-sdk/MsgCreateValidator",
    MsgCreateValidator.prototype
  );
  codec.registerConcrete(
    "cosmos-sdk/MsgEditValidator",
    MsgEditValidator.prototype
  );
  codec.registerConcrete("cosmos-sdk/MsgDelegate", MsgDelegate.prototype);
  codec.registerConcrete(
    "cosmos-sdk/MsgBeginRedelegate",
    MsgBeginRedelegate.prototype
  );
  codec.registerConcrete("cosmos-sdk/MsgUndelegate", MsgUndelegate.prototype);
}
