export interface IResponseList<T>{
    "_shards": {
        "failed": number,
        "skipped":number,
        "successful": number,
        "total":number,
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

export interface IBlock{
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
        "miner":string,
        "mixHash":string,
        "nonce": string,
        "number": string,
        "parentHash": string,
        "receiptsRoot": string,
        "sha3Uncles": string,
        "stateRoot": string,
        "timestamp": 0,
        "transactionsRoot":string,
        "txns": 0
    },
    "_type": string,
    "sort": number[]
}

export interface ITx{
    "_id": string,
    "_index": string,
    "_score": string,
    "_source": {
        'gas': number
        'gasPrice': string
        'hash': string
        'input': string
        'maxFeePerGas': string
        'maxPriorityFeePerGas': string
        'nonce': number
        'number': string
        'r': string
        's': string
        'timestamp': number
        'to': string
        'type': number
        'v': string
        'value': string
    },
    "_type": string,
    "sort": number[]
}

