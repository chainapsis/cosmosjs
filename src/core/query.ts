import { AccAddress } from "../common/address";
import { BaseAccount } from "../common/baseAccount";

import { AxiosInstance } from "axios";

export async function queryAccount(
  rpcInstance: AxiosInstance,
  account: string | Uint8Array,
  bech32PrefixAccAddr?: string
) {
  if (typeof account === "string" && !bech32PrefixAccAddr) {
    throw new Error("Empty bech32 prefix");
  }

  const accAddress: AccAddress =
    typeof account === "string"
      ? AccAddress.fromBech32(account, bech32PrefixAccAddr)
      : new AccAddress(account, bech32PrefixAccAddr!);

  let result = await rpcInstance.get("abci_query", {
    params: {
      path: "0x" + Buffer.from("custom/auth/account").toString("hex"),
      data:
        "0x" +
        Buffer.from(
          JSON.stringify({
            account: accAddress.toBech32()
          })
        ).toString("hex")
    }
  });

  if (result.status !== 200) {
    throw new Error(result.statusText);
  }

  let value: any;

  if (result.data) {
    const r = result.data;
    if (r.result && r.result.response) {
      const response = r.result.response;

      if (response.code !== undefined && response.code !== 0) {
        throw new Error(response.log);
      }

      value = JSON.parse(Buffer.from(response.value, "base64").toString());
    }
  }

  result = await rpcInstance.get("abci_query", {
    params: {
      path: "0x" + Buffer.from("custom/bank/all_balances").toString("hex"),
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

      value.value.coins = JSON.parse(
        Buffer.from(response.value, "base64").toString()
      );
    }
  }

  if (value) {
    return BaseAccount.fromJSON(value);
  } else {
    throw new Error("Unknown error");
  }
}
