import { ISignClient, SessionTypes, DappMetadata } from "@xuxinlai2002/core";
export declare class SignClient extends ISignClient {
    readonly metadata: ISignClient["metadata"];
    session?: SessionTypes.Struct;
    sessionConfig?: SessionTypes.SessionConfig;
    events: ISignClient["events"];
    engine: ISignClient["engine"];
    constructor(metaData: DappMetadata);
    connect: ISignClient["connect"];
    restoreconnect: ISignClient["restoreconnect"];
    reject: ISignClient["reject"];
    request: ISignClient["request"];
    openOKXWallet(): void;
    disconnect: ISignClient["disconnect"];
}
