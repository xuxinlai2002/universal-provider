import { SessionTypes, ProposalTypes, ConnectNamespaceMap, ConnectWalletNameSpace } from "@okxconnect/core";
import Struct = SessionTypes.Struct;
export declare function getAccountsChains(accounts: SessionTypes.Namespace["accounts"]): string[];
export declare function nameSpaceToConnectWalletNameSpace(namespaces?: ConnectNamespaceMap): ConnectWalletNameSpace[];
export declare function fillParamsToSession(session: Struct, namespaces?: ConnectNamespaceMap, optionalNamespaces?: ConnectNamespaceMap, sessionConfig?: SessionTypes.SessionConfig): void;
export type BuildApprovedNamespacesParams = {
    proposal: ProposalTypes.Struct;
    supportedNamespaces: Record<string, {
        chains: string[];
        methods: string[];
        events: string[];
        accounts: string[];
    }>;
};
/**
 * util designed for Wallets that builds namespaces structure by provided supported chains, methods, events & accounts.
 * It takes required & optional namespaces provided in the session proposal
 * along with the supported chains/methods/events/accounts by the wallet and returns a structured namespaces object
 * @param {BuildApprovedNamespacesParams} params
 * @returns {SessionTypes.Namespaces}
 */
export declare function isCaipNamespace(namespace: string): boolean;
export declare function parseNamespaceKey(namespace: string): string;
/**
 * Converts
 * ```
 * {
 *  "eip155:1": {...},
 *  "eip155:2": {...},
 * }
 * ```
 * into
 * ```
 * {
 *  "eip155": {
 *      chains: ["eip155:1", "eip155:2"],
 *      ...
 *    }
 * }
 *```
 */
