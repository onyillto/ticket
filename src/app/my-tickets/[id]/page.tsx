"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  ChevronLeft, MapPin, Lock, ChevronDown,
  Send, RefreshCw, Accessibility,
} from "lucide-react";
import { QRCodeSVG } from "qrcode.react";
import { Ticket } from "@/lib/data";
import { getTicketById } from "@/lib/store";

// ── Helpers ───────────────────────────────────────────────────────────────────

function isQrVisible(date: string, time: string): boolean {
  const [h, m] = time.split(":").map(Number);
  const kickoff = new Date(date);
  kickoff.setHours(h, m, 0, 0);
  const diffHours = (kickoff.getTime() - Date.now()) / 3_600_000;
  return diffHours <= 2;
}

function isPast(date: string) {
  return new Date(date) < new Date();
}

function getSeatGrid(ticket: Ticket, seatStr: string) {
  const row = seatStr.replace(/\d/g, "");
  const seatNum = seatStr.replace(/\D/g, "");
  const gateNum = ((row.charCodeAt(0) - 65) % 7) + 1;
  const gate = String.fromCharCode(64 + gateNum);
  const entrance = ["A", "B", "C", "D", "E", "F", "G", "H"][
    (row.charCodeAt(0) - 65) % 8
  ];

  if (ticket.category === 1) {
    return {
      rows: [
        [
          { label: "ENTRANCE", value: entrance },
          { label: "HOSPITALITY AREA", value: "Village A" },
          { label: "GATE", value: gate },
        ],
        [
          { label: "HOSPITALITY AREA", value: "Lounge B" },
          { label: "SUITE", value: String(100 + (parseInt(seatNum) % 50)) },
          { label: "ROW", value: row },
        ],
        [{ label: "SEAT", value: seatNum }],
      ],
      category: "Suite Barstool",
    };
  }
  if (ticket.category === 2) {
    return {
      rows: [
        [
          { label: "ENTRANCE", value: entrance },
          { label: "BLOCK", value: String(200 + (parseInt(seatNum) % 30)) },
          { label: "GATE", value: gate },
        ],
        [
          { label: "ROW", value: row },
          { label: "SEAT", value: seatNum },
        ],
      ],
      category: "Category 2 — Standard+",
    };
  }
  return {
    rows: [
      [
        { label: "ENTRANCE", value: entrance },
        { label: "BLOCK", value: String(400 + (parseInt(seatNum) % 40)) },
        { label: "GATE", value: gate },
      ],
      [{ label: "ROW", value: row }, { label: "SEAT", value: seatNum }],
    ],
    category: ticket.category === 3 ? "Category 3 — Standard" : "Category 4 — Supporter",
  };
}

// ── Page ──────────────────────────────────────────────────────────────────────

