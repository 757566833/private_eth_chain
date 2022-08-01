package route

import (
	"explorer/controller"
	"github.com/gin-gonic/gin"
)

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
func InitRouter() *gin.Engine {
	router := gin.Default()
	router.Use(CORSMiddleware())
	router.GET("/block/:block", controller.GetBlock)
	router.GET("/tx/:tx", controller.GetTx)
	router.GET("/blocks", controller.GetBlocks)
	router.GET("/txs", controller.GetTxs)
	router.GET("/address/:address", controller.GetAddress)
	router.GET("/block/hash/:hash", controller.GetBlockByHash)
	return router
}
