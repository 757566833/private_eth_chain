package db

import (
	"github.com/elastic/go-elasticsearch/v7"
	"log"
	"os"
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
}
