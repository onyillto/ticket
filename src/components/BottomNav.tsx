"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Ticket, Shuffle, AlignJustify } from "lucide-react";

const navItems = [
  { href: "/my-tickets",   label: "My tickets",    Icon: Ticket      },
  { href: "/transactions", label: "Transactions",  Icon: Shuffle     },
  { href: "/more",         label: "More",          Icon: AlignJustify },
];

export default function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-200">
      <div className="flex items-start justify-around py-2 pb-3 max-w-lg mx-auto">
        {navItems.map(({ href, label, Icon }) => {
          const active = pathname === href || pathname.startsWith(href + "/");
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
              <span
                className={`text-xs font-medium ${
                  active ? "text-gray-900" : "text-gray-500"
                }`}
              >
                {label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
//comment: This component renders a bottom navigation bar with three items: "My tickets", "Transactions", and "More". Each item has an icon and a label. The active item is highlighted with a different background color and text color. The navigation bar is fixed at the bottom of the screen and is responsive to different screen sizes.