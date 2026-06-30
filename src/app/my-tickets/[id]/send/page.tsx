"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { ChevronLeft, ChevronRight, ChevronDown, Check, CheckCircle, X } from "lucide-react";
import { Ticket } from "@/lib/data";
import { getTicketById, reassignTicket } from "@/lib/store";

const LANGUAGES = [
  { code: "en",    label: "English",    native: "English"       },
  { code: "es",    label: "Spanish",    native: "Español"       },
  { code: "fr",    label: "French",     native: "Français"      },
  { code: "pt",    label: "Portuguese", native: "Português"     },
  { code: "de",    label: "German",     native: "Deutsch"       },
  { code: "ar",    label: "Arabic",     native: "العربية"       },
  { code: "zh",    label: "Chinese",    native: "中文"           },
  { code: "ja",    label: "Japanese",   native: "日本語"          },
  { code: "ko",    label: "Korean",     native: "한국어"          },
  { code: "it",    label: "Italian",    native: "Italiano"      },
  { code: "nl",    label: "Dutch",      native: "Nederlands"    },
  { code: "ru",    label: "Russian",    native: "Русский"       },
  { code: "tr",    label: "Turkish",    native: "Türkçe"        },
  { code: "pl",    label: "Polish",     native: "Polski"        },
  { code: "sv",    label: "Swedish",    native: "Svenska"       },
];

export default function SendTicketPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [ticket, setTicket] = useState<Ticket | null>(null);

  const [recipientEmail, setRecipientEmail] = useState("");
  const [recipientExpanded, setRecipientExpanded] = useState(false);
  const [message, setMessage] = useState("");
  const [emailError, setEmailError] = useState("");
  const [language, setLanguage] = useState(LANGUAGES[0]);
  const [langPickerOpen, setLangPickerOpen] = useState(false);
  const [sent, setSent] = useState(false);

  useEffect(() => {
    const t = getTicketById(id);
    if (!t) { router.replace("/my-tickets"); return; }
    setTicket(t);
  }, [id, router]);

  if (!ticket) return null;

  const { match } = ticket;
  const d = new Date(match.date);
  const formattedDate = `${String(d.getDate()).padStart(2, "0")}.${String(d.getMonth() + 1).padStart(2, "0")}.2026`;

  function handleSend() {
    if (!recipientEmail.trim()) {
      setRecipientExpanded(true);
      setEmailError("Please enter a recipient email");
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(recipientEmail)) {
      setRecipientExpanded(true);
      setEmailError("Invalid email address");
      return;
    }
    reassignTicket(ticket!.id, { name: recipientEmail.split("@")[0], email: recipientEmail });
    setSent(true);
  }

  if (sent) {
    return (
      <div className="min-h-screen bg-[#f2f2f7] flex flex-col items-center justify-center px-6 text-center">
        <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center mb-5">
          <CheckCircle size={40} className="text-green-500" />
        </div>
        <h2 className="text-2xl font-black text-gray-900 mb-2">Ticket Sent!</h2>
        <p className="text-gray-500 text-sm mb-2">Your ticket has been sent to</p>
        <p className="text-gray-900 font-bold mb-1">{recipientEmail}</p>
        <p className="text-gray-400 text-xs mb-8">in {language.label}</p>
        <button
          onClick={() => router.replace("/my-tickets")}
          className="w-full max-w-xs text-white font-bold py-4 rounded-2xl text-base"
          style={{ background: "#7b9ef7" }}
        >
          Back to My Tickets
        </button>
      </div>
    );
  }

  return (
    <>
      <div className="min-h-screen bg-[#f2f2f7]">
        <div className="max-w-lg mx-auto pb-36">

          {/* Back + Title */}
          <div className="px-4 pt-6 pb-1">
            <button onClick={() => router.back()} className="text-gray-800 mb-4 block">
              <ChevronLeft size={26} strokeWidth={2.5} />
            </button>
            <h1 className="text-[2rem] font-black text-gray-900 leading-tight mb-1">Confirm</h1>
            <p className="text-gray-500 text-[0.85rem] leading-snug">
              You can send tickets to someone else directly within the app by following the steps below.
            </p>
          </div>

          {/* Ticket info card */}
          <div className="mx-4 mt-4 bg-white rounded-2xl px-4 py-3.5 flex items-center gap-3 shadow-sm">
            <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center shrink-0">
              <span className="font-black text-gray-700 text-sm">1</span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-bold text-gray-900 text-sm leading-tight">
                {match.homeTeam} vs {match.awayTeam}
              </p>
              <p className="text-gray-400 text-xs mt-0.5">
                {formattedDate}&nbsp;&nbsp;{match.time}&nbsp;&nbsp;{match.venue}
              </p>
            </div>
            <ChevronDown size={16} className="text-gray-400 shrink-0" />
          </div>

          <p className="mx-4 mt-3 font-bold text-gray-800 text-[0.85rem]">
            Select more tickets to send
          </p>

          <p className="mx-4 mt-5 mb-2 font-black text-gray-900 text-[1rem]">
            Steps to follow
          </p>

          <div className="mx-4 bg-white rounded-2xl overflow-hidden shadow-sm">

            {/* Step 1 — Ticket recipient */}
            <div className="border-b border-gray-100">
              <button
                className="w-full flex items-start gap-3 px-4 py-4 text-left"
                onClick={() => setRecipientExpanded((v) => !v)}
              >
                <span className="text-xs text-gray-400 font-bold mt-0.5 shrink-0">1</span>
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-gray-900 text-sm">
                    Ticket recipient<span className="text-red-500 ml-0.5">*</span>
                  </p>
                  {recipientEmail ? (
                    <p className="text-gray-600 text-xs mt-0.5 truncate">{recipientEmail}</p>
                  ) : (
                    <p className="text-gray-400 text-xs mt-0.5 leading-snug">
                      Please add the email address of the ticket recipient
                    </p>
                  )}
                </div>
                <ChevronRight size={16} className="text-gray-300 shrink-0 mt-0.5" />
              </button>
              {recipientExpanded && (
                <div className="px-4 pb-4">
                  <input
                    type="email"
                    placeholder="recipient@example.com"
                    value={recipientEmail}
                    onChange={(e) => { setRecipientEmail(e.target.value); setEmailError(""); }}
                    autoFocus
                    className={`w-full bg-[#f2f2f7] rounded-xl px-4 py-3 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 ${
                      emailError ? "ring-2 ring-red-300" : "focus:ring-[#7b9ef7]/40"
                    }`}
                  />
                  {emailError && <p className="text-red-500 text-[11px] mt-1">{emailError}</p>}
                </div>
              )}
            </div>

            {/* Step 2 — Message */}
            <div className="px-4 py-4 border-b border-gray-100">
              <p className="font-bold text-gray-900 text-sm mb-3">Message</p>
              <div className="flex items-start gap-3">
                <span className="text-xs text-gray-400 font-bold mt-2 shrink-0">2</span>
                <div className="flex-1">
                  <textarea
                    value={message}
                    onChange={(e) => setMessage(e.target.value.slice(0, 300))}
                    maxLength={300}
                    rows={3}
                    className="w-full bg-[#f2f2f7] rounded-xl px-3 py-2.5 text-sm text-gray-900 resize-none focus:outline-none focus:ring-2 focus:ring-[#7b9ef7]/30"
                  />
                  <p className="text-gray-400 text-[11px] text-right mt-1">{message.length}/300</p>
                </div>
              </div>
            </div>

            {/* Step 3 — Language (interactive) */}
            <button
              className="w-full flex items-center gap-3 px-4 py-4 text-left active:bg-gray-50"
              onClick={() => setLangPickerOpen(true)}
            >
              <div
                className="w-6 h-6 rounded-full flex items-center justify-center shrink-0"
                style={{ background: "#7dc143" }}
              >
                <Check size={13} className="text-white" strokeWidth={3} />
              </div>
              <div className="flex-1">
                <p className="font-bold text-gray-900 text-sm">Language to send your ticket(s)</p>
                <p className="text-gray-400 text-xs mt-0.5">
                  {language.label}
                  {language.native !== language.label && (
                    <span className="ml-1 text-gray-300">· {language.native}</span>
                  )}
                </p>
              </div>
              <ChevronRight size={16} className="shrink-0" style={{ color: "#7b9ef7" }} />
            </button>

          </div>
        </div>

        {/* Fixed Send button */}
        <div className="fixed bottom-20 left-0 right-0 px-4 z-20">
          <div className="max-w-lg mx-auto">
            <button
              onClick={handleSend}
              className="w-full text-white font-bold py-4 rounded-2xl text-base active:opacity-80 transition-opacity"
              style={{ background: "#7b9ef7" }}
            >
              Send
            </button>
          </div>
        </div>
      </div>

      {/* Language picker bottom sheet */}
      {langPickerOpen && (
        <LanguagePicker
          selected={language}
          onSelect={(l) => { setLanguage(l); setLangPickerOpen(false); }}
          onClose={() => setLangPickerOpen(false)}
        />
      )}
    </>
  );
}

