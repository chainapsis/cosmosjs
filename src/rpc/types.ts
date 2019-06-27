export interface JSONRPC {
  jsonrpc: string;
  id: string;
  result: any;
  error:
    | {
        code: number;
        message: string;
        data: string;
      }
    | undefined;
}
