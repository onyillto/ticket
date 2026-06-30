"use client";

import { useState, useEffect } from "react";
import { Ticket as TicketIcon, ChevronRight } from "lucide-react";
import Link from "next/link";
import { Ticket } from "@/lib/data";
import { getTickets, clearTickets } from "@/lib/store";

type Tab = "upcoming" | "past";

function isPast(dateStr: string) {
  return new Date(dateStr) < new Date();
}

export default function MyTicketsPage() {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [tab, setTab] = useState<Tab>("upcoming");

  useEffect(() => {
    setTickets(getTickets());
  }, []);

  function handleReset() {
    if (confirm("Reset demo data? Page will reload.")) {
      clearTickets();
      window.location.reload();
    }
  }

  const upcomingTickets = tickets.filter((t) => !isPast(t.match.date));
  const pastTickets = tickets.filter((t) => isPast(t.match.date));
  const displayed = tab === "upcoming" ? upcomingTickets : pastTickets;

  return (
    <div className="min-h-screen bg-[#f2f2f7]">
      <div className="max-w-lg mx-auto px-4 pt-8 pb-4">

        {/* Page title */}
        <div className="flex items-center justify-between mb-5">
          <h1 className="text-[2rem] font-black text-gray-900 tracking-tight">
            My ticket(s)
          </h1>
          <button
            onClick={handleReset}
            className="text-gray-300 hover:text-gray-400 text-xs transition-colors"
          >
            Reset
          </button>
        </div>

        {/* Underline tabs */}
        <div className="flex border-b border-gray-300 mb-4 bg-[#f2f2f7]">
          {(["upcoming", "past"] as Tab[]).map((t) => {
            const count = t === "upcoming" ? upcomingTickets.length : pastTickets.length;
            const active = tab === t;
            return (
              <button
                key={t}
                onClick={() => setTab(t)}
                className={`relative flex items-center gap-2 pb-3 mr-6 text-[0.88rem] font-bold transition-colors ${
                  active ? "text-gray-900" : "text-gray-400"
                }`}
              >
                {t === "upcoming" ? "Upcoming match(es)" : "Past match(es)"}
                <span
                  className={`text-[11px] font-bold w-[22px] h-[22px] rounded-full flex items-center justify-center ${
                    active ? "bg-gray-900 text-white" : "bg-gray-300 text-gray-500"
                  }`}
                >
                  {count}
                </span>
                {active && (
                  <span className="absolute bottom-0 left-0 right-0 h-[2.5px] bg-gray-900 rounded-full" />
                )}
              </button>
            );
          })}
        </div>

        {/* FIFA app promo banner */}
        <div className="flex items-center gap-3 mb-4 p-3 bg-white rounded-2xl shadow-sm">
          <FifaAppIcon />
          <div>
            <p className="text-gray-900 font-bold text-[0.82rem] leading-snug">
              Get the FIFA World Cup 2026™ App
            </p>
            <p className="text-gray-400 text-[0.75rem] leading-snug">
              Your official guide to every match and moment
            </p>
          </div>
        </div>

        {/* Empty state */}
        {displayed.length === 0 && (
          <div className="text-center py-16">
            <div className="w-14 h-14 bg-white rounded-full flex items-center justify-center mx-auto mb-3 shadow-sm">
              <TicketIcon size={24} className="text-gray-300" />
            </div>
            <p className="text-gray-700 font-bold text-sm mb-1">
              {tab === "upcoming" ? "No upcoming tickets" : "No past tickets"}
            </p>
            <p className="text-gray-400 text-xs mb-5">
              {tab === "upcoming"
                ? "Book seats for an upcoming match."
                : "Tickets for completed matches appear here."}
            </p>
            {tab === "upcoming" && (
              <Link
                href="/matches"
                className="inline-flex bg-[#cc0000] text-white font-bold px-5 py-2.5 rounded-xl text-sm"
              >
                Browse Matches
              </Link>
            )}
          </div>
        )}

        {/* Ticket list */}
        <div className="space-y-3">
          {displayed.map((ticket) => (
            <TicketCard key={ticket.id} ticket={ticket} />
          ))}
        </div>

      </div>
    </div>
  );
}

