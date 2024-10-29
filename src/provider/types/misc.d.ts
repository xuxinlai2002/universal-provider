import { IProvider, IJSONRpcProvider } from "./providers";
import { RequestArguments } from "@xuxinlai2002/core";
import EventEmitter from "eventemitter3";
export interface RpcProviderMap {
    [chainId: string]: IProvider;
}
export interface HttpRpcProviderMap {
    [chainId: string]: IJSONRpcProvider;
}
export type ProviderChainId = string;
export type ProviderAccounts = string[];
export interface EIP1102Request extends RequestArguments {
    method: "eth_requestAccounts";
}
export declare abstract class IEvents {
    abstract events: EventEmitter;
    abstract on(event: string, listener: any): void;
    abstract once(event: string, listener: any): void;
    abstract off(event: string, listener: any): void;
    abstract removeListener(event: string, listener: any): void;
}
export interface EIP1193Provider extends IEvents {
    request(args: RequestArguments, namespace: string): Promise<unknown>;
}
export interface IEthereumProvider extends EIP1193Provider {
}
