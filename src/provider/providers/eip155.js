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
const utils_1 = require("../utils");
const constants_1 = require("../constants");
const core_1 = require("@xuxinlai2002/core");
const JsonRpcProvider_1 = require("./rpc/JsonRpcProvider");
const JsonRpcConnection_1 = require("./rpc/JsonRpcConnection");
class Eip155Provider {
    constructor(opts) {
        this.name = "eip155";
        this.namespace = opts.namespace;
        this.events = (0, utils_1.getGlobal)("events");
        this.client = (0, utils_1.getGlobal)("client");
        this.chainId = parseInt(this.getDefaultChain());
        // rpc
        this.httpProviders = this.createHttpProviders();
        (0, core_1.logDebug)("eip155 constructor --opts.namespace-->", opts.namespace);
    }
    isRecord(value) {
        return typeof value === "object" && value !== null && !Array.isArray(value);
    }
    isArray(value) {
        return typeof value === "object" && value !== null && Array.isArray(value);
    }
    updateRequestParams(args) {
        let isDic = args.params && typeof args.params === 'object' && !Array.isArray(args.params);
        if (args.method === 'wallet_switchEthereumChain') {
            const switchChainId = args.chainId.split(":")[1];
            // const hexChainId = parseInt(switchChainId, 16);
            const decimalNumber = parseInt(switchChainId, 10);
            if (isNaN(decimalNumber)) {
                throw new core_1.OKXConnectError(core_1.OKX_CONNECT_ERROR_CODES.NOT_CONNECTED_ERROR, `Invalid decimal number,  chainId: '${switchChainId}' `);
            }
            if (!args.params) {
                args.params = { chainId: '0x' + decimalNumber.toString(16) };
            }
            else if (isDic) { //为 Record<string, unknown>
                let params = args.params;
                if (!('chainId' in params)) {
                    params['chainId'] = '0x' + decimalNumber.toString(16);
                    args.params = params;
                }
            }
            else {
                throw new core_1.OKXConnectError(core_1.OKX_CONNECT_ERROR_CODES.NOT_CONNECTED_ERROR, `Request params error ,  method: '${args.method}' `);
            }
        }
        else if (args.method === 'personal_sign'
            || args.method === 'eth_signTypedData_v4'
            || args.method === 'eth_sendTransaction'
            || args.method === 'wallet_watchAsset') {
            if (!args.params) {
                throw new core_1.OKXConnectError(core_1.OKX_CONNECT_ERROR_CODES.NOT_CONNECTED_ERROR, `Request params is nil, method: '${args.method}'`);
            }
            if (this.isRecord(args.params)) {
                let params = args.params;
                (0, core_1.logDebug)("eip155 updateRequestParams params>", JSON.stringify(params));
                if ('chainId' in params) {
                    const selectedChainId = args.chainId.split(":")[1];
                    const chainNum = parseInt(selectedChainId, 10);
                    let paramsChainString = String(params.chainId);
                    let paramsChainId;
                    if (paramsChainString.startsWith(this.name) && args.chainId === paramsChainString) { //为
                        paramsChainId = chainNum;
                    }
                    else if (paramsChainString.startsWith("0x")) {
                        paramsChainId = parseInt(paramsChainString, 16);
                    }
                    else if (!isNaN(Number(paramsChainString))) { //数字
                        paramsChainId = parseInt(paramsChainString, 10);
                    }
                    else {
                        throw new core_1.OKXConnectError(core_1.OKX_CONNECT_ERROR_CODES.NOT_CONNECTED_ERROR, `Invalid params.chainId format, method: '${args.method}'`);
                    }
                    if (chainNum !== paramsChainId) {
                        throw new core_1.OKXConnectError(core_1.OKX_CONNECT_ERROR_CODES.NOT_CONNECTED_ERROR, `Request params.chainId not equal chain,  method: '${args.method}' `);
                    }
                }
            }
            else {
                throw new core_1.OKXConnectError(core_1.OKX_CONNECT_ERROR_CODES.NOT_CONNECTED_ERROR, `Invalid request params type, method: '${args.method}'`);
            }
        }
    }
    //adapt array
    adaptArray(args) {
        if (args.method === 'wallet_switchEthereumChain'
            || args.method === 'wallet_addEthereumChain'
            || args.method === 'wallet_watchAsset'
            || args.method === 'eth_sendTransaction') {
            if (this.isArray(args.params)) {
                let paramsArr = args.params;
                if (paramsArr) {
                    if (paramsArr.length === 1) {
                        let firstParam = args.params[0];
                        if (this.isRecord(firstParam)) {
                            args.params = firstParam;
                        }
                    }
                    else if (paramsArr.length > 1) {
                        throw new core_1.OKXConnectError(core_1.OKX_CONNECT_ERROR_CODES.UNKNOWN_ERROR, `Request params only Support one data,  method: '${args.method}' `);
                    }
                    else {
                        throw new core_1.OKXConnectError(core_1.OKX_CONNECT_ERROR_CODES.UNKNOWN_ERROR, `Request params is nil,  method: '${args.method}' `);
                    }
                }
            }
        }
        else if (args.method === 'eth_signTypedData_v4') {
            if (this.isArray(args.params)) {
                let paramsArr = args.params;
                if (paramsArr && paramsArr.length > 2) {
                    throw new core_1.OKXConnectError(core_1.OKX_CONNECT_ERROR_CODES.UNKNOWN_ERROR, `Request params only Support one data,  method: '${args.method}' `);
                }
                else if (paramsArr && paramsArr.length === 0) {
                    throw new core_1.OKXConnectError(core_1.OKX_CONNECT_ERROR_CODES.UNKNOWN_ERROR, `Request params is nil,  method: '${args.method}' `);
                }
                let messageObj = {};
                if (paramsArr && paramsArr.length === 2) {
                    let addressObj = args.params[0]; //address
                    if (addressObj && typeof addressObj === 'string') { //check address
                        let isEqual = false;
                        this.namespace.accounts.forEach((chain) => {
                            let chainAddress = chain.split(':')[2];
                            if (chainAddress === addressObj) {
                                isEqual = true;
                            }
                        });
                        (0, core_1.logDebug)("eip155 adaptArray eth_signTypedData_v4 >>>isEqual: ", isEqual);
                        if (!isEqual) {
                            throw new core_1.OKXConnectError(core_1.OKX_CONNECT_ERROR_CODES.UNKNOWN_ERROR, `Request params address error, not equal,  method: '${args.method}' `);
                        }
                        if (this.isRecord(args.params[1])) {
                            messageObj = args.params[1];
                        }
                        else {
                            throw new core_1.OKXConnectError(core_1.OKX_CONNECT_ERROR_CODES.UNKNOWN_ERROR, `Request params message data error,  method: '${args.method}' `);
                        }
                    }
                    else {
                        throw new core_1.OKXConnectError(core_1.OKX_CONNECT_ERROR_CODES.UNKNOWN_ERROR, `Request params address error , not string,  method: '${args.method}' `);
                    }
                }
                else if (paramsArr && paramsArr.length === 1) {
                    if (this.isRecord(args.params[0])) {
                        messageObj = args.params[0];
                    }
                    else {
                        throw new core_1.OKXConnectError(core_1.OKX_CONNECT_ERROR_CODES.UNKNOWN_ERROR, `Request params message data error,  method: '${args.method}' `);
                    }
                }
                try {
                    let messages = JSON.stringify(messageObj);
                    args.params = {
                        typedDataJson: messages
                    };
                }
                catch (err) {
                    throw new core_1.OKXConnectError(core_1.OKX_CONNECT_ERROR_CODES.UNKNOWN_ERROR, `Request params call JSON.stringify() failed,  method: '${args.method}' `);
                }
            }
        }
        else if (args.method === 'personal_sign') {
            if (this.isArray(args.params)) {
                if (args.params && args.params.length > 2) {
                    throw new core_1.OKXConnectError(core_1.OKX_CONNECT_ERROR_CODES.UNKNOWN_ERROR, `Request params error,  method: '${args.method}' `);
                }
                else if (args.params && args.params.length === 0) {
                    throw new core_1.OKXConnectError(core_1.OKX_CONNECT_ERROR_CODES.UNKNOWN_ERROR, `Request params is nil,  method: '${args.method}' `);
                }
                let firstObj = args.params[0];
                let secondObj = args.params[1];
                if (secondObj && typeof secondObj === 'string') { //check address
                    let isEqual = false;
                    this.namespace.accounts.forEach((chain) => {
                        let chainAddress = chain.split(':')[2];
                        if (chainAddress === secondObj) {
                            isEqual = true;
                        }
                    });
                    (0, core_1.logDebug)("eip155 adaptArray personal_sign >>>isEqual: ", isEqual);
                    if (!isEqual) {
                        throw new core_1.OKXConnectError(core_1.OKX_CONNECT_ERROR_CODES.UNKNOWN_ERROR, `Request params address error,  method: '${args.method}' `);
                    }
                }
                if (firstObj && typeof firstObj === 'string') {
                    args.params = {
                        message: firstObj
                    };
                }
                else {
                    throw new core_1.OKXConnectError(core_1.OKX_CONNECT_ERROR_CODES.UNKNOWN_ERROR, `Request params is error,  method: '${args.method}' `);
                }
            }
        }
    }
    request(args) {
        return __awaiter(this, void 0, void 0, function* () {
            this.adaptArray(args);
            (0, core_1.logDebug)("eip155 request --args--string>", JSON.stringify(args));
            this.updateRequestParams(args);
            (0, core_1.logDebug)("eip155 request --params--string>", JSON.stringify(args));
            switch (args.method) {
                case "eth_requestAccounts":
                    return this.getAccounts();
                case "eth_accounts":
                    return this.getAccounts();
                case "eth_chainId":
                    return parseInt(this.getDefaultChain());
                case "wallet_switchEthereumChain": {
                    return (yield this.handleSwitchChain(args));
                }
                case "wallet_addEthereumChain":
                    return this.addEthereumChain(args);
                default:
                    break;
            }
            if (this.namespace.methods.includes(args.method)) {
                // personal_sign
                // eth_signTypedData_v4
                // eth_sendTransaction
                // wallet_watchAsset
                return yield this.client.request(args)
                    .then(response => {
                    (0, core_1.logDebug)("eip155 request --response----string>", JSON.stringify(response));
                    if (this.isRecord(response)) {
                        if ('result' in response) {
                            let result = response.result;
                            if (result && typeof result === 'string' && (result === "true" || result === "false")) {
                                (0, core_1.logDebug)("eip155 request --wallet_watchAsset>>>>", result === "true");
                                return result === "true";
                            }
                            return response.result;
                        }
                    }
                    return response;
                })
                    .catch(error => {
                    (0, core_1.logDebug)("eip155 request --response --error--string>", JSON.stringify(error));
                    throw error;
                });
            }
            else {
                (0, core_1.logDebug)('[RPC] request begin');
                return yield this.getHttpProvider().request(args);
            }
        });
    }
    addEthereumChain(args) {
        return __awaiter(this, void 0, void 0, function* () {
            let resultData = (yield this.client.request(args));
            try {
                if ('result' in resultData) {
                    let successData = resultData;
                    let account = resultData.result;
                    if (account) {
                        const nameSpace = account.split(":")[0];
                        const chainId = account.split(":")[1];
                        const chain = nameSpace + ':' + chainId;
                        let newNameSpace = this.namespace;
                        this.namespace.accounts.push(account);
                        this.namespace.chains.push(chain);
                        if (this.isRecord(args.params)) {
                            if ("rpcUrls" in args.params) {
                                let rpcUrls = args.params.rpcUrls;
                                let rpcUrl = rpcUrls ? rpcUrls[0] : undefined;
                                if (rpcUrl) {
                                    if (this.namespace.rpcMap) {
                                        this.namespace.rpcMap[chainId] = rpcUrl;
                                    }
                                    else {
                                        this.namespace.rpcMap = {
                                            [chainId]: rpcUrl
                                        };
                                    }
                                    this.setHttpProvider(chainId, rpcUrl);
                                }
                            }
                        }
                        this.events.emit(constants_1.PROVIDER_EVENTS.UPDATE_NAMESPACES, {
                            eip155: this.namespace
                        });
                    }
                }
                else {
                    new core_1.OKXConnectError(core_1.OKX_CONNECT_ERROR_CODES.UNKNOWN_ERROR, `the method ${args.method} request error`);
                }
            }
            catch (error) {
                throw new core_1.OKXConnectError(core_1.OKX_CONNECT_ERROR_CODES.UNKNOWN_ERROR, `the method ${args.method} request  error`);
            }
            return null;
        });
    }
    updateNamespace(namespace) {
        this.namespace = Object.assign(this.namespace, namespace);
    }
    setDefaultChain(chainId, rpcUrl) {
        this.chainId = parseInt(chainId);
        // set rpc
        if (!this.httpProviders[chainId]) {
            const rpc = rpcUrl || (0, utils_1.getRpcUrl)(`${this.name}:${chainId}`, this.namespace);
            if (!rpc) {
                // throw new Error(`No RPC url provided for chainId: ${chainId}`);
                (0, core_1.logError)(`No RPC url provided for chainId: ${chainId}`);
            }
            else {
                this.setHttpProvider(chainId, rpc);
            }
        }
        this.events.emit(constants_1.PROVIDER_EVENTS.DEFAULT_CHAIN_CHANGED, `${this.name}:${chainId}`);
    }
    requestAccounts() {
        return this.getAccounts();
    }
    getDefaultChain() {
        if (this.chainId)
            return this.chainId.toString();
        if (this.namespace.defaultChain)
            return this.namespace.defaultChain;
        const chainId = this.namespace.chains[0];
        if (!chainId)
            throw new Error(`ChainId not found`);
        return chainId.split(":")[1];
    }
    // ---------- Private ----------------------------------------------- //
    getAccounts() {
        const accounts = this.namespace.accounts;
        (0, core_1.logDebug)("eip155 getAccounts ", accounts, this.chainId);
        if (!accounts) {
            return [];
        }
        return [
            ...new Set(accounts
                // get the accounts from the active chain
                .filter((account) => account.split(":")[1] === this.chainId.toString())
                // remove namespace & chainId from the string
                .map((account) => account.split(":")[2])),
        ];
    }
    handleSwitchChain(args) {
        return __awaiter(this, void 0, void 0, function* () {
            let params = args.params;
            let hexChainId = "0x0";
            if (params && "chainId" in params) {
                hexChainId = params.chainId;
            }
            hexChainId = hexChainId.startsWith("0x") ? hexChainId : `0x${hexChainId}`;
            (0, core_1.logDebug)("handleSwitchChain -->args ", args);
            (0, core_1.logDebug)("handleSwitchChain -->hexChainId ", hexChainId);
            const parsedChainId = parseInt(hexChainId, 16);
            (0, core_1.logDebug)("handleSwitchChain -->parsedChainId ", parsedChainId);
            if (this.isChainApproved(parsedChainId)) {
                this.setDefaultChain(`${parsedChainId}`);
            }
            else {
                const resultData = (yield this.client.request({
                    method: "wallet_switchEthereumChain",
                    chainId: args.chainId,
                    params: {
                        chainId: hexChainId,
                    },
                }));
                try {
                    if ('result' in resultData) {
                        let successData = resultData;
                        let account = resultData.result;
                        if (account) {
                            const nameSpace = account.split(":")[0];
                            const chainId = account.split(":")[1];
                            const chain = nameSpace + ':' + chainId;
                            let newNameSpace = this.namespace;
                            this.namespace.accounts.push(account);
                            this.namespace.chains.push(chain);
                            (0, core_1.logDebug)("handleSwitchChain -->wallet_switchEthereumChain ", resultData);
                            this.setDefaultChain(`${parsedChainId}`);
                            this.events.emit(constants_1.PROVIDER_EVENTS.UPDATE_NAMESPACES, {
                                eip155: this.namespace
                            });
                        }
                    }
                    else {
                        new core_1.OKXConnectError(core_1.OKX_CONNECT_ERROR_CODES.UNKNOWN_ERROR, `the method ${args.method} request error`);
                    }
                }
                catch (error) {
                    throw new core_1.OKXConnectError(core_1.OKX_CONNECT_ERROR_CODES.UNKNOWN_ERROR, `the method ${args.method} request  error`);
                }
            }
            return null;
        });
    }
    isChainApproved(chainId) {
        return this.namespace.chains.includes(`${this.name}:${chainId}`);
    }
    // rpc
    createHttpProvider(chainId, rpcUrl) {
        // 没有备用rpc对外提供
        const rpc = rpcUrl;
        if (!rpc) {
            (0, core_1.logError)(`No RPC url provided for chainId: ${chainId}`);
            //   throw new Error(`No RPC url provided for chainId: ${chainId}`);
        }
        else {
            const http = new JsonRpcProvider_1.JsonRpcProvider(new JsonRpcConnection_1.JsonRpcConnection(rpc, (0, utils_1.getGlobal)("disableProviderPing")));
            return http;
        }
    }
    createHttpProviders() {
        const http = {};
        this.namespace.chains.forEach((chain) => {
            const parsedChainId = (0, utils_1.getChainId)(chain);
            const parsedRpc = (0, utils_1.getRpcUrl)(chain, this.namespace);
            (0, core_1.logDebug)('get parsed chain and rpc:', parsedChainId, parsedRpc);
            let httpProvider = this.createHttpProvider(parsedChainId, parsedRpc);
            if (httpProvider) {
                http[parsedChainId] = httpProvider;
            }
        });
        (0, core_1.logDebug)('get http providermap:', http);
        return http;
    }
    setHttpProvider(chainId, rpcUrl) {
        const http = this.createHttpProvider(chainId, rpcUrl);
        if (http) {
            this.httpProviders[chainId] = http;
        }
    }
    getHttpProvider() {
        const chain = `${this.chainId}`;
        const http = this.httpProviders[chain];
        (0, core_1.logDebug)('[RPC] get http provider:', chain, http);
        if (typeof http === "undefined") {
            throw new Error(`JSON-RPC provider for ${chain} not found`);
        }
        return http;
    }
}
exports.default = Eip155Provider;
