package main

import (
	"context"
	"encoding/json"
	"log"
	"net/http"
	"os"
	"strconv"
	"strings"

	"github.com/elastic/go-elasticsearch/v7"
	"github.com/elastic/go-elasticsearch/v7/esapi"
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

func getGenesis(c *gin.Context) {
	c.FileAttachment("./genesis.json", "genesis.json")
}
func getAlbums(c *gin.Context) {
	c.IndentedJSON(http.StatusOK, albums)
}

func getTx(c *gin.Context) {
	tx := c.Param("tx")
	if tx == "" {
		c.IndentedJSON(http.StatusBadRequest, "")
	}
	req := esapi.GetRequest{
		Index:      "tx",
		DocumentID: tx,
	}
	res, err := req.Do(context.Background(), esClient)
	if err != nil {
		panic(err)
	}
	defer res.Body.Close()
	var response any
	err2 := json.NewDecoder(res.Body).Decode(&response)
	if err2 != nil {
		panic(err2)
	}
	c.IndentedJSON(res.StatusCode, response)
}
func getBlock(c *gin.Context) {
	block := c.Param("block")
	if block == "" {
		c.IndentedJSON(http.StatusBadRequest, "")
	}
	blockReq := esapi.GetRequest{
		Index:      "block",
		DocumentID: block,
	}
	res, err := blockReq.Do(context.Background(), esClient)
	if err != nil {
		panic(err)
	}
	defer res.Body.Close()
	var response any
	err2 := json.NewDecoder(res.Body).Decode(&response)
	if err2 != nil {
		panic(err2)
	}
	c.IndentedJSON(res.StatusCode, response)
}
func getBlocks(c *gin.Context) {
	defatultSize := 20
	sizeStr := c.DefaultQuery("size", "20")
	size, err := strconv.Atoi(sizeStr)
	if err != nil {
		size = defatultSize
	}
	defatultPage := 1
	pageStr := c.DefaultQuery("page", "1")
	page, err := strconv.Atoi(pageStr)
	if err != nil {
		page = defatultPage
	}
	from := (page - 1) * size

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

	res, err := blockReq.Do(context.Background(), esClient)
	if err != nil {
		panic(err)
	}
	defer res.Body.Close()
	var response any
	err2 := json.NewDecoder(res.Body).Decode(&response)
	if err2 != nil {
		panic(err2)
	}
	// byt, err := io.ReadAll(res.Body)
	// str := string(byt)
	// if err != nil {
	// 	panic(err)
	// }
	// if res.StatusCode > 300 {
	// 	c.IndentedJSON(res.StatusCode, str)
	// }
	// fmt.Println(str)
	// response := []byte(``)
	// err = json.Unmarshal(response, &str)
	// if err != nil {
	// 	panic(err)
	// }
	c.IndentedJSON(res.StatusCode, response)
}

func getTxs(c *gin.Context) {
	blockStr := c.DefaultQuery("block", "")
	defatultSize := 20
	sizeStr := c.DefaultQuery("size", "20")
	size, err := strconv.Atoi(sizeStr)
	if err != nil {
		size = defatultSize
	}
	defatultPage := 1
	pageStr := c.DefaultQuery("page", "1")
	page, err := strconv.Atoi(pageStr)
	if err != nil {
		page = defatultPage
	}
	from := (page - 1) * size

	sort := `"sort": [
		{
		  "timestamp":{
			"order": "desc"
		  }
		}
	  ]
	`
	query := `"query": {
		"match": {
		  "number": "` + blockStr + `"
		}
	  }
	`
	var body string
	if blockStr == "" {
		body = `{` + sort + `}`
	} else {
		body = `{` + query + "," + sort + `}`
	}
	// _body := `{
	// 	"sort": [
	// 	   {
	// 		 "timestamp":{
	// 		   "order": "desc"
	// 		 }
	// 	   }
	// 	 ]
	//    }`

	req := esapi.SearchRequest{
		Index: []string{"tx"},
		Size:  &size,
		From:  &from,
		Body:  strings.NewReader(body),
	}

	res, err := req.Do(context.Background(), esClient)
	if err != nil {
		panic(err)
	}
	defer res.Body.Close()
	var response any
	err2 := json.NewDecoder(res.Body).Decode(&response)
	if err2 != nil {
		panic(err2)
	}
	// byt, err := io.ReadAll(res.Body)
	// str := string(byt)
	// if err != nil {
	// 	panic(err)
	// }
	// if res.StatusCode > 300 {
	// 	c.IndentedJSON(res.StatusCode, str)
	// }
	// fmt.Println(str)
	// response := []byte(``)
	// err = json.Unmarshal(response, &str)
	// if err != nil {
	// 	panic(err)
	// }
	c.IndentedJSON(res.StatusCode, response)
}

func getAddress(c *gin.Context) {
	address := c.Param("address")
	if address == "" {
		c.IndentedJSON(http.StatusBadRequest, "")
	}
	defatultSize := 20
	sizeStr := c.DefaultQuery("size", "20")
	size, err := strconv.Atoi(sizeStr)
	if err != nil {
		size = defatultSize
	}
	defatultPage := 1
	pageStr := c.DefaultQuery("page", "1")
	page, err := strconv.Atoi(pageStr)
	if err != nil {
		page = defatultPage
	}
	from := (page - 1) * size
	_body := `{
		"query": {
		  "bool": {
			"should": [
			  {
				"term": {
				  "to": {
					"value": "` + address + `"
				  }
				}
			  },
			  {
				"term": {
				  "from": {
					"value": "` + address + `"
				  }
				}
			  }
			]
		  }
		}
	  }`

	req := esapi.SearchRequest{
		Index: []string{"tx"},
		Size:  &size,
		From:  &from,
		Body:  strings.NewReader(_body),
	}

	res, err := req.Do(context.Background(), esClient)
	if err != nil {
		panic(err)
	}
	defer res.Body.Close()
	var response any
	err2 := json.NewDecoder(res.Body).Decode(&response)
	if err2 != nil {
		panic(err2)
	}
	// byt, err := io.ReadAll(res.Body)
	// str := string(byt)
	// if err != nil {
	// 	panic(err)
	// }
	// if res.StatusCode > 300 {
	// 	c.IndentedJSON(res.StatusCode, str)
	// }
	// fmt.Println(str)
	// response := []byte(``)
	// err = json.Unmarshal(response, &str)
	// if err != nil {
	// 	panic(err)
	// }
	c.IndentedJSON(res.StatusCode, response)
}
func CORSMiddleware() gin.HandlerFunc {
	return func(c *gin.Context) {
		c.Writer.Header().Set("Access-Control-Allow-Origin", "*")
		c.Writer.Header().Set("Access-Control-Allow-Credentials", "true")
		c.Writer.Header().Set("Access-Control-Allow-Headers", "Content-Type, Content-Length, Accept-Encoding, X-CSRF-Token, Authorization, accept, origin, Cache-Control, X-Requested-With")
		c.Writer.Header().Set("Access-Control-Allow-Methods", "POST, OPTIONS, GET, PUT")

		if c.Request.Method == "OPTIONS" {
			c.AbortWithStatus(204)
			return
		}

		c.Next()
	}
}

func main() {
	ELASTICSEARCH_PATH := os.Getenv("ELASTICSEARCH_PATH")
	ec, err := elasticsearch.NewClient(elasticsearch.Config{Addresses: []string{
		ELASTICSEARCH_PATH,
	}})
	if err != nil {
		log.Fatalf("Error creating the client: %s", err)
	}
	esClient = ec
	res, err := esClient.Info()
	if err != nil {
		log.Fatalf("Error getting response: %s", err)
	}
	defer res.Body.Close()
	if res.IsError() {
		log.Fatalf("Error: %s", res.String())
	}

	EXPLORER_SERVER_PORT := os.Getenv("EXPLORER_SERVER_PORT")
	router := gin.Default()
	router.Use(CORSMiddleware())
	router.GET("/albums", getAlbums)
	router.GET("/genesis", getGenesis)
	router.GET("/block/:block", getBlock)
	router.GET("/tx/:tx", getTx)
	router.GET("/blocks", getBlocks)
	router.GET("/txs", getTxs)
	router.GET("/address/:address", getAddress)
	router.Run("0.0.0.0:" + EXPLORER_SERVER_PORT)
}
