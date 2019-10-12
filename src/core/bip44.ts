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
   * Constant 0 is used for external chain and constant 1 for internal chain (also known as change addresses).
   * External chain is used for addresses that are meant to be visible outside of the wallet (e.g. for receiving payments).
   * Internal chain is used for addresses which are not meant to be visible outside of the wallet and is used for return transaction change.
   */
  public readonly change: number;

  constructor(purpose: number, coinType: number, change: number = 0) {
    this.purpose = purpose;
    this.coinType = coinType;
    this.change = change;
  }

  public withChange(change: number): BIP44 {
    return new BIP44(this.purpose, this.coinType, change);
  }

  /**
   * Return path
   * @param account Accounts are numbered from index 0 in sequentially increasing manner. This number is used as child index in BIP32 derivation.
   * Public derivation is used at this level.
   * @param index Addresses are numbered from index 0 in sequentially increasing manner. This number is used as child index in BIP32 derivation.
   * Public derivation is used at this level.
   */
  public path(account: number, index: number): number[] {
    if (this.purpose !== parseInt(this.purpose.toString(), 10)) {
      throw new Error("Purpose should be integer");
    }
    if (this.coinType !== parseInt(this.coinType.toString(), 10)) {
      throw new Error("CoinType should be integer");
    }
    if (account !== parseInt(account.toString(), 10)) {
      throw new Error("Account should be integer");
    }
    if (this.change !== parseInt(this.change.toString(), 10)) {
      throw new Error("Change should be integer");
    }
    if (index !== parseInt(index.toString(), 10)) {
      throw new Error("Index should be integer");
    }

    return [this.purpose, this.coinType, account, this.change, index];
  }

  public pathString(account: number, index: number): string {
    const path = this.path(account, index);
    return `m/${path[0]}'/${path[1]}'/${path[2]}'/${path[3]}/${path[4]}`;
  }
}
