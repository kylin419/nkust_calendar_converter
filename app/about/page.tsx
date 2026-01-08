"use client";

import Header from "../components/Header";
import Link from "next/link";

export default function InstructionsPage() {
  const steps = [
    {
      title: "下載 PDF",
      desc: "進入高科大教務處網頁，點選行事曆，下載學期行事曆 PDF 檔案。",
      icon: "",
    },
    {
      title: "上傳並解析",
      desc: "回到本站首頁，將下載的 PDF 拖入上傳區，系統會自動提取事件內容及時間。",
      icon: "",
    },
    {
      title: "選取事件",
      desc: "勾選想要加入行事曆中的事件",
      icon: "",
    },
    {
      title: "匯入行事曆",
      desc: "點擊『下載行事曆』按鈕獲取 .ics 檔案，即可匯入 Google 日曆、Apple 日曆或 Outlook。",
      icon: "",
    },
  ];

  return (
    <main className="min-h-screen bg-[#f4f7f9]">
      <Header />

      <div className="max-w-4xl mx-auto p-6 space-y-10 py-12">
        {/* 標題區 */}
        <section className="text-center space-y-4">
          <h1 className="text-4xl font-extrabold text-[#004b93]">使用說明</h1>
          <p className="text-gray-600 text-lg">
            只需三秒鐘，將學期行事曆轉成精美日曆
          </p>
        </section>

        {/* 步驟區 */}
        <div className="grid md:grid-cols-2 gap-6">
          {steps.map((step, index) => (
            <div
              key={index}
              className="bg-white p-6 rounded-xl shadow-sm border-l-4 border-[#b4975a] flex gap-4"
            >
              <span className="text-4xl">{step.icon}</span>
              <div>
                <h3 className="font-bold text-xl text-[#004b93] mb-2">{`Step ${
                  index + 1
                }: ${step.title}`}</h3>
                <p className="text-gray-500 leading-relaxed">{step.desc}</p>
              </div>
            </div>
          ))}
        </div>
        <div className="text-center">
          <Link
            href="/"
            className="text-[#004b93] hover:text-[#b4975a] font-bold transition-colors underline underline-offset-8"
          >
            ← 回到首頁開始使用
          </Link>
        </div>
      </div>

      <footer className="py-12 text-center text-gray-400 text-sm">
        Developed by kylin @ NKUST Electronic Engineering
      </footer>
    </main>
  );
}
