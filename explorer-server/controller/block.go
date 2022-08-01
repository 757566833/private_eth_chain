package controller

import (
	"context"
	"encoding/json"
	"explorer/db"
	"github.com/elastic/go-elasticsearch/v7/esapi"
	"github.com/gin-gonic/gin"
	"net/http"
	"strconv"
	"strings"
)

func GetBlock(c *gin.Context) {
	block := c.Param("block")
	if block == "" {
		c.IndentedJSON(http.StatusBadRequest, "")
	}
	blockReq := esapi.GetRequest{
		Index:      "block",
		DocumentID: block,
	}
	res, err := blockReq.Do(context.Background(), db.EsClient)
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
func GetBlocks(c *gin.Context) {
	defaultSize := 20
	sizeStr := c.DefaultQuery("size", "20")
	size, err := strconv.Atoi(sizeStr)
	if err != nil {
		size = defaultSize
	}
	defaultPage := 1
	pageStr := c.DefaultQuery("page", "1")
	page, err := strconv.Atoi(pageStr)
	if err != nil {
		page = defaultPage
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

	res, err := blockReq.Do(context.Background(), db.EsClient)
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

func GetBlockByHash(c *gin.Context) {
	hash := c.Param("hash")
	if hash == "" {
		c.IndentedJSON(http.StatusBadRequest, "")
	}
	body := `{
		"query": {
		  "term": {
			"blockHash": {
			  "value": "` + hash + `"
			}
		  }
		}
	  }
	`
	req := esapi.SearchRequest{
		Index: []string{"block"},
		Body:  strings.NewReader(body),
	}
	res, err := req.Do(context.Background(), db.EsClient)
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
