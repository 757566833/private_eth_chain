package db

import (
	"log"
	"os"

	"github.com/elastic/go-elasticsearch/v7"
)

var EsClient *elasticsearch.Client

func InitEsClient() {

	ElasticsearchPath := os.Getenv("ELASTICSEARCH_PATH")
	ec, err := elasticsearch.NewClient(elasticsearch.Config{Addresses: []string{
		ElasticsearchPath,
	}})
	if err != nil {
		log.Fatalf("Error creating the client: %s", err)
	}
	EsClient = ec
	res, err := EsClient.Info()
	if err != nil {
		log.Fatalf("Error getting response: %s", err)
	}
	defer res.Body.Close()
	if res.IsError() {
		log.Fatalf("Error: %s", res.String())
	}
	blockResponse, err := ec.Indices.Exists([]string{"block"})
	if err != nil {
		log.Fatalf("Error exists the block index: %s", err)
	}
	if blockResponse.StatusCode == 404 {
		var createIndexResponse, err = ec.Indices.Create("block")
		if err != nil {
			log.Fatalf("Error create the block index: %s", err)
		}
		if createIndexResponse.IsError() {
			log.Fatalf("Error create the block index: %s", err)
		}
	}
	txResponse, err := ec.Indices.Exists([]string{"tx"})
	if err != nil {
		log.Fatalf("Error exists the tx index: %s", err)
	}
	if txResponse.StatusCode == 404 {
		var createIndexResponse, err = ec.Indices.Create("tx")
		if err != nil {
			log.Fatalf("Error create the tx index: %s", err)
		}
		if createIndexResponse.IsError() {
			log.Fatalf("Error create the tx index: %s", err)
		}
	}
}
