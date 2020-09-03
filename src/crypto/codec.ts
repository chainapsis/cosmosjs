import { Codec } from "@chainapsis/ts-amino";
import { PrivKeySecp256k1, PubKeySecp256k1 } from "./secp256k1";

export function registerCodec(codec: Codec) {
  codec.registerConcrete(
    "tendermint/PrivKeySecp256k1",
    PrivKeySecp256k1.prototype
  );
  codec.registerConcrete(
    "tendermint/PubKeySecp256k1",
    PubKeySecp256k1.prototype
  );
}
