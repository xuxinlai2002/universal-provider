# EVM 兼容链

EVM 兼容链是指采用以太坊虚拟机（Ethereum Virtual Machine，EVM）技术的区块链网络。

这些链与以太坊共享相同的智能合约执行环境，使得开发者能够轻松地将基于以太坊的应用程序部署到这些网络上。

这种兼容性使得开发者可以利用现有的以太坊工具和库，如 Solidity、Web3.js 和 Truffle，来构建和部署去中心化应用（DApps）。

常见的 EVM 兼容链包括 Polygon、Avalanche 和 Fantom 等。这些网络的出现丰富了区块链生态系统，为用户提供了更多选择，同时也推动了跨链互操作性的发展。

## 安装及初始化

请确保更新OKX App到 6.88.0 版本或以后版本，即可开始接入：

将 OKX Connect 集成到您的 DApp 中，可以使用 npm:

`npm install @okxconnect/universal-provider`

连接钱包之前，需要先创建一个对象，用于后续连接钱包、发送交易等操作。

`OKXUniversalProvider.init({metaData: {name, icon}})`

**请求参数**

- metaData - object
    - name - string: 应用名称，不会作为唯一表示
    - icon - string: 应用图标的 URL。必须是 PNG、ICO 等格式，不支持 SVG 图标。最好传递指向 180x180px PNG 图标的 url。

**返回值**

- OKXUniversalProvider

**示例**

```typescript
import {OKXUniversalProvider} from "@okxconnect/universal-provider";

const okxUniversalProvider = await OKXUniversalProvider.init({
    dappMetaData: {
        name: "application name",
        icon: "application icon url"
    },
})
```

## 连接钱包

连接钱包去获取钱包地址，作为标识符和用于签名交易的必要参数;

`okxUniversalProvider.connect(connectParams: ConnectParams);`

**请求参数**

- connectParams - ConnectParams
    - namespaces - [namespace: string]: ConnectNamespace ; 请求连接的必要信息， EVM系的key为"eip155"
      ，如果请求的链中，有任何一个链钱包不支持的话，钱包会拒绝连接；
        - chains: string[]; 链id信息,
        - rpcMap?: [chainId: string]: string; rpc 信息，配置了rpc url才能请求链上rpc信息；
        - defaultChain?: string; 默认链
    - optionalNamespaces - [namespace: string]: ConnectNamespace; 请求连接的可选信息， EVM系的key为"eip155"
      ，如果对应的链信息钱包不支持，依然可以连接；
        - chains: string[]; 链id信息,
            - rpcMap?: [chainId: string]: string; rpc 信息；
            - defaultChain?: string; 默认链
    - sessionConfig: object
        - redirect: string 连接成功后的跳转参数，如果是Telegram中的Mini App，这里可以设置为Telegram的deeplink: "tg://resolve"

**返回值**

- Promise`<SessionTypes.Struct | undefined>`
    - topic: string; 会话标识；
    - namespaces: `Record<string, Namespace>`; 成功连接的namespace 信息；
        - chains: string[]; 连接的链信息；
        - accounts: string[]; 连接的账户信息；
        - methods: string[]; 当前namespace下，钱包支持的方法；
        - rpcMap?: [chainId: string]: string; rpc 信息；
        - defaultChain?: string; 当前会话的默认链
    - sessionConfig?: SessionConfig
        - dappInfo: object DApp 信息；
            - name:string
            - icon:string
        - redirect?:string, 连接成功后的跳转参数；

**示例**

```typescript
var session = await okxUniversalProvider.connect({
    namespaces: {
        eip155: {
            chains: ["eip155:1", "eip155:66", "eip155:56"],
            rpcMap: {
                1: "https://rpc" // set your own rpc url
            },
            defaultChain: "1"
        }
    },
    optionalNamespaces: {
        eip155: {
            chains: ["eip155:43114"]
        }
    },
    sessionConfig: {
        redirect: "tg://resolve"
    }
})
```

