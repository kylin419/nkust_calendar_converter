package handlers

import (
	"fmt"
	"net/http"
	"nkust-calendar/models"   // 請確保路徑正確
	"nkust-calendar/services" // 請確保路徑正確

	"github.com/gin-gonic/gin"
)

func ExportICSHandler(c *gin.Context) {
	// 1. 改為接收包含學期資訊的 Request 結構
	var req models.AcademicRequest
	
	// 接收 JSON 資料 (包含 semester 和 events 陣列)
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "無效的資料格式，請確認 JSON 結構"})
		return
	}

	icsContent := services.GenerateICS(req)

	fileName := fmt.Sprintf("nkust_%s_calendar.ics", req.Semester)
	
	c.Header("Content-Disposition", fmt.Sprintf("attachment; filename=%s", fileName))
	c.Header("Content-Type", "text/calendar; charset=utf-8")

	c.String(http.StatusOK, icsContent)
}