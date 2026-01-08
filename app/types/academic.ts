export interface AcademicEvent {
  id: string;
  date: string;
  title: string;
  description?: string;
  isSelected: boolean;
}

export interface AcademicCalendarInfo{
    semester: string;
    events: AcademicEvent[];
}