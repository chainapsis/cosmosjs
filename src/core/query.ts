import { AccAddress, useBech32ConfigPromise } from "../common/address";
import { BaseAccount } from "../common/baseAccount";
import { Bech32Config } from "./bech32Config";
import { AxiosInstance } from "axios";

export function queryAccount(
  bech32Config: Bech32Config,
  rpcInstance: AxiosInstance,
  account: string | Uint8Array
) {
  return useBech32ConfigPromise(bech32Config, async () => {
    const accAddress: AccAddress =
      typeof account === "string"
        ? AccAddress.fromBech32(account)
        : new AccAddress(account);

    const result = await rpcInstance.get("abci_query", {
      params: {
        path: "0x" + Buffer.from("custom/acc/account").toString("hex"),
        data:
          "0x" +
          Buffer.from(
            JSON.stringify({
              Address: accAddress.toBech32()
            })
          ).toString("hex")
      }
    });

    if (result.status !== 200) {
      throw new Error(result.statusText);
    }

    if (result.data) {
      const r = result.data;
      if (r.result && r.result.response) {
        const response = r.result.response;

        if (response.code !== undefined && response.code !== 0) {
          throw new Error(response.log);
        }

        const value = JSON.parse(
          Buffer.from(response.value, "base64").toString()
        );

        return BaseAccount.fromJSON(value);
      }
    }

    throw new Error("Unknown error");
  });
}
