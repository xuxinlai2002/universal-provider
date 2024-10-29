export const __esModule: boolean;
export default Eip155Provider;
declare class Eip155Provider {
    constructor(opts: any);
    name: string;
    namespace: any;
    events: any;
    client: any;
    chainId: number;
    httpProviders: {};
    isRecord(value: any): boolean;
    isArray(value: any): value is any[];
    updateRequestParams(args: any): void;
    adaptArray(args: any): void;
    request(args: any): any;
    addEthereumChain(args: any): any;
    updateNamespace(namespace: any): void;
    setDefaultChain(chainId: any, rpcUrl: any): void;
    requestAccounts(): any[];
    getDefaultChain(): any;
    getAccounts(): any[];
    handleSwitchChain(args: any): any;
    isChainApproved(chainId: any): any;
    createHttpProvider(chainId: any, rpcUrl: any): JsonRpcProvider_1.JsonRpcProvider | undefined;
    createHttpProviders(): {};
    setHttpProvider(chainId: any, rpcUrl: any): void;
    getHttpProvider(): any;
}
import JsonRpcProvider_1 = require("./rpc/JsonRpcProvider");
