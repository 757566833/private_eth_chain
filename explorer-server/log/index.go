package log

import (
	"encoding/json"
	"log"

	"go.uber.org/zap"
)

var Logger *zap.Logger

func InitLogger() {
	logger, _ := zap.NewProduction()
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
		log.Fatalf("Error init log: %s", err)
	}
	logger, err := cfg.Build()
	if err != nil {
		log.Fatalf("Error build log: %s", err)
	}
	defer logger.Sync()
	Logger = logger
}
