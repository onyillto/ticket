"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { ChevronLeft, MapPin, Send, Calendar } from "lucide-react";
import { QRCodeSVG } from "qrcode.react";
import { Ticket } from "@/lib/data";
import { getTicketById } from "@/lib/store";

// ── Helpers ───────────────────────────────────────────────────────────────────

function isQrVisible(date: string, time: string): boolean {
  const [h, m] = time.split(":").map(Number);
  const kickoff = new Date(date);
  kickoff.setHours(h, m, 0, 0);
  return (kickoff.getTime() - Date.now()) / 3_600_000 <= 2;
}

function isPast(date: string) {
  return new Date(date) < new Date();
}

function formatTime(time: string) {
  const [h, m] = time.split(":").map(Number);
  const period = h >= 12 ? "PM" : "AM";
  const hour12 = h % 12 || 12;
  return `${String(hour12).padStart(2, "0")}:${String(m).padStart(2, "0")} ${period}`;
}

function getSeatInfo(seatStr: string) {
  const letter = seatStr.replace(/\d/g, "") || "A";
  const seatNum = seatStr.replace(/\D/g, "") || "1";
  const pos = letter.charCodeAt(0) - 64;
  const gateNum = (pos % 4) + 1;
  const gateLetter = ["A", "B", "C"][parseInt(seatNum) % 3];
  return {
    entrance: `${letter}/${String.fromCharCode(letter.charCodeAt(0) + 1)}`,
    gate: `${gateNum}${gateLetter}`,
    section: String(100 + ((pos * 11 + parseInt(seatNum)) % 99) + 1),
    row: String((parseInt(seatNum) % 30) + 1),
    seat: seatNum,
  };
}

// ── Page ──────────────────────────────────────────────────────────────────────

