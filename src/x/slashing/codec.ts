import { Codec } from "@chainapsis/ts-amino";
import { MsgUnjail } from "./msgs";

export function registerCodec(codec: Codec) {
  codec.registerConcrete("cosmos-sdk/MsgUnjail", MsgUnjail.prototype);
}
