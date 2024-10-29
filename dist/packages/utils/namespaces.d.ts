export const __esModule: boolean;
export function getAccountsChains(accounts: any): any[];
export function nameSpaceToConnectWalletNameSpace(namespaces: any): any[];
export function fillParamsToSession(session: any, namespaces: any, optionalNamespaces: any, sessionConfig: any): void;
/**
 * util designed for Wallets that builds namespaces structure by provided supported chains, methods, events & accounts.
 * It takes required & optional namespaces provided in the session proposal
 * along with the supported chains/methods/events/accounts by the wallet and returns a structured namespaces object
 * @param {BuildApprovedNamespacesParams} params
 * @returns {SessionTypes.Namespaces}
 */
export function isCaipNamespace(namespace: any): SessionTypes.Namespaces;
export function parseNamespaceKey(namespace: any): any;
