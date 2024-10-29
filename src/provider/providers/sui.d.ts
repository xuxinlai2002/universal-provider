import { HttpRpcProviderMap, IProvider } from "../types";
import { SignClient } from "../../packages/sign-client/client";
import EventEmitter from "events";
import { SessionTypes, RequestParams, SessionNamespace, SubProviderOpts } from "@okxconnect/core";
declare class SuiProvider implements IProvider {
    name: string;
    client: SignClient;
    httpProviders: HttpRpcProviderMap;
    events: EventEmitter;
    namespace: SessionNamespace;
    chainId: string;
    constructor(opts: SubProviderOpts);
    updateNamespace(namespace: SessionTypes.Namespace): void;
    request<T>(args: RequestParams): Promise<T>;
    requestAccounts(): string[];
    setDefaultChain(chainId: string, rpcUrl: string | undefined): void;
    getDefaultChain(): string;
    private getAccounts;
    private createHttpProviders;
    private getHttpProvider;
    private setHttpProvider;
    private createHttpProvider;
    private getPubkey;
    private getWalletAddress;
}
export default SuiProvider;
