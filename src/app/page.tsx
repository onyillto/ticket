import Link from "next/link";
import { ArrowRight, MapPin, Calendar, Shield, Zap } from "lucide-react";
import MatchCard from "@/components/MatchCard";
import { matches } from "@/lib/data";

const featuredMatches = matches.filter((m) => ["m1", "m3", "m5"].includes(m.id));

const hosts = [
  { country: "🇺🇸", name: "United States", stadiums: 11 },
  { country: "🇨🇦", name: "Canada", stadiums: 2 },
  { country: "🇲🇽", name: "Mexico", stadiums: 3 },
];

const stats = [
  { value: "48", label: "Teams" },
  { value: "104", label: "Matches" },
  { value: "16", label: "Host Cities" },
  { value: "3", label: "Countries" },
];

export default function HomePage() {
  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-gray-50 to-white border-b border-gray-100">
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#cc0000]/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 md:py-32">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 bg-[#cc0000]/10 border border-[#cc0000]/20 rounded-full px-4 py-1.5 mb-6">
              <span className="w-2 h-2 bg-[#cc0000] rounded-full animate-pulse" />
              <span className="text-[#cc0000] text-xs font-bold uppercase tracking-widest">
                Tickets On Sale Now
              </span>
            </div>

            <h1 className="text-5xl md:text-7xl font-black text-gray-900 leading-none tracking-tight mb-4">
              FIFA
              <br />
              <span className="text-[#cc0000]">World Cup</span>
              <br />
              2026™
            </h1>

            <p className="text-gray-500 text-lg md:text-xl mb-8 max-w-xl">
              Experience the greatest sporting event on Earth. 48 teams, 104 matches,
              3 nations — one unforgettable summer.
            </p>

            <div className="flex flex-wrap gap-4">
              <Link
                href="/matches"
                className="inline-flex items-center gap-2 bg-[#cc0000] hover:bg-[#b30000] text-white font-bold px-7 py-3.5 rounded-xl transition-all"
              >
                Browse Matches
                <ArrowRight size={18} />
              </Link>
              <Link
                href="/my-tickets"
                className="inline-flex items-center gap-2 bg-white border border-gray-200 hover:border-gray-300 text-gray-700 font-bold px-7 py-3.5 rounded-xl transition-all shadow-sm"
              >
                My Tickets
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Stats strip */}
      <section className="border-b border-gray-100 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((s) => (
              <div key={s.label} className="text-center">
                <p className="text-4xl font-black text-gray-900">{s.value}</p>
                <p className="text-gray-400 text-sm uppercase tracking-widest mt-1">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Host nations */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl font-black text-gray-900">Host Nations</h2>
            <p className="text-gray-400 text-sm mt-1">Three countries, one dream</p>
          </div>
          <MapPin size={20} className="text-[#cc0000]" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {hosts.map((h) => (
            <div
              key={h.name}
              className="flex items-center gap-4 bg-white border border-gray-200 rounded-2xl p-5 hover:shadow-sm transition-shadow"
            >
              <span className="text-5xl">{h.country}</span>
              <div>
                <p className="text-gray-900 font-bold">{h.name}</p>
                <p className="text-gray-400 text-sm">{h.stadiums} host stadiums</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Featured matches */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl font-black text-gray-900">Featured Matches</h2>
            <p className="text-gray-400 text-sm mt-1">Don&apos;t miss these marquee fixtures</p>
          </div>
          <Link
            href="/matches"
            className="flex items-center gap-1.5 text-[#cc0000] hover:text-[#b30000] text-sm font-medium transition-colors"
          >
            View all <ArrowRight size={14} />
          </Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {featuredMatches.map((match) => (
            <MatchCard key={match.id} match={match} />
          ))}
        </div>
      </section>

      {/* Why book */}
      <section className="bg-gray-50 border-y border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <h2 className="text-2xl font-black text-gray-900 text-center mb-10">Why Book With Us?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                icon: <Shield size={24} className="text-[#cc0000]" />,
                title: "100% Official",
                desc: "All tickets are sourced directly from FIFA. Guaranteed authentic.",
              },
              {
                icon: <Zap size={24} className="text-[#cc0000]" />,
                title: "Instant Delivery",
                desc: "Digital tickets delivered to your email instantly after purchase.",
              },
              {
                icon: <Calendar size={24} className="text-[#cc0000]" />,
                title: "Flexible Options",
                desc: "Choose your category, quantity, and match date with ease.",
              },
            ].map((f) => (
              <div key={f.title} className="text-center p-6">
                <div className="w-12 h-12 bg-[#cc0000]/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  {f.icon}
                </div>
                <h3 className="text-gray-900 font-bold mb-2">{f.title}</h3>
                <p className="text-gray-400 text-sm">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
