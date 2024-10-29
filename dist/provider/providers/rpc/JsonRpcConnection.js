"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try {
            step(generator.next(value));
        }
        catch (e) {
            reject(e);
        } }
        function rejected(value) { try {
            step(generator["throw"](value));
        }
        catch (e) {
            reject(e);
        } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.JsonRpcConnection = void 0;
const eventemitter3_1 = require("eventemitter3");
const cross_fetch_1 = __importDefault(require("cross-fetch"));
const core_1 = require("@xuxinlai2002/core");
const core_2 = require("@xuxinlai2002/core");
const DEFAULT_HTTP_HEADERS = {
    Accept: "application/json",
    "Content-Type": "application/json",
};
const DEFAULT_HTTP_METHOD = "POST";
const DEFAULT_FETCH_OPTS = {
    headers: DEFAULT_HTTP_HEADERS,
    method: DEFAULT_HTTP_METHOD,
};
// Source: https://nodejs.org/api/events.html#emittersetmaxlistenersn
const EVENT_EMITTER_MAX_LISTENERS_DEFAULT = 10;
class JsonRpcConnection {
    constructor(url, disableProviderPing = false) {
        this.url = url;
        this.disableProviderPing = disableProviderPing;
        this.events = new eventemitter3_1.EventEmitter();
        this.isAvailable = false;
        this.registering = false;
        if (!(0, core_2.isHttpUrl)(url)) {
            throw new Error(`Provided URL is not compatible with HTTP connection: ${url}`);
        }
        this.url = url;
        this.disableProviderPing = disableProviderPing;
    }
    get connected() {
        return this.isAvailable;
    }
    get connecting() {
        return this.registering;
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
    open() {
        return __awaiter(this, arguments, void 0, function* (url = this.url) {
            yield this.register(url);
        });
    }
    close() {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.isAvailable) {
                throw new Error("Connection already closed");
            }
            this.onClose();
        });
    }
    send(payload) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.isAvailable) {
                yield this.register();
            }
            try {
                const body = (0, core_1.safeJsonStringify)(payload);
                const res = yield (0, cross_fetch_1.default)(this.url, Object.assign(Object.assign({}, DEFAULT_FETCH_OPTS), { body }));
                const data = yield res.json();
                this.onPayload({ data });
            }
            catch (e) {
                this.onError(payload.id, e);
            }
        });
    }
    // ---------- Private ----------------------------------------------- //
    register() {
        return __awaiter(this, arguments, void 0, function* (url = this.url) {
            if (!(0, core_2.isHttpUrl)(url)) {
                throw new Error(`Provided URL is not compatible with HTTP connection: ${url}`);
            }
            if (this.registering) {
                return new Promise((resolve, reject) => {
                    this.events.once("register_error", (error) => {
                        reject(error);
                    });
                    this.events.once("open", () => {
                        if (typeof this.isAvailable === "undefined") {
                            return reject(new Error("HTTP connection is missing or invalid"));
                        }
                        resolve();
                    });
                });
            }
            this.url = url;
            this.registering = true;
            try {
                if (!this.disableProviderPing) {
                    const body = (0, core_1.safeJsonStringify)({ id: 1, jsonrpc: "2.0", method: "test", params: [] });
                    yield (0, cross_fetch_1.default)(url, Object.assign(Object.assign({}, DEFAULT_FETCH_OPTS), { body }));
                }
                this.onOpen();
            }
            catch (e) {
                const error = this.parseError(e);
                this.events.emit("register_error", error);
                this.onClose();
                throw error;
            }
        });
    }
    onOpen() {
        this.isAvailable = true;
        this.registering = false;
        this.events.emit("open");
    }
    onClose() {
        this.isAvailable = false;
        this.registering = false;
        this.events.emit("close");
    }
    onPayload(e) {
        if (typeof e.data === "undefined")
            return;
        const payload = typeof e.data === "string" ? (0, core_1.safeJsonParse)(e.data) : e.data;
        this.events.emit("payload", payload);
    }
    onError(id, e) {
        const error = this.parseError(e);
        const message = error.message || error.toString();
        const payload = (0, core_2.formatJsonRpcError)(id, message);
        this.events.emit("payload", payload);
    }
    parseError(e, url = this.url) {
        return (0, core_2.parseConnectionError)(e, url, "HTTP");
    }
}
exports.JsonRpcConnection = JsonRpcConnection;
