package services

import (
	"fmt"
	"nkust-calendar/models"
	"strings"
	"time"
)

func GenerateICS(req models.AcademicRequest) string {
	var b strings.Builder
	b.WriteString("BEGIN:VCALENDAR\r\nVERSION:2.0\r\nPRODID:-//NKUST//Calendar//ZH\r\n")

	var rocYear, semType int
	_, err := fmt.Sscanf(req.Semester, "%d-%d", &rocYear, &semType)

	if err != nil {
		now := time.Now()
		rocYear = now.Year() - 1911
		semType = 1
	}

	baseYear := rocYear + 1911 

	for _, ev := range req.Events {
		month := getMonth(ev.Date)
		eventYear := baseYear

		if semType == 2 {
			eventYear = baseYear + 1
		} else if semType == 1 && month < 8 {
			eventYear = baseYear + 1
		}

		start, end := parseAcademicDate(ev.Date, eventYear)
		
		b.WriteString("BEGIN:VEVENT\r\n")
		b.WriteString(fmt.Sprintf("DTSTAMP:%s\r\n", time.Now().Format("20060102T150405Z")))
		b.WriteString(fmt.Sprintf("DTSTART;VALUE=DATE:%s\r\n", start.Format("20060102")))
		b.WriteString(fmt.Sprintf("DTEND;VALUE=DATE:%s\r\n", end.Format("20060102")))
		b.WriteString(fmt.Sprintf("SUMMARY:%s\r\n", ev.Title))
		b.WriteString("END:VEVENT\r\n")
	}
	b.WriteString("END:VCALENDAR\r\n")
	return b.String()
}

func getMonth(dateStr string) int {
	var m int
	fmt.Sscanf(dateStr, "%d/", &m)
	return m
}

func parseAcademicDate(dateStr string, year int) (time.Time, time.Time) {
	sep := "-"
	if strings.Contains(dateStr, "~") { sep = "~" }

	if strings.Contains(dateStr, sep) {
		parts := strings.Split(dateStr, sep)
		s := parseSingle(parts[0], year)
		e := parseSingle(parts[1], year)
		return s, e.AddDate(0, 0, 1)
	}
	t := parseSingle(dateStr, year)
	return t, t.AddDate(0, 0, 1)
}

func parseSingle(s string, year int) time.Time {
	var m, d int
	fmt.Sscanf(strings.TrimSpace(s), "%d/%d", &m, &d)
	return time.Date(year, time.Month(m), d, 0, 0, 0, 0, time.Local)
}