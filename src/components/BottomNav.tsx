"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Ticket, Shuffle, AlignJustify, X, Trophy } from "lucide-react";
import { useState } from "react";

const navItems = [
  {
    href: "/my-tickets",
    label: "My tickets",
    icon: Ticket,
  },
  {
    href: "/transactions",
    label: "Transactions",
    icon: Shuffle,
  },
];

export default function BottomNav() {
  const pathname = usePathname();
  const [moreOpen, setMoreOpen] = useState(false);

  return (
    <>
      {/* "More" sheet */}
      {moreOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/20"
          onClick={() => setMoreOpen(false)}
        >
          <div
            className="absolute bottom-20 left-0 right-0 bg-white border-t border-gray-200 rounded-t-2xl shadow-xl overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 bg-[#cc0000] rounded-full flex items-center justify-center">
                  <Trophy size={14} className="text-white" />
                </div>
                <span className="text-gray-900 font-black text-sm tracking-wide">FIFA World Cup 2026™</span>
              </div>
              <button onClick={() => setMoreOpen(false)} className="text-gray-400 hover:text-gray-600">
                <X size={20} />
              </button>
            </div>
            <div className="divide-y divide-gray-100">
              {[
                { href: "/matches", label: "Browse Matches" },
                { href: "/matches", label: "Buy Tickets" },
              ].map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMoreOpen(false)}
                  className={`flex items-center px-5 py-4 text-sm font-medium transition-colors hover:bg-gray-50 ${
                    pathname === item.href ? "text-[#cc0000]" : "text-gray-800"
                  }`}
                >
                  {item.label}
                </Link>
              ))}
            </div>
            <div className="h-6" />
          </div>
        </div>
      )}

      {/* Bottom nav bar */}
      <nav className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-200 safe-area-pb">
        <div className="flex items-start justify-around py-2 pb-3">
          {navItems.map(({ href, label, icon: Icon }) => {
            const active = pathname === href;
            return (
              <Link
                key={href}
                href={href}
                className="flex flex-col items-center gap-1 min-w-20"
              >
                <div
                  className={`w-12 h-12 rounded-full flex items-center justify-center transition-colors ${
                    active ? "bg-gray-100" : "bg-transparent"
                  }`}
                >
                  <Icon size={22} className="text-gray-900" strokeWidth={1.8} />
                </div>
                <span className={`text-xs font-medium ${active ? "text-gray-900" : "text-gray-600"}`}>
                  {label}
                </span>
              </Link>
            );
          })}

          {/* More button */}
          <button
            onClick={() => setMoreOpen((v) => !v)}
            className="flex flex-col items-center gap-1 min-w-20"
          >
            <div
              className={`w-12 h-12 rounded-full flex items-center justify-center transition-colors ${
                moreOpen ? "bg-gray-100" : "bg-transparent"
              }`}
            >
              <AlignJustify size={22} className="text-gray-900" strokeWidth={1.8} />
            </div>
            <span className="text-xs font-medium text-gray-600">More</span>
          </button>
        </div>
      </nav>
    </>
  );
}
