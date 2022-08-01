package sync

import (
	"bytes"
	"context"
	"encoding/json"
	"explorer/db"
	"explorer/log"
	"github.com/elastic/go-elasticsearch/v7/esapi"
	"github.com/ethereum/go-ethereum/common"
	"github.com/ethereum/go-ethereum/core/types"
	"io"
	"math/big"
	"strings"
	"time"
)

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
	GasLimit    string           `json:"gasLimit"         gencodec:"required"`
	GasUsed     string           `json:"gasUsed"          gencodec:"required"`
	Time        uint64           `json:"timestamp"        gencodec:"required"`
	Extra       []byte           `json:"extraData"        gencodec:"required"`
	MixDigest   common.Hash      `json:"mixHash"`
	Nonce       types.BlockNonce `json:"nonce"`

	// BaseFee was added by EIP-1559 and is ignored in legacy headers.
	BaseFee *big.Int `json:"baseFeePerGas" rlp:"optional"`

	Txns      int         `json:"txns"                  gencodec:"required"`
	BlockHash common.Hash `json:"blockHash"             gencodec:"required"`
	Size      string      `json:"size"                  gencodec:"required"`
}

type ESTx struct {
	Type       byte             `json:"type"                        gencodec:"required"`
	Nonce      string           `json:"nonce"`
	GasPrice   string           `json:"gasPrice"                    gencodec:"required"`
	GasTipCap  string           `json:"maxPriorityFeePerGas"        gencodec:"required"`
	GasFeeCap  string           `json:"maxFeePerGas"                gencodec:"required"`
	Gas        string           `json:"gas"                         gencodec:"required"`
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
	IsFake     bool             `json:"isFake"                      gencodec:"required"`

	// receipt
	ReceiptType       uint8        `json:"receiptType"`
	PostState         []byte       `json:"postState"`
	Status            string       `json:"status"`
	CumulativeGasUsed string       `json:"cumulativeGasUsed"       gencodec:"required"`
	Bloom             types.Bloom  `json:"logsBloom"               gencodec:"required"`
	Logs              []*types.Log `json:"logs"                    gencodec:"required"`

	// Implementation fields: These fields are added by geth when processing a transaction.
	// They are stored in the chain database.
	TxHash          common.Hash    `json:"transactionHash"         gencodec:"required"`
	ContractAddress common.Address `json:"contractAddress"`
	GasUsed         string         `json:"gasUsed"                 gencodec:"required"`

	// Inclusion information: These fields provide information about the inclusion of the
	// transaction corresponding to this receipt.
	BlockHash        common.Hash `json:"blockHash"`
	BlockNumber      string      `json:"blockNumber"`
	TransactionIndex uint        `json:"transactionIndex"`
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

func Sync() {
	if db.EsClient != nil && db.EthClient != nil {
		var startStr = "0"

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
		esBlockResponse, err := blockReq.Do(context.Background(), db.EsClient)
		if err != nil {
			startStr = "0"
		}
		defer esBlockResponse.Body.Close()
		if esBlockResponse.StatusCode >= 300 {
			startStr = "0"
		} else {
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
		num, err := db.EthClient.BlockNumber(context.Background())
		if err != nil {
			log.Logger.Error("区块链获取最新区块报错")
			panic(err)
		}
		length := new(big.Int).SetUint64(num)
		length.Sub(length, big.NewInt(1))
		var startBg *big.Int
		var b bool
		startBg, b = new(big.Int).SetString(startStr, 10)
		if !b {
			startBg = big.NewInt(0)
		}
		for i := startBg; i.Cmp(length) == -1; i.Add(i, big.NewInt(1)) {
			func(i *big.Int) {
				log.Logger.Info(i.String())
				msg, err := db.EthClient.BlockByNumber(context.Background(), i)
				if err != nil {
					log.Logger.Error("获取区块信息出错")
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
				esBlock.GasLimit = new(big.Int).SetUint64(header.GasLimit).String()
				esBlock.GasUsed = new(big.Int).SetUint64(header.GasUsed).String()
				esBlock.Time = header.Time
				esBlock.Extra = header.Extra
				esBlock.MixDigest = header.MixDigest
				esBlock.Nonce = header.Nonce
				esBlock.BaseFee = header.BaseFee
				esBlock.Txns = leng
				esBlock.BlockHash = msg.Hash()
				esBlock.Size = msg.Size().String()

				blockBuf, err := json.Marshal(esBlock)
				if err != nil {
					log.Logger.Error("序列化block出错")
					panic(err)
				}

				blockReq := esapi.IndexRequest{
					Index:      "block",
					DocumentID: header.Number.String(),
					Body:       bytes.NewReader(blockBuf),
				}

				blockRes, blockErr := blockReq.Do(context.Background(), db.EsClient)
				if blockErr != nil {
					log.Logger.Error("es写入出错")
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
							log.Logger.Error("序列化批量创建方法出错")
							panic(createErr)
						}
						txBuf.Write(createStr)
						txBuf.WriteByte('\n')
						esTx := new(ESTx)
						esTx.Type = tx.Type()
						esTx.Nonce = new(big.Int).SetUint64(tx.Nonce()).String()
						esTx.GasPrice = tx.GasPrice().String()
						esTx.GasTipCap = tx.GasTipCap().String()
						esTx.GasFeeCap = tx.GasFeeCap().String()
						esTx.Gas = new(big.Int).SetUint64(tx.Gas()).String()
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
							log.Logger.Error("as message 出错")
							panic(asMsgErr)
						}

						esTx.IsFake = msg.IsFake()
						esTx.AccessList = msg.AccessList()
						esTx.From = msg.From()

						receipt, receiptErr := db.EthClient.TransactionReceipt(context.Background(), tx.Hash())
						if receiptErr != nil {
							log.Logger.Error("as message 出错")
							panic(receiptErr)
						}

						esTx.ReceiptType = receipt.Type
						esTx.PostState = receipt.PostState
						esTx.Status = new(big.Int).SetUint64(receipt.Status).String()
						esTx.CumulativeGasUsed = new(big.Int).SetUint64(receipt.CumulativeGasUsed).String()
						esTx.Bloom = receipt.Bloom
						esTx.Logs = receipt.Logs
						esTx.TxHash = receipt.TxHash
						esTx.ContractAddress = receipt.ContractAddress
						esTx.GasUsed = new(big.Int).SetUint64(receipt.GasUsed).String()
						esTx.BlockHash = receipt.BlockHash
						esTx.BlockNumber = receipt.BlockNumber.String()
						esTx.TransactionIndex = receipt.TransactionIndex
						paramsStr, paramsErr := json.Marshal(esTx)
						if paramsErr != nil {
							log.Logger.Error("序列化批量创建参数出错")
							panic(paramsErr)
						}
						txBuf.Write(paramsStr)
						txBuf.WriteByte('\n')

					}

					txReq := esapi.BulkRequest{
						Body: bytes.NewReader(txBuf.Bytes()),
					}
					txRes, txErr := txReq.Do(context.Background(), db.EsClient)

					if txErr != nil {
						log.Logger.Error("批量写入tx出错")
						panic(txErr)
					}
					defer txRes.Body.Close()
					if txRes.StatusCode >= 300 {
						log.Logger.Error("批量写入http返回报错")
					}

				}
			}(i)

		}
	}

	timer1 := time.NewTimer(time.Second * 5)
	<-timer1.C //阻塞，5秒以后继续执行
	Sync()
}
