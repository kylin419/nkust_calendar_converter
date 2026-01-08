package models

type AcademicEvent struct {
    ID    string `json:"id"`
    Date  string `json:"date"`
    Title string `json:"title"`
}

type AcademicRequest struct {
    Semester string          `json:"semester"` 
    Events   []AcademicEvent `json:"events"`
}