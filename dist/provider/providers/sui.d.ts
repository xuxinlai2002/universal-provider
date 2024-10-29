export const __esModule: boolean;
export default SuiProvider;
declare class SuiProvider {
    constructor(opts: any);
    name: string;
    namespace: any;
    events: any;
    client: any;
    chainId: any;
    httpProviders: {};
    updateNamespace(namespace: any): void;
    request(args: any): any;
    requestAccounts(): any[];
    setDefaultChain(chainId: any, rpcUrl: any): void;
    getDefaultChain(): any;
    getAccounts(): any[];
    createHttpProviders(): {};
    getHttpProvider(): any;
    setHttpProvider(chainId: any, rpcUrl: any): void;
    createHttpProvider(chainId: any, rpcUrl: any): JsonRpcProvider_1.JsonRpcProvider | undefined;
    getPubkey(chainId: any): any;
    getWalletAddress(chainId: any): any;
}
import JsonRpcProvider_1 = require("./rpc/JsonRpcProvider");
