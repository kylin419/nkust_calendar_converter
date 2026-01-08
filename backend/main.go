package main

import (
	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
	"nkust-calendar/handlers"
	"os"
	"net/http"
)

func main() {
	r := gin.Default()

	r.Use(cors.New(cors.Config{
    AllowOrigins:     []string{"https://nkust-cal-convert.vercel.app","http://localhost:3000"}, 
    AllowMethods:     []string{"POST", "OPTIONS"},
    AllowHeaders:     []string{"Content-Type"},
    ExposeHeaders:    []string{"Content-Disposition"},
    AllowCredentials: true,
}))
	r.GET("/", func(c *gin.Context) {
		c.JSON(http.StatusOK, gin.H{"status": "UP", "message": "NKUST API is running"})
	})
	// 設定 API 路由
	r.POST("/api/export-ics", handlers.ExportICSHandler)
	port := os.Getenv("PORT")
	if port == "" {
		port = "8081"
	}
	r.Run(":" + port)
}
