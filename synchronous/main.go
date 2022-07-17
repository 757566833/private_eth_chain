package main

import (
	"bytes"
	"context"
	"encoding/json"
	"io"
	"log"
	"math/big"
	"os"
	"strings"
	"time"

	"github.com/elastic/go-elasticsearch/v7"
	"github.com/elastic/go-elasticsearch/v7/esapi"
	"github.com/ethereum/go-ethereum/common"
	"github.com/ethereum/go-ethereum/core/types"
	"github.com/ethereum/go-ethereum/ethclient"
	"go.uber.org/zap"
)

var esClient *elasticsearch.Client
var logger *zap.Logger

// TODO
type ESBlock struct {
	ParentHash  common.Hash      `json:"parentHash"       gencodec:"required"`
	UncleHash   common.Hash      `json:"sha3Uncles"       gencodec:"required"`
	Coinbase    common.Address   `json:"miner"`
	Root        common.Hash      `json:"stateRoot"        gencodec:"required"`
	TxHash      common.Hash      `json:"transactionsRoot" gencodec:"required"`
	ReceiptHash common.Hash      `json:"receiptsRoot"     gencodec:"required"`
	Bloom       types.Bloom      `json:"logsBloom"        gencodec:"required"`
	Difficulty  string           `json:"difficulty"       gencodec:"required"`
	Number      string           `json:"number"           gencodec:"required"`
	GasLimit    uint64           `json:"gasLimit"         gencodec:"required"`
	GasUsed     uint64           `json:"gasUsed"          gencodec:"required"`
	Time        uint64           `json:"timestamp"        gencodec:"required"`
	Extra       []byte           `json:"extraData"        gencodec:"required"`
	MixDigest   common.Hash      `json:"mixHash"`
	Nonce       types.BlockNonce `json:"nonce"`

	// BaseFee was added by EIP-1559 and is ignored in legacy headers.
	BaseFee *big.Int `json:"baseFeePerGas" rlp:"optional"`

	Txns int `json:"txns"        gencodec:"required"`
}

type ESTx struct {
	TxType     byte             `json:"type"                        gencodec:"required"`
	Nonce      uint64           `json:"nonce"`
	GasPrice   string           `json:"gasPrice"                    gencodec:"required"`
	GasTipCap  string           `json:"maxPriorityFeePerGas"        gencodec:"required"`
	GasFeeCap  string           `json:"maxFeePerGas"                gencodec:"required"`
	Gas        uint64           `json:"gas"                         gencodec:"required"`
	Value      string           `json:"value"                       gencodec:"required"`
	Data       []byte           `json:"input"                       gencodec:"required"`
	Number     string           `json:"number"                      gencodec:"required"`
	V          string           `json:"v"                           gencodec:"required"`
	R          string           `json:"r"                           gencodec:"required"`
	S          string           `json:"s"                           gencodec:"required"`
	To         *common.Address  `json:"to"                          gencodec:"required"`
	Hash       common.Hash      `json:"hash"                        gencodec:"required"`
	Time       uint64           `json:"timestamp"                   gencodec:"required"`
	From       common.Address   `json:"from"                        gencodec:"required"`
	AccessList types.AccessList `json:"accessList"                  gencodec:"required"`
	IsFake     bool             `json:"isFake"                  gencodec:"required"`
}

type ESBlockHit1 struct {
	Source ESBlock `json:"_source"                       gencodec:"required"`
	Index  string  `json:"_index"                        gencodec:"required"`
	Type   string  `json:"_type"                         gencodec:"required"`
	Id     string  `json:"_id"                           gencodec:"required"`
	Score  string  `json:"_score"                        gencodec:"required"`
}
type ESTotal struct {
	Value    int64  `json:"value"                        gencodec:"required"`
	Relation string `json:"relation"                        gencodec:"required"`
}
type ESBlockHit2 struct {
	Hits  []ESBlockHit1 `json:"hits"                       gencodec:"required"`
	Total ESTotal       `json:"total"                       gencodec:"required"`
}
type ESShards struct {
	Total      int64 `json:"total"                       gencodec:"required"`
	Successful int64 `json:"successful"                       gencodec:"required"`
	Skipped    int64 `json:"skipped"                       gencodec:"required"`
	Failed     int64 `json:"failed"                       gencodec:"required"`
}
type ESBlockRes struct {
	Took     int64       `json:"took"                       gencodec:"required"`
	TimedOut bool        `json:"timed_out"                       gencodec:"required"`
	Shards   ESShards    `json:"_shards"                       gencodec:"required"`
	Hits     ESBlockHit2 `json:"hits"                       gencodec:"required"`
}

