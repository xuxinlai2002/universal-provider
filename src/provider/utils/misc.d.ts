import { NamespaceConfig, SessionTypes, ConnectNamespace } from "@xuxinlai2002/core";
export declare function getRpcUrl(chainId: string, rpc: ConnectNamespace, projectId?: string): string | undefined;
export declare function getChainId(chain: string): string;
export declare function validateChainApproval(chain: string, chains: string[]): void;
export declare function getChainsFromApprovedSession(accounts: string[]): string[];
export declare function getAccountsFromSession(namespace: string, session: SessionTypes.Struct): string[];
export declare function mergeRequiredOptionalNamespaces(required?: NamespaceConfig, optional?: NamespaceConfig): NamespaceConfig;
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
export declare function normalizeNamespaces(namespaces: NamespaceConfig): NamespaceConfig;
export declare function parseCaip10Account(caip10Account: string): string;
/**
 * Populates the chains array for each namespace with the chains extracted from the accounts if are otherwise missing
 */
export declare function convertChainIdToNumber(chainId: string | number): number | string;
export declare function parseChainId(chain: string): ChainIdParams;
interface ChainIdParams {
    namespace: string;
    reference: string;
}
export declare function mergeArrays<T>(a?: T[], b?: T[]): T[];
export {};
