"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.JsonRpcProvider = void 0;
const eventemitter3_1 = require("eventemitter3");
const types_1 = require("../../types");
const core_1 = require("@xuxinlai2002/core");
const core_2 = require("@xuxinlai2002/core");
class JsonRpcProvider extends types_1.IJSONRpcProvider {
    constructor(connection) {
        super(connection);
        this.events = new eventemitter3_1.EventEmitter();
        this.connected = false;
        this.connecting = false;
        this.hasRegisteredEventListeners = false;
        this.connection = this.setConnection(connection);
        if (this.connection.connected) {
            this.registerEventListeners();
        }
    }
    connect() {
        return __awaiter(this, arguments, void 0, function* (connection = this.connection) {
            yield this.open(connection);
        });
    }
    disconnect() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.close();
        });
    }
    on(event, listener) {
        this.events.on(event, listener);
    }
    once(event, listener) {
        this.events.once(event, listener);
    }
    off(event, listener) {
        this.events.off(event, listener);
    }
    removeListener(event, listener) {
        this.events.removeListener(event, listener);
    }
    request(request, context) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.requestStrict((0, core_1.formatJsonRpcRequest)(request.method, request.params || [], (0, core_1.getBigIntRpcId)().toString()), // casting to any is required in order to use BigInt as rpcId
            context);
        });
    }
    // ---------- Protected ----------------------------------------------- //
    requestStrict(request, context) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
                if (!this.connection.connected) {
                    try {
                        yield this.open();
                    }
                    catch (e) {
                        reject(e);
                    }
                }
                this.events.on(`${request.id}`, (response) => {
                    if ((0, core_1.isJsonRpcError)(response)) {
                        reject(response.error);
                    }
                    else {
                        resolve(response.result);
                    }
                });
                try {
                    (0, core_2.logDebug)('[RPC] >>> send request', request, context);
                    yield this.connection.send(request, context);
                }
                catch (e) {
                    reject(e);
                }
            }));
        });
    }
    setConnection(connection = this.connection) {
        return connection;
    }
    onPayload(payload) {
        this.events.emit("payload", payload);
        if ((0, core_1.isJsonRpcResponse)(payload)) {
            this.events.emit(`${payload.id}`, payload);
        }
        else {
            this.events.emit("message", {
                type: payload.method,
                data: payload.params,
            });
        }
    }
    onClose(event) {
        // Code 3000 indicates an abnormal closure signalled by the relay -> emit an error in this case.
        if (event && event.code === 3000) {
            this.events.emit("error", new Error(`WebSocket connection closed abnormally with code: ${event.code} ${event.reason ? `(${event.reason})` : ""}`));
        }
        this.events.emit("disconnect");
    }
    open() {
        return __awaiter(this, arguments, void 0, function* (connection = this.connection) {
            if (this.connection === connection && this.connection.connected)
                return;
            if (this.connection.connected)
                this.close();
            if (typeof connection === "string") {
                yield this.connection.open(connection);
                connection = this.connection;
            }
            this.connection = this.setConnection(connection);
            yield this.connection.open();
            this.registerEventListeners();
            this.events.emit("connect");
        });
    }
    close() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.connection.close();
        });
    }
    // ---------- Private ----------------------------------------------- //
    registerEventListeners() {
        if (this.hasRegisteredEventListeners)
            return;
        this.connection.on("payload", (payload) => this.onPayload(payload));
        this.connection.on("close", (event) => this.onClose(event));
        this.connection.on("error", (error) => this.events.emit("error", error));
        this.connection.on("register_error", (_error) => this.onClose());
        this.hasRegisteredEventListeners = true;
    }
}
exports.JsonRpcProvider = JsonRpcProvider;