export default function TicketDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [ticket, setTicket] = useState<Ticket | null>(null);
  const [seatIdx, setSeatIdx] = useState(0);
  const [qrVisible, setQrVisible] = useState(false);
  const [fabOpen, setFabOpen] = useState(false);

  useEffect(() => {
    const t = getTicketById(id);
    if (!t) { router.replace("/my-tickets"); return; }
    setTicket(t);
    setQrVisible(isQrVisible(t.match.date, t.match.time));
  }, [id, router]);

  useEffect(() => {
    if (!ticket) return;
    const iv = setInterval(() => setQrVisible(isQrVisible(ticket.match.date, ticket.match.time)), 30_000);
    return () => clearInterval(iv);
  }, [ticket]);

  if (!ticket) return null;

  const { match } = ticket;
  const currentSeat = ticket.seatNumbers[seatIdx] ?? ticket.seatNumbers[0];
  const grid = getSeatGrid(ticket, currentSeat);
  const matchPast = isPast(match.date);

  const d = new Date(match.date);
  const dateStr = `${d.getDate()} ${d.toLocaleDateString("en-US", { month: "short" }).toUpperCase()} 26, ${match.time}`;

  return (
    <div className="min-h-screen bg-[#f2f2f7] pb-32 relative">

      {/* ── Dim overlay when FAB is open ── */}
      {fabOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-30"
          onClick={() => setFabOpen(false)}
        />
      )}

      {/* ── Header ── */}
      <div className="relative flex flex-col items-center pt-5 pb-3 bg-[#f2f2f7]">
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
            <div className="w-4 shrink-0 bg-gray-200" />
            <div className="flex-1 flex flex-col items-center justify-center py-8 text-center px-6">
              <div className="w-14 h-14 bg-gray-100 rounded-full flex items-center justify-center mb-3">
                <Lock size={24} className="text-gray-400" />
              </div>
              <p className="text-gray-700 font-bold text-sm">QR code not yet available</p>
              <p className="text-gray-400 text-xs mt-1 leading-relaxed">
                Your barcode will appear{" "}
                <span className="font-semibold text-gray-600">2 hours before kick-off</span>
              </p>
            </div>
            <div className="w-4 shrink-0 bg-gray-200" />
          </div>
        )}
      </div>

      {/* ── Ticket card ── */}
      <div className="mx-4 bg-white rounded-2xl shadow-sm overflow-hidden">
        <div className="relative px-5 pt-5 pb-2 text-center">
          <div className="absolute top-4 left-4">
            <Accessibility size={18} className="text-gray-400" />
          </div>
          <p className="font-black text-[1.05rem] leading-tight text-gray-900">FIFA</p>
          <p className="font-black text-[1.05rem] leading-tight text-gray-900">WORLD CUP</p>
          <p className="font-black text-[1.05rem] leading-tight text-gray-900">2026™</p>
        </div>

        <div className="px-5 pt-2 pb-3 text-center">
          <h2 className="text-[1.5rem] font-black text-gray-900 leading-tight">
            {match.homeTeam} vs {match.awayTeam}
          </h2>
        </div>

        <div className="px-5 pb-4 space-y-1.5 text-center">
          <div className="flex items-center justify-center gap-1.5 text-gray-600 text-[0.85rem]">
            <span>📅</span>
            <span className="font-medium">{dateStr}</span>
          </div>
          <div className="flex items-center justify-center gap-1.5 text-gray-600 text-[0.85rem]">
            <MapPin size={13} />
            <span className="font-medium">{match.venue}</span>
          </div>
        </div>

        {/* Seat grid */}
        <div className="px-4 pb-4 space-y-2">
          {grid.rows.map((row, ri) => (
            <div
              key={ri}
              className={`grid gap-2 ${
                row.length === 1 ? "grid-cols-3" : row.length === 2 ? "grid-cols-2" : "grid-cols-3"
              }`}
            >
              {row.length === 1 ? (
                <>
                  <div />
                  <SeatCell label={row[0].label} value={row[0].value} />
                  <div />
                </>
              ) : (
                row.map((cell, ci) => <SeatCell key={ci} label={cell.label} value={cell.value} />)
              )}
            </div>
          ))}
        </div>

        {/* Dotted separator */}
        <div
          className="mx-4 my-1 h-px"
          style={{
            backgroundImage:
              "repeating-linear-gradient(to right,#d1d5db 0,#d1d5db 6px,transparent 6px,transparent 12px)",
          }}
        />

        <div className="px-5 py-4 flex items-center justify-between">
          <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
            Ticket Category
          </p>
          <p className="text-sm font-bold text-gray-900 truncate max-w-[55%] text-right">
            {grid.category}
          </p>
        </div>
      </div>

      {/* ── Expandable FAB ── */}
      <div className="fixed bottom-24 right-4 flex flex-col items-end gap-2.5 z-40">
        {fabOpen && (
          <>
            {/* Send action */}
            <button
              onClick={() => {
                setFabOpen(false);
                router.push(`/my-tickets/${id}/send`);
              }}
              className="flex items-center gap-2 text-white font-bold text-sm px-5 py-3 rounded-full shadow-lg"
              style={{ background: "#4f8ef7" }}
            >
              <Send size={15} />
              Send
            </button>

            {/* Resale/Exchange action */}
            <button
              onClick={() => setFabOpen(false)}
              className="flex items-center gap-2 text-white font-bold text-sm px-5 py-3 rounded-full shadow-lg"
              style={{ background: "#4f8ef7" }}
            >
              <RefreshCw size={15} />
              Resale/Exchange
            </button>
          </>
        )}

        {/* FAB toggle button */}
        <button
          onClick={() => setFabOpen((v) => !v)}
          className="w-12 h-12 rounded-full flex items-center justify-center shadow-lg transition-transform"
          style={{ background: "#4f8ef7" }}
        >
          <ChevronDown
            size={22}
            className={`text-white transition-transform duration-200 ${fabOpen ? "rotate-180" : ""}`}
          />
        </button>
      </div>

    </div>
  );
}

// ── Seat Info Cell ────────────────────────────────────────────────────────────

function SeatCell({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-[#f2f2f7] rounded-xl px-2 py-2.5 text-center">
      <p className="text-[9px] font-black text-[#6b9aff] uppercase tracking-wider leading-none mb-1">
        {label}
      </p>
      <p className={`font-black text-gray-900 leading-none ${value.length > 4 ? "text-base" : "text-[1.5rem]"}`}>
        {value}
      </p>
    </div>
  );
}
