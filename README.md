0. 特别注意 链id 创建后不可更改，请慎重，最好弄一个比较大不会有人用的，以防和公链重复，在本文中均使用 8549140784658，可以自行更改
1. 设置密码，根目录下创建chain文件夹，在chain文件夹下创建password文件，并输入密码（最少十位）
2. 创建挖矿账号
```
docker-compose -f docker-compose.account.yml up
```
3. 根据创建出的账号，获取私钥（同步用aes创建了一个对称加密，所以可以反推私钥），已将源码放到根目录下，名字为utils.ts,为了避免安装冗杂的依赖，我已打包好可执行文件
```
node do.js
// 你可以选择 执行 getPrivateKeyAndCreateFile 或 getPrivateKey 区别是前者只是打印，后者会在本地生成一个mint.json的文件，里面放置了公私钥
```

4.1 假如你想创建区块链   
4.1.1  Clique 部分  (如果你想创建自己的保留账号，你可以执行 utils下的createKeys，输入你的助记词，可以生成20个账号，放到key.json中)
在 chain 文件夹下创建文件genesis.json 填入以下内容 (注意chainId部分，要和接下来的启动服务统一)
```
{
  "config": {
    "chainId": <8549140784658>,
    "homesteadBlock": 0,
    "eip150Block": 0,
    "eip155Block": 0,
    "eip158Block": 0,
    "byzantiumBlock": 0,
    "constantinopleBlock": 0,
    "petersburgBlock": 0,
    "clique": {
      "period": 5,
      "epoch": 30000
    }
  },
  "difficulty": "1",
  "gasLimit": "8000000",
  "extradata": "0x0000000000000000000000000000000000000000000000000000000000000000<没有0x前缀的挖矿地址地址保证修改后是236的长度>0000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000",
  "alloc": {
    "<建议是挖矿地址>": { "balance": "999999" },

    "<测试账号>": { "balance": "999999" }
  }
}

//例如
{
  "config": {
    "chainId": 8549140784658,
    "homesteadBlock": 0,
    "eip150Block": 0,
    "eip155Block": 0,
    "eip158Block": 0,
    "byzantiumBlock": 0,
    "constantinopleBlock": 0,
    "petersburgBlock": 0,
    "clique": {
      "period": 5,
      "epoch": 30000
    }
  },
  "difficulty": "1",
  "gasLimit": "8000000",
  "extradata": "0x00000000000000000000000000000000000000000000000000000000000000007eb8404F07Daf2405D458F2eA1eB77409d524d7F0000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000",
  "alloc": {
    "7eb8404F07Daf2405D458F2eA1eB77409d524d7F": {
      "balance": "1000000000000000000000"
    },
    "68F3b9eE1E9aC8704591D0B185171113b7A8cA59": {
      "balance": "1000000000000000000000"
    },
    "a4FF0a8D37342daf2a92A8aad710292A10c4610E": {
      "balance": "1000000000000000000000"
    },
    "8D3bDAde6fF60ad610029435d0ce03F09fF43d88": {
      "balance": "1000000000000000000000"
    },
    "bF52e9a726798F4023b29BbE0043D127d28Ea4B3": {
      "balance": "1000000000000000000000"
    },
    "7d33137B979BB4Ae5D30f454003330CF489f186e": {
      "balance": "1000000000000000000000"
    },
    "e9Ee0FA08F9DaB90FdEdD00816A08c473552394E": {
      "balance": "1000000000000000000000"
    },
    "7dc8293C8928FA0F6704aD469FfC737b06bAF5b7": {
      "balance": "1000000000000000000000"
    },
    "db19edB85Db5fcf7cA762356Ca0C37C7b35A9827": {
      "balance": "1000000000000000000000"
    },
    "299261BDB619B46B111068a8cF29A96b7417e29E": {
      "balance": "1000000000000000000000"
    },
    "00F218e2Cc15C3F88206a217F135468a7dfD639A": {
      "balance": "1000000000000000000000"
    },
    "8Ed57a034693A814AF040E1b830F1bC69c3936da": {
      "balance": "1000000000000000000000"
    },
    "Cda28FF82F6Bf1E49ae526Dc934DFB424a9C144d": {
      "balance": "1000000000000000000000"
    },
    "30E8F6Cd1e2B901DEDF2f1d2afEa924113c71e21": {
      "balance": "1000000000000000000000"
    },
    "Cde39aeaE924df3F802138b025eD5ca5042f0B46": {
      "balance": "1000000000000000000000"
    },
    "4dDDCa80C4b061394C42bFB9A9eF2893dd36617d": {
      "balance": "1000000000000000000000"
    },
    "cb42f2C850D9CC0DD000F9F6d99d84D0002D5421": {
      "balance": "1000000000000000000000"
    },
    "2a8C97b63e197b2eB293F3E9A15a84D634e7cc9B": {
      "balance": "1000000000000000000000"
    },
    "97B672a69683ee5a560DC423Ef99f6c1cfFcdd8f": {
      "balance": "1000000000000000000000"
    },
    "05e89A2f96Ee1d43Ab99AB59898C8eB544346690": {
      "balance": "1000000000000000000000"
    },
    "E7bC3ADdB4c41Dc236fEFAdc5FCCCF539F7cA7bb": {
      "balance": "1000000000000000000000"
    }
  }
}
```
4.1.2 Ethash 部分  
// todo

