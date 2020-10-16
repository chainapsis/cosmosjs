import { AccAddress } from "../common/address";
import { BaseAccount } from "../common/baseAccount";

import { AxiosInstance } from "axios";

export async function queryAccount(
  rpcInstance: AxiosInstance,
  account: string | Uint8Array,
  bech32PrefixAccAddr?: string,
  options?: {
    querierRoute?: string;
    data?: string;
    isStargate?: boolean;
  }
) {
  if (typeof account === "string" && !bech32PrefixAccAddr) {
    throw new Error("Empty bech32 prefix");
  }

  const accAddress: AccAddress =
    typeof account === "string"
      ? AccAddress.fromBech32(account, bech32PrefixAccAddr)
      : new AccAddress(account, bech32PrefixAccAddr!);

  const result = await rpcInstance.get("abci_query", {
    params: {
      path:
        "0x" +
        Buffer.from(
          `custom/${
            options && options.querierRoute
              ? options.querierRoute
              : options && options.isStargate
              ? "auth"
              : "acc"
          }/account`
        ).toString("hex"),
      data:
        options && options.data
          ? options.data
          : "0x" +
            Buffer.from(
              JSON.stringify({
                [options && options.isStargate
                  ? "address"
                  : "Address"]: accAddress.toBech32()
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
}
