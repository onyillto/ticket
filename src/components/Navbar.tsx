"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Ticket, Trophy } from "lucide-react";

const links = [
  { href: "/", label: "Home" },
  { href: "/matches", label: "Matches" },
  { href: "/my-tickets", label: "My Tickets" },
];

export default function Navbar() {
  const pathname = usePathname();

  return (
    <nav className="sticky top-0 z-50 bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-9 h-9 bg-[#cc0000] rounded-full flex items-center justify-center">
              <Trophy size={18} className="text-white" />
            </div>
            <div className="leading-none">
              <p className="text-gray-900 font-black text-sm tracking-widest uppercase">FIFA</p>
              <p className="text-[#cc0000] font-bold text-xs tracking-wider">World Cup 2026™</p>
            </div>
          </Link>

          <div className="flex items-center gap-1">
            {links.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  pathname === l.href
                    ? "bg-[#cc0000] text-white"
                    : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                }`}
              >
                {l.label === "My Tickets" ? (
                  <span className="flex items-center gap-1.5">
                    <Ticket size={14} />
                    {l.label}
                  </span>
                ) : (
                  l.label
                )}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </nav>
  );
}
