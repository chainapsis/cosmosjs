import { Codec } from "@node-a-team/ts-amino";
import { MsgExecuteContract } from "./msgs";

export function registerCodec(codec: Codec) {
  codec.registerConcrete(
    "wasm/MsgExecuteContract",
    MsgExecuteContract.prototype
  );
}
