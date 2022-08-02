# 快速搭建私有区块链

## 前言

多个服务的大杂烩，基本上不用考虑直接上生产，服务可拆分，包含geth的admin服务，区块链数据同步到es的同步服务，水龙头，区块链浏览器  
由于需要geth，且windows 有太多奇奇怪怪的bug，照顾跨平台的情况，目前用docker-compose 模拟脚本

## 环境要求

1. docker        （必须）
2. nodejs v14    （涉及到解析公钥，打包区块链浏览器客户端）
3. go 1.18       （区块链admin服务，节点同步es的服务）

## 硬件要求

1. 挖矿不占很多资源，尤其是poa共识机制下，仅仅区块链最低需要4核8g
2. 硬盘最好是固态
3. 根据自己的需求可以适当降低配置

## 前置提醒

特别注意 链id 创建后不可更改，请慎重，最好弄一个比较大不会有人用的，以防和公链重复，在本文中均使用 8549140784658，可以自行更改，全局搜索，批量替换

## 区块链服务介绍

区块链建议起三个服务 分别为 boot，miner，rpc，其中boot为引导节点，miner为挖矿节点，rpc为业务通讯节点，由于抢占式系统的原因，三个服务应部署在三台机器上，但在本案例中，由于资源限制，更改端口后部署同一台机器上

## 创建区块链流程

1. 设置密码，根目录下创建chain文件夹，这里面放的是所有docker的容器内映射的文件；在chain文件夹下创建password文件，并输入密码（最少十位）
2. 创建挖矿账号

   ```shell
    docker-compose -f docker-compose.account.yml up
    ```

3. 生成自己的助记词 （可选步骤）

   ```shell
   // 复制 do.example.js 为do.js 自己改想执行的方法 里面有注释 也可参考源码

   // 将do.js 改为
   const utils = require ('./utils')

   console.log(utils.generateMnemonic())

   // 然后执行，会在终端打印一个助记词
   node do.js

   ```

4. 生成自己的账号  (可选步骤)

   ```shell
   const utils = require ('./utils')

   utils.createKeys(<mnemonic>)
   // 然后执行，会生成一个key.json
   node do.js
   ```

5. 导出挖矿私钥 （后期水龙头需要）

   ```shell
   const utils = require ('./utils')

   utils.getPrivateKeyAndCreateFile('./chain/account/keystore','./chain/password')
   // 然后执行，会生成一个miner.json
   node do.js
   ```

6.1 假如你想创建区块链
6.1.1  Clique 部分  (如果你想创建自己的保留账号，你可以执行 utils下的createKeys，输入你的助记词，可以生成20个账号，放到key.json中)
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

    "<测试账号地址/上一步创建的自己的账号地址>": { "balance": "999999" }
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

6.1.2 Ethash 部分  
// todo

6.2 加入区块链
// todo
7. 创建三个服务（boot rpc miner）

```

docker-compose -f docker-compose.create.boot.yml up
docker-compose -f docker-compose.create.rpc.yml up
docker-compose -f docker-compose.create.miner.yml up

```

8. 启动引导服务（boot服务）

```

// 记得 修改entrypoint部分的链id ，ip设置为当前机器的对外ip 必须要设置 其他节点需要知道宿主机的地址 以便接入
docker-compose -f docker-compose.boot.yml up -d

```

9. 获取boot服务的enr  

```

// 有两个选择 第一种启动admin服务 访问 <http://127.0.0.1:8080/nodeInfo/><name> 这种是针对将来 其他节点加入 方便获取enr做的
// admin是一个go项目，将其打包生成linux可执行的main，在chain文件夹下新建admin文件夹，复制admin到chain/admin文件夹 记得修改elastic search 的地址
docker-compose -f docker-compose.admin.yml up -d
// 然后访问 <http://127.0.0.1:8080/nodeInfo/boot>

// 第二种 内部查看 新建终端
docker exec <imageName> -it  sh
// 执行命令进入 boot的js控制台
geth attach /home/chain/boot/geth.ipc
// 获取enr
admin.nodeInfo.enr

```

