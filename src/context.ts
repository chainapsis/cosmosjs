export interface IContext {
  chainId: string;
}

export default class Context {
  constructor(private context: IContext) {}

  public get<K extends keyof IContext>(key: K): IContext[K] {
    return this.context[key] as IContext[K];
  }

  public set<K extends keyof IContext>(key: K, value: IContext[K]): Context {
    return new Context({ ...this.context, ...{ [key]: value } });
  }
}
