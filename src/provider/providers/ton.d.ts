import { IProvider } from "../types";
import { SignClient } from "../../packages/sign-client/client";
import { SessionTypes } from "@okxconnect/core";
import { RequestParams, SessionNamespace, SubProviderOpts } from "@okxconnect/core";
declare class TonProvider implements IProvider {
    readonly client: SignClient;
    readonly namespace: SessionNamespace;
    constructor(opts: SubProviderOpts);
    getDefaultChain(): string;
    request<T>(args: RequestParams): Promise<T>;
    requestAccounts(): string[];
    setDefaultChain(chainId: string, rpcUrl: string | undefined): void;
    updateNamespace(args: SessionTypes.Namespace): void;
}
export default TonProvider;
