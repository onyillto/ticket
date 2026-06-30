"use client";

import { useState, useEffect } from "react";
import { Ticket as TicketIcon, Download, ArrowRightLeft, X, CheckCircle, ChevronRight } from "lucide-react";
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
    <div className="max-w-lg mx-auto px-4 pt-8 pb-4">
      {/* Page title */}
      <div className="flex items-center justify-between mb-5">
        <h1 className="text-[2rem] font-black text-gray-900 tracking-tight">My ticket(s)</h1>
        <button
          onClick={handleClear}
          className="text-gray-300 hover:text-gray-400 text-xs transition-colors"
        >
          Reset
        </button>
      </div>

      {/* Underline tabs */}
      <div className="flex border-b border-gray-200 mb-5">
        <button
          onClick={() => setTab("upcoming")}
          className={`relative flex items-center gap-2 pb-3 mr-7 text-[0.9rem] font-bold transition-colors ${
            tab === "upcoming" ? "text-gray-900" : "text-gray-400"
          }`}
        >
          Upcoming match(es)
          <span
            className={`text-[11px] font-bold w-6 h-6 rounded-full flex items-center justify-center ${
              tab === "upcoming" ? "bg-gray-900 text-white" : "bg-gray-200 text-gray-500"
            }`}
          >
            {upcomingTickets.length}
          </span>
          {tab === "upcoming" && (
            <span className="absolute bottom-0 left-0 right-0 h-[2.5px] bg-gray-900 rounded-full" />
          )}
        </button>

        <button
          onClick={() => setTab("past")}
          className={`relative flex items-center gap-2 pb-3 text-[0.9rem] font-bold transition-colors ${
            tab === "past" ? "text-gray-900" : "text-gray-400"
          }`}
        >
          Past match(es)
          <span
            className={`text-[11px] font-bold w-6 h-6 rounded-full flex items-center justify-center ${
              tab === "past" ? "bg-gray-900 text-white" : "bg-gray-200 text-gray-500"
            }`}
          >
            {pastTickets.length}
          </span>
          {tab === "past" && (
            <span className="absolute bottom-0 left-0 right-0 h-[2.5px] bg-gray-900 rounded-full" />
          )}
        </button>
      </div>

      {/* FIFA app promo banner */}
      <div className="flex items-center gap-3 mb-5 p-3 bg-white border border-gray-100 rounded-2xl shadow-sm">
        <FifaAppIcon />
        <div>
          <p className="text-gray-900 font-bold text-sm leading-snug">
            Get the FIFA World Cup 2026™ App
          </p>
          <p className="text-gray-400 text-xs leading-snug">
            Your official guide to every match and moment
          </p>
        </div>
      </div>

      {/* Empty state */}
      {displayed.length === 0 && (
        <div className="text-center py-16">
          <div className="w-14 h-14 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-3">
            <TicketIcon size={24} className="text-gray-300" />
          </div>
          <p className="text-gray-900 font-bold text-sm mb-1">
            {tab === "upcoming" ? "No upcoming tickets" : "No past tickets"}
          </p>
          <p className="text-gray-400 text-xs mb-5">
            {tab === "upcoming"
              ? "Book seats for a match coming up soon."
              : "Tickets for completed matches appear here."}
          </p>
          {tab === "upcoming" && (
            <Link
              href="/matches"
              className="inline-flex items-center gap-1.5 bg-[#cc0000] text-white font-bold px-5 py-2.5 rounded-xl text-sm"
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

// ── FIFA WC 2026 ticket graphic (no date inside) ──────────────────────────────

function FifaGraphic() {
  return (
    <div className="relative w-full h-full overflow-hidden" style={{ background: "#003f7f" }}>
      {/* Red diagonal band */}
      <div
        className="absolute inset-0"
        style={{
          background: "#cc0000",
          clipPath: "polygon(0 26%, 100% 12%, 100% 74%, 0 88%)",
        }}
      />
      {/* Green triangle bottom-right */}
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
          <p className="font-black text-[9px] tracking-[0.25em] mb-[2px]">FIFA</p>
          <p className="font-black text-[10.5px] tracking-widest leading-tight">WORLD CUP</p>
          <p className="font-black text-[28px] tracking-wider leading-tight">2026</p>
        </div>
      </div>
    </div>
  );
}

// ── Small FIFA icon for promo banner ──────────────────────────────────────────

function FifaAppIcon() {
  return (
    <div
      className="relative w-12 h-12 rounded-xl overflow-hidden shrink-0"
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
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="text-white font-black text-[7px] tracking-widest text-center leading-tight">
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

function TicketCard({
  ticket, isPastMatch, isReassigning,
  onStartReassign, onCancelReassign, onReassigned,
}: CardProps) {
  const { match } = ticket;
  const isReassigned = !!ticket.reassignedTo;

  const d = new Date(match.date);
  const day = d.getDate();
  const month = d.toLocaleDateString("en-US", { month: "short" }).toUpperCase();

  return (
    <div
      className={`bg-white rounded-2xl overflow-hidden shadow-sm border transition-all ${
        isReassigning ? "border-[#cc0000]/30 ring-2 ring-[#cc0000]/10" : "border-gray-100"
      }`}
    >
      {/* ── Top section: graphic (left) + date (right) ── */}
      <div className="flex h-36">
        {/* FIFA graphic — takes ~65% */}
        <div className="flex-1">
          <FifaGraphic />
        </div>

        {/* Date column — white, right side, ~35% */}
        <div className="w-[38%] flex flex-col items-center justify-center bg-white border-l border-gray-100 gap-0 py-2">
          <span className="text-[2.4rem] font-black text-gray-900 leading-none">{day}</span>
          <span className="text-[11px] font-semibold text-gray-500 uppercase tracking-wider leading-tight">
            {month}
          </span>
          <span className="text-[2rem] font-black text-gray-900 leading-none mt-0.5">26</span>
          <span className="text-[11px] text-gray-400 font-medium leading-tight mt-0.5">
            {match.time}
          </span>
        </div>
      </div>

      {/* ── Match name + venue row (below graphic) ── */}
      <div className="px-4 pt-3 pb-2 border-t border-gray-100">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <h3 className="text-gray-900 font-black text-[1rem] leading-tight truncate">
              {match.homeTeam} vs {match.awayTeam}
            </h3>
            <p className="text-gray-400 text-sm mt-0.5 truncate">{match.venue}</p>
          </div>
          {/* Qty + ticket icon + chevron — exact FIFA layout */}
          <div className="flex items-center gap-1.5 shrink-0 mt-0.5">
            <span className="text-gray-700 font-bold text-sm">{ticket.quantity}</span>
            <TicketIcon size={15} className="text-gray-500" strokeWidth={1.8} />
            <ChevronRight size={16} className="text-gray-400" strokeWidth={2} />
          </div>
        </div>
      </div>

      {/* ── Status + reassign row ── */}
      <div className="px-4 pb-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          {isPastMatch ? (
            <span className="text-xs font-semibold text-gray-400 bg-gray-100 px-2.5 py-1 rounded-full">
              Attended
            </span>
          ) : isReassigned ? (
            <span className="text-xs font-semibold text-blue-600 bg-blue-50 border border-blue-100 px-2.5 py-1 rounded-full flex items-center gap-1">
              <ArrowRightLeft size={10} /> Reassigned
            </span>
          ) : (
            <span className="text-xs font-semibold text-green-600 bg-green-50 border border-green-100 px-2.5 py-1 rounded-full">
              ✓ Confirmed
            </span>
          )}
          <span className="text-[#cc0000] font-bold text-sm">
            ${ticket.totalPrice.toLocaleString()}
          </span>
        </div>

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

      {/* Seat numbers */}
      <div className="px-4 pb-3 flex flex-wrap gap-1.5">
        {ticket.seatNumbers.map((seat) => (
          <span
            key={seat}
            className="bg-gray-50 border border-gray-200 rounded px-2 py-0.5 text-[11px] text-gray-500 font-mono"
          >
            {seat}
          </span>
        ))}
      </div>

      {/* Reassigned-to pill */}
      {isReassigned && (
        <div className="mx-4 mb-3 flex items-center gap-2 bg-blue-50 border border-blue-100 rounded-xl px-3 py-2">
          <ArrowRightLeft size={12} className="text-blue-400 shrink-0" />
          <span className="text-blue-700 text-xs">
            Transferred to <strong>{ticket.reassignedTo!.name}</strong>{" "}
            · {ticket.reassignedTo!.email}
          </span>
        </div>
      )}

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

function ReassignForm({
  ticketId, onCancel, onSuccess,
}: { ticketId: string; onCancel: () => void; onSuccess: () => void }) {
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
        <p className="text-green-800 text-sm font-medium">
          Ticket reassigned to <strong>{name}</strong>.
        </p>
      </div>
    );
  }

  return (
    <div className="mx-4 mb-4 bg-gray-50 border border-gray-200 rounded-xl p-4">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <ArrowRightLeft size={13} className="text-[#cc0000]" />
          <p className="text-gray-900 font-bold text-sm">Reassign Ticket</p>
        </div>
        <button onClick={onCancel} className="text-gray-300 hover:text-gray-500">
          <X size={16} />
        </button>
      </div>
      <p className="text-gray-400 text-xs mb-3">
        The new holder will receive ownership of this ticket.
      </p>
      <div className="space-y-2 mb-3">
        <div>
          <input
            type="text"
            placeholder="New holder's full name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className={`w-full bg-white border rounded-xl px-3 py-2.5 text-gray-900 placeholder-gray-300 text-sm focus:outline-none focus:ring-1 ${
              errors.name
                ? "border-red-300 focus:ring-red-200"
                : "border-gray-200 focus:border-[#cc0000]/40 focus:ring-[#cc0000]/10"
            }`}
          />
          {errors.name && <p className="text-red-500 text-[11px] mt-1">{errors.name}</p>}
        </div>
        <div>
          <input
            type="email"
            placeholder="New holder's email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={`w-full bg-white border rounded-xl px-3 py-2.5 text-gray-900 placeholder-gray-300 text-sm focus:outline-none focus:ring-1 ${
              errors.email
                ? "border-red-300 focus:ring-red-200"
                : "border-gray-200 focus:border-[#cc0000]/40 focus:ring-[#cc0000]/10"
            }`}
          />
          {errors.email && <p className="text-red-500 text-[11px] mt-1">{errors.email}</p>}
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
          className="px-4 py-2.5 bg-white border border-gray-200 text-gray-500 rounded-xl text-sm hover:border-gray-300 transition-colors"
        >
          Cancel
        </button>
      </div>
    </div>
  );
}
