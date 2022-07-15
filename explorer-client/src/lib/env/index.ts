export enum EEnv{
    client=1,
    server
}

/**
 * 环境
 */
export class Env {
    static isClient:boolean|undefined = undefined;

    /**
     * 在浏览器环境下
     * @param cb 回调
     */
    static inClient(cb:Function) {
      if (Env.isClient==undefined) {
        if (globalThis?.document) {
          Env.isClient = true;
          cb();
        } else {
          Env.isClient = false;
        }
      } else if (Env.isClient) {
        cb();
      }
    }

    /**
     * 在服务器环境下
     * @param cb 回调
     */
    static inServer(cb:Function) {
      if (Env.isClient==undefined) {
        if (!globalThis?.document) {
          Env.isClient = false;
          cb();
        } else {
          Env.isClient = true;
        }
      } else if (!Env.isClient) {
        cb();
      }
    }

    /**
     * 获取环境
     */
    static getEnv() {
      if (Env.isClient==undefined) {
        if (globalThis?.document) {
          Env.isClient = true;
          return EEnv.client;
        } else {
          Env.isClient = false;
          return EEnv.server;
        }
      } else {
        return Env.isClient?EEnv.client:EEnv.server;
      }
    }
}
