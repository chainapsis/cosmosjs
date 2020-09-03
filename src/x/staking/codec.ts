import { Codec } from "@chainapsis/ts-amino";
import {
  MsgCreateValidator,
  MsgEditValidator,
  MsgDelegate,
  MsgBeginRedelegate,
  MsgUndelegate
} from "./msgs";

export function registerCodec(codec: Codec) {
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
