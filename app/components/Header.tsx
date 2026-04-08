"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Header() {
  const pathname = usePathname();

  const navItems = [
    { name: "首頁", href: "/" },
    { name: "使用說明", href: "/about" },
  ];

  return (
    <header className="bg-white shadow-sm border-b border-gray-100">
      <div className="max-w-4xl mx-auto px-4 py-3 md:px-6 md:py-4 flex justify-between items-center">
        <Link href="/" className="flex items-center gap-2 md:gap-3 group">
          <div className="bg-[#004b93] text-white w-8 h-8 md:w-10 md:h-10 rounded-full flex items-center justify-center font-bold text-lg md:text-xl transition-transform group-hover:scale-110">
            K
          </div>
          <div>
            <h1 className="text-[#004b93] font-black text-lg md:text-xl tracking-tight">
              高科大<span className="hidden xs:inline">行事曆轉換器</span>
            </h1>
            <p className="text-gray-400 text-[8px] md:text-[10px] uppercase tracking-widest font-medium">
              NKUST Calendar Converter
            </p>
          </div>
        </Link>

        <nav className="flex gap-1">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`px-3 py-1.5 md:px-4 md:py-2 rounded-lg text-sm font-bold transition-all ${
                  isActive
                    ? "text-[#004b93] bg-blue-50"
                    : "text-gray-500 hover:text-[#b4975a] hover:bg-gray-50"
                }`}
              >
                {item.name}
              </Link>
            );
          })}
        </nav>
      </div>
    </header>
  );
}
