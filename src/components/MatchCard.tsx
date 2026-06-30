import Link from "next/link";
import { Calendar, MapPin, Users } from "lucide-react";
import { Match, stageColors } from "@/lib/data";

interface Props {
  match: Match;
}

export default function MatchCard({ match }: Props) {
  const soldPct = Math.round(((match.capacity - match.availableSeats) / match.capacity) * 100);
  const isSoldOut = match.availableSeats === 0;
  const isAlmostGone = match.availableSeats < 5000 && match.availableSeats > 0;

  return (
    <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden hover:shadow-md hover:-translate-y-0.5 transition-all group">
      {/* Stage badge */}
      <div className={`${stageColors[match.stage]} px-4 py-1.5 flex items-center justify-between`}>
        <span className="text-white text-xs font-bold uppercase tracking-widest">{match.stage}</span>
        {match.group && <span className="text-white/80 text-xs font-medium">{match.group}</span>}
      </div>

      <div className="p-5">
        {/* Teams */}
        <div className="flex items-center justify-between mb-5">
          <div className="flex flex-col items-center gap-1 flex-1">
            <span className="text-4xl">{match.homeFlag}</span>
            <span className="text-gray-900 font-bold text-sm text-center">{match.homeTeam}</span>
          </div>
          <div className="flex flex-col items-center gap-1 px-4">
            <span className="text-gray-400 text-xs font-medium uppercase tracking-widest">vs</span>
            <div className="w-8 h-px bg-gray-200" />
          </div>
          <div className="flex flex-col items-center gap-1 flex-1">
            <span className="text-4xl">{match.awayFlag}</span>
            <span className="text-gray-900 font-bold text-sm text-center">{match.awayTeam}</span>
          </div>
        </div>

        {/* Meta */}
        <div className="space-y-2 mb-4">
          <div className="flex items-center gap-2 text-gray-500 text-xs">
            <Calendar size={12} />
            <span>
              {new Date(match.date).toLocaleDateString("en-US", {
                weekday: "short", month: "short", day: "numeric", year: "numeric",
              })}{" "}
              · {match.time}
            </span>
          </div>
          <div className="flex items-center gap-2 text-gray-500 text-xs">
            <MapPin size={12} />
            <span>{match.venue}, {match.city}</span>
          </div>
        </div>

        {/* Availability bar */}
        <div className="mb-4">
          <div className="flex justify-between text-xs mb-1">
            <span className="text-gray-400 flex items-center gap-1">
              <Users size={11} />
              {isSoldOut ? "Sold Out" : `${match.availableSeats.toLocaleString()} available`}
            </span>
            <span className={isAlmostGone ? "text-orange-500 font-medium" : "text-gray-400"}>
              {isSoldOut ? "0%" : `${100 - soldPct}% left`}
            </span>
          </div>
          <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full transition-all ${
                soldPct > 90 ? "bg-red-500" : soldPct > 70 ? "bg-orange-400" : "bg-green-500"
              }`}
              style={{ width: `${soldPct}%` }}
            />
          </div>
        </div>

        {/* Price + CTA */}
        <div className="flex items-center justify-between">
          <div>
            <p className="text-gray-400 text-xs">From</p>
            <p className="text-gray-900 font-bold text-lg">${match.prices.category4}</p>
          </div>
          <Link
            href={isSoldOut ? "#" : `/matches/${match.id}`}
            className={`px-5 py-2.5 rounded-xl text-sm font-bold transition-all ${
              isSoldOut
                ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                : "bg-[#cc0000] text-white hover:bg-[#b30000]"
            }`}
          >
            {isSoldOut ? "Sold Out" : "Get Tickets"}
          </Link>
        </div>
      </div>
    </div>
  );
}
