"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAccountsChains = getAccountsChains;
exports.nameSpaceToConnectWalletNameSpace = nameSpaceToConnectWalletNameSpace;
exports.fillParamsToSession = fillParamsToSession;
exports.isCaipNamespace = isCaipNamespace;
exports.parseNamespaceKey = parseNamespaceKey;
const core_1 = require("@xuxinlai2002/core");
function getAccountsChains(accounts) {
    const chains = [];
    accounts.forEach((account) => {
        const [chain, chainId] = account.split(":");
        chains.push(`${chain}:${chainId}`);
    });
    return chains;
}
function nameSpaceToConnectWalletNameSpace(namespaces) {
    var result = [];
    if (!namespaces) {
        return result;
    }
    Object.keys(namespaces).forEach((key) => {
        if (key === core_1.NameSpaceKeyEip155 || key === core_1.NameSpaceKeySOL || key === core_1.NameSpaceKeySui) {
            if (namespaces[key].chains) {
                result.push({
                    namespace: key,
                    chains: namespaces[key].chains
                });
            }
        }
    });
    return result;
}
function fillParamsToSession(session, namespaces, optionalNamespaces, sessionConfig) {
    // Helper function to merge rpcMaps
    const mergeRpcMap = (targetRpcMap, sourceRpcMap) => {
        Object.assign(targetRpcMap, sourceRpcMap);
    };
    // Merge function for namespaces
    const mergeNamespaces = (target, source) => {
        for (const key in source) {
            if (source.hasOwnProperty(key) && source[key].rpcMap) {
                if (source[key].rpcMap) {
                    if (!target[key].rpcMap) {
                        target[key].rpcMap = {};
                    }
                    // 合并 rpcMap
                    mergeRpcMap(target[key].rpcMap, source[key].rpcMap);
                }
                if (source[key].defaultChain && target[key].defaultChain === undefined) {
                    //defaultChain need in session nameSpace
                    if (target[key].chains.some(chain => chain.split(":")[1] === source[key].defaultChain)) {
                        target[key].defaultChain = source[key].defaultChain;
                    }
                }
            }
        }
    };
    // 合并 namespaces
    if (namespaces) {
        mergeNamespaces(session.namespaces, namespaces);
    }
    // 合并 optionalNamespaces
    if (optionalNamespaces) {
        mergeNamespaces(session.namespaces, optionalNamespaces);
    }
    session.sessionConfig = sessionConfig;
}
/**
 * util designed for Wallets that builds namespaces structure by provided supported chains, methods, events & accounts.
 * It takes required & optional namespaces provided in the session proposal
 * along with the supported chains/methods/events/accounts by the wallet and returns a structured namespaces object
 * @param {BuildApprovedNamespacesParams} params
 * @returns {SessionTypes.Namespaces}
 */
// export function buildApprovedNamespaces(
//   params: BuildApprovedNamespacesParams,
// ): SessionTypes.Namespaces {
//   const {
//     proposal: { requiredNamespaces, optionalNamespaces = {} },
//     supportedNamespaces,
//   } = params;
//   const normalizedRequired = normalizeNamespaces(requiredNamespaces);
//   const normalizedOptional = normalizeNamespaces(optionalNamespaces);
//
//   // build approved namespaces
//   const namespaces = {};
//   Object.keys(supportedNamespaces).forEach((namespace) => {
//     const supportedChains = supportedNamespaces[namespace].chains;
//     const supportedMethods = supportedNamespaces[namespace].methods;
//     const supportedEvents = supportedNamespaces[namespace].events;
//     const supportedAccounts = supportedNamespaces[namespace].accounts;
//
//     supportedChains.forEach((chain) => {
//       if (!supportedAccounts.some((account) => account.includes(chain))) {
//         throw new Error(`No accounts provided for chain ${chain} in namespace ${namespace}`);
//       }
//     });
//
//     namespaces[namespace] = {
//       chains: supportedChains,
//       methods: supportedMethods,
//       events: supportedEvents,
//       accounts: supportedAccounts,
//     };
//   });
//
//   // verify all required namespaces are supported
//   const err = isConformingNamespaces(requiredNamespaces, namespaces, "approve()");
//   if (err) throw new Error(err.message);
//
//   const approvedNamespaces = {};
//
//   // if both required & optional namespaces are empty, return all supported namespaces by the wallet
//   if (!Object.keys(requiredNamespaces).length && !Object.keys(optionalNamespaces).length)
//     return namespaces;
//
//   // assign accounts for the required namespaces
//   Object.keys(normalizedRequired).forEach((requiredNamespace) => {
//     const chains = supportedNamespaces[requiredNamespace].chains.filter((chain) =>
//       normalizedRequired[requiredNamespace]?.chains?.includes(chain),
//     );
//     const methods = supportedNamespaces[requiredNamespace].methods.filter((method) =>
//       normalizedRequired[requiredNamespace]?.methods?.includes(method),
//     );
//     const events = supportedNamespaces[requiredNamespace].events.filter((event) =>
//       normalizedRequired[requiredNamespace]?.events?.includes(event),
//     );
//
//     const accounts = chains
//       .map((chain: string) =>
//         supportedNamespaces[requiredNamespace].accounts.filter((account: string) =>
//           account.includes(`${chain}:`),
//         ),
//       )
//       .flat();
//
//     approvedNamespaces[requiredNamespace] = {
//       chains,
//       methods,
//       events,
//       accounts,
//     };
//   });
//
//   // add optional namespaces
//   Object.keys(normalizedOptional).forEach((optionalNamespace) => {
//     if (!supportedNamespaces[optionalNamespace]) return;
//
//     const chainsToAdd = normalizedOptional[optionalNamespace]?.chains?.filter((chain) =>
//       supportedNamespaces[optionalNamespace].chains.includes(chain),
//     );
//     const methodsToAdd = supportedNamespaces[optionalNamespace].methods.filter((method) =>
//       normalizedOptional[optionalNamespace]?.methods?.includes(method),
//     );
//     const eventsToAdd = supportedNamespaces[optionalNamespace].events.filter((event) =>
//       normalizedOptional[optionalNamespace]?.events?.includes(event),
//     );
//
//     const accountsToAdd = chainsToAdd
//       ?.map((chain: string) =>
//         supportedNamespaces[optionalNamespace].accounts.filter((account: string) =>
//           account.includes(`${chain}:`),
//         ),
//       )
//       .flat();
//
//     approvedNamespaces[optionalNamespace] = {
//       chains: mergeArrays(approvedNamespaces[optionalNamespace]?.chains, chainsToAdd),
//       methods: mergeArrays(approvedNamespaces[optionalNamespace]?.methods, methodsToAdd),
//       events: mergeArrays(approvedNamespaces[optionalNamespace]?.events, eventsToAdd),
//       accounts: mergeArrays(approvedNamespaces[optionalNamespace]?.accounts, accountsToAdd),
//     };
//   });
//
//   return approvedNamespaces;
// }
function isCaipNamespace(namespace) {
    return namespace.includes(":");
}
function parseNamespaceKey(namespace) {
    return isCaipNamespace(namespace) ? namespace.split(":")[0] : namespace;
}
