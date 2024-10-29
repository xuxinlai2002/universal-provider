export const __esModule: boolean;
export default OKXUniversalProvider;
export class OKXUniversalProvider {
    static init(opts: any): any;
    constructor(opts: any);
    getUniversalProvider(): this;
    rpcProviders: {};
    events: any;
    providerOpts: any;
    request(args: any, chain: any): any;
    enable(): any;
    disconnect(): any;
    disconnectAndEmit(): void;
    connect(opts: any): any;
    on(event: any, listener: any): void;
    once(event: any, listener: any): void;
    removeListener(event: any, listener: any): void;
    off(event: any, listener: any): void;
    setDefaultChain(chain: any, rpcUrl: any): void;
    checkStorage(): any;
    initialize(): any;
    createProviders(): void;
    registerEventListeners(): void;
    getProvider(namespace: any): any;
    setNamespaces(params: any): void;
    connectOpts: any;
    sessionConfig: {
        dappInfo: {
            url: string;
            name: any;
            icon: any;
        };
        openUniversalUrl: any;
        redirect: any;
    } | undefined;
    validateChain(chain: any): any[];
    isChainNamespaceInSession(namespaceStr: any): boolean;
    requestAccountsWithNamespace(namespace: any): any;
    requestDefaultChainWithNamespace(namespace: any): any;
    requestAccounts(): any;
    onChainChanged(caip2Chain: any): void;
    onConnect(): void;
    cleanup(): any;
    persist(key: any, data: any): any;
    getFromStore(key: any): any;
}
