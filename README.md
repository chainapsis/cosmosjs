
<h1  align="center">Welcome to cosmosjs 👋</h1>
<p>
<img  src="https://img.shields.io/badge/version-0.0.1-blue.svg?cacheSeconds=2592000" />
<a  href="https://twitter.com/Node_Ateam">
<img  alt="Twitter: Node_Ateam"  src="https://img.shields.io/twitter/follow/Node_Ateam.svg?style=social"  target="_blank" />
</a>
</p>

> General purpose library for cosmos-sdk

## Basic usage
More examples will be provided [here](https://github.com/node-a-team/cosmosjs/tree/master/example) soon.
```ts
import { GaiaApi } from "../src/gaia/api";
import { defaultBech32Config } from "../src/core/bech32Config";
import { LocalWalletProvider } from "../src/core/walletProvider";
import { MsgSend } from "../src/gaia/msgs/bank";
import { AccAddress, useGlobalBech32Config } from "../src/common/address";
import { Coin } from "../src/common/coin";
import { Int } from "../src/common/int";
import bigInteger from "big-integer";

(async () => {
  // You should not use local wallet provider in production
  const wallet = new LocalWalletProvider(
    "anger river nuclear pig enlist fish demand dress library obtain concert nasty wolf episode ring bargain rely off vibrant iron cram witness extra enforce"
  );
  const api = new GaiaApi({
    chainId: "cosmoshub-2",
    bech32Config: defaultBech32Config("cosmos"),
    walletProvider: wallet,
    rpc: "http://localhost:26657",
    rest: "http://localhost:1317"
  });

  useGlobalBech32Config(api.context.get("bech32Config"));

  // You should sign in before using your wallet
  await wallet.signIn("m/44'/118'/0'/0/0");

  await api.sendMsgs(
    [
      new MsgSend(
        AccAddress.fromBech32("cosmos1t68n2ezn5zt8frh4jehmufkk2puakv9glapyz4"),
        AccAddress.fromBech32("cosmos1t68n2ezn5zt8frh4jehmufkk2puakv9glapyz4"),
        [new Coin("uatom", new Int("1"))]
      ),
      new MsgSend(
        AccAddress.fromBech32("cosmos1t68n2ezn5zt8frh4jehmufkk2puakv9glapyz4"),
        AccAddress.fromBech32("cosmos1t68n2ezn5zt8frh4jehmufkk2puakv9glapyz4"),
        [new Coin("uatom", new Int("1"))]
      )
    ],
    {
      // If account number or sequence is omitted, they are calculated automatically
      gas: bigInteger(60000),
      memo: "test",
      fee: new Coin("uatom", new Int("111")),
      gasPrice: 1
    },
    "commit"
  );
})();
```

## Making your own messages
Below is Gaia's basic sending message.
More examples are [here](https://github.com/node-a-team/cosmosjs/tree/master/src/gaia/msgs).
```ts
import { Amino, Type } from "ts-amino";
const { Field, Concrete, DefineStruct } = Amino;
import { Msg }  from "../../core/tx";
import { AccAddress } from "../../common/address";
import { Coin } from "../../common/coin";
import { Int } from "../../common/int";

@Concrete("cosmos-sdk/MsgSend")
@DefineStruct()
export  class  MsgSend  extends  Msg {
  @Field.Defined(0, {
    jsonName:  "from_address"
  })
  public fromAddress:  AccAddress;

  @Field.Defined(1, {
    jsonName:  "to_address"
  })
  public toAddress:  AccAddress;

  @Field.Slice(
    2,
    { type:  Type.Defined },
    {
      jsonName:  "amount"
    }
  )
  public amount:  Coin[];

  constructor(fromAddress:  AccAddress, toAddress:  AccAddress, amount:  Coin[]) {
    super();
    this.fromAddress  = fromAddress;
    this.toAddress  = toAddress;
    this.amount  = amount;
  }

  public  getSigners():  AccAddress[] {
    return [this.fromAddress];
  }

  /**
  * ValidateBasic does a simple validation check that
  * doesn't require access to any other information.
  * You can throw error in this when msg is invalid.
  */
  public  validateBasic():  void {
    for (const  coin  of  this.amount) {
      if (coin.amount.lte(new  Int(0))) {
        throw  new  Error("Send amount is invalid");
      }
    }
  }
  
  /**
  * Get the canonical byte representation of the Msg.
  * @return Return sorted by alphabetically amino encoded json by default.
  */
  // public  getSignBytes():  Uint8Array {
  //   return  Buffer.from(sortJSON(marshalJson(this)), "utf8");
  // }
}
```

## Making api for your own blockchain
Check out [this](https://github.com/node-a-team/cosmosjs/tree/master/src/gaia).

## Run tests
```sh
npm run test
```

## Author
👤 **node-a-team**
* Twitter: [@Node_Ateam](https://twitter.com/Node_Ateam)
* Github: [@node-a-team](https://github.com/node-a-team)

## Show your support
Give a ⭐️ if this project helped you!  
***
**If you find this project interesting, you can always donate by delegating to Node A-Team!**

Node A-Team (Moniker: ATEAM) is a Cosmos-SDK and Tendermint-based Blockchain Validator, which currently participates in Cosmos, IRISnet and Terra. Based on the knowledge and experience gained from various testnets and mainnet, Node A-Team contributes to Cosmos Ecosystem and operates highly secure nodes.
> ATEAM History
 — Cosmos: “Game of Stakes” — Never Jailed  
 — IRISnet: “FUXI Betanet” — Reward Winner  
 — Terra-project: “Genesis Drill” — Top Tier  

[ATEAM Validator Address: cosmosvaloper14l0fp639yudfl46zauvv8rkzjgd4u0zk2aseys]

Webpage: https://nodeateam.com/  
Twitter: https://twitter.com/Node_Ateam  
E-mail: contact@nodeateam.com  
***
