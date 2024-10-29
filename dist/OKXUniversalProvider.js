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
exports.OKXUniversalProvider = void 0;
const utils_1 = require("./provider/utils");
const eip155_1 = __importDefault(require("./provider/providers/eip155"));
const sui_1 = __importDefault(require("./provider/providers/sui"));
const constants_1 = require("./provider/constants");
const eventemitter3_1 = __importDefault(require("eventemitter3"));
const client_1 = require("./packages/sign-client/client");
const core_1 = require("@okxconnect/core");
const namespaces_1 = require("./packages/utils/namespaces");
const solana_1 = __importDefault(require("./provider/providers/solana"));
class OKXUniversalProvider {
    static init(opts) {
        return __awaiter(this, void 0, void 0, function* () {
            const provider = new OKXUniversalProvider(opts);
            yield provider.initialize();
            return provider;
        });
    }
    getUniversalProvider() {
        return this;
    }
    constructor(opts) {
        this.rpcProviders = {};
        this.events = new eventemitter3_1.default();
        this.providerOpts = opts;
    }
    request(args, chain) {
        return __awaiter(this, void 0, void 0, function* () {
            (0, core_1.logDebug)("UniversalProvider request args >>>: ", JSON.stringify(args));
            const [namespace, chainId] = this.validateChain(chain);
            if (!this.session) {
                throw new core_1.OKXConnectError(core_1.OKX_CONNECT_ERROR_CODES.UNKNOWN_ERROR, "Please call connect() before request()");
            }
            let keyArr = Object.keys(this.session.namespaces);
            if (!chain && keyArr && keyArr.length > 1) {
                throw new core_1.OKXConnectError(core_1.OKX_CONNECT_ERROR_CODES.NOT_CONNECTED_ERROR, `Multiple chains have been linked, the request method requires chain`);
            }
            (0, core_1.logDebug)("UniversalProvider request >>args>>>: ", args);
            const requestParam = Object.assign(Object.assign({}, args), { chainId: `${namespace}:${chainId}` });
            (0, core_1.logDebug)("UniversalProvider request >>requestParam>>>: ", JSON.stringify(requestParam));
            (0, core_1.logDebug)("UniversalProvider request >>namespace>>>: ", namespace, this.getProvider(namespace));
            return yield this.getProvider(namespace).request(requestParam);
        });
    }
    enable() {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.client) {
                throw new core_1.OKXConnectError(core_1.OKX_CONNECT_ERROR_CODES.UNKNOWN_ERROR, "Sign Client not initialized");
            }
            if (!this.session) {
                if (this.connectOpts) {
                    yield this.connect(this.connectOpts);
                }
                else {
                    throw new core_1.OKXConnectError(core_1.OKX_CONNECT_ERROR_CODES.UNKNOWN_ERROR, "Sign Client not initialized");
                }
            }
            const accounts = yield this.requestAccounts();
            return accounts;
        });
    }
    disconnect() {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.session) {
                throw new core_1.OKXConnectError(core_1.OKX_CONNECT_ERROR_CODES.NOT_CONNECTED_ERROR);
            }
            return new Promise((resolve) => __awaiter(this, void 0, void 0, function* () {
                let called = false;
                const onRequestSent = () => {
                    if (!called) {
                        called = true;
                        this.disconnectAndEmit();
                        this.cleanup().then(resolve);
                    }
                };
                try {
                    yield this.client.disconnect();
                    onRequestSent();
                }
                catch (e) {
                    if (!called) {
                        this.cleanup().then(resolve);
                    }
                }
                finally {
                    onRequestSent();
                }
            }));
        });
    }
    disconnectAndEmit() {
        var _a, _b;
        this.client.engine.connectionManager.disconnect();
        this.events.emit("disconnect", { topic: (_a = this.session) === null || _a === void 0 ? void 0 : _a.topic });
        this.events.emit("session_delete", { topic: (_b = this.session) === null || _b === void 0 ? void 0 : _b.topic });
    }
    connect(opts) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.client) {
                throw new core_1.OKXConnectError(core_1.OKX_CONNECT_ERROR_CODES.UNKNOWN_ERROR, "Sign Client not initialized");
            }
            if (opts.sessionConfig === undefined) {
                opts.sessionConfig = {};
            }
            if (opts.sessionConfig.openUniversalUrl === undefined) {
                opts.sessionConfig.openUniversalUrl = (0, core_1.isMobileUserAgent)();
            }
            this.setNamespaces(opts);
            let session = yield this.client.connect(opts);
            (0, core_1.logDebug)(`UniversalProvider connect success ====> ${JSON.stringify(session)}`);
            if (session) {
                this.session = session;
                this.onConnect();
                return session;
            }
        });
    }
    on(event, listener) {
        this.events.on(event, listener);
    }
    once(event, listener) {
        this.events.once(event, listener);
    }
    removeListener(event, listener) {
        this.events.removeListener(event, listener);
    }
    off(event, listener) {
        this.events.off(event, listener);
    }
    setDefaultChain(chain, rpcUrl) {
        try {
            // ignore without active session
            if (!this.session)
                return;
            const [namespace, chainId] = this.validateChain(chain);
            const provider = this.getProvider(namespace);
            provider.setDefaultChain(chainId, rpcUrl);
        }
        catch (error) {
            // ignore the error if the fx is used prematurely before namespaces are set
            if (!/Please call connect/.test(error.message))
                throw error;
        }
    }
    checkStorage() {
        return __awaiter(this, void 0, void 0, function* () {
            let sessionInfoStr = yield this.getFromStore("connectSession");
            (0, core_1.logDebug)(sessionInfoStr);
            if (sessionInfoStr) {
                let sessionInfo = sessionInfoStr;
                this.session = sessionInfo;
                this.client.session = this.session;
                this.sessionConfig = sessionInfo.sessionConfig;
                this.client.sessionConfig = this.sessionConfig;
                (0, core_1.logDebug)('[evm u-provider] do reconnection', this.session);
                yield this.client.restoreconnect(sessionInfo);
                this.createProviders();
                setTimeout(() => {
                    this.events.emit("reconnect", { session: this.session });
                }, 100);
            }
        });
    }
    initialize() {
        return __awaiter(this, void 0, void 0, function* () {
            const data = Object.assign({ url: window.location.hostname }, this.providerOpts.dappMetaData);
            (0, utils_1.setGlobal)("events", this.events);
            this.client = new client_1.SignClient(data);
            (0, utils_1.setGlobal)("client", this.client);
            yield this.checkStorage();
        });
    }
    createProviders() {
        if (!this.client) {
            throw new core_1.OKXConnectError(core_1.OKX_CONNECT_ERROR_CODES.UNKNOWN_ERROR, "Sign Client not initialized");
        }
        if (!this.session) {
            throw new core_1.OKXConnectError(core_1.OKX_CONNECT_ERROR_CODES.UNKNOWN_ERROR, "Session not initialized. Please call connect() before enable()");
        }
        const providersToCreate = [
            ...new Set(Object.keys(this.session.namespaces).map((namespace) => (0, namespaces_1.parseNamespaceKey)(namespace))),
        ];
        providersToCreate.forEach((namespace) => {
            if (!this.session)
                return;
            const namespacesValue = this.session.namespaces;
            const currentNameSpace = namespacesValue[namespace];
            (0, core_1.logDebug)("init eip155 >> ", currentNameSpace);
            switch (namespace) {
                case "eip155":
                    const opts = {
                        namespace: currentNameSpace
                    };
                    this.rpcProviders[namespace] = new eip155_1.default(opts);
                    break;
                case "solana":
                    const opts1 = {
                        namespace: currentNameSpace
                    };
                    let solanaProvider = new solana_1.default(opts1, "solana");
                    this.rpcProviders[namespace] = solanaProvider;
                    let sonicProvider = new solana_1.default(opts1, "sonic");
                    this.rpcProviders['sonic'] = sonicProvider;
                    let svmProvider = new solana_1.default(opts1, "svm");
                    this.rpcProviders['svm'] = svmProvider;
                    // this.rpcProviders[namespace] = new SolanaProvider(opts1, () => { return this.session; });
                    break;
                case "ton":
                    break;
                case "sui":
                    const optsSui = {
                        namespace: currentNameSpace
                    };
                    let suiProvider = new sui_1.default(optsSui);
                    suiProvider.name = "sui";
                    this.rpcProviders[namespace] = suiProvider;
                    break;
            }
        });
    }
    registerEventListeners() {
        if (typeof this.client === "undefined") {
            throw new core_1.OKXConnectError(core_1.OKX_CONNECT_ERROR_CODES.UNKNOWN_ERROR, "Sign Client is not initialized");
        }
        this.client.engine.addDisconnectListener(() => {
            this.disconnectAndEmit();
            this.cleanup();
        });
        this.on(constants_1.PROVIDER_EVENTS.DEFAULT_CHAIN_CHANGED, (caip2ChainId) => {
            this.onChainChanged(caip2ChainId);
        });
        this.on(constants_1.PROVIDER_EVENTS.UPDATE_NAMESPACES, (nameSpaces) => {
            if (nameSpaces) {
                const nameSpacekey = Object.keys(nameSpaces)[0];
                if (this.session) {
                    this.session.namespaces[nameSpacekey] = nameSpaces[nameSpacekey];
                    if (this.session) {
                        this.persist("connectSession", this.session);
                        this.events.emit("session_update", this.session);
                    }
                    (0, core_1.logDebug)("PROVIDER_EVENTS.UPDATE_NAMESPACES this.session... ->>>", JSON.stringify(this.session));
                }
            }
        });
    }
    getProvider(namespace) {
        (0, core_1.logDebug)('current get providers', this.rpcProviders);
        (0, core_1.logDebug)('query namespace: ', namespace);
        return this.rpcProviders[namespace];
    }
    setNamespaces(params) {
        this.connectOpts = params;
        const { namespaces, sessionConfig } = params;
        const data = {
            url: window.location.hostname,
            name: this.providerOpts.dappMetaData.name,
            icon: this.providerOpts.dappMetaData.icon,
        };
        this.sessionConfig = {
            dappInfo: data,
            openUniversalUrl: sessionConfig === null || sessionConfig === void 0 ? void 0 : sessionConfig.openUniversalUrl,
            redirect: sessionConfig === null || sessionConfig === void 0 ? void 0 : sessionConfig.redirect,
        };
        (0, core_1.logDebug)("setNamespaces sessionConfig>>>", this.sessionConfig);
        this.client.sessionConfig = this.sessionConfig;
        this.persist("sessionConfig", sessionConfig);
    }
    validateChain(chain) {
        var _a;
        let [namespace, chainId] = (chain === null || chain === void 0 ? void 0 : chain.split(":")) || ["", ""];
        if (!this.session || !this.session.namespaces || !Object.keys(this.session.namespaces).length) {
            (0, core_1.logDebug)('get name & chain', namespace, chainId);
            return [namespace, chainId];
        }
        if (namespace) {
            if (!this.isChainNamespaceInSession(namespace)) {
                throw new core_1.OKXConnectError(core_1.OKX_CONNECT_ERROR_CODES.NOT_CONNECTED_ERROR, `Namespace '${namespace}' is not configured. Please call connect() first with namespace config.`);
            }
            if (chainId && chain) {
                (0, core_1.logDebug)('this.session.namespaces -->> ', namespace, JSON.stringify(this.session.namespaces));
                const chainsArr = (_a = this.session.namespaces[namespace]) === null || _a === void 0 ? void 0 : _a.chains;
                (0, core_1.logDebug)('get chainsArr & chain', JSON.stringify(chainsArr), chain);
                if (chainsArr && !chainsArr.includes(chain)) {
                    throw new core_1.OKXConnectError(core_1.OKX_CONNECT_ERROR_CODES.NOT_CONNECTED_ERROR, `Namespace not include the chain '${chain}'`);
                }
            }
        }
        if (namespace && chainId) {
            (0, core_1.logDebug)('get name & chain', namespace, chainId);
            return [namespace, chainId];
        }
        let defaultNamespace = (0, namespaces_1.parseNamespaceKey)(Object.keys(this.session.namespaces)[0]);
        const defaultChain = this.rpcProviders[defaultNamespace].getDefaultChain();
        (0, core_1.logDebug)('get default chain:', defaultChain);
        return [defaultNamespace, defaultChain];
    }
    isChainNamespaceInSession(namespaceStr) {
        var _a, _b;
        if (Object.keys(((_a = this.session) === null || _a === void 0 ? void 0 : _a.namespaces) || {})
            .map((key) => (0, namespaces_1.parseNamespaceKey)(key))
            .includes(namespaceStr)) {
            return true;
        }
        let isChainNamespaceInSession = false;
        Object.values(((_b = this.session) === null || _b === void 0 ? void 0 : _b.namespaces) || {})
            .forEach(namespace => {
            namespace.chains.forEach(chain => {
                if (chain.split(":")[0] == namespaceStr) {
                    isChainNamespaceInSession = true;
                }
            });
        });
        return isChainNamespaceInSession;
    }
    requestAccountsWithNamespace(namespace) {
        return this.getProvider(namespace).requestAccounts();
    }
    requestDefaultChainWithNamespace(namespace) {
        return this.getProvider(namespace).getDefaultChain();
    }
    requestAccounts() {
        return __awaiter(this, void 0, void 0, function* () {
            const [namespace] = this.validateChain();
            return yield this.getProvider(namespace).requestAccounts();
        });
    }
    onChainChanged(caip2Chain) {
        var _a;
        if (!((_a = this.session) === null || _a === void 0 ? void 0 : _a.namespaces))
            return;
        const [namespace, chainId] = this.validateChain(caip2Chain);
        if (!chainId)
            return;
        if (this.session.namespaces[namespace]) {
            this.session.namespaces[namespace].defaultChain = chainId;
            this.persist("connectSession", this.session);
        }
        this.events.emit("chainChanged", chainId);
    }
    onConnect() {
        this.createProviders();
        if (this.session) {
            this.persist("connectSession", this.session);
        }
        this.events.emit("connect", { session: this.session });
        this.registerEventListeners();
    }
    cleanup() {
        return __awaiter(this, void 0, void 0, function* () {
            this.session = undefined;
            this.sessionProperties = undefined;
            this.persist("optionalNamespaces", undefined);
            this.persist("sessionProperties", undefined);
            this.persist("connectSession", undefined);
        });
    }
    persist(key, data) {
        (0, core_1.logDebug)('[evm u-provider] persisit data', key, data);
        return this.client.engine.connectionManager.saveSessionContent(key, data);
    }
    getFromStore(key) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.client.engine.connectionManager.getSessionContent(key);
        });
    }
}
exports.OKXUniversalProvider = OKXUniversalProvider;
exports.default = OKXUniversalProvider;
