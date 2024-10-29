import { IProvider } from "../types";
import { SignClient } from "../../packages/sign-client/client";
import { SessionTypes } from "@xuxinlai2002/core";
import { RequestParams, SessionNamespace, SubProviderOpts } from "@xuxinlai2002/core";
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
