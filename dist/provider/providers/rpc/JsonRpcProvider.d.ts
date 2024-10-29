export const __esModule: boolean;
export class JsonRpcProvider extends types_1.IJSONRpcProvider {
    constructor(connection: any);
    hasRegisteredEventListeners: boolean;
    connection: any;
    connect(...args: any[]): any;
    disconnect(): any;
    on(event: any, listener: any): void;
    once(event: any, listener: any): void;
    off(event: any, listener: any): void;
    removeListener(event: any, listener: any): void;
    request(request: any, context: any): any;
    requestStrict(request: any, context: any): any;
    setConnection(connection?: any): any;
    onPayload(payload: any): void;
    onClose(event: any): void;
    open(...args: any[]): any;
    close(): any;
    registerEventListeners(): void;
}
import types_1 = require("../../types");
