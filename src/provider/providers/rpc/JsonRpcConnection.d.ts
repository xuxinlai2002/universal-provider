import { EventEmitter } from "eventemitter3";
import { IJSONRpcConnection } from "../../types";
import { JsonRpcPayload } from "@xuxinlai2002/core";
export declare class JsonRpcConnection implements IJSONRpcConnection {
    url: string;
    disableProviderPing: boolean;
    events: EventEmitter<string | symbol, any>;
    private isAvailable;
    private registering;
    constructor(url: string, disableProviderPing?: boolean);
    get connected(): boolean;
    get connecting(): boolean;
    on(event: string, listener: any): void;
    once(event: string, listener: any): void;
    off(event: string, listener: any): void;
    removeListener(event: string, listener: any): void;
    open(url?: string): Promise<void>;
    close(): Promise<void>;
    send(payload: JsonRpcPayload): Promise<void>;
    private register;
    private onOpen;
    private onClose;
    private onPayload;
    private onError;
    private parseError;
}
