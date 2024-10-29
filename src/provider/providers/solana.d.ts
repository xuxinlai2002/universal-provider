import { SignClient } from "../../packages/sign-client/client";
import EventEmitter from "events";
import { RequestParams, SessionNamespace, SessionTypes, SubProviderOpts } from "@xuxinlai2002/core";
import { HttpRpcProviderMap, IProvider } from "../types";
declare class SolanaProvider implements IProvider {
    name: string;
    client: SignClient;
    httpProviders: HttpRpcProviderMap;
    events: EventEmitter;
    namespace: SessionNamespace;
    chainId: string;
    constructor(opts: SubProviderOpts, name: string);
    updateNamespace(namespace: SessionTypes.Namespace): void;
    requestAccounts(): string[];
    request<T = unknown>(args: RequestParams): Promise<T>;
    setDefaultChain(chainId: string, rpcUrl?: string | undefined): void;
    getDefaultChain(): string;
    private getAccounts;
    private createHttpProviders;
    private getHttpProvider;
    private setHttpProvider;
    private createHttpProvider;
    private getPubkey;
    private getWalletAddress;
}
export default SolanaProvider;
