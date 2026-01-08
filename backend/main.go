package main

import (
	"nkust-calendar/handlers"
	"time"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
)

func main() {
	r := gin.Default()

	r.Use(cors.New(cors.Config{
		AllowOrigins:     []string{"http://localhost:3000"}, 
		AllowMethods:     []string{"POST", "OPTIONS"},
		AllowHeaders:     []string{"Content-Type"},
		ExposeHeaders:    []string{"Content-Disposition"}, 
		AllowCredentials: true,
		MaxAge:           12 * time.Hour,
	}))

	// 設定 API 路由
	r.POST("/api/export-ics", handlers.ExportICSHandler)

	r.Run(":8081")
}