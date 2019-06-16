import { Context } from "./context";
import { AxiosInstance } from "axios";

export class Rest {
  // tslint:disable-next-line: variable-name
  private _instance: AxiosInstance;

  // tslint:disable-next-line: variable-name
  constructor(private _context: Context) {
    this._instance = _context.get("restInstance");
  }

  public get context(): Context {
    return this._context;
  }

  public get instance(): AxiosInstance {
    return this._instance;
  }
}
