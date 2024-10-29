"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getRpcUrl = getRpcUrl;
exports.getChainId = getChainId;
exports.validateChainApproval = validateChainApproval;
exports.getChainsFromApprovedSession = getChainsFromApprovedSession;
exports.getAccountsFromSession = getAccountsFromSession;
exports.mergeRequiredOptionalNamespaces = mergeRequiredOptionalNamespaces;
exports.normalizeNamespaces = normalizeNamespaces;
exports.parseCaip10Account = parseCaip10Account;
exports.convertChainIdToNumber = convertChainIdToNumber;
exports.parseChainId = parseChainId;
exports.mergeArrays = mergeArrays;
const core_1 = require("@xuxinlai2002/core");
const namespaces_1 = require("../../packages/utils/namespaces");
const lodash_1 = __importDefault(require("lodash"));
function getRpcUrl(chainId, rpc, projectId) {
    var _a;
    const chain = parseChainId(chainId);
    // no default
    return (((_a = rpc.rpcMap) === null || _a === void 0 ? void 0 : _a[chain.reference]) ||
        ``);
}
function getChainId(chain) {
    return chain.includes(":") ? chain.split(":")[1] : chain;
}
function validateChainApproval(chain, chains) {
    if (!chains.includes(chain)) {
        throw new Error(`Chain '${chain}' not approved. Please use one of the following: ${chains.toString()}`);
    }
}
function getChainsFromApprovedSession(accounts) {
    return accounts.map((address) => `${address.split(":")[0]}:${address.split(":")[1]}`);
}
function getAccountsFromSession(namespace, session) {
    // match namespaces e.g. eip155 with eip155:1
    const matchedNamespaceKeys = Object.keys(session.namespaces).filter((key) => key.includes(namespace));
    if (!matchedNamespaceKeys.length)
        return [];
    const accounts = [];
    matchedNamespaceKeys.forEach((key) => {
        const accountsForNamespace = session.namespaces[key].accounts;
        accounts.push(...accountsForNamespace);
    });
    return accounts;
}
function mergeRequiredOptionalNamespaces(required = {}, optional = {}) {
    const requiredNamespaces = normalizeNamespaces(required);
    const optionalNamespaces = normalizeNamespaces(optional);
    return lodash_1.default.merge(requiredNamespaces, optionalNamespaces);
}
/**
 * Converts
 * {
 *  "eip155:1": {...},
 *  "eip155:2": {...},
 * }
 * into
 * {
 *  "eip155": {
 *      chains: ["eip155:1", "eip155:2"],
 *      ...
 *    }
 * }
 *
 */
function normalizeNamespaces(namespaces) {
    var _a, _b;
    const normalizedNamespaces = {};
    if (!(0, core_1.isValidObject)(namespaces))
        return normalizedNamespaces;
    for (const [key, values] of Object.entries(namespaces)) {
        const chains = (0, namespaces_1.isCaipNamespace)(key) ? [key] : values.chains;
        const rpcMap = values.rpcMap || {};
        const normalizedKey = (0, namespaces_1.parseNamespaceKey)(key);
        normalizedNamespaces[normalizedKey] = Object.assign(Object.assign(Object.assign({}, normalizedNamespaces[normalizedKey]), values), { chains: mergeArrays(chains, (_a = normalizedNamespaces[normalizedKey]) === null || _a === void 0 ? void 0 : _a.chains), rpcMap: Object.assign(Object.assign({}, rpcMap), (_b = normalizedNamespaces[normalizedKey]) === null || _b === void 0 ? void 0 : _b.rpcMap) });
    }
    return normalizedNamespaces;
}
function parseCaip10Account(caip10Account) {
    return caip10Account.includes(":") ? caip10Account.split(":")[2] : caip10Account;
}
/**
 * Populates the chains array for each namespace with the chains extracted from the accounts if are otherwise missing
 */
// export function populateNamespacesChains(
//   namespaces: SessionTypes.Namespaces,
// ): Record<string, SessionTypes.Namespace> {
//   const parsedNamespaces: Record<string, SessionTypes.Namespace> = {};
//   for (const [key, values] of Object.entries(namespaces)) {
//     const methods = values.methods || [];
//     const events = values.events || [];
//     const accounts = values.accounts || [];
//     // If the key includes a CAIP separator `:` we know it's a namespace + chainId (e.g. `eip155:1`)
//     const chains = isCaipNamespace(key)
//       ? [key]
//       : values.chains
//       ? values.chains
//       : getChainsFromApprovedSession(values.accounts);
//     parsedNamespaces[key] = {
//       chains,
//       methods,
//       events,
//       accounts,
//     };
//   }
//   return parsedNamespaces;
// }
function convertChainIdToNumber(chainId) {
    if (typeof chainId === "number")
        return chainId;
    if (chainId.includes("0x")) {
        return parseInt(chainId, 16);
    }
    chainId = chainId.includes(":") ? chainId.split(":")[1] : chainId;
    return isNaN(Number(chainId)) ? chainId : Number(chainId);
}
const CAIP_DELIMITER = ":";
function parseChainId(chain) {
    const [namespace, reference] = chain.split(CAIP_DELIMITER);
    return { namespace, reference };
}
function mergeArrays(a = [], b = []) {
    return [...new Set([...a, ...b])];
}
