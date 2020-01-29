import { Rest } from "../core/rest";
import { Account } from "../core/account";
import { AccAddress } from "../common/address";
import { BaseAccount } from "../common/baseAccount";

export class GaiaRest extends Rest {
  public async getAccount(
    account: string | Uint8Array,
    bech32PrefixAccAddr?: string
  ): Promise<Account> {
    if (typeof account === "string" && !bech32PrefixAccAddr) {
      throw new Error("Empty bech32 prefix");
    }

    const accAddress: AccAddress =
      typeof account === "string"
        ? AccAddress.fromBech32(account, bech32PrefixAccAddr)
        : new AccAddress(account, bech32PrefixAccAddr!);

    const result = await this.instance.get(
      `auth/accounts/${accAddress.toBech32()}`
    );
    return BaseAccount.fromJSON(result.data);
  }
}
