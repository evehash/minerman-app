import type { AnyObjectSchema, InferType } from "yup";
import { number, object, string } from "yup";

/**
 * Response for getnetworkinfo.
 *
 * @link https://bitcoincore.org/en/doc/0.16.0/rpc/network/getnetworkinfo/
 * @version 0.16.0
 */
const networkInfoSchema = object({
  version: number().required(),
  subver: string().required(),
});

type NetworkInfo = InferType<typeof networkInfoSchema>;

interface RpcConfig {
  url: string;
  user: string;
  password: string;
}

type Response<T> = { ok: true; data: T } | { ok: false; reason: string; i18nKey: string };

class BitcoinRpcClient {
  private config: RpcConfig;

  constructor(config: RpcConfig) {
    this.config = config;
  }

  public async getNetworkInfo(): Promise<Response<NetworkInfo>> {
    return this.callRpcMethod("getnetworkinfo", networkInfoSchema);
  }

  public async testConnection(): Promise<boolean> {
    const response = await this.getNetworkInfo();
    return response.ok;
  }

  private async callRpcMethod<T>(method: string, schema: AnyObjectSchema, params?: []): Promise<Response<T>> {
    const { url, user, password } = this.config;
    try {
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          // eslint-disable-next-line no-undef
          Authorization: `Basic ${btoa(`${user}:${password}`)}`,
        },
        body: JSON.stringify({
          jsonrpc: "1.0",
          //id: method,
          method: method,
          params: params,
        }),
      });

      if (!response.ok) {
        //console.error({response);
        if (response.status === 403) {
          return { ok: false, reason: "unexpected error", i18nKey: "unexpected-error" };
        }

        return { ok: false, reason: "unexpected error", i18nKey: "unexpected-error" };
      }

      const data = await response.json();
      console.log(JSON.stringify(data?.result));
      const a = schema.validateSync(data);
      console.log(JSON.stringify(a));

      if (!schema.isValidSync(data)) {
        return { ok: false, reason: "reponse node invalid", i18nKey: "unexpected-error" };
      }

      return { ok: true, data: data };
    } catch (err) {
      console.error(JSON.stringify(err));
      return { ok: false, reason: "unexpected error", i18nKey: "unexpected-error" };
    }
  }
}

export default BitcoinRpcClient;
