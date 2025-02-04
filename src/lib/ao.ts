import { connect } from "@permaweb/aoconnect";
export interface Config {
  CU_URL: string;
  MU_URL: string;
  GATEWAY_URL?: string;
}
export const defaultConfig: Config = {
  CU_URL: "https://cu.ao-testnet.xyz",
  MU_URL: "https://mu.ao-testnet.xyz",
  GATEWAY_URL: "https://g8way.io:443"
};

export const joinUrl = ({ url, path }: { url: string; path: string }) => {
  if (!path) return url;

  // Create a URL object
  const urlObj = new URL(url);

  // Remove leading slash from path if present
  const normalizedPath = path.startsWith("/") ? path.slice(1) : path;

  // Ensure the URL object's pathname ends with a slash if it's not empty
  urlObj.pathname = urlObj.pathname.replace(/\/?$/, "/");

  // Join the normalized path
  urlObj.pathname += normalizedPath;

  return urlObj.toString();
};

export function safeDecode<R = unknown>(data: any): R {
  try {
    return JSON.parse(data);
  } catch (e) {
    return data as R;
  }
}

export class BaseError extends Error {
  constructor(message: string) {
    super(message);
    this.name = this.constructor.name;
  }
}

export class AOProcess {
  private processId: string;
  private ao: {
    result: any;
    results: any;
    message: any;
    spawn: any;
    monitor: any;
    unmonitor: any;
    dryrun: any;
    assign: any;
  };

  constructor({
    processId,
    connectionConfig
  }: {
    processId: string;
    connectionConfig?: {
      CU_URL: string;
      MU_URL: string;
      GATEWAY_URL: string;
      GRAPHQL_URL: string;
    };
  }) {
    this.processId = processId;
    this.ao = connect({
      GRAPHQL_URL:
        connectionConfig?.GRAPHQL_URL ??
        joinUrl({
          url: connectionConfig?.GATEWAY_URL ?? defaultConfig.GATEWAY_URL!,
          path: "graphql"
        }),
      CU_URL: connectionConfig?.CU_URL ?? defaultConfig.CU_URL,
      MU_URL: connectionConfig?.MU_URL ?? defaultConfig.MU_URL,
      GATEWAY_URL: connectionConfig?.GATEWAY_URL ?? defaultConfig.GATEWAY_URL
    });
  }

  async read<K>({
    tags,
    retries = 3
  }: {
    tags?: Array<{ name: string; value: string }>;
    retries?: number;
  }): Promise<K> {
    let attempts = 0;
    let lastError: Error | undefined;
    while (attempts < retries) {
      try {
        console.debug(`Evaluating read interaction on contract`, {
          tags
        });
        // map tags to inputs
        const result = await this.ao.dryrun({
          process: this.processId,
          tags
        });

        if (result.Error !== undefined) {
          throw new Error(result.Error);
        }

        if (result.Messages.length === 0) {
          throw new Error("Process does not support provided action.");
        }

        console.debug(`Read interaction result`, {
          result: result.Messages[0].Data
        });

        const data: K = JSON.parse(result.Messages[0].Data);
        return data;
      } catch (e:any) {
        attempts++;
        console.debug(`Read attempt ${attempts} failed`, {
          error: e,
          tags
        });
        lastError = e;
        // exponential backoff
        await new Promise((resolve) =>
          setTimeout(resolve, 2 ** attempts * 1000)
        );
      }
    }
    throw lastError;
  }
}
