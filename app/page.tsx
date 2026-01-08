"use client";

import { useState } from "react";
import Header from "./components/Header";
import AcademicEventList from "@/app/components/AcademicEventList";
import { parseAcademicCalendar } from "@/app/utils/academicParser";
import { AcademicCalendarInfo } from "@/app/types/academic";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || '';

export default function CalendarTool() {
  const [data, setData] = useState<AcademicCalendarInfo | null>(null);
  const [loading, setLoading] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);

  const toggleEvent = (id: string) => {
    if (!data) return;
    setData({
      ...data,
      events: data.events.map((e) =>
        e.id === id ? { ...e, isSelected: !e.isSelected } : e
      ),
    });
  };

  const toggleAll = (selected: boolean) => {
    if (!data) return;
    setData({
      ...data,
      events: data.events.map((e) => ({ ...e, isSelected: selected })),
    });
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setLoading(true);
    const formData = new FormData();
    formData.append("file", file);

    try {
      // 呼叫 Vercel 內建的 API Route
      const res = await fetch("/api/extract-pdf", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) throw new Error("伺服器提取文字失敗");

      const { text } = await res.json();
      setData(parseAcademicCalendar(text));
    } catch (error) {
      console.error(error);
      alert("解析失敗，請確認 PDF 內容格式");
    } finally {
      setLoading(false);
    }
  };

  const handleExport = async () => {
    if (!data) return;
    const selectedEvents = data.events.filter((e) => e.isSelected);

    if (selectedEvents.length === 0) {
      alert("請至少選取一個項目");
      return;
    }

    setIsDownloading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/api/export-ics`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          semester: data.semester,
          events: selectedEvents,
        }),
      });

      if (!response.ok) throw new Error("產生 ICS 失敗");

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `nkust_${data.semester}_calendar.ics`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error(error);
      alert("ICS 匯出失敗，請確認伺服器連線");
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#f4f7f9]">
      <Header />
      <div className="max-w-4xl mx-auto p-6 space-y-8">
        <div className="bg-white p-10 rounded-xl shadow-lg border-t-4 border-[#b4975a] text-center">
          <h2 className="text-2xl font-bold text-[#004b93]">
            NKUST {data ? data.semester : ""} 校曆轉行事曆
          </h2>
          <p className="text-gray-500 mt-2 mb-8">
            上傳高科大 PDF 校曆，自動轉換為行事曆格式（.ics）
          </p>

          <label
            htmlFor="pdf-upload"
            className={`cursor-pointer px-10 py-4 rounded-full font-bold shadow-lg transition inline-block text-white ${
              loading ? "bg-gray-400" : "bg-[#004b93] hover:bg-blue-800"
            }`}
          >
            {loading ? "讀取中..." : "選擇校曆 PDF"}
            <input
              id="pdf-upload"
              title="請選擇校曆 PDF 檔案"
              type="file"
              accept=".pdf"
              className="hidden"
              onChange={handleFileUpload}
              disabled={loading}
            />
          </label>
        </div>

        {data && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <AcademicEventList
              events={data.events}
              onToggle={toggleEvent}
              onToggleAll={toggleAll}
            />
            <div className="flex justify-center py-10">
              <button
                onClick={handleExport}
                disabled={isDownloading}
                className="bg-[#b4975a] text-white px-12 py-4 rounded-full font-bold shadow-xl hover:scale-105 active:scale-95 transition-all disabled:bg-gray-400"
              >
                {isDownloading
                  ? "檔案產生中..."
                  : `匯出 ${data.semester} 項目 (.ics)`}
              </button>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