export default function TicketDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [ticket, setTicket] = useState<Ticket | null>(null);
  const [seatIdx, setSeatIdx] = useState(0);
  const [qrVisible, setQrVisible] = useState(false);

  useEffect(() => {
    const t = getTicketById(id);
    if (!t) { router.replace("/my-tickets"); return; }
    setTicket(t);
    setQrVisible(isQrVisible(t.match.date, t.match.time));
  }, [id, router]);

  useEffect(() => {
    if (!ticket) return;
    const iv = setInterval(
      () => setQrVisible(isQrVisible(ticket.match.date, ticket.match.time)),
      30_000,
    );
    return () => clearInterval(iv);
  }, [ticket]);

  if (!ticket) return null;

  const { match } = ticket;
  const currentSeat = ticket.seatNumbers[seatIdx] ?? ticket.seatNumbers[0];
  const seat = getSeatInfo(currentSeat);
  const matchPast = isPast(match.date);
  const badgeNum = ticket.matchNumber.replace(/^M0*/, "");

  const d = new Date(match.date);
  const day = String(d.getDate()).padStart(2, "0");
  const mon = d.toLocaleDateString("en-US", { month: "short" }).toUpperCase();
  const dateStr = `${day} ${mon} 26, ${formatTime(match.time)}`;

  const holderName = ticket.reassignedTo ? ticket.reassignedTo.name : ticket.holderName;

  return (
    <div className="min-h-screen bg-[#f2f2f7] pb-32">

      {/* ── Header ── */}
      <div className="relative flex flex-col items-center pt-5 pb-3">
        <button onClick={() => router.back()} className="absolute left-4 top-5 text-gray-800">
          <ChevronLeft size={26} strokeWidth={2.5} />
        </button>
        <p className="font-bold text-gray-900 text-[0.95rem]">
          Ticket {seatIdx + 1} of {ticket.quantity}
        </p>
        {ticket.quantity > 1 && (
          <div className="flex gap-1.5 mt-1.5">
            {ticket.seatNumbers.map((_, i) => (
              <button
                key={i}
                onClick={() => setSeatIdx(i)}
                className={`rounded-full transition-all ${
                  i === seatIdx ? "w-4 h-1.5 bg-gray-900" : "w-1.5 h-1.5 bg-gray-300"
                }`}
              />
            ))}
          </div>
        )}
      </div>

      {/* ── QR Code ── */}
      <div className="mx-4 mb-4">
        {qrVisible || matchPast ? (
          <div className="flex rounded-2xl overflow-hidden shadow-sm bg-white">
            <div className="w-4 shrink-0" style={{ background: "#00c9a7" }} />
            <div className="flex-1 flex flex-col items-center justify-center py-6 relative">
              <QRCodeSVG
                value={`FIFA-WC2026-${ticket.id}-SEAT${currentSeat}`}
                size={190}
                level="H"
                marginSize={2}
              />
              {matchPast && (
                <div className="absolute inset-0 bg-white/75 flex items-center justify-center">
                  <span className="border-2 border-gray-400 text-gray-400 font-black text-lg px-4 py-1 rounded rotate-[-15deg] tracking-widest">
                    USED
                  </span>
                </div>
              )}
            </div>
            <div className="w-4 shrink-0" style={{ background: "#00c9a7" }} />
          </div>
        ) : (
          <div className="flex rounded-2xl overflow-hidden shadow-sm bg-white">
            <div className="w-4 shrink-0" style={{ background: "#1B55E6" }} />
            <div className="flex-1 flex flex-col items-center justify-center py-7 text-center px-6 relative overflow-hidden">
              {/* faint FIFA watermark */}
              <p className="absolute font-black text-gray-100 select-none pointer-events-none"
                style={{ fontSize: "5rem", opacity: 0.55, letterSpacing: "-0.02em" }}>
                FIFA
              </p>
              <div className="relative z-10">
                <p className="text-gray-800 font-black text-[0.8rem] uppercase tracking-wide">
                  The ticket is not yet ready
                </p>
                <p className="text-gray-400 text-xs mt-1 leading-relaxed">
                  It will be activated on the day of the match
                </p>
              </div>
            </div>
            <div className="w-4 shrink-0" style={{ background: "#1B55E6" }} />
          </div>
        )}
      </div>

      {/* ── Ticket Card ── */}
      <div className="mx-4 bg-white rounded-2xl shadow-sm overflow-hidden relative">

        {/* Match number badge */}
        <div className="absolute top-3 right-3 bg-gray-100 rounded-xl px-3 py-1.5">
          <span className="text-gray-700 font-bold text-sm">{badgeNum}</span>
        </div>

        {/* FIFA WORLD CUP 2026 — black badge logo (sharp bottom-left corner) */}
        <div className="flex justify-center pt-5 pb-4">
          <div
            className="px-8 py-3.5 text-center"
            style={{ background: "#111111", borderRadius: "22px 22px 22px 4px" }}
          >
            <p className="text-white font-black text-[1.05rem] leading-tight tracking-tight">FIFA</p>
            <p className="text-white font-black text-[0.85rem] leading-tight tracking-tight">WORLD CUP</p>
            <p className="text-white font-black text-[1.55rem] leading-tight tracking-tight">
              2026<span className="text-[0.65rem] align-super">™</span>
            </p>
          </div>
        </div>

        {/* Match title */}
        <div className="px-5 pb-2">
          <h2 className="text-[1.45rem] font-black text-gray-900 leading-tight">
            {ticket.matchNumber} {match.homeTeam} vs {match.awayTeam}
          </h2>
        </div>

        {/* Date + Venue — centered */}
        <div className="px-5 pb-4 space-y-1.5">
          <div className="flex items-center justify-center gap-1.5 text-gray-600 text-[0.83rem]">
            <Calendar size={13} className="shrink-0" />
            <span className="font-medium">{dateStr}</span>
          </div>
          <div className="flex items-center justify-center gap-1.5 text-gray-600 text-[0.83rem]">
            <MapPin size={13} className="shrink-0" />
            <span className="font-medium">{match.venue}</span>
          </div>
        </div>

        {/* Seat grid: 4-col row + SEAT centered */}
        <div className="px-4 pb-4">
          <div className="grid grid-cols-4 gap-2 mb-2">
            <SeatCell label="ENTRANCE" value={seat.entrance} />
            <SeatCell label="GATE"     value={seat.gate}     />
            <SeatCell label="SECTION"  value={seat.section}  />
            <SeatCell label="ROW"      value={seat.row}      />
          </div>
          <div className="flex justify-center">
            <div className="w-1/4">
              <SeatCell label="SEAT" value={seat.seat} />
            </div>
          </div>
        </div>

        {/* Dotted separator */}
        <div
          className="mx-4 h-px"
          style={{
            backgroundImage:
              "repeating-linear-gradient(to right,#d1d5db 0,#d1d5db 6px,transparent 6px,transparent 12px)",
          }}
        />

        {/* TICKET HOLDER */}
        <div className="px-5 py-3 flex items-start justify-between border-b border-gray-100">
          <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest pt-0.5">
            Ticket Holder
          </p>
          <div className="text-right">
            <p className="text-sm text-gray-900 font-medium">* FIFA Collect by Modex *</p>
            <p className="text-xs text-gray-400 mt-0.5">{holderName}</p>
          </div>
        </div>

        {/* CATEGORY */}
        <div className="px-5 py-3 flex items-center justify-between">
          <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
            Category
          </p>
          <p className="text-sm text-gray-900 font-medium">Category {ticket.category}</p>
        </div>
      </div>

      {/* ── Send your ticket(s) ── */}
      {!matchPast && !ticket.reassignedTo && (
        <div className="mx-4 mt-5">
          <p className="font-black text-gray-900 text-base mb-2 px-1">Send your ticket(s)</p>
          <div className="bg-white rounded-2xl p-4 flex items-start gap-3 shadow-sm">
            <div className="w-9 h-9 rounded-full bg-black flex items-center justify-center shrink-0 mt-0.5">
              <Send size={15} className="text-white" />
            </div>
            <p className="text-gray-500 text-[0.82rem] leading-relaxed">
              Send your ticket(s) to your guest(s). Keep in mind that once you send the
              ticket(s), they will no longer be visible in your account.
            </p>
          </div>
          <button
            onClick={() => router.push(`/my-tickets/${id}/send`)}
            className="w-full mt-3 bg-black text-white font-bold py-4 rounded-2xl text-base active:opacity-70 transition-opacity"
          >
            Send
          </button>
        </div>
      )}

    </div>
  );
}

// ── Seat Cell ─────────────────────────────────────────────────────────────────

function SeatCell({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-[#f2f2f7] rounded-xl px-1 py-2.5 text-center">
      <p className="text-[8px] font-black text-gray-900 uppercase tracking-wider leading-none mb-1.5">
        {label}
      </p>
      <p className={`font-black text-gray-900 leading-none ${value.length <= 2 ? "text-2xl" : "text-base"}`}>
        {value}
      </p>
    </div>
  );
}
