"use client";

import { useState, useEffect } from "react";
import { Ticket as TicketIcon, Download, ArrowRightLeft, X, CheckCircle } from "lucide-react";
import Link from "next/link";
import { Ticket } from "@/lib/data";
import { getTickets, reassignTicket, clearTickets } from "@/lib/store";

type Tab = "upcoming" | "past";

function isPast(dateStr: string) {
  return new Date(dateStr) < new Date();
}

export default function MyTicketsPage() {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [tab, setTab] = useState<Tab>("upcoming");
  const [reassignTarget, setReassignTarget] = useState<string | null>(null);

  useEffect(() => {
    setTickets(getTickets());
  }, []);

  function refresh() {
    setTickets(getTickets());
  }

  function handleClear() {
    if (confirm("Reset demo data? Page will reload.")) {
      clearTickets();
      window.location.reload();
    }
  }

  const upcomingTickets = tickets.filter((t) => !isPast(t.match.date));
  const pastTickets = tickets.filter((t) => isPast(t.match.date));
  const displayed = tab === "upcoming" ? upcomingTickets : pastTickets;

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-black text-gray-900">My ticket(s)</h1>
        <button onClick={handleClear} className="text-gray-300 hover:text-gray-400 text-xs transition-colors">
          Reset demo
        </button>
      </div>

      {/* Underline tabs — exactly like FIFA app */}
      <div className="flex border-b border-gray-200 mb-6">
        <button
          onClick={() => setTab("upcoming")}
          className={`flex items-center gap-2 pb-3 mr-8 text-sm font-bold transition-all relative ${
            tab === "upcoming" ? "text-gray-900" : "text-gray-400 hover:text-gray-600"
          }`}
        >
          Upcoming match(es)
          <span className={`text-xs font-bold w-6 h-6 rounded-full flex items-center justify-center ${
            tab === "upcoming" ? "bg-gray-900 text-white" : "bg-gray-100 text-gray-400"
          }`}>
            {upcomingTickets.length}
          </span>
          {tab === "upcoming" && (
            <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-gray-900 rounded-full" />
          )}
        </button>
        <button
          onClick={() => setTab("past")}
          className={`flex items-center gap-2 pb-3 text-sm font-bold transition-all relative ${
            tab === "past" ? "text-gray-900" : "text-gray-400 hover:text-gray-600"
          }`}
        >
          Past match(es)
          <span className={`text-xs font-bold w-6 h-6 rounded-full flex items-center justify-center ${
            tab === "past" ? "bg-gray-900 text-white" : "bg-gray-100 text-gray-400"
          }`}>
            {pastTickets.length}
          </span>
          {tab === "past" && (
            <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-gray-900 rounded-full" />
          )}
        </button>
      </div>

      {/* FIFA app promo banner */}
      <div className="bg-white border border-gray-100 rounded-2xl p-4 flex items-center gap-3 mb-6 shadow-sm">
        <div className="w-12 h-12 rounded-xl overflow-hidden shrink-0">
          <FifaAppIcon />
        </div>
        <div>
          <p className="text-gray-900 font-bold text-sm">Get the FIFA World Cup 2026™ App</p>
          <p className="text-gray-400 text-xs">Your official guide to every match and moment</p>
        </div>
      </div>

      {/* Empty states */}
      {displayed.length === 0 && (
        <div className="text-center py-20">
          <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
            <TicketIcon size={28} className="text-gray-300" />
          </div>
          <p className="text-gray-900 font-bold mb-1">
            {tab === "upcoming" ? "No upcoming tickets" : "No past tickets"}
          </p>
          <p className="text-gray-400 text-sm mb-6">
            {tab === "upcoming"
              ? "Book seats for a match coming up soon."
              : "Tickets for completed matches will appear here."}
          </p>
          {tab === "upcoming" && (
            <Link
              href="/matches"
              className="inline-flex items-center gap-2 bg-[#cc0000] hover:bg-[#b30000] text-white font-bold px-5 py-2.5 rounded-xl text-sm transition-colors"
            >
              Browse Matches
            </Link>
          )}
        </div>
      )}

      {/* Ticket list */}
      <div className="space-y-4">
        {displayed.map((ticket) => (
          <TicketCard
            key={ticket.id}
            ticket={ticket}
            isPastMatch={isPast(ticket.match.date)}
            isReassigning={reassignTarget === ticket.id}
            onStartReassign={() => setReassignTarget(ticket.id)}
            onCancelReassign={() => setReassignTarget(null)}
            onReassigned={() => { setReassignTarget(null); refresh(); }}
          />
        ))}
      </div>
    </div>
  );
}

// ── FIFA Branded Ticket Graphic ───────────────────────────────────────────────

