import { Rest } from "../core/rest";
import { Account } from "../core/account";
import { AccAddress, useBech32ConfigPromise } from "../common/address";
import { BaseAccount } from "../common/baseAccount";

export class GaiaRest extends Rest {
  public getAccount(account: string | Uint8Array): Promise<Account> {
    return useBech32ConfigPromise(
      this.context.get("bech32Config"),
      async () => {
        const accAddress: AccAddress =
          typeof account === "string"
            ? AccAddress.fromBech32(account)
            : new AccAddress(account);

        const result = await this.instance.get(
          `auth/accounts/${accAddress.toBech32()}`
        );
        return BaseAccount.fromJSON(result.data);
      }
    );
  }
}
