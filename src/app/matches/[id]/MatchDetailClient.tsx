"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Calendar, MapPin, Users, ChevronLeft, CheckCircle } from "lucide-react";
import Link from "next/link";
import { Match, generateSeatNumbers, stageColors } from "@/lib/data";
import { saveTicket } from "@/lib/store";

const categories = [
  { id: 1 as const, label: "Category 1", desc: "Best seats — pitch-side & premium stands" },
  { id: 2 as const, label: "Category 2", desc: "Excellent views — main stand & corners" },
  { id: 3 as const, label: "Category 3", desc: "Great atmosphere — end stands" },
  { id: 4 as const, label: "Category 4", desc: "Supporter tickets — behind the goal" },
];

interface Props { match: Match }

export default function MatchDetailClient({ match }: Props) {
  const router = useRouter();
  const [step, setStep] = useState<"select" | "form" | "confirm">("select");
  const [category, setCategory] = useState<1 | 2 | 3 | 4>(4);
  const [quantity, setQuantity] = useState(1);
  const [form, setForm] = useState({ name: "", email: "" });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const priceKey = `category${category}` as keyof typeof match.prices;
  const unitPrice = match.prices[priceKey];
  const total = unitPrice * quantity;

  function validateForm() {
    const e: Record<string, string> = {};
    if (!form.name.trim()) e.name = "Full name is required";
    if (!form.email.trim()) e.email = "Email is required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = "Invalid email address";
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  function handleBook() {
    if (!validateForm()) return;
    const ticket = {
      id: `TKT-${Date.now()}`,
      matchNumber: `M${Math.floor(537400 + Math.random() * 200)}`,
      matchId: match.id,
      match,
      category,
      quantity,
      totalPrice: total,
      holderName: form.name,
      email: form.email,
      bookedAt: new Date().toISOString(),
      seatNumbers: generateSeatNumbers(quantity),
    };
    saveTicket(ticket);
    setStep("confirm");
  }

  if (step === "confirm") {
    return (
      <div className="max-w-xl mx-auto px-4 py-20 text-center">
        <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle size={40} className="text-green-500" />
        </div>
        <h1 className="text-3xl font-black text-gray-900 mb-2">Booking Confirmed!</h1>
        <p className="text-gray-500 mb-6">
          Your tickets have been booked successfully. A confirmation has been sent to{" "}
          <span className="text-gray-900 font-medium">{form.email}</span>.
        </p>
        <div className="bg-white border border-gray-200 rounded-2xl p-6 text-left mb-8 shadow-sm">
          {[
            ["Match", `${match.homeTeam} vs ${match.awayTeam}`],
            ["Category", `Category ${category}`],
            ["Quantity", `${quantity}`],
            ["Unit price", `$${unitPrice}`],
          ].map(([label, value]) => (
            <div key={label} className="flex justify-between mb-3 text-sm">
              <span className="text-gray-400">{label}</span>
              <span className="text-gray-900 font-medium text-right max-w-[60%]">{value}</span>
            </div>
          ))}
          <div className="flex justify-between pt-4 border-t border-gray-100">
            <span className="text-gray-900 font-bold">Total Paid</span>
            <span className="text-[#cc0000] font-black text-lg">${total.toLocaleString()}</span>
          </div>
        </div>
        <div className="flex gap-3 justify-center">
          <Link href="/my-tickets" className="bg-[#cc0000] hover:bg-[#b30000] text-white font-bold px-6 py-3 rounded-xl transition-colors">
            View My Tickets
          </Link>
          <Link href="/matches" className="bg-white border border-gray-200 hover:border-gray-300 text-gray-700 font-bold px-6 py-3 rounded-xl transition-colors">
            Browse More
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <Link href="/matches" className="inline-flex items-center gap-1.5 text-gray-400 hover:text-gray-900 text-sm mb-8 transition-colors">
        <ChevronLeft size={16} /> Back to matches
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          {/* Match header */}
          <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm">
            <div className={`${stageColors[match.stage]} px-5 py-2 flex items-center gap-2`}>
              <span className="text-white text-xs font-bold uppercase tracking-widest">{match.stage}</span>
              {match.group && <span className="text-white/70 text-xs">· {match.group}</span>}
            </div>
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <div className="flex flex-col items-center gap-2 flex-1">
                  <span className="text-6xl">{match.homeFlag}</span>
                  <span className="text-gray-900 font-black text-xl">{match.homeTeam}</span>
                </div>
                <p className="text-gray-400 text-sm uppercase tracking-widest font-medium px-6">vs</p>
                <div className="flex flex-col items-center gap-2 flex-1">
                  <span className="text-6xl">{match.awayFlag}</span>
                  <span className="text-gray-900 font-black text-xl">{match.awayTeam}</span>
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm text-gray-500">
                <div className="flex items-center gap-2 bg-gray-50 rounded-lg px-3 py-2">
                  <Calendar size={14} className="text-[#cc0000]" />
                  {new Date(match.date).toLocaleDateString("en-US", {
                    weekday: "short", month: "long", day: "numeric",
                  })} · {match.time}
                </div>
                <div className="flex items-center gap-2 bg-gray-50 rounded-lg px-3 py-2">
                  <MapPin size={14} className="text-[#cc0000]" />
                  {match.venue}, {match.city}
                </div>
              </div>
            </div>
          </div>

          {/* Category selection */}
          {step === "select" && (
            <div>
              <h2 className="text-gray-900 font-bold text-lg mb-4">Choose Your Category</h2>
              <div className="space-y-3">
                {categories.map((cat) => {
                  const price = match.prices[`category${cat.id}` as keyof typeof match.prices];
                  return (
                    <button
                      key={cat.id}
                      onClick={() => setCategory(cat.id)}
                      className={`w-full flex items-center justify-between p-4 rounded-xl border transition-all text-left ${
                        category === cat.id
                          ? "border-[#cc0000] bg-[#cc0000]/5"
                          : "border-gray-200 bg-white hover:border-gray-300"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                          category === cat.id ? "border-[#cc0000]" : "border-gray-300"
                        }`}>
                          {category === cat.id && <div className="w-2.5 h-2.5 rounded-full bg-[#cc0000]" />}
                        </div>
                        <div>
                          <p className="text-gray-900 font-bold text-sm">{cat.label}</p>
                          <p className="text-gray-400 text-xs">{cat.desc}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-gray-900 font-black">${price}</p>
                        <p className="text-gray-400 text-xs">per ticket</p>
                      </div>
                    </button>
                  );
                })}
              </div>

              <div className="mt-6">
                <h2 className="text-gray-900 font-bold text-lg mb-4">Number of Tickets</h2>
                <div className="flex items-center gap-4">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="w-10 h-10 bg-white border border-gray-200 rounded-xl text-gray-700 font-bold text-lg hover:border-gray-300 transition-colors"
                  >
                    −
                  </button>
                  <span className="text-gray-900 font-black text-2xl w-8 text-center">{quantity}</span>
                  <button
                    onClick={() => setQuantity(Math.min(8, quantity + 1))}
                    className="w-10 h-10 bg-white border border-gray-200 rounded-xl text-gray-700 font-bold text-lg hover:border-gray-300 transition-colors"
                  >
                    +
                  </button>
                  <span className="text-gray-400 text-sm">Max 8 per order</span>
                </div>
              </div>
            </div>
          )}

          {/* Holder form */}
          {step === "form" && (
            <div>
              <h2 className="text-gray-900 font-bold text-lg mb-4">Ticket Holder Details</h2>
              <div className="space-y-4">
                <div>
                  <label className="text-gray-500 text-sm block mb-1.5">Full Name *</label>
                  <input
                    type="text"
                    placeholder="John Smith"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    className={`w-full bg-white border rounded-xl px-4 py-3 text-gray-900 placeholder-gray-300 text-sm focus:outline-none focus:ring-1 ${
                      errors.name
                        ? "border-red-400 focus:ring-red-400/20"
                        : "border-gray-200 focus:border-[#cc0000]/50 focus:ring-[#cc0000]/20"
                    }`}
                  />
                  {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
                </div>
                <div>
                  <label className="text-gray-500 text-sm block mb-1.5">Email Address *</label>
                  <input
                    type="email"
                    placeholder="john@example.com"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    className={`w-full bg-white border rounded-xl px-4 py-3 text-gray-900 placeholder-gray-300 text-sm focus:outline-none focus:ring-1 ${
                      errors.email
                        ? "border-red-400 focus:ring-red-400/20"
                        : "border-gray-200 focus:border-[#cc0000]/50 focus:ring-[#cc0000]/20"
                    }`}
                  />
                  {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Order summary */}
        <div className="lg:col-span-1">
          <div className="sticky top-24 bg-white border border-gray-200 rounded-2xl p-5 shadow-sm">
            <h3 className="text-gray-900 font-bold mb-4">Order Summary</h3>
            <div className="space-y-3 text-sm mb-4">
              <div className="flex justify-between">
                <span className="text-gray-400">Match</span>
                <span className="text-gray-900 text-right text-xs font-medium max-w-32">
                  {match.homeTeam} vs {match.awayTeam}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Category</span>
                <span className="text-gray-900">Cat. {category}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Qty</span>
                <span className="text-gray-900">{quantity}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Unit price</span>
                <span className="text-gray-900">${unitPrice}</span>
              </div>
              <div className="flex items-center gap-2 bg-gray-50 rounded-lg px-3 py-2">
                <Users size={12} className="text-[#cc0000]" />
                <span className="text-gray-400 text-xs">
                  {match.availableSeats.toLocaleString()} seats remaining
                </span>
              </div>
            </div>
            <div className="border-t border-gray-100 pt-4 mb-5">
              <div className="flex justify-between items-center">
                <span className="text-gray-900 font-bold">Total</span>
                <span className="text-[#cc0000] font-black text-xl">${total.toLocaleString()}</span>
              </div>
              <p className="text-gray-400 text-xs mt-1">All taxes & fees included</p>
            </div>
            {step === "select" ? (
              <button
                onClick={() => setStep("form")}
                className="w-full bg-[#cc0000] hover:bg-[#b30000] text-white font-bold py-3.5 rounded-xl transition-colors"
              >
                Continue
              </button>
            ) : (
              <div className="space-y-2">
                <button
                  onClick={handleBook}
                  className="w-full bg-[#cc0000] hover:bg-[#b30000] text-white font-bold py-3.5 rounded-xl transition-colors"
                >
                  Confirm Booking
                </button>
                <button
                  onClick={() => setStep("select")}
                  className="w-full bg-gray-50 hover:bg-gray-100 text-gray-500 font-medium py-2.5 rounded-xl transition-colors text-sm"
                >
                  Back
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