function FifaTicketGraphic({ date, time }: { date: string; time: string }) {
  const d = new Date(date);
  const day = d.getDate();
  const month = d.toLocaleDateString("en-US", { month: "short" }).toUpperCase();

  return (
    <div className="relative w-full h-full overflow-hidden rounded-xl" style={{ background: "#003f7f" }}>
      {/* Red diagonal band */}
      <div
        className="absolute inset-0"
        style={{
          background: "#cc0000",
          clipPath: "polygon(0 28%, 100% 14%, 100% 72%, 0 86%)",
        }}
      />
      {/* Green/lime triangle bottom-right */}
      <div
        className="absolute inset-0"
        style={{
          background: "#6ab04c",
          clipPath: "polygon(55% 100%, 100% 55%, 100% 100%)",
        }}
      />
      {/* Text: FIFA WORLD CUP 2026 */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="text-white text-center leading-none">
          <p className="font-black text-[10px] tracking-[0.2em] mb-0.5">FIFA</p>
          <p className="font-black text-[11px] tracking-widest leading-tight">WORLD CUP</p>
          <p className="font-black text-[22px] tracking-wider leading-tight">2026</p>
        </div>
      </div>

      {/* Date overlay — right side of graphic */}
      <div className="absolute right-0 top-0 bottom-0 w-16 bg-white/90 flex flex-col items-center justify-center gap-0 border-l border-white/20">
        <span className="text-2xl font-black text-gray-900 leading-none">{day}</span>
        <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">{month}</span>
        <span className="text-xl font-black text-gray-900 leading-none mt-0.5">
          &apos;26
        </span>
        <span className="text-[10px] font-medium text-gray-400 mt-0.5">{time}</span>
      </div>
    </div>
  );
}

function FifaAppIcon() {
  return (
    <div className="w-full h-full relative overflow-hidden" style={{ background: "#003f7f" }}>
      <div
        className="absolute inset-0"
        style={{ background: "#cc0000", clipPath: "polygon(0 30%, 100% 10%, 100% 70%, 0 90%)" }}
      />
      <div
        className="absolute inset-0"
        style={{ background: "#6ab04c", clipPath: "polygon(50% 100%, 100% 50%, 100% 100%)" }}
      />
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="text-white font-black text-[9px] tracking-widest leading-none text-center">
          FIFA{"\n"}WC
        </span>
      </div>
    </div>
  );
}

// ── Ticket Card ───────────────────────────────────────────────────────────────

interface CardProps {
  ticket: Ticket;
  isPastMatch: boolean;
  isReassigning: boolean;
  onStartReassign: () => void;
  onCancelReassign: () => void;
  onReassigned: () => void;
}

function TicketCard({ ticket, isPastMatch, isReassigning, onStartReassign, onCancelReassign, onReassigned }: CardProps) {
  const { match } = ticket;
  const isReassigned = !!ticket.reassignedTo;

  return (
    <div className={`bg-white border rounded-2xl overflow-hidden shadow-sm transition-all ${
      isReassigning ? "border-[#cc0000]/40 ring-2 ring-[#cc0000]/10" : "border-gray-200"
    }`}>
      {/* Ticket visual — matches FIFA app layout */}
      <div className="h-28">
        <FifaTicketGraphic date={match.date} time={match.time} />
      </div>

      {/* Match info row — below the graphic, like the FIFA app */}
      <div className="px-4 pt-3 pb-1">
        <h3 className="text-gray-900 font-black text-base leading-tight">
          {match.homeTeam} vs {match.awayTeam}
        </h3>
        <p className="text-gray-400 text-sm mt-0.5">{match.venue}</p>
      </div>

      {/* Quantity + actions row */}
      <div className="px-4 pb-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-gray-700 font-bold text-sm">{ticket.quantity}</span>
          <TicketIcon size={14} className="text-gray-400" />
          <span className="text-gray-400 text-xs">Cat. {ticket.category}</span>
          <span className="text-gray-300">·</span>
          <span className="text-[#cc0000] font-bold text-sm">${ticket.totalPrice.toLocaleString()}</span>
        </div>

        <div className="flex items-center gap-2">
          {/* Status badge */}
          {isPastMatch ? (
            <span className="text-xs font-bold text-gray-400 bg-gray-100 px-2.5 py-1 rounded-full">
              Attended
            </span>
          ) : isReassigned ? (
            <span className="text-xs font-bold text-blue-600 bg-blue-50 px-2.5 py-1 rounded-full flex items-center gap-1">
              <ArrowRightLeft size={10} /> Reassigned
            </span>
          ) : (
            <span className="text-xs font-bold text-green-600 bg-green-50 px-2.5 py-1 rounded-full">
              ✓ Confirmed
            </span>
          )}
          <span className="text-gray-300">›</span>
        </div>
      </div>

      {/* Seat chips */}
      <div className="px-4 pb-3 flex flex-wrap gap-1.5">
        {ticket.seatNumbers.map((seat) => (
          <span key={seat} className="bg-gray-50 border border-gray-200 rounded px-2 py-0.5 text-xs text-gray-500 font-mono">
            {seat}
          </span>
        ))}
      </div>

      {/* Reassigned-to info */}
      {isReassigned && (
        <div className="mx-4 mb-3 flex items-center gap-2 bg-blue-50 border border-blue-100 rounded-lg px-3 py-2">
          <ArrowRightLeft size={12} className="text-blue-400 shrink-0" />
          <span className="text-blue-700 text-xs">
            Transferred to <strong>{ticket.reassignedTo!.name}</strong> · {ticket.reassignedTo!.email}
          </span>
        </div>
      )}

      {/* Footer: ticket ID + actions */}
      <div className="mx-4 mb-3 pt-3 border-t border-gray-100 flex items-center justify-between">
        <span className="text-xs text-gray-300 font-mono">{ticket.id}</span>
        <div className="flex items-center gap-3">
          {!isPastMatch && !isReassigning && (
            <button
              onClick={onStartReassign}
              className="flex items-center gap-1 text-xs text-gray-400 hover:text-[#cc0000] font-medium transition-colors"
            >
              <ArrowRightLeft size={11} />
              {isReassigned ? "Reassign again" : "Reassign"}
            </button>
          )}
          <button className="flex items-center gap-1 text-xs text-gray-300 hover:text-gray-600 transition-colors">
            <Download size={11} />
            Download
          </button>
        </div>
      </div>

      {/* Inline reassign form */}
      {isReassigning && (
        <ReassignForm
          ticketId={ticket.id}
          onCancel={onCancelReassign}
          onSuccess={onReassigned}
        />
      )}
    </div>
  );
}

// ── Reassign Form ─────────────────────────────────────────────────────────────

function ReassignForm({ ticketId, onCancel, onSuccess }: {
  ticketId: string; onCancel: () => void; onSuccess: () => void;
}) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [errors, setErrors] = useState<{ name?: string; email?: string }>({});
  const [done, setDone] = useState(false);

  function validate() {
    const e: { name?: string; email?: string } = {};
    if (!name.trim()) e.name = "Name is required";
    if (!email.trim()) e.email = "Email is required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) e.email = "Invalid email";
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  function handleSubmit() {
    if (!validate()) return;
    reassignTicket(ticketId, { name: name.trim(), email: email.trim() });
    setDone(true);
    setTimeout(onSuccess, 1400);
  }

  if (done) {
    return (
      <div className="mx-4 mb-4 bg-green-50 border border-green-100 rounded-xl p-4 flex items-center gap-3">
        <CheckCircle size={18} className="text-green-500 shrink-0" />
        <p className="text-green-700 text-sm font-medium">
          Ticket reassigned to <strong>{name}</strong>.
        </p>
      </div>
    );
  }

  return (
    <div className="mx-4 mb-4 bg-gray-50 border border-gray-200 rounded-xl p-4">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <ArrowRightLeft size={14} className="text-[#cc0000]" />
          <p className="text-gray-900 font-bold text-sm">Reassign Ticket</p>
        </div>
        <button onClick={onCancel} className="text-gray-300 hover:text-gray-600 transition-colors">
          <X size={16} />
        </button>
      </div>
      <p className="text-gray-400 text-xs mb-3">
        Enter the new holder&apos;s details. They will receive this ticket.
      </p>

      <div className="space-y-3 mb-3">
        <div>
          <input
            type="text"
            placeholder="New holder's full name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className={`w-full bg-white border rounded-xl px-3 py-2.5 text-gray-900 placeholder-gray-300 text-sm focus:outline-none focus:ring-1 ${
              errors.name ? "border-red-300 focus:ring-red-300/30" : "border-gray-200 focus:border-[#cc0000]/40 focus:ring-[#cc0000]/15"
            }`}
          />
          {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
        </div>
        <div>
          <input
            type="email"
            placeholder="New holder's email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={`w-full bg-white border rounded-xl px-3 py-2.5 text-gray-900 placeholder-gray-300 text-sm focus:outline-none focus:ring-1 ${
              errors.email ? "border-red-300 focus:ring-red-300/30" : "border-gray-200 focus:border-[#cc0000]/40 focus:ring-[#cc0000]/15"
            }`}
          />
          {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
        </div>
      </div>

      <div className="flex gap-2">
        <button
          onClick={handleSubmit}
          className="flex-1 bg-[#cc0000] hover:bg-[#b30000] text-white font-bold py-2.5 rounded-xl text-sm transition-colors"
        >
          Confirm Transfer
        </button>
        <button
          onClick={onCancel}
          className="px-4 py-2.5 bg-white border border-gray-200 hover:border-gray-300 text-gray-500 rounded-xl text-sm transition-colors"
        >
          Cancel
        </button>
      </div>
    </div>
  );
}
