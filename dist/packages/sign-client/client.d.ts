export const __esModule: boolean;
export class SignClient extends core_1.ISignClient {
    constructor(metaData: any);
    connect: (params: any) => any;
    restoreconnect: (sessionConfig: any) => any;
    reject: (params: any) => any;
    request: (params: any) => any;
    disconnect: () => any;
    events: any;
    metadata: any;
    openOKXWallet(): void;
}
import core_1 = require("@okxconnect/core");
