import { AcademicCalendarInfo, AcademicEvent } from "../types/academic";

export function parseAcademicCalendar(rawText: string): AcademicCalendarInfo {
  const events: AcademicEvent[] = [];
  const textNoSpace = rawText.replace(/\s+/g, "");
  const semesterRegex = /(\d{3})學年度(?:第)?([一二12])學期/;
  const semMatch = textNoSpace.match(semesterRegex);

  let detectedSemester = "未知學期";
  let isFallSemester = false; 

  if (semMatch) {
    const year = semMatch[1];
    const term = semMatch[2] === "一" || semMatch[2] === "1" ? "1" : "2";
    detectedSemester = `${year}-${term}`;
    isFallSemester = term === "1";
  } else {
    const backupMatch = textNoSpace.match(/(\d{3})-(\d)/);
    if (backupMatch) {
      detectedSemester = `${backupMatch[1]}-${backupMatch[2]}`;
      isFallSemester = backupMatch[2] === "1";
    }
  }
  let cleanText = rawText.replace(/\n/g, " ").replace(/\s+/g, " ");
  cleanText = cleanText.replace(/\(\s*(\d{1,2})\s*\/\s*(\d{1,2})/g, "($1/$2");


  const dateMarkerRegex = /\((?!\d{4})\d{1,2}[\/\d~起前止迄\- ]+\)/g;
  const matches = Array.from(cleanText.matchAll(dateMarkerRegex));

  for (let i = 0; i < matches.length; i++) {
    const startIdx = matches[i].index!;
    const endIdx =
      i < matches.length - 1 ? matches[i + 1].index! : cleanText.length;

    const segment = cleanText.substring(startIdx, endIdx);
    const segmentMatch = segment.match(/\(([^)]+)\)\s*(.*)/);

    if (segmentMatch) {
      const dateStr = segmentMatch[1].trim();
      let title = segmentMatch[2].trim();

      title = title
        .replace(/\s\d+(\s+\d+){2,}.*$/, "") 
        .replace(/[\s○課註秘總學外基輔體]+$/, "") 
        .replace(/\s+[一二三四五六七八九十百]+[\s\d]*[月]*$/, "") 
        .replace(/^[)）\s:：\-/]+/, "")
        .trim();

      const monthMatch = dateStr.match(/(\d{1,2})\//);
      if (monthMatch && title.length >= 2) {
        events.push({
          id: Math.random().toString(36).substring(2, 9),
          date: dateStr,
          title: title,
          isSelected: true,
        });
      }
    }
  }

  const finalEvents = events
    .filter(
      (ev, index, self) =>
        index ===
        self.findIndex((t) => t.date === ev.date && t.title === ev.title)
    )
    .sort((a, b) => {
      const getSortVal = (s: string) => {
        const m = s.match(/(\d+)\/(\d+)/);
        if (!m) return 0;
        let month = parseInt(m[1]);
        let day = parseInt(m[2]);

        if (isFallSemester) {
          if (month < 8) month += 12;
        } else {
     
        }
        return month * 100 + day;
      };
      return getSortVal(a.date) - getSortVal(b.date);
    });

  return { semester: detectedSemester, events: finalEvents };
}
