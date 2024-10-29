import { IUniversalProvider, RpcProviderMap } from "./provider/";
import EventEmitter from "eventemitter3";
import { SignClient } from "./packages/sign-client/client";
import { SessionTypes, EngineTypes, RequestArguments, UniversalProviderOpts } from "@xuxinlai2002/core";
import ConnectParams = EngineTypes.ConnectParams;
export declare class OKXUniversalProvider implements IUniversalProvider, IUniversalProviderGenerator {
    client: SignClient;
    rpcProviders: RpcProviderMap;
    sessionProperties?: Record<string, string>;
    private sessionConfig?;
    events: EventEmitter;
    session?: SessionTypes.Struct;
    providerOpts: UniversalProviderOpts;
    private connectOpts;
    uri: string | undefined;
    static init(opts: UniversalProviderOpts): Promise<OKXUniversalProvider>;
    getUniversalProvider(): this;
    constructor(opts: UniversalProviderOpts);
    request<T = unknown>(args: RequestArguments, chain?: string | undefined): Promise<T>;
    private enable;
    disconnect(): Promise<void>;
    private disconnectAndEmit;
    connect(opts: ConnectParams): Promise<SessionTypes.Struct | undefined>;
    on(event: any, listener: any): void;
    once(event: string, listener: any): void;
    removeListener(event: string, listener: any): void;
    off(event: string, listener: any): void;
    setDefaultChain(chain: string, rpcUrl?: string | undefined): void;
    private checkStorage;
    private initialize;
    private createProviders;
    private registerEventListeners;
    private getProvider;
    private setNamespaces;
    private validateChain;
    private isChainNamespaceInSession;
    requestAccountsWithNamespace(namespace: string): string[];
    requestDefaultChainWithNamespace(namespace: string): string;
    private requestAccounts;
    private onChainChanged;
    private onConnect;
    private cleanup;
    private persist;
    private getFromStore;
}
export interface IUniversalProviderGenerator {
    getUniversalProvider: () => OKXUniversalProvider;
}
export default OKXUniversalProvider;
