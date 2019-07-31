import { Codec } from "@node-a-team/ts-amino";
import { MsgUnjail } from "./msgs";

export function registerCodec(codec: Codec) {
  codec.registerConcrete("cosmos-sdk/MsgUnjail", MsgUnjail.prototype);
}
