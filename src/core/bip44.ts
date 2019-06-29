/**
 * This BIP defines a logical hierarchy for deterministic wallets.
 */
export class BIP44 {
  /**
   * Purpose is a constant set to 44' (or 0x8000002C) following the BIP43 recommendation.
   * It indicates that the subtree of this node is used according to this specification.
   * Hardened derivation is used at this level.
   */
  public readonly purpose: number;
  /**
   * One master node (seed) can be used for unlimited number of independent cryptocoins such as Bitcoin, Litecoin or Namecoin. However, sharing the same space for various cryptocoins has some disadvantages.
   * This level creates a separate subtree for every cryptocoin, avoiding reusing addresses across cryptocoins and improving privacy issues.
   * Coin type is a constant, set for each cryptocoin. Cryptocoin developers may ask for registering unused number for their project.
   * The list of already allocated coin types is in the chapter "Registered coin types" below.
   * Hardened derivation is used at this level.
   */
  public readonly coinType: number;
  /**
   * This level splits the key space into independent user identities, so the wallet never mixes the coins across different accounts.
   * Users can use these accounts to organize the funds in the same fashion as bank accounts; for donation purposes (where all addresses are considered public), for saving purposes, for common expenses etc.
   * Accounts are numbered from index 0 in sequentially increasing manner. This number is used as child index in BIP32 derivation.
   * Hardened derivation is used at this level.
   * Software should prevent a creation of an account if a previous account does not have a transaction history (meaning none of its addresses have been used before).
   * Software needs to discover all used accounts after importing the seed from an external source. Such an algorithm is described in "Account discovery" chapter.
   */
  public readonly account: number;

  constructor(purpose: number, coinType: number, account: number) {
    this.purpose = purpose;
    this.coinType = coinType;
    this.account = account;
  }

  /**
   * Return path
   * @param index Addresses are numbered from index 0 in sequentially increasing manner. This number is used as child index in BIP32 derivation.
   * Public derivation is used at this level.
   * @param change Constant 0 is used for external chain and constant 1 for internal chain (also known as change addresses). External chain is used for addresses that are meant to be visible outside of the wallet (e.g. for receiving payments). Internal chain is used for addresses which are not meant to be visible outside of the wallet and is used for return transaction change.
   * Public derivation is used at this level.
   */
  public path(index: number, change: number = 0): number[] {
    if (this.purpose !== parseInt(this.purpose.toString(), 10)) {
      throw new Error("Purpose should be integer");
    }
    if (this.coinType !== parseInt(this.coinType.toString(), 10)) {
      throw new Error("CoinType should be integer");
    }
    if (this.account !== parseInt(this.account.toString(), 10)) {
      throw new Error("Account should be integer");
    }
    if (change !== parseInt(change.toString(), 10)) {
      throw new Error("Change should be integer");
    }
    if (index !== parseInt(index.toString(), 10)) {
      throw new Error("Index should be integer");
    }

    return [this.purpose, this.coinType, this.account, change, index];
  }

  public pathString(index: number, change: number = 0): string {
    const path = this.path(index, change);
    return `m/${path[0]}'/${path[1]}'/${path[2]}'/${path[3]}/${path[4]}`;
  }
}
