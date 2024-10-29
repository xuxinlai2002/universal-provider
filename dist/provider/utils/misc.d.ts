export const __esModule: boolean;
export function getRpcUrl(chainId: any, rpc: any, projectId: any): any;
export function getChainId(chain: any): any;
export function validateChainApproval(chain: any, chains: any): void;
export function getChainsFromApprovedSession(accounts: any): any;
export function getAccountsFromSession(namespace: any, session: any): any[];
export function mergeRequiredOptionalNamespaces(required?: {}, optional?: {}): any;
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
export function normalizeNamespaces(namespaces: any): {};
export function parseCaip10Account(caip10Account: any): any;
/**
 * Populates the chains array for each namespace with the chains extracted from the accounts if are otherwise missing
 */
export function convertChainIdToNumber(chainId: any): any;
export function parseChainId(chain: any): {
    namespace: any;
    reference: any;
};
export function mergeArrays(a?: any[], b?: any[]): any[];
