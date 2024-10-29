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
const constants_1 = require("../constants");
const core_1 = require("@xuxinlai2002/core");
const utils_1 = require("../utils");
const JsonRpcConnection_1 = require("./rpc/JsonRpcConnection");
const JsonRpcProvider_1 = require("./rpc/JsonRpcProvider");
class SolanaProvider {
    constructor(opts, name) {
        this.name = "solana";
        this.namespace = opts.namespace;
        this.events = (0, utils_1.getGlobal)("events");
        this.client = (0, utils_1.getGlobal)("client");
        this.chainId = this.getDefaultChain();
        this.httpProviders = this.createHttpProviders();
        this.name = name;
    }
    updateNamespace(namespace) {
        this.namespace = Object.assign(this.namespace, namespace);
    }
    requestAccounts() {
        return this.getAccounts();
    }
    request(args) {
        return __awaiter(this, void 0, void 0, function* () {
            (0, core_1.logDebug)("solana request --args--string>", JSON.stringify(args));
            (0, core_1.logDebug)("solana provider namespace: ", this.namespace);
            if (this.namespace.methods.includes(args.method)) {
                return this.client.request(args);
            }
            return this.getHttpProvider().request(args);
        });
    }
    setDefaultChain(chainId, rpcUrl) {
        // http provider exists so just set the chainId
        if (!this.httpProviders[chainId]) {
            this.setHttpProvider(chainId, rpcUrl);
        }
        this.chainId = chainId;
        this.events.emit(constants_1.PROVIDER_EVENTS.DEFAULT_CHAIN_CHANGED, `${this.name}:${chainId}`);
    }
    getDefaultChain() {
        if (this.chainId)
            return this.chainId;
        if (this.namespace.defaultChain)
            return this.namespace.defaultChain;
        const chainId = this.namespace.chains[0];
        if (!chainId)
            throw new Error(`ChainId not found`);
        return chainId.split(":")[1];
    }
    // --------- PRIVATE --------- //
    getAccounts() {
        const accounts = this.namespace.accounts;
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
    createHttpProviders() {
        const http = {};
        this.namespace.chains.forEach((chain) => {
            const parsedChainId = (0, utils_1.getChainId)(chain);
            const parsedRpc = (0, utils_1.getRpcUrl)(chain, this.namespace);
            let httpProvider = this.createHttpProvider(parsedChainId, parsedRpc);
            if (httpProvider) {
                http[parsedChainId] = httpProvider;
            }
        });
        return http;
    }
    getHttpProvider() {
        const chain = `${this.chainId}`;
        const http = this.httpProviders[chain];
        if (typeof http === "undefined") {
            throw new Error(`JSON-RPC provider for ${chain} not found`);
        }
        return http;
    }
    setHttpProvider(chainId, rpcUrl) {
        const http = this.createHttpProvider(chainId, rpcUrl);
        if (http) {
            this.httpProviders[chainId] = http;
        }
    }
    createHttpProvider(chainId, rpcUrl) {
        // 没有备用rpc对外提供
        const rpc = rpcUrl;
        if (!rpc) {
            (0, core_1.logError)(`No RPC url provided for chainId: ${chainId}`);
            // throw new Error(`No RPC url provided for chainId: ${chainId}`);
        }
        else {
            const http = new JsonRpcProvider_1.JsonRpcProvider(new JsonRpcConnection_1.JsonRpcConnection(rpc, (0, utils_1.getGlobal)("disableProviderPing")));
            return http;
        }
    }
    getPubkey(chainId) {
        return this.getWalletAddress(chainId);
    }
    //   {
    //     "chains": ["solana:5eykt4UsFv8P8NJdTREpY1vzqKqZKvdp" ],
    //     "accounts": ["solana:5eykt4UsFv8P8NJdTREpY1vzqKqZKvdp:F7wnJc5wiBGy1k87jv6gyNwE3jMEWd18oTQiYsF1xVG7"],
    //     "methods": [
    //         "solana_signTransaction",
    //         "solana_signMessage"
    //     ],
    //     "defaultChain": "5eykt4UsFv8P8NJdTREpY1vzqKqZKvdp"
    // }
    // TODO:确认上面的defaultChain是否正确（没有solana前缀）
    getWalletAddress(chainId) {
        if (!chainId) {
            chainId = this.namespace.defaultChain;
            if (!(chainId === null || chainId === void 0 ? void 0 : chainId.startsWith("solana"))) {
                chainId = `solana:${chainId}`;
            }
        }
        return this.namespace.accounts.filter(function (account) {
            let components = account.split(":");
            return components.length > 2 && account.startsWith(chainId);
        }).map(function (account) {
            let components = account.split(":");
            return components[2];
        })[0];
    }
}
exports.default = SolanaProvider;
