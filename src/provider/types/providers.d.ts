import { IEthereumProvider } from "./misc";
import { SignClient } from "../../packages/sign-client/client";
import { SessionTypes, EngineTypes, SessionNamespace, RequestParams, RequestArguments } from "@okxconnect/core";
import { EventEmitter } from "eventemitter3";
import ConnectParams = EngineTypes.ConnectParams;
import { JsonRpcPayload, JsonRpcRequest } from "@okxconnect/core";
export interface IProvider {
    readonly namespace: SessionNamespace;
    readonly client: SignClient;
    request: <T = unknown>(args: RequestParams) => Promise<T>;
    updateNamespace: (args: SessionTypes.Namespace) => void;
    setDefaultChain: (chain: string, rpcUrl?: string | undefined) => void;
    getDefaultChain: () => string;
    requestAccounts: () => string[];
}
export declare abstract class IJSONRpcConnection {
    abstract events: EventEmitter;
    abstract on(event: string, listener: any): void;
    abstract once(event: string, listener: any): void;
    abstract off(event: string, listener: any): void;
    abstract removeListener(event: string, listener: any): void;
    abstract connected: boolean;
    abstract connecting: boolean;
    abstract open(opts?: any): Promise<void>;
    abstract close(): Promise<void>;
    abstract send(payload: JsonRpcPayload, context?: any): Promise<void>;
}
export declare abstract class IJSONRpcProvider {
    abstract events: EventEmitter;
    abstract connection: IJSONRpcConnection | string;
    abstract on(event: string, listener: any): void;
    abstract once(event: string, listener: any): void;
    abstract off(event: string, listener: any): void;
    abstract removeListener(event: string, listener: any): void;
    abstract connected: boolean;
    abstract connecting: boolean;
    constructor(opt: any);
    abstract connect(connection?: string | IJSONRpcConnection): Promise<void>;
    abstract request<Result = any>(request: RequestArguments, context?: any): Promise<Result>;
    protected abstract onPayload(payload: JsonRpcPayload): void;
    protected abstract requestStrict<Result = any, Params = any>(request: JsonRpcRequest<Params>, context?: any): Promise<Result>;
}
export interface IUniversalProvider extends IEthereumProvider {
    client: SignClient;
    session?: SessionTypes.Struct;
    uri: string | undefined;
    request: <T = unknown>(args: RequestArguments, chain?: string) => Promise<T>;
    connect: (opts: ConnectParams) => Promise<SessionTypes.Struct | undefined>;
    disconnect: () => Promise<void>;
    setDefaultChain: (chain: string, rpcUrl?: string | undefined) => void;
}
