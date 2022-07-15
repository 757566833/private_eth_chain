package main

import (
	"context"
	"log"
	"net/http"
	"os"

	"github.com/elastic/go-elasticsearch/v7"
	"github.com/ethereum/go-ethereum/ethclient/gethclient"
	"github.com/ethereum/go-ethereum/rpc"
	"github.com/gin-gonic/gin"
)

type album struct {
	ID     string  `json:"id"`
	Title  string  `json:"title"`
	Artist string  `json:"artist"`
	Price  float64 `json:"price"`
}

var albums = []album{
	{ID: "1", Title: "Blue Train", Artist: "John Coltrane", Price: 56.99},
	{ID: "2", Title: "Jeru", Artist: "Gerry Mulligan", Price: 17.99},
	{ID: "3", Title: "Sarah Vaughan and Clifford Brown", Artist: "Sarah Vaughan", Price: 39.99},
}
var esClient *elasticsearch.Client

func getBootNodeInfo(c *gin.Context) {
	node := c.Param("node")
	_path := "/home/chain/" + node + "/geth.ipc"
	bootClient, err := rpc.Dial(_path)
	if err != nil {
		panic(err)
	}
	gcl := gethclient.New(bootClient)
	nodeInfo, err3 := gcl.GetNodeInfo(context.Background())
	if err3 != nil {
		panic(err3)
	}
	c.IndentedJSON(http.StatusOK, nodeInfo)
}
func getGenesis(c *gin.Context) {
	c.FileAttachment("./genesis.json", "genesis.json")
}
func getAlbums(c *gin.Context) {
	c.IndentedJSON(http.StatusOK, albums)
}
func getEs(c *gin.Context) {
	c.IndentedJSON(http.StatusOK, albums)
}

func main() {
	esClient, err := elasticsearch.NewClient(elasticsearch.Config{Addresses: []string{
		"http://192.168.246.22:9200",
	}})
	if err != nil {
		log.Fatalf("Error creating the client: %s", err)
	}

	res, err := esClient.Info()
	if err != nil {
		log.Fatalf("Error getting response: %s", err)
	}
	defer res.Body.Close()
	if res.IsError() {
		log.Fatalf("Error: %s", res.String())
	}
	response, err := esClient.Indices.Exists([]string{"block"})
	if err != nil {
		log.Println(err)
		os.Exit(1)
	}
	if response.StatusCode == 404 {
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

	router := gin.Default()
	router.GET("/albums", getAlbums)
	router.GET("/es", getEs)
	router.GET("/nodeInfo/:node", getBootNodeInfo)
	router.GET("/genesis", getGenesis)
	router.Run("0.0.0.0:8090")
}
