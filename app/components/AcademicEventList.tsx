"use client";

import { AcademicEvent } from "../types/academic";

interface Props {
  events: AcademicEvent[];
  onToggle: (id: string) => void;
  onToggleAll: (selected: boolean) => void;
}

export default function AcademicEventList({
  events,
  onToggle,
  onToggleAll,
}: Props) {
  const selectedCount = events.filter((e) => e.isSelected).length;

  return (
    <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100 animate-in fade-in slide-in-from-bottom-4">
      {/* 頂部控制列 */}
      <div className="bg-[#004b93] p-3 px-4 md:p-4 md:px-6 flex justify-between items-center text-white">
        <div className="flex items-center gap-3">
          <input
            type="checkbox"
            className="w-5 h-5 accent-[#b4975a]"
            checked={selectedCount === events.length}
            onChange={(e) => onToggleAll(e.target.checked)}
          />
          <span className="font-bold">已選取 {selectedCount} 項事件</span>
        </div>
        <span className="text-xs opacity-70">點擊項目可取消/選取</span>
      </div>

      {/* 事件列表 */}
      <div className="max-h-[500px] overflow-y-auto">
        {events.map((event) => (
          <div
            key={event.id}
            onClick={() => onToggle(event.id)}
            className={`flex items-center gap-3 md:gap-4 p-3 md:p-4 border-b border-gray-50 cursor-pointer transition-all hover:bg-gray-50
              ${event.isSelected ? "bg-blue-50/30" : "opacity-40 grayscale"}`}
          >
            <div
              className={`w-1.5 h-10 rounded-full ${
                event.isSelected ? "bg-[#b4975a]" : "bg-gray-300"
              }`}
            />
            <div className="flex-1">
              <div className="text-blue-600 font-mono font-black text-sm">
                {event.date}
              </div>
              <div className="text-gray-800 font-bold">{event.title}</div>
            </div>
            <input
              type="checkbox"
              checked={event.isSelected}
              readOnly
              className="w-5 h-5 accent-[#004b93]"
            />
          </div>
        ))}
      </div>
    </div>
  );
}
