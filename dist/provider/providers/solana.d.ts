export const __esModule: boolean;
export default SolanaProvider;
declare class SolanaProvider {
    constructor(opts: any, name: any);
    name: any;
    namespace: any;
    events: any;
    client: any;
    chainId: any;
    httpProviders: {};
    updateNamespace(namespace: any): void;
    requestAccounts(): any[];
    request(args: any): any;
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
