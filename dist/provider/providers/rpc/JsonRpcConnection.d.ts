export const __esModule: boolean;
export class JsonRpcConnection {
    constructor(url: any, disableProviderPing?: boolean);
    url: any;
    disableProviderPing: boolean;
    events: eventemitter3_1.EventEmitter<string | symbol, any>;
    isAvailable: boolean;
    registering: boolean;
    get connected(): boolean;
    get connecting(): boolean;
    on(event: any, listener: any): void;
    once(event: any, listener: any): void;
    off(event: any, listener: any): void;
    removeListener(event: any, listener: any): void;
    open(...args: any[]): any;
    close(): any;
    send(payload: any): any;
    register(...args: any[]): any;
    onOpen(): void;
    onClose(): void;
    onPayload(e: any): void;
    onError(id: any, e: any): void;
    parseError(e: any, url?: any): Error;
}
import eventemitter3_1 = require("eventemitter3");