10. 修改docker-compose.rpc.yml （enr和链id）

11. 启动rpc服务

```

docker-compose -f docker-compose.rpc.yml up -d

```

12. 修改docker-compose.miner.yml （enr、链id、挖矿地址）

13. 启动miner服务

```

docker-compose -f docker-compose.miner.yml up -d

```

14. 启动开源浏览器

```

// 修改ip后
docker-compose -f docker-compose.explorer.yml up -d
// 访问 <http://127.0.0.1:3020/> 不停的出块，就是对了

```

## 区块链浏览器启动过程

已迁移
<https://github.com/757566833/explorer-server>
<https://github.com/757566833/explorer-client>

# ipfs启动过程

1. 启动服务

```

docker-compose -f docker-compose.ipfs.yml up -d

```

2. 改成私有（可选）

```

docker exec ipfs-node1 ipfs bootstrap rm all

```

3. 测试上传文件

```

// 可以把任意文件传到./chain/node1/upload下，以下代码复制了demo.png
docker exec ipfs-node1 ipfs add /data/upload/demo.png
// 大概会返回一个hash
13.07 KiB / 13.07 KiB  100.00%added QmcRGfsyA8JnazEHjFRrc4CXzwrqsWEVmTFhjRbzTkSbSo demo.png

```

4. 测试下载文件

```

docker exec ipfs-node1 ipfs get <哈希> -o /data/down/demo.png
// 例如
docker exec ipfs-node1 ipfs get QmcRGfsyA8JnazEHjFRrc4CXzwrqsWEVmTFhjRbzTkSbSo -o /data/down/demo.png

```

> 进行第二步以后无法打开webui，看社区回复是 webui要在可以连接到其他节点的情况下才能使用，笔者尚未明确原因

# todo

1. 区块链浏览器 还差一个 total difficult 的字段， 还差通过input data 解析合同调用的方法名功能
2. 区块链浏览器前端 没想到太优雅的启动方式， 且固定访问端口9090 还没抽出来可配
3. 水龙头还没做

## 备注

默认支持的硬分叉

- Homestead:                   0        (<https://github.com/ethereum/execution-specs/blob/master/network-upgrades/mainnet-upgrades/homestead.md>)
- Tangerine Whistle (EIP 150): 0        (<https://github.com/ethereum/execution-specs/blob/master/network-upgrades/mainnet-upgrades/tangerine-whistle.md>)
- Spurious Dragon/1 (EIP 155): 0        (<https://github.com/ethereum/execution-specs/blob/master/network-upgrades/mainnet-upgrades/spurious-dragon.md>)
- Spurious Dragon/2 (EIP 158): 0        (<https://github.com/ethereum/execution-specs/blob/master/network-upgrades/mainnet-upgrades/spurious-dragon.md>)
- Byzantium:                   0        (<https://github.com/ethereum/execution-specs/blob/master/network-upgrades/mainnet-upgrades/byzantium.md>)
- Constantinople:              0        (<https://github.com/ethereum/execution-specs/blob/master/network-upgrades/mainnet-upgrades/constantinople.md>)
- Petersburg:                  0        (<https://github.com/ethereum/execution-specs/blob/master/network-upgrades/mainnet-upgrades/petersburg.md>)
- Istanbul:                    尚未支持 (<https://github.com/ethereum/execution-specs/blob/master/network-upgrades/mainnet-upgrades/istanbul.md>)
- Berlin:                      尚未支持 (<https://github.com/ethereum/execution-specs/blob/master/network-upgrades/mainnet-upgrades/berlin.md>)
- London:                      尚未支持 (<https://github.com/ethereum/execution-specs/blob/master/network-upgrades/mainnet-upgrades/london.md>)

> geth原本就这样 继续支持要本地硬分叉
