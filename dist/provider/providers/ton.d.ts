export const __esModule: boolean;
export default TonProvider;
declare class TonProvider {
    constructor(opts: any);
    namespace: any;
    client: any;
    getDefaultChain(): core_1.TONCHAIN;
    request(args: any): any;
    requestAccounts(): never[];
    setDefaultChain(chainId: any, rpcUrl: any): void;
    updateNamespace(args: any): void;
}
import core_1 = require("@xuxinlai2002/core");