// ── Language Picker Sheet ─────────────────────────────────────────────────────

function LanguagePicker({
  selected, onSelect, onClose,
}: {
  selected: typeof LANGUAGES[0];
  onSelect: (l: typeof LANGUAGES[0]) => void;
  onClose: () => void;
}) {
  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/40 z-50"
        onClick={onClose}
      />

      {/* Sheet */}
      <div className="fixed bottom-0 left-0 right-0 z-50 bg-white rounded-t-3xl shadow-2xl max-h-[75vh] flex flex-col">
        {/* Handle + header */}
        <div className="flex items-center justify-between px-5 pt-4 pb-3 shrink-0">
          <div className="absolute left-1/2 -translate-x-1/2 top-3 w-10 h-1 bg-gray-200 rounded-full" />
          <h2 className="font-black text-gray-900 text-base mt-2">Select language</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 mt-2">
            <X size={20} />
          </button>
        </div>

        {/* Language list */}
        <div className="overflow-y-auto flex-1 pb-8">
          {LANGUAGES.map((lang, i) => {
            const isSelected = lang.code === selected.code;
            return (
              <div key={lang.code}>
                <button
                  className="w-full flex items-center gap-4 px-5 py-3.5 text-left active:bg-gray-50"
                  onClick={() => onSelect(lang)}
                >
                  {/* Selected indicator */}
                  <div
                    className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 transition-colors ${
                      isSelected ? "border-[#7b9ef7]" : "border-gray-300"
                    }`}
                  >
                    {isSelected && (
                      <div className="w-2.5 h-2.5 rounded-full bg-[#7b9ef7]" />
                    )}
                  </div>

                  <div className="flex-1">
                    <p className={`text-sm font-semibold ${isSelected ? "text-[#7b9ef7]" : "text-gray-900"}`}>
                      {lang.label}
                    </p>
                    {lang.native !== lang.label && (
                      <p className="text-xs text-gray-400 mt-0.5">{lang.native}</p>
                    )}
                  </div>

                  {isSelected && (
                    <Check size={16} className="shrink-0" style={{ color: "#7b9ef7" }} strokeWidth={2.5} />
                  )}
                </button>
                {i < LANGUAGES.length - 1 && (
                  <div className="ml-14 h-px bg-gray-100" />
                )}
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
}
