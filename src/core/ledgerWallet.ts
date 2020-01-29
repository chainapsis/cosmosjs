import { PubKey, PubKeySecp256k1 } from "../crypto";
import { Context } from "./context";
import { AccAddress } from "../common/address";
import { WalletProvider, Key } from "./walletProvider";
import { Buffer } from "buffer/";
const TransportWebUSB: any = require("@ledgerhq/hw-transport-webusb").default;
const TransportU2F: any = require("@ledgerhq/hw-transport-u2f").default;
const TransportHID: any = require("@ledgerhq/hw-transport-node-hid").default;
const CosmosApp: any = require("ledger-cosmos-js").default;

/**
 * This wallet provider provides a basic client interface to communicate with a Tendermint/Cosmos App running in a Ledger Nano S/X
 * Note: WebUSB support requires Cosmos app >= 1.5.3
 */
export class LedgerWalletProvider implements WalletProvider {
  private app: any;
  private path: number[] | undefined;
  private key:
    | {
        pubKey: PubKey;
        address: Uint8Array;
      }
    | undefined;

  constructor(
    public readonly transport: "WebUSB" | "U2F" | "HID",
    public readonly bech32PrefixAccAddr: string,
    private readonly account: number = 0,
    private readonly index: number = 0
  ) {}

  async enable(context: Context): Promise<void> {
    let transport;
    switch (this.transport) {
      case "WebUSB":
        transport = await TransportWebUSB.create();
        break;
      case "U2F":
        transport = await TransportU2F.create();
        break;
      case "HID":
        transport = await TransportHID.create();
        break;
      default:
        throw new Error("Unsupported transport");
    }
    this.app = new CosmosApp(transport);

    let response = await this.app.getVersion();
    if (response.error_message !== "No errors") {
      throw new Error(`[${response.error_message}] ${response.error_message}`);
    }

    console.log("Response received!");
    console.log(
      `App Version ${response.major}.${response.minor}.${response.patch}`
    );
    console.log(`Device Locked: ${response.device_locked}`);
    console.log(`Test mode: ${response.test_mode}`);
    console.log("Full response:");
    console.log(response);

    this.path = context.get("bip44").path(this.account, this.index);

    response = await this.app.getAddressAndPubKey(
      this.path,
      context.get("bech32Config").bech32PrefixAccAddr
    );
    if (response.error_message !== "No errors") {
      throw new Error(`[${response.error_message}] ${response.error_message}`);
    }

    this.key = {
      address: AccAddress.fromBech32(
        this.bech32PrefixAccAddr,
        response.bech32_address
      ).toBytes(),
      pubKey: new PubKeySecp256k1(response.compressed_pk)
    };

    return Promise.resolve();
  }

  getKeys(context: Context): Promise<Key[]> {
    if (!this.app || !this.path || !this.key) {
      throw new Error("Not approved");
    }

    const bech32Address = new AccAddress(
      this.key!.address,
      this.bech32PrefixAccAddr
    ).toBech32();

    const key = {
      address: this.key.address,
      algo: "secp256k1",
      pubKey: this.key.pubKey.serialize(),
      bech32Address
    };

    return Promise.resolve([key]);
  }

  public async sign(
    context: Context,
    bech32Address: string,
    message: Uint8Array
  ): Promise<Uint8Array> {
    if (!this.app || !this.path || !this.key) {
      throw new Error("Not signed in");
    }

    if (
      new AccAddress(this.key!.address, this.bech32PrefixAccAddr).toBech32() !==
      bech32Address
    ) {
      throw new Error(`Unknown address: ${bech32Address}`);
    }

    const response = await this.app.sign(this.path, message);
    if (response.error_message !== "No errors") {
      throw new Error(`[${response.error_message}] ${response.error_message}`);
    }

    // Ledger has encoded the sig in ASN1 DER format, but we need a 64-byte buffer of <r,s>
    // DER-encoded signature from Ledger:
    // 0 0x30: a header byte indicating a compound structure
    // 1 A 1-byte length descriptor for all what follows (ignore)
    // 2 0x02: a header byte indicating an integer
    // 3 A 1-byte length descriptor for the R value
    // 4 The R coordinate, as a big-endian integer
    //   0x02: a header byte indicating an integer
    //   A 1-byte length descriptor for the S value
    //   The S coordinate, as a big-endian integer
    //  = 7 bytes of overhead
    let signature: Buffer = response.signature;
    if (signature[0] !== 0x30) {
      throw new Error(
        "Ledger assertion failed: Expected a signature header of 0x30"
      );
    }

    // decode DER string format
    let rOffset = 4;
    let rLen = signature[3];
    const sLen = signature[4 + rLen + 1]; // skip over following 0x02 type prefix for s
    let sOffset = signature.length - sLen;
    // we can safely ignore the first byte in the 33 bytes cases
    if (rLen === 33) {
      rOffset++; // chop off 0x00 padding
      rLen--;
    }
    if (sLen === 33) {
      sOffset++;
    } // as above
    const sigR = signature.slice(rOffset, rOffset + rLen); // skip e.g. 3045022100 and pad
    const sigS = signature.slice(sOffset);

    signature = Buffer.concat([sigR, sigS]);
    if (signature.length !== 64) {
      throw new Error(
        `Ledger assertion failed: incorrect signature length ${
          signature.length
        }`
      );
    }

    return Promise.resolve(new Uint8Array(signature));
  }
}
