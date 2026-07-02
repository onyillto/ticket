"use client";

import { ChevronRight } from "lucide-react";

interface Transaction {
  id: string;
  date: string;
  match: string;
  venue: string;
  qty: number;
  category: number;
  amount: number;
  reference: string;
}

const transactions: Transaction[] = [
  {
    id: "TX-20260615001",
    date: "2026-06-15T10:20:00Z",
    match: "M83 Portugal vs Croatia — Quarter-Final",
    venue: "MetLife Stadium, NJ",
    qty: 2,
    category: 3,
    amount: 1500,
    reference: "TKT-NEW001",
  },
  {
    id: "TX-20260522001",
    date: "2026-05-22T09:00:00Z",
    match: "M07 Croatia vs Belgium — Group G",
    venue: "Arrowhead Stadium, Kansas City",
    qty: 1,
    category: 2,
    amount: 390,
    reference: "TKT-PAST007",
  },
  {
    id: "TX-20260518001",
    date: "2026-05-18T13:00:00Z",
    match: "M06 Morocco vs Japan — Group F",
    venue: "Hard Rock Stadium, Miami",
    qty: 2,
    category: 4,
    amount: 230,
    reference: "TKT-PAST006",
  },
  {
    id: "TX-20260515001",
    date: "2026-05-15T08:30:00Z",
    match: "M05 USA vs Mexico — Group E",
    venue: "Rose Bowl, Los Angeles",
    qty: 3,
    category: 3,
    amount: 1170,
    reference: "TKT-PAST005",
  },
  {
    id: "TX-20260514001",
    date: "2026-05-14T10:00:00Z",
    match: "M04 Portugal vs Netherlands — Group D",
    venue: "Levi's Stadium, San Francisco",
    qty: 2,
    category: 2,
    amount: 900,
    reference: "TKT-PAST004",
  },
  {
    id: "TX-20260520001",
    date: "2026-05-20T11:00:00Z",
    match: "M03 Germany vs Spain — Group B",
    venue: "SoFi Stadium, Los Angeles",
    qty: 2,
    category: 1,
    amount: 1780,
    reference: "TKT-PAST003",
  },
  {
    id: "TX-20260512001",
    date: "2026-05-12T14:30:00Z",
    match: "M02 France vs England — Group A",
    venue: "AT&T Stadium, Dallas",
    qty: 1,
    category: 3,
    amount: 290,
    reference: "TKT-PAST002",
  },
  {
    id: "TX-20260510001",
    date: "2026-05-10T09:14:00Z",
    match: "M01 Brazil vs Argentina — Group C",
    venue: "MetLife Stadium, NJ",
    qty: 2,
    category: 2,
    amount: 1180,
    reference: "TKT-PAST001",
  },
];

function groupByMonth(txs: Transaction[]) {
  const groups: Record<string, Transaction[]> = {};
  txs.forEach((tx) => {
    const key = new Date(tx.date).toLocaleDateString("en-US", {
      month: "long",
      year: "numeric",
    });
    if (!groups[key]) groups[key] = [];
    groups[key].push(tx);
  });
  return groups;
}

export default function TransactionsPage() {
  const grouped = groupByMonth(transactions);

  return (
    <div className="min-h-screen bg-[#f2f2f7]">
      <div className="max-w-lg mx-auto px-4 pt-8 pb-6">

        {/* Title */}
        <h1 className="text-[2rem] font-black text-gray-900 tracking-tight mb-5">
          Transactions
        </h1>

        {/* FIFA promo banner — same as My Tickets */}
        <div className="flex items-center gap-3 mb-5 p-3 bg-white rounded-2xl shadow-sm">
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

        {/* Grouped list */}
        <div className="space-y-5">
          {Object.entries(grouped).map(([month, txs]) => (
            <div key={month}>
              <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2 px-1">
                {month}
              </p>
              <div className="bg-white rounded-2xl overflow-hidden shadow-sm">
                {txs.map((tx, i) => (
                  <div key={tx.id}>
                    <div className="px-4 py-3.5 flex items-center gap-3">
                      {/* FIFA icon thumbnail */}
                      <FifaAppIcon />

                      <div className="flex-1 min-w-0">
                        <p className="text-gray-900 font-bold text-sm truncate">{tx.match}</p>
                        <p className="text-gray-400 text-xs truncate mt-0.5">{tx.venue}</p>
                      </div>

                      <div className="text-right shrink-0">
                        <p className="text-gray-900 font-black text-sm">
                          ${tx.amount.toLocaleString()}
                        </p>
                        <p className="text-gray-400 text-[11px] mt-0.5">
                          {tx.qty} ticket{tx.qty > 1 ? "s" : ""}
                        </p>
                      </div>

                      <ChevronRight size={16} className="text-gray-300 shrink-0" />
                    </div>
                    {i < txs.length - 1 && (
                      <div className="ml-[68px] h-px bg-gray-100" />
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}

// ── FIFA App Icon (same graphic as My Tickets banner) ─────────────────────────

function FifaAppIcon() {
  return (
    <div
      className="relative w-11 h-11 rounded-xl overflow-hidden shrink-0"
      style={{ background: "#003f7f" }}
    >
      <div
        className="absolute inset-0"
        style={{
          background: "#cc0000",
          clipPath: "polygon(0 28%, 100% 12%, 100% 72%, 0 88%)",
        }}
      />
      <div
        className="absolute inset-0"
        style={{
          background: "#7dc143",
          clipPath: "polygon(50% 100%, 100% 50%, 100% 100%)",
        }}
      />
    </div>
  );
}
