package db

import (
	"github.com/ethereum/go-ethereum/ethclient"
	"log"
	"os"
)

var EthClient *ethclient.Client

func InitEthClient() {
	ChainHttpUrl := os.Getenv("CHAIN_HTTP_URL")
	// todo 这里应该连接ipc更快
	// _path := "/home/chain/rpc/geth.ipc"
	_path := ChainHttpUrl
	// bootClient, err := rpc.Dial(_path)
	// if err != nil {
	// 	panic(err)
	// }
	gcl, err := ethclient.Dial(_path)
	if err != nil {
		log.Fatalf("Error: %s", "create eth client failed")
		os.Exit(1)
	}
	EthClient = gcl
}
