import { Context } from "./context";

export class Rest {
  // tslint:disable-next-line: variable-name
  constructor(private _context: Context) {}

  public get context(): Context {
    return this._context;
  }
}
