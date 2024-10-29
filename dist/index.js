"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function (o, m, k, k2) {
    if (k2 === undefined)
        k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
        desc = { enumerable: true, get: function () { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function (o, m, k, k2) {
    if (k2 === undefined)
        k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function (m, exports) {
    for (var p in m)
        if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p))
            __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OKXConnectError = exports.OKX_CONNECT_ERROR_CODES = exports.NameSpaceKeySui = exports.OKXUniversalProvider = void 0;
__exportStar(require("./provider/types"), exports);
var OKXUniversalProvider_1 = require("./OKXUniversalProvider");
Object.defineProperty(exports, "OKXUniversalProvider", { enumerable: true, get: function () { return OKXUniversalProvider_1.OKXUniversalProvider; } });
var core_1 = require("@okxconnect/core");
Object.defineProperty(exports, "NameSpaceKeySui", { enumerable: true, get: function () { return core_1.NameSpaceKeySui; } });
Object.defineProperty(exports, "OKX_CONNECT_ERROR_CODES", { enumerable: true, get: function () { return core_1.OKX_CONNECT_ERROR_CODES; } });
Object.defineProperty(exports, "OKXConnectError", { enumerable: true, get: function () { return core_1.OKXConnectError; } });
