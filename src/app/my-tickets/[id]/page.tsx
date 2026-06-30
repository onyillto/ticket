"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  ChevronLeft, Ticket as TicketIcon, Calendar,
  MapPin, ArrowRightLeft, CheckCircle, X,
} from "lucide-react";
import Link from "next/link";
import { Ticket } from "@/lib/data";
import { getTicketById, reassignTicket } from "@/lib/store";

function isPast(dateStr: string) {
  return new Date(dateStr) < new Date();
}

export default function TicketDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [ticket, setTicket] = useState<Ticket | null>(null);
  const [showReassign, setShowReassign] = useState(false);

  useEffect(() => {
    const t = getTicketById(id);
    if (!t) { router.replace("/my-tickets"); return; }
    setTicket(t);
  }, [id, router]);

  function refresh() {
    setTicket(getTicketById(id) ?? null);
  }

  if (!ticket) return null;

  const { match } = ticket;
  const past = isPast(match.date);
  const isReassigned = !!ticket.reassignedTo;

  const d = new Date(match.date);
  const day = d.getDate();
  const month = d.toLocaleDateString("en-US", { month: "short" }).toUpperCase();
  const weekday = d.toLocaleDateString("en-US", { weekday: "long" });
  const fullDate = d.toLocaleDateString("en-US", { day: "numeric", month: "long", year: "numeric" });

  return (
    <div className="min-h-screen bg-[#f2f2f7]">
      <div className="max-w-lg mx-auto">

        {/* Back header */}
        <div className="flex items-center gap-2 px-4 pt-6 pb-3 bg-[#f2f2f7]">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-1 text-[#cc0000] font-medium text-sm"
          >
            <ChevronLeft size={18} strokeWidth={2.5} />
            My ticket(s)
          </button>
        </div>

        {/* Ticket visual card */}
        <div className="mx-4 bg-white rounded-2xl overflow-hidden shadow-sm mb-4">
          {/* FIFA graphic + date */}
          <div className="flex h-44">
            <div className="flex-1 overflow-hidden relative" style={{ background: "#003f7f" }}>
              <div
                className="absolute inset-0"
                style={{ background: "#cc0000", clipPath: "polygon(0 26%, 100% 12%, 100% 74%, 0 88%)" }}
              />
              <div
                className="absolute inset-0"
                style={{ background: "#7dc143", clipPath: "polygon(52% 100%, 100% 52%, 100% 100%)" }}
              />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-white text-center leading-none select-none">
                  <p className="font-black text-[10px] tracking-[0.22em] mb-[2px]">FIFA</p>
                  <p className="font-black text-[12px] tracking-widest leading-tight">WORLD CUP</p>
                  <p className="font-black text-[32px] tracking-wider leading-tight">2026</p>
                </div>
              </div>
            </div>
            {/* Date column */}
            <div className="w-[34%] flex flex-col items-center justify-center bg-white shrink-0">
              <span className="text-[3rem] font-black text-gray-900 leading-none">{day}</span>
              <span className="text-[12px] font-semibold text-gray-500 uppercase tracking-wide">{month}</span>
              <span className="text-[2.2rem] font-black text-gray-900 leading-none mt-0.5">26</span>
              <span className="text-[11px] text-gray-400 mt-0.5">{match.time}</span>
            </div>
          </div>

          {/* Match title */}
          <div className="px-5 pt-4 pb-2 border-t border-gray-100">
            <p className="text-[0.72rem] font-bold text-gray-400 uppercase tracking-widest mb-1">
              {ticket.matchNumber}
            </p>
            <h2 className="text-gray-900 font-black text-xl leading-tight">
              {match.homeTeam} vs {match.awayTeam}
            </h2>
          </div>

          {/* Details grid */}
          <div className="px-5 pb-5 space-y-3">
            <div className="flex items-start gap-3">
              <Calendar size={16} className="text-gray-400 mt-0.5 shrink-0" />
              <div>
                <p className="text-gray-900 font-semibold text-sm">{weekday}, {fullDate}</p>
                <p className="text-gray-400 text-xs">Kick-off {match.time}</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <MapPin size={16} className="text-gray-400 mt-0.5 shrink-0" />
              <div>
                <p className="text-gray-900 font-semibold text-sm">{match.venue}</p>
                <p className="text-gray-400 text-xs">{match.city}</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <TicketIcon size={16} className="text-gray-400 mt-0.5 shrink-0" />
              <div>
                <p className="text-gray-900 font-semibold text-sm">
                  {ticket.quantity} ticket{ticket.quantity > 1 ? "s" : ""} · Category {ticket.category}
                </p>
                <p className="text-gray-400 text-xs">Seats: {ticket.seatNumbers.join(", ")}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Status card */}
        <div className="mx-4 bg-white rounded-2xl px-5 py-4 shadow-sm mb-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-xs mb-1">Status</p>
              {past ? (
                <span className="text-sm font-bold text-gray-500">Attended</span>
              ) : isReassigned ? (
                <span className="text-sm font-bold text-blue-600 flex items-center gap-1">
                  <ArrowRightLeft size={13} /> Reassigned
                </span>
              ) : (
                <span className="text-sm font-bold text-green-600 flex items-center gap-1">
                  <CheckCircle size={13} /> Confirmed
                </span>
              )}
            </div>
            <div className="text-right">
              <p className="text-gray-400 text-xs mb-1">Total paid</p>
              <p className="text-gray-900 font-black text-lg">${ticket.totalPrice.toLocaleString()}</p>
            </div>
          </div>

          {isReassigned && (
            <div className="mt-3 pt-3 border-t border-gray-100 flex items-start gap-2">
              <ArrowRightLeft size={13} className="text-blue-400 mt-0.5 shrink-0" />
              <p className="text-blue-700 text-xs">
                Transferred to <strong>{ticket.reassignedTo!.name}</strong> · {ticket.reassignedTo!.email}
              </p>
            </div>
          )}
        </div>

        {/* Reassign button — only for upcoming tickets */}
        {!past && !showReassign && (
          <div className="mx-4 mb-4">
            <button
              onClick={() => setShowReassign(true)}
              className="w-full flex items-center justify-center gap-2 bg-white border border-gray-200 text-gray-800 font-bold py-3.5 rounded-2xl shadow-sm text-sm hover:bg-gray-50 transition-colors"
            >
              <ArrowRightLeft size={15} />
              {isReassigned ? "Reassign again" : "Reassign ticket"}
            </button>
          </div>
        )}

        {/* Reassign form */}
        {showReassign && (
          <ReassignForm
            ticketId={ticket.id}
            onCancel={() => setShowReassign(false)}
            onSuccess={() => { setShowReassign(false); refresh(); }}
          />
        )}

        {/* Booking reference */}
        <div className="mx-4 mb-6 px-5 py-3 bg-white rounded-2xl shadow-sm">
          <p className="text-gray-400 text-xs mb-1">Booking reference</p>
          <p className="text-gray-700 font-mono text-sm font-bold">{ticket.id}</p>
          <p className="text-gray-400 text-xs mt-1">
            Booked{" "}
            {new Date(ticket.bookedAt).toLocaleDateString("en-US", {
              day: "numeric", month: "long", year: "numeric",
            })}
          </p>
        </div>

      </div>
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
      <div className="mx-4 mb-4 bg-green-50 border border-green-100 rounded-2xl p-5 flex items-center gap-3">
        <CheckCircle size={20} className="text-green-500 shrink-0" />
        <p className="text-green-800 text-sm font-semibold">
          Ticket successfully transferred to <strong>{name}</strong>.
        </p>
      </div>
    );
  }

  return (
    <div className="mx-4 mb-4 bg-white rounded-2xl shadow-sm p-5">
      <div className="flex items-center justify-between mb-1">
        <div className="flex items-center gap-2">
          <ArrowRightLeft size={15} className="text-[#cc0000]" />
          <p className="text-gray-900 font-black text-base">Reassign Ticket</p>
        </div>
        <button onClick={onCancel} className="text-gray-300 hover:text-gray-500">
          <X size={18} />
        </button>
      </div>
      <p className="text-gray-400 text-xs mb-4">
        The new holder will receive full ownership of this ticket.
      </p>

      <div className="space-y-3 mb-4">
        <div>
          <label className="text-gray-500 text-xs font-medium block mb-1.5">
            New holder&apos;s full name
          </label>
          <input
            type="text"
            placeholder="e.g. Maria Gonzalez"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className={`w-full bg-[#f2f2f7] border-0 rounded-xl px-4 py-3 text-gray-900 placeholder-gray-400 text-sm focus:outline-none focus:ring-2 ${
              errors.name ? "ring-2 ring-red-300" : "focus:ring-[#cc0000]/20"
            }`}
          />
          {errors.name && <p className="text-red-500 text-[11px] mt-1">{errors.name}</p>}
        </div>
        <div>
          <label className="text-gray-500 text-xs font-medium block mb-1.5">
            New holder&apos;s email address
          </label>
          <input
            type="email"
            placeholder="e.g. maria@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={`w-full bg-[#f2f2f7] border-0 rounded-xl px-4 py-3 text-gray-900 placeholder-gray-400 text-sm focus:outline-none focus:ring-2 ${
              errors.email ? "ring-2 ring-red-300" : "focus:ring-[#cc0000]/20"
            }`}
          />
          {errors.email && <p className="text-red-500 text-[11px] mt-1">{errors.email}</p>}
        </div>
      </div>

      <button
        onClick={handleSubmit}
        className="w-full bg-[#cc0000] hover:bg-[#b30000] text-white font-bold py-3.5 rounded-xl text-sm transition-colors"
      >
        Confirm Transfer
      </button>
    </div>
  );
}
