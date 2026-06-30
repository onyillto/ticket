"use client";

import { CheckCircle, XCircle, Clock, ChevronRight } from "lucide-react";

type TxStatus = "completed" | "pending" | "refunded";

interface Transaction {
  id: string;
  date: string;
  match: string;
  venue: string;
  qty: number;
  category: number;
  amount: number;
  status: TxStatus;
  reference: string;
}

const transactions: Transaction[] = [
  {
    id: "TX-20260610001",
    date: "2026-06-10T09:30:00Z",
    match: "TBD vs TBD — Final",
    venue: "MetLife Stadium, NJ",
    qty: 2,
    category: 1,
    amount: 9980,
    status: "completed",
    reference: "TKT-NEW003",
  },
  {
    id: "TX-20260608001",
    date: "2026-06-08T10:00:00Z",
    match: "TBD vs TBD — Semi-Final",
    venue: "AT&T Stadium, Dallas",
    qty: 3,
    category: 2,
    amount: 5370,
    status: "completed",
    reference: "TKT-NEW002",
  },
  {
    id: "TX-20260605001",
    date: "2026-06-05T16:45:00Z",
    match: "TBD vs TBD — Quarter-Final",
    venue: "MetLife Stadium, NJ",
    qty: 2,
    category: 1,
    amount: 3980,
    status: "completed",
    reference: "TKT-NEW001",
  },
  {
    id: "TX-20260520001",
    date: "2026-05-20T11:00:00Z",
    match: "Germany vs Spain — Group B",
    venue: "SoFi Stadium, Los Angeles",
    qty: 2,
    category: 1,
    amount: 1780,
    status: "completed",
    reference: "TKT-PAST003",
  },
  {
    id: "TX-20260512001",
    date: "2026-05-12T14:30:00Z",
    match: "France vs England — Group A",
    venue: "AT&T Stadium, Dallas",
    qty: 1,
    category: 3,
    amount: 290,
    status: "completed",
    reference: "TKT-PAST002",
  },
  {
    id: "TX-20260510001",
    date: "2026-05-10T09:14:00Z",
    match: "Brazil vs Argentina — Group C",
    venue: "MetLife Stadium, NJ",
    qty: 2,
    category: 2,
    amount: 1180,
    status: "completed",
    reference: "TKT-PAST001",
  },
  {
    id: "TX-20260418001",
    date: "2026-04-18T13:00:00Z",
    match: "USA vs Mexico — Group E",
    venue: "Rose Bowl, Los Angeles",
    qty: 4,
    category: 3,
    amount: 1560,
    status: "refunded",
    reference: "TKT-CANCEL01",
  },
  {
    id: "TX-20260415001",
    date: "2026-04-15T08:22:00Z",
    match: "Portugal vs Netherlands — Group D",
    venue: "Levi's Stadium, San Francisco",
    qty: 1,
    category: 2,
    amount: 450,
    status: "pending",
    reference: "TKT-PEND001",
  },
];

const statusConfig: Record<TxStatus, { label: string; icon: React.ReactNode; color: string; bg: string }> = {
  completed: {
    label: "Completed",
    icon: <CheckCircle size={13} />,
    color: "text-green-600",
    bg: "bg-green-50 border-green-100",
  },
  pending: {
    label: "Pending",
    icon: <Clock size={13} />,
    color: "text-amber-600",
    bg: "bg-amber-50 border-amber-100",
  },
  refunded: {
    label: "Refunded",
    icon: <XCircle size={13} />,
    color: "text-gray-400",
    bg: "bg-gray-50 border-gray-200",
  },
};

function groupByMonth(txs: Transaction[]) {
  const groups: Record<string, Transaction[]> = {};
  txs.forEach((tx) => {
    const key = new Date(tx.date).toLocaleDateString("en-US", { month: "long", year: "numeric" });
    if (!groups[key]) groups[key] = [];
    groups[key].push(tx);
  });
  return groups;
}

export default function TransactionsPage() {
  const total = transactions
    .filter((t) => t.status === "completed")
    .reduce((sum, t) => sum + t.amount, 0);

  const refunded = transactions
    .filter((t) => t.status === "refunded")
    .reduce((sum, t) => sum + t.amount, 0);

  const grouped = groupByMonth(transactions);

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-8">
      <h1 className="text-3xl font-black text-gray-900 mb-6">Transactions</h1>

      {/* Summary cards */}
      <div className="grid grid-cols-3 gap-3 mb-8">
        {[
          { label: "Total spent", value: `$${total.toLocaleString()}`, color: "text-gray-900" },
          { label: "Transactions", value: `${transactions.length}`, color: "text-gray-900" },
          { label: "Refunded", value: `$${refunded.toLocaleString()}`, color: "text-red-500" },
        ].map((s) => (
          <div key={s.label} className="bg-white border border-gray-200 rounded-2xl p-4 shadow-sm">
            <p className={`text-xl font-black ${s.color}`}>{s.value}</p>
            <p className="text-gray-400 text-xs mt-0.5">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Grouped list */}
      <div className="space-y-6">
        {Object.entries(grouped).map(([month, txs]) => (
          <div key={month}>
            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">{month}</p>
            <div className="space-y-2">
              {txs.map((tx) => {
                const cfg = statusConfig[tx.status];
                return (
                  <div
                    key={tx.id}
                    className="bg-white border border-gray-200 rounded-2xl px-4 py-3.5 flex items-center gap-3 shadow-sm hover:shadow transition-shadow cursor-pointer"
                  >
                    {/* FIFA ticket thumbnail */}
                    <div className="w-12 h-12 rounded-xl overflow-hidden shrink-0 relative" style={{ background: "#003f7f" }}>
                      <div className="absolute inset-0" style={{ background: "#cc0000", clipPath: "polygon(0 28%, 100% 14%, 100% 72%, 0 86%)" }} />
                      <div className="absolute inset-0" style={{ background: "#6ab04c", clipPath: "polygon(55% 100%, 100% 55%, 100% 100%)" }} />
                      <div className="absolute inset-0 flex items-center justify-center">
                        <span className="text-white font-black text-[7px] tracking-widest text-center leading-tight">
                          FIFA{"\n"}WC
                        </span>
                      </div>
                    </div>

                    <div className="flex-1 min-w-0">
                      <p className="text-gray-900 font-bold text-sm truncate">{tx.match}</p>
                      <p className="text-gray-400 text-xs truncate">{tx.venue}</p>
                      <p className="text-gray-300 text-xs mt-0.5 font-mono">{tx.reference}</p>
                    </div>

                    <div className="text-right shrink-0 ml-2">
                      <p className={`font-black text-sm ${tx.status === "refunded" ? "text-gray-400 line-through" : "text-gray-900"}`}>
                        ${tx.amount.toLocaleString()}
                      </p>
                      <span className={`inline-flex items-center gap-1 text-xs font-medium border rounded-full px-2 py-0.5 mt-1 ${cfg.color} ${cfg.bg}`}>
                        {cfg.icon}
                        {cfg.label}
                      </span>
                    </div>

                    <ChevronRight size={16} className="text-gray-300 shrink-0" />
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
