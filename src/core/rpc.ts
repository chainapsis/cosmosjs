import { Context } from "./context";
import { AxiosInstance } from "axios";

export class RPC {
  private _instance: AxiosInstance;

  constructor(private _context: Context) {
    this._instance = _context.get("rpcInstance");
  }

  public get context(): Context {
    return this._context;
  }

  public get instance(): AxiosInstance {
    return this._instance;
  }
}
