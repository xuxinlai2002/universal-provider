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
const core_1 = require("@okxconnect/core");
const utils_1 = require("../utils");
const core_2 = require("@okxconnect/core");
class TonProvider {
    constructor(opts) {
        this.namespace = opts.namespace;
        this.client = (0, utils_1.getGlobal)("client");
    }
    getDefaultChain() {
        return core_1.TONCHAIN.MAINNET;
    }
    request(args) {
        return __awaiter(this, void 0, void 0, function* () {
            var requestMethod = args.method;
            throw new core_2.OKXConnectError(core_2.OKX_CONNECT_ERROR_CODES.METHOD_NOT_SUPPORTED, `the method ${requestMethod} not support`);
        });
    }
    requestAccounts() {
        return [];
    }
    setDefaultChain(chainId, rpcUrl) {
    }
    updateNamespace(args) {
    }
}
exports.default = TonProvider;
