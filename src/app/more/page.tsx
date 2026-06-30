"use client";

import { useRouter } from "next/navigation";
import {
  ChevronLeft, ChevronRight, CircleUser, Globe,
  ArrowLeftRight, Trash2, Link2, BadgeInfo, LogOut,
} from "lucide-react";

const USER_EMAIL = "james.carter@gmail.com";

interface MenuItem {
  icon: React.FC<{ size?: number; strokeWidth?: number; style?: React.CSSProperties; className?: string }>;
  label: string;
  href: string;
  danger?: boolean;
}

const menuGroups: MenuItem[][] = [
  [
    { icon: CircleUser,    label: "My profile",  href: "#" },
    { icon: Globe,         label: "Language",    href: "#" },
  ],
  [
    { icon: ArrowLeftRight, label: "Ticket(s) submitted for resale/\nexchange", href: "#" },
    { icon: Trash2,         label: "Deleted", href: "#" },
  ],
  [
    { icon: Link2,    label: "More information", href: "#" },
    { icon: BadgeInfo, label: "Support details", href: "#" },
  ],
  [
    { icon: LogOut, label: "Log Out", href: "#", danger: true },
  ],
];

export default function MorePage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-[#f2f2f7] pb-32">
      <div className="max-w-lg mx-auto">

        {/* Back */}
        <div className="px-4 pt-6 pb-2">
          <button onClick={() => router.back()} className="text-gray-800">
            <ChevronLeft size={26} strokeWidth={2.5} />
          </button>
        </div>

        {/* Email header */}
        <div className="px-4 pt-2 pb-6">
          <h1 className="text-[1.6rem] font-black text-gray-900 leading-tight break-all">
            {USER_EMAIL}
          </h1>
        </div>

        {/* Menu groups */}
        <div className="px-4 space-y-4">
          {menuGroups.map((group, gi) => (
            <div key={gi} className="bg-white rounded-2xl overflow-hidden shadow-sm">
              {group.map((item, ii) => {
                const Icon = item.icon;
                return (
                  <div key={ii}>
                    <button
                      className="w-full flex items-center gap-4 px-4 py-4 text-left active:bg-gray-50 transition-colors"
                      onClick={() => {
                        if (item.label === "Log Out") {
                          router.replace("/my-tickets");
                        }
                      }}
                    >
                      {/* Icon */}
                      <Icon
                        size={22}
                        className="shrink-0"
                        style={{ color: item.danger ? "#cc0000" : "#1a3a6b" }}
                        strokeWidth={1.8}
                      />
                      {/* Label */}
                      <span
                        className={`flex-1 text-[0.93rem] font-medium leading-snug whitespace-pre-line ${
                          item.danger ? "text-[#cc0000]" : "text-gray-900"
                        }`}
                      >
                        {item.label}
                      </span>
                      {/* Chevron */}
                      <ChevronRight
                        size={17}
                        style={{ color: "#7b9ef7" }}
                        strokeWidth={2.5}
                        className="shrink-0"
                      />
                    </button>

                    {/* Divider between items */}
                    {ii < group.length - 1 && (
                      <div className="ml-[56px] h-px bg-gray-100" />
                    )}
                  </div>
                );
              })}
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}
