import { Codec } from "@chainapsis/ts-amino";
import { MsgExecuteContract, MsgInstantiateContract } from "./msgs";

export function registerCodec(codec: Codec) {
  codec.registerConcrete(
    "wasm/MsgExecuteContract",
    MsgExecuteContract.prototype
  );
  codec.registerConcrete(
    "wasm/MsgInstantiateContract",
    MsgInstantiateContract.prototype
  );
}