func sync(ethclient *ethclient.Client) {
	var startStr string = "0"

	size := 1
	from := 0
	_body := `{
		"sort": [
		   {
			 "timestamp":{
			   "order": "desc"
			 }
		   }
		 ]
	   }`
	blockReq := esapi.SearchRequest{
		Index: []string{"block"},
		Size:  &size,
		From:  &from,
		Body:  strings.NewReader(_body),
	}
	esBlockResponse, err := blockReq.Do(context.Background(), esClient)
	if err != nil {
		startStr = "0"
	}
	defer esBlockResponse.Body.Close()
	// var block []any
	if esBlockResponse.StatusCode >= 300 {
		startStr = "0"
	} else {
		// fmt.Print(esBlockResponse.Body)
		byt, err := io.ReadAll(esBlockResponse.Body)

		if err != nil {
			panic(err)
		}
		var esBlockRes ESBlockRes
		err = json.Unmarshal(byt, &esBlockRes)
		if err != nil {
			startStr = "0"
		} else {
			startStr = esBlockRes.Hits.Hits[0].Source.Number
		}

	}
	num, err := ethclient.BlockNumber(context.Background())
	if err != nil {
		logger.Error("区块链获取最新区块报错")
		panic(err)
	}

	// 57269
	length := new(big.Int).SetUint64(num)
	length.Sub(length, big.NewInt(1))

	// length := big.NewInt(57269)
	var startBg *big.Int
	var b bool
	startBg, b = new(big.Int).SetString(startStr, 10)
	if !b {
		startBg = big.NewInt(0)
	}
	for i := startBg; i.Cmp(length) == -1; i.Add(i, big.NewInt(1)) {
		logger.Info(i.String())
		msg, err := ethclient.BlockByNumber(context.Background(), i)
		if err != nil {
			logger.Error("获取区块信息出错")
			panic(err)
		}
		header := msg.Header()
		body := msg.Body()

		leng := len(body.Transactions)
		// todo 为什么重新赋值一次 就会自动转成数字 直接使用header 就是hex
		esBlock := new(ESBlock)
		esBlock.ParentHash = header.ParentHash
		esBlock.UncleHash = header.UncleHash
		esBlock.Coinbase = header.Coinbase
		esBlock.Root = header.Root
		esBlock.TxHash = header.TxHash
		esBlock.ReceiptHash = header.ReceiptHash
		esBlock.Bloom = header.Bloom
		esBlock.Difficulty = header.Difficulty.String()
		esBlock.Number = header.Number.String()
		esBlock.GasLimit = header.GasLimit
		esBlock.GasUsed = header.GasUsed
		esBlock.Time = header.Time
		esBlock.Extra = header.Extra
		esBlock.MixDigest = header.MixDigest
		esBlock.Nonce = header.Nonce
		esBlock.BaseFee = header.BaseFee
		esBlock.Txns = leng

		blockBuf, err := json.Marshal(esBlock)
		if err != nil {
			logger.Error("序列化block出错")
			panic(err)
		}

		blockReq := esapi.IndexRequest{
			Index:      "block",
			DocumentID: header.Number.String(),
			Body:       bytes.NewReader(blockBuf),
		}

		blockRes, blockErr := blockReq.Do(context.Background(), esClient)
		if blockErr != nil {
			logger.Error("es写入出错")
			panic(blockErr)
		}
		defer blockRes.Body.Close()

		if leng > 0 {
			txBuf := new(bytes.Buffer)
			for _, tx := range body.Transactions {

				createLine := map[string]interface{}{
					"create": map[string]interface{}{
						"_index": "tx",
						"_id":    tx.Hash(),
					},
				}
				createStr, createErr := json.Marshal(createLine)
				if createErr != nil {
					logger.Error("序列化批量创建方法出错")
					panic(createErr)
				}
				txBuf.Write(createStr)
				txBuf.WriteByte('\n')
				esTx := new(ESTx)
				esTx.TxType = tx.Type()
				esTx.Nonce = tx.Nonce()
				esTx.GasPrice = tx.GasPrice().String()
				esTx.GasTipCap = tx.GasTipCap().String()
				esTx.GasFeeCap = tx.GasFeeCap().String()
				esTx.Gas = tx.Gas()
				esTx.Value = tx.Value().String()
				esTx.Data = tx.Data()
				esTx.Number = header.Number.String()
				esTx.To = tx.To()
				esTx.Hash = tx.Hash()
				v, r, s := tx.RawSignatureValues()
				esTx.V = v.String()
				esTx.R = r.String()
				esTx.S = s.String()
				esTx.Time = header.Time

				msg, asMsgErr := tx.AsMessage(types.LatestSignerForChainID(tx.ChainId()), tx.GasPrice())
				if asMsgErr != nil {
					logger.Error("as message 出错")
					panic(asMsgErr)
				}

				esTx.IsFake = msg.IsFake()
				esTx.AccessList = msg.AccessList()
				esTx.From = msg.From()

				paramsStr, paramsErr := json.Marshal(esTx)
				if paramsErr != nil {
					logger.Error("序列化批量创建参数出错")
					panic(paramsErr)
				}
				txBuf.Write(paramsStr)
				txBuf.WriteByte('\n')

			}

			txReq := esapi.BulkRequest{
				Body: bytes.NewReader(txBuf.Bytes()),
			}
			txRes, txErr := txReq.Do(context.Background(), esClient)

			if txErr != nil {
				logger.Error("批量写入tx出错")
				panic(txErr)
			}
			defer txRes.Body.Close()
			if txRes.StatusCode >= 300 {
				logger.Error("批量写入http返回报错")
			}

		}

	}

	timer1 := time.NewTimer(time.Second * 5)
	<-timer1.C //阻塞，5秒以后继续执行
	sync(ethclient)
}
func main() {

	rawJSON := []byte(`{
		"level": "debug",
		"encoding": "json",
		"outputPaths": ["stdout", "./logs"],
		"errorOutputPaths": ["stderr"],
		"encoderConfig": {
		  "messageKey": "message",
		  "levelKey": "level",
		  "levelEncoder": "lowercase"
		}
	  }`)

	var cfg zap.Config
	if err := json.Unmarshal(rawJSON, &cfg); err != nil {
		panic(err)
	}
	l, err := cfg.Build()
	if err != nil {
		panic(err)
	}
	logger = l
	defer l.Sync()

	logger.Info("logger construction succeeded")

	ec, err := elasticsearch.NewClient(elasticsearch.Config{Addresses: []string{
		"http://192.168.31.153:30200",
	}})
	if err != nil {
		log.Fatalf("Error creating the client: %s", err)
	}

	esClient = ec
	res, err := esClient.Info()
	if err != nil {
		log.Fatalf("Error getting response: %s", err)
	}
	// defer res.Body.Close()
	if res.IsError() {
		log.Fatalf("Error: %s", res.String())
	}
	blockResponse, err := esClient.Indices.Exists([]string{"block"})
	if err != nil {
		log.Println(err)
		os.Exit(1)
	}
	if blockResponse.StatusCode == 404 {
		var createIndexResponse, err = esClient.Indices.Create("block")
		if err != nil {
			log.Println(err)
			os.Exit(1)
		}
		if createIndexResponse.IsError() {
			log.Println(err)
			os.Exit(1)
		}
	}
	txResponse, err := esClient.Indices.Exists([]string{"tx"})
	if err != nil {
		log.Println(err)
		os.Exit(1)
	}
	if txResponse.StatusCode == 404 {
		var createIndexResponse, err = esClient.Indices.Create("tx")
		if err != nil {
			log.Println(err)
			os.Exit(1)
		}
		if createIndexResponse.IsError() {
			log.Println(err)
			os.Exit(1)
		}
	}
	// _path := "/home/chain/rpc/geth.ipc"
	_path := "http://192.168.31.252:8545"
	// bootClient, err := rpc.Dial(_path)
	// if err != nil {
	// 	panic(err)
	// }
	gcl, err := ethclient.Dial(_path)
	// nodeInfo, err3 := gcl.GetNodeInfo(context.Background())
	if err != nil {
		panic(err)
	}
	sync(gcl)
}
