import { Codec } from "@node-a-team/ts-amino";
import { MsgSubmitProposal, MsgDeposit, MsgVote } from "./msgs";

export function registerCodec(codec: Codec) {
  codec.registerConcrete(
    "cosmos-sdk/MsgSubmitProposal",
    MsgSubmitProposal.prototype
  );
  codec.registerConcrete("cosmos-sdk/MsgDeposit", MsgDeposit.prototype);
  codec.registerConcrete("cosmos-sdk/MsgVote", MsgVote.prototype);
}
