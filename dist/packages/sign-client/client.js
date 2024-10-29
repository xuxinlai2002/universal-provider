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
Object.defineProperty(exports, "__esModule", { value: true });
exports.SignClient = void 0;
const core_1 = require("@xuxinlai2002/core");
const namespaces_1 = require("../utils/namespaces");
const utils_1 = require("../../provider/utils");
class SignClient extends core_1.ISignClient {
    constructor(metaData) {
        super(metaData);
        this.engine = new core_1.Engine(new core_1.ConnectionManager());
        // ---------- Engine ----------------------------------------------- //
        this.connect = (params) => __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, reject) => {
                var connectRequest = [];
                var requestAccountItem = {
                    name: "requestAccounts",
                    requiredNamespaces: (0, namespaces_1.nameSpaceToConnectWalletNameSpace)(params.namespaces),
                    optionalNamespaces: (0, namespaces_1.nameSpaceToConnectWalletNameSpace)(params.optionalNamespaces)
                };
                connectRequest.push(requestAccountItem);
                try {
                    this.engine.conect(connectRequest, Object.assign({ dappInfo: this.metadata }, params.sessionConfig), (session) => {
                        if (session) {
                            (0, namespaces_1.fillParamsToSession)(session, params.namespaces, params.optionalNamespaces, this.sessionConfig);
                        }
                        resolve(session);
                    }).then((info) => {
                        this.events.emit("display_uri", info.deeplinkUrl);
                    });
                }
                catch (e) {
                    reject(e);
                }
            });
        });
        this.restoreconnect = (sessionConfig) => __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, reject) => {
                this.engine.restoreconnect(sessionConfig, (session) => {
                    resolve(session);
                });
            });
        });
        this.reject = (params) => __awaiter(this, void 0, void 0, function* () {
            //   try {
            //     return await this.engine.reject(params);
            //   } catch (error: any) {
            //     this.logger.error(error.message);
            //     throw error;
            //   }
        });
        //
        // public update: ISignClient["update"] = async (params) => {
        //   return
        // //   try {
        // //     return await this.engine.update(params);
        // //   } catch (error: any) {
        // //     this.logger.error(error.message);
        // //     throw error;
        // //   }
        // };
        this.request = (params) => __awaiter(this, void 0, void 0, function* () {
            var _a;
            (0, core_1.logDebug)("clint request --params>>>> >", (_a = this.sessionConfig) === null || _a === void 0 ? void 0 : _a.openUniversalUrl, JSON.stringify(params));
            return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
                var _a;
                try {
                    // this.sessionConfig
                    if (((_a = this.sessionConfig) === null || _a === void 0 ? void 0 : _a.openUniversalUrl) && (0, core_1.isIos)()) {
                        this.openOKXWallet();
                    }
                    yield this.engine.send(params, {
                        resolve: (response) => {
                            delete response.requestId;
                            (0, core_1.logDebug)("clint request --response >", JSON.stringify(response));
                            if (('error' in response) && response.error) {
                                let error = response.error;
                                error.message = response.method + ":" + error.message;
                                reject(error);
                            }
                            else {
                                resolve(response);
                            }
                        },
                        onAck: () => {
                            var _a;
                            if (!(0, core_1.isIos)() && ((_a = this.sessionConfig) === null || _a === void 0 ? void 0 : _a.openUniversalUrl)) {
                                this.openOKXWallet();
                            }
                        }
                    });
                }
                catch (e) {
                    reject(e);
                }
            }));
        });
        // public emit: ISignClient["emit"] = async (params) => {
        //     try {
        //         // return await this.engine.emit(params);
        //     } catch (error: any) {
        //         throw error;
        //     }
        // };
        this.disconnect = () => __awaiter(this, void 0, void 0, function* () {
            try {
                return new Promise(resolve => {
                    this.engine.send({
                        method: "disconnect"
                    }, {
                        onAck: () => {
                            resolve();
                        }
                    });
                });
            }
            catch (error) {
                throw error;
            }
        });
        this.events = (0, utils_1.getGlobal)("events");
        this.metadata = metaData;
    }
    openOKXWallet() {
        // if (this.openUniversalUrl){
        (0, core_1.openOKXDeeplinkWithFallback)(core_1.standardDeeplink);
        // }
    }
}
exports.SignClient = SignClient;