4.2 加入区块链
// todo

5. 创建引导服务（boot服务）
```
docker-compose -f docker-compose.create.boot.yml up
```

5. 启动引导服务（boot服务）
```
// 记得 修改entrypoint部分的链id ，ip设置为当前机器的对外ip 必须要设置 其他节点需要知道宿主机的地址 以便接入
docker-compose -f docker-compose.boot.yml up -d
```

6. 获取enr  
```
// 有两个选择 第一种启动admin服务 访问 http://127.0.0.1:8080/nodeInfo 这种是针对将来 其他节点加入 方便获取enr做的
// admin是一个go项目，将其打包生成main，复制admin文件夹到chain文件夹 记得修改elastic search 的地址
docker-compose -f docker-compose.admin.yml up -d

// 第二种 内部查看 新建终端
docker exec <imageName> -it  sh 
// 执行命令进入 boot的js控制台
geth attact /home/chain/boot/geth.ipc
// 获取enr
admin.nodeInfo.enr
```
7. 创建rpc 服务
```
docker-compose -f docker-compose.create.rpc.yml up
```
8. 启动rpc服务
```
// 记得 修改entrypoint部分的链id
docker-compose -f docker-compose.rpc.yml up -d
```

7. 创建miner 服务
```
docker-compose -f docker-compose.create.miner.yml up
```

8. 启动miner服务
```
// 记得 修改entrypoint部分的链id ，ip设置为当前机器的对外ip   地址也要修改
docker-compose -f docker-compose.miner.yml up -d
```

9. 启动浏览器
```
// 修改ip后
docker-compose -f docker-compose.explorer.yml up -d
```

10. 开启同步服务
```
// build synchronous

```


## 备注
默认支持的硬分叉
- Homestead:                   0        (https://github.com/ethereum/execution-specs/blob/master/network-upgrades/mainnet-upgrades/homestead.md)
- Tangerine Whistle (EIP 150): 0        (https://github.com/ethereum/execution-specs/blob/master/network-upgrades/mainnet-upgrades/tangerine-whistle.md)
- Spurious Dragon/1 (EIP 155): 0        (https://github.com/ethereum/execution-specs/blob/master/network-upgrades/mainnet-upgrades/spurious-dragon.md)
- Spurious Dragon/2 (EIP 158): 0        (https://github.com/ethereum/execution-specs/blob/master/network-upgrades/mainnet-upgrades/spurious-dragon.md)
- Byzantium:                   0        (https://github.com/ethereum/execution-specs/blob/master/network-upgrades/mainnet-upgrades/byzantium.md)
- Constantinople:              0        (https://github.com/ethereum/execution-specs/blob/master/network-upgrades/mainnet-upgrades/constantinople.md)
- Petersburg:                  0        (https://github.com/ethereum/execution-specs/blob/master/network-upgrades/mainnet-upgrades/petersburg.md)
- Istanbul:                    <nil> (https://github.com/ethereum/execution-specs/blob/master/network-upgrades/mainnet-upgrades/istanbul.md)
- Berlin:                      <nil> (https://github.com/ethereum/execution-specs/blob/master/network-upgrades/mainnet-upgrades/berlin.md)
- London:                      <nil> (https://github.com/ethereum/execution-specs/blob/master/network-upgrades/mainnet-upgrades/london.md)