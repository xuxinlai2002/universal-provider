import { EventEmitter } from "eventemitter3";
import { IJSONRpcProvider, IJSONRpcConnection } from "../../types";
import { JsonRpcRequest, JsonRpcPayload, RequestArguments } from "@xuxinlai2002/core";
export declare class JsonRpcProvider extends IJSONRpcProvider {
    events: EventEmitter<string | symbol, any>;
    connection: IJSONRpcConnection;
    connected: boolean;
    connecting: boolean;
    private hasRegisteredEventListeners;
    constructor(connection: IJSONRpcConnection);
    connect(connection?: string | IJSONRpcConnection): Promise<void>;
    disconnect(): Promise<void>;
    on(event: string, listener: any): void;
    once(event: string, listener: any): void;
    off(event: string, listener: any): void;
    removeListener(event: string, listener: any): void;
    request<Result = any, Params = any>(request: RequestArguments, context?: any): Promise<Result>;
    protected requestStrict<Result = any, Params = any>(request: JsonRpcRequest<Params>, context?: any): Promise<Result>;
    protected setConnection(connection?: IJSONRpcConnection): IJSONRpcConnection;
    protected onPayload(payload: JsonRpcPayload): void;
    protected onClose(event?: CloseEvent): void;
    protected open(connection?: string | IJSONRpcConnection): Promise<void>;
    protected close(): Promise<void>;
    private registerEventListeners;
}