## 发送签名和交易

向钱包发送消息的方法，支持签名，交易，rpc请求;

`okxUniversalProvider.request(requestArguments, chain);`

**请求参数**

- requestArguments - object
    - method: string; 请求的方法名，
    - params?: unknown[]  | Record`<string, unknown>` | object | undefined; 请求的方法对应的参数；
- chain: string, 请求方法执行的链，建议传该参数，如果未传的话，会被设置为当前的defaultChain；

**返回值**

根据不同方法的执行结果，会返回不同的参数，具体参数参照下面的示例；

- personal_sign
    - Promise - string 签名结果；

- eth_signTypedData_v4
    - Promise - string 签名结果

- eth_sendTransaction
    - Promise - string hash

- eth_accounts
    - Promise - string[] 返回默认chainId的地址;

- eth_requestAccounts
    - Promise - string[] 返回默认chainId的地址;

- eth_chainId
    - Promise - number 返回默认链id;

- wallet_switchEthereumChain
    - Promise - null

- wallet_addEthereumChain
    - Promise - null

- wallet_watchAsset
    - Promise - boolean 添加成功

**示例**

```typescript

let chain = 'eip155:1'
var data = {}

// 在chain链上执行 personalSign，
// params 数组中，第一个参数为 Challenge 必选；
//               第二个参数 hex encoded address 为可选项
data = {
    "method": "personal_sign",
    "params": [
        "0x506c65617365207369676e2074686973206d65737361676520746f20636f6e6669726d20796f7572206964656e746974792e",
        "0x4B0897b0513FdBeEc7C469D9aF4fA6C0752aBea7"
    ]
}
var personalSignResult = await okxUniversalProvider.request(data, chain)
//personalSignResult:   0xe8d34297c33a61"

// 在chain链上执行 eth_signTypedData_v4
// params 数组中，第一个参数为 地址 是可选项；
//               第二个参数是TypedData 必传
data = {
    "method": "eth_signTypedData_v4",
    "params": [
        "0x00000",
        {
            "domain": {
                "name": "Ether Mail",
                "version": "1",
                "chainId": 1,
                "verifyingContract": "0xcccccccccccccccccccccccccccccccccccccccc"
            },
            "message": {
                "from": {"name": "Cow", "wallet": "0xCD2a3d9F938E13CD947Ec05AbC7FE734Df8DD826"},
                "to": {"name": "Bob", "wallet": "0xbBbBBBBbbBBBbbbBbbBbbbbBBbBbbbbBbBbbBBbB"},
                "contents": "Hello, Bob!"
            },
            "primaryType": "Mail",
            "types": {
                "EIP712Domain": [{"name": "name", "type": "string"}, {
                    "name": "version",
                    "type": "string"
                }, {"name": "chainId", "type": "uint256"}, {"name": "verifyingContract", "type": "address"}],
                "Person": [{"name": "name", "type": "string"}, {"name": "wallet", "type": "address"}],
                "Mail": [{"name": "from", "type": "Person"}, {"name": "to", "type": "Person"}, {
                    "name": "contents",
                    "type": "string"
                }]
            }
        }
    ]
}
var signTypeV4Result = await okxUniversalProvider.request(data, chain)
//signTypeV4Result: "0xa8bb3c6b33a119d..."

// 在chain链上执行 sendTransaction,
data = {
    "method": "eth_sendTransaction",
    "params": [
        {
            to: "0x4B...",
            from: "0xDe...",
            gas: "0x76c0",
            value: "0x8ac7230489e80000",
            data: "0x",
            gasPrice: "0x4a817c800"
        }
    ]
}
var sendTransactionResult = await okxUniversalProvider.request(data, chain)
// "0x1ccf2c4a3d689067fc2ac..."

// 获取默认链的地址信息；
data = {"method": "eth_requestAccounts"}
var ethRequestAccountsResult = await okxUniversalProvider.request(data, chain)
//  ["0xf2f3e73b..."]

// 获取默认链信息；
data = {"method": "eth_chainId"}
var chainIdResult = await okxUniversalProvider.request(data, chain)
//chainIdResult   1

// 切换链；
data = {
    "method": "wallet_switchEthereumChain",
    "params": [
        {
            chainId: "0x1"
        }
    ]
}
var switchResult = await okxUniversalProvider.request(data, chain)
// switchResult null

// 添加链
data = {
    "method": "wallet_addEthereumChain",
    "params": [{
        "blockExplorerUrls": ["https://explorer.fuse.io"],
        "chainId": "0x7a",
        "chainName": "Fuse",
        "nativeCurrency": {"name": "Fuse", "symbol": "FUSE", "decimals": 18},
        "rpcUrls": ["https://rpc.fuse.io"]
    }]
}
var addEthereumChainResult = await okxUniversalProvider.request(data, chain)
//addEthereumChainResult   null

// 在chain链 watchAsset 添加币种
data = {
    "method": "wallet_watchAsset",
    "params": [{
        "type": "ERC20",
        "options": {
            "address": "0xeB51D9A39AD5EEF215dC0Bf39a8821ff804A0F01",
            "symbol": "LGNS",
            "image": "https://polygonscan.com/token/images/originlgns_32.png",
            "decimals": 9
        }
    }]
}
var watchAssetResult = await okxUniversalProvider.request(data, chain)
// watchAssetResult   
// true/false

// 在chain链 执行 requestRpc
data = {"method": "eth_getBalance", "params": ["0x8D97689C9818892B700e27F316cc3E41e17fBeb9", "latest"]}
var getBalanceResult = await okxUniversalProvider.request(data, chain)
// getBalanceResult:  "0xba862b54effa"

```