// ── FIFA Graphic ──────────────────────────────────────────────────────────────

function FifaGraphic() {
  return (
    <div className="relative w-full h-full" style={{ background: "#003f7f" }}>
      {/* Red diagonal band */}
      <div
        className="absolute inset-0"
        style={{
          background: "#cc0000",
          clipPath: "polygon(0 26%, 100% 12%, 100% 74%, 0 88%)",
        }}
      />
      {/* Green/lime triangle bottom-right */}
      <div
        className="absolute inset-0"
        style={{
          background: "#7dc143",
          clipPath: "polygon(52% 100%, 100% 52%, 100% 100%)",
        }}
      />
      {/* FIFA WC 2026 text */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="text-white text-center leading-none select-none">
          <p className="font-black text-[9px] tracking-[0.22em] mb-[2px]">FIFA</p>
          <p className="font-black text-[10px] tracking-widest leading-tight">WORLD CUP</p>
          <p className="font-black text-[26px] tracking-wider leading-tight">2026</p>
        </div>
      </div>
    </div>
  );
}

function FifaAppIcon() {
  return (
    <div
      className="relative w-11 h-11 rounded-xl overflow-hidden shrink-0"
      style={{ background: "#003f7f" }}
    >
      <div
        className="absolute inset-0"
        style={{ background: "#cc0000", clipPath: "polygon(0 28%, 100% 12%, 100% 72%, 0 88%)" }}
      />
      <div
        className="absolute inset-0"
        style={{ background: "#7dc143", clipPath: "polygon(50% 100%, 100% 50%, 100% 100%)" }}
      />
    </div>
  );
}

// ── Ticket Card ───────────────────────────────────────────────────────────────

function TicketCard({ ticket }: { ticket: Ticket }) {
  const { match } = ticket;
  const d = new Date(match.date);
  const day = d.getDate();
  const month = d.toLocaleDateString("en-US", { month: "short" }).toUpperCase();

  return (
    <Link
      href={`/my-tickets/${ticket.id}`}
      className="block bg-white rounded-2xl overflow-hidden shadow-sm active:opacity-80 transition-opacity"
    >
      {/* Top: graphic (left) + date (right) */}
      <div className="flex h-[130px]">
        {/* FIFA graphic — ~62% */}
        <div className="flex-1 overflow-hidden">
          <FifaGraphic />
        </div>

        {/* Date column — white right panel */}
        <div className="w-[34%] flex flex-col items-center justify-center bg-white gap-0 shrink-0">
          <span className="text-[2.6rem] font-black text-gray-900 leading-none">
            {day}
          </span>
          <span className="text-[11px] font-semibold text-gray-500 uppercase tracking-wide leading-tight">
            {month}
          </span>
          <span className="text-[2rem] font-black text-gray-900 leading-none mt-[1px]">
            26
          </span>
          <span className="text-[11px] text-gray-400 font-normal leading-tight mt-[2px]">
            {match.time}
          </span>
        </div>
      </div>

      {/* Bottom: match info */}
      <div className="px-4 pt-2.5 pb-3">
        <p className="text-gray-900 font-black text-[0.95rem] leading-snug">
          {ticket.matchNumber} {match.homeTeam} vs {match.awayTeam}
        </p>
        <div className="flex items-center justify-between mt-1">
          <p className="text-gray-400 text-[0.82rem]">{match.venue}</p>
          <div className="flex items-center gap-1 shrink-0">
            <span className="text-gray-700 font-bold text-sm">{ticket.quantity}</span>
            <TicketIcon size={14} className="text-gray-500" strokeWidth={1.8} />
            <ChevronRight size={15} className="text-gray-400" strokeWidth={2.5} />
          </div>
        </div>
      </div>
    </Link>
  );
}
