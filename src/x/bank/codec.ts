import { Codec } from "@chainapsis/ts-amino";
import { MsgSend } from "./msgs";

export function registerCodec(codec: Codec) {
  codec.registerConcrete("cosmos-sdk/MsgSend", MsgSend.prototype);
}