## 设置默认网络

在连接多个网络的状况下,如果开发者没有明确指定当前操作所在网络,则通过默认网络进行交互。

'setDefaultChain(chain, rpcUrl?)'

**示例**

```typescript
okxUniversalProvider.setDefaultChain("eip155:1", "rpcurl")
```

## 断开钱包连接

断开已连接钱包,并删除当前会话,如果要切换连接钱包,请先断开当前钱包。

```typescript
okxUniversalProvider.disconnect();
```

## Event事件

```typescript
// 生成 universalLink  
okxUniversalProvider.on("display_uri", (uri) => {
    console.log(uri);
});
// session 信息变更(例如添加自定义链）会触发该事件；
okxUniversalProvider.on("session_update", (session) => {
    console.log(JSON.stringify(session));
});
// 断开连接会触发该事件；
okxUniversalProvider.on("session_delete", ({topic}) => {
    console.log(topic);
});
```


## 错误码

在连接，交易，断开连接的过程中可能抛出的异常;

**异常**

| 错误码                                             | 描述    |
|-------------------------------------------------|-------|
| OKX_CONNECT_ERROR_CODES.UNKNOWN_ERROR           | 未知异常  |
| OKX_CONNECT_ERROR_CODES.ALREADY_CONNECTED_ERROR | 钱包已连接 |
| OKX_CONNECT_ERROR_CODES.NOT_CONNECTED_ERROR     | 钱包未连接 |
| OKX_CONNECT_ERROR_CODES.USER_REJECTS_ERROR      | 用户拒绝  |
| OKX_CONNECT_ERROR_CODES.METHOD_NOT_SUPPORTED    | 方法不支持 |

```typescript
export enum OKX_CONNECT_ERROR_CODES {
    UNKNOWN_ERROR = 0,
    ALREADY_CONNECTED_ERROR = 11,
    NOT_CONNECTED_ERROR = 12,
    USER_REJECTS_ERROR = 300,
    METHOD_NOT_SUPPORTED = 400,
}
```