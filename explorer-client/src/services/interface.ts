export interface IResponseList<T> {
    "_shards": {
        "failed": number,
        "skipped": number,
        "successful": number,
        "total": number,
    },
    "hits": {
        "hits": T[]
        "max_score": string,
        "total": {
            "relation": string,
            "value": number
        }
    },
    "timed_out": boolean,
    "took": number
}

export interface IBlock {
    "_id": string,
    "_index": string,
    "_score": string,
    "_source": {
        "baseFeePerGas": string,
        "difficulty": string,
        "extraData": string,
        "gasLimit": number,
        "gasUsed": number,
        "logsBloom": string,
        "miner": string,
        "mixHash": string,
        "nonce": string,
        "number": string,
        "parentHash": string,
        "receiptsRoot": string,
        "sha3Uncles": string,
        "stateRoot": string,
        "timestamp": number,
        "transactionsRoot": string,
        "txns": number
        "blockHash":string
        "size":string
    },
    "_type": string,
    "sort": number[]
}

export interface ITx {
    "_id": string,
    "_index": string,
    "_score": string,
    "_source": {
        blockHash: string
        blockNumber: string
        contractAddress: string
        cumulativeGasUsed: string
        from: string
        gas: number
        gasPrice: string
        gasUsed: string
        hash: string
        input: string
        isFake: boolean
        logs: string[]
        logsBloom: string
        maxFeePerGas: string
        maxPriorityFeePerGas: string
        nonce: number
        number: string
        postState: string
        r: string
        receiptType: number
        s: string
        status: number
        timestamp: number
        to: string
        transactionHash: string
        transactionIndex: number
        type: number
        v: string
        value: string

    },
    "_type": string,
    "sort": number[]
}

