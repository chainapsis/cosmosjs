interface WalletProvider {
  newAccount():Promise<Account>
  getAccounts():Promise<Account[]>
  sign(bz:Uint8Array):Promise<Uint8Array>
}

interface Account {
  pubKey:PubKey
}

interface Address {
  bytes():Uint8Array
  bech32():string
}

type PubKey = Secp256k1PubKey | Ed25519PubKey

interface Secp256k1PubKey {
  type:'secp256k1',
  bytes():Uint8Array,
  address():Address,
  privateKey():Uint8Array | never,
}

interface Ed25519PubKey {
  type:'ed25519',
  bytes():Uint8Array,
  address():Address,
  privateKey():Uint8Array | never,
}
