"use client";

import { Ticket, matches } from "./data";

const STORAGE_KEY = "wc2026_tickets";
const SEEDED_KEY = "wc2026_seeded_v2";

const dummyTickets: Ticket[] = [
  // ── Past tickets ──────────────────────────────────────────────
  {
    id: "TKT-PAST001",
    matchNumber: "M537401",
    matchId: "m1",
    match: matches.find((m) => m.id === "m1")!,
    category: 2,
    quantity: 2,
    totalPrice: 1180,
    holderName: "James Carter",
    email: "james.carter@gmail.com",
    bookedAt: "2026-05-10T09:14:00Z",
    seatNumbers: ["C12", "C13"],
  },
  {
    id: "TKT-PAST002",
    matchNumber: "M537408",
    matchId: "m2",
    match: matches.find((m) => m.id === "m2")!,
    category: 3,
    quantity: 1,
    totalPrice: 290,
    holderName: "James Carter",
    email: "james.carter@gmail.com",
    bookedAt: "2026-05-12T14:30:00Z",
    seatNumbers: ["F7"],
  },
  {
    id: "TKT-PAST003",
    matchNumber: "M537416",
    matchId: "m3",
    match: matches.find((m) => m.id === "m3")!,
    category: 1,
    quantity: 2,
    totalPrice: 1780,
    holderName: "James Carter",
    email: "james.carter@gmail.com",
    bookedAt: "2026-05-20T11:00:00Z",
    seatNumbers: ["A4", "A5"],
    reassignedTo: {
      name: "Sofia Müller",
      email: "sofia.muller@email.de",
      reassignedAt: "2026-06-01T08:22:00Z",
    },
  },
  {
    id: "TKT-PAST004",
    matchNumber: "M537419",
    matchId: "m4",
    match: matches.find((m) => m.id === "m4")!,
    category: 2,
    quantity: 2,
    totalPrice: 900,
    holderName: "James Carter",
    email: "james.carter@gmail.com",
    bookedAt: "2026-05-14T10:00:00Z",
    seatNumbers: ["G3", "G4"],
  },
  {
    id: "TKT-PAST005",
    matchNumber: "M537421",
    matchId: "m5",
    match: matches.find((m) => m.id === "m5")!,
    category: 3,
    quantity: 3,
    totalPrice: 1170,
    holderName: "James Carter",
    email: "james.carter@gmail.com",
    bookedAt: "2026-05-15T08:30:00Z",
    seatNumbers: ["H10", "H11", "H12"],
  },
  {
    id: "TKT-PAST006",
    matchNumber: "M537425",
    matchId: "m6",
    match: matches.find((m) => m.id === "m6")!,
    category: 4,
    quantity: 2,
    totalPrice: 230,
    holderName: "James Carter",
    email: "james.carter@gmail.com",
    bookedAt: "2026-05-18T13:00:00Z",
    seatNumbers: ["D22", "D23"],
  },
  {
    id: "TKT-PAST007",
    matchNumber: "M537430",
    matchId: "m7",
    match: matches.find((m) => m.id === "m7")!,
    category: 2,
    quantity: 1,
    totalPrice: 390,
    holderName: "James Carter",
    email: "james.carter@gmail.com",
    bookedAt: "2026-05-22T09:00:00Z",
    seatNumbers: ["B17"],
  },
  // ── Upcoming tickets ──────────────────────────────────────────
  {
    id: "TKT-NEW001",
    matchNumber: "M537440",
    matchId: "m8",
    match: matches.find((m) => m.id === "m8")!,
    category: 1,
    quantity: 2,
    totalPrice: 3980,
    holderName: "James Carter",
    email: "james.carter@gmail.com",
    bookedAt: "2026-06-05T16:45:00Z",
    seatNumbers: ["B8", "B9"],
  },
  {
    id: "TKT-NEW002",
    matchNumber: "M537448",
    matchId: "m9",
    match: matches.find((m) => m.id === "m9")!,
    category: 2,
    quantity: 3,
    totalPrice: 5370,
    holderName: "James Carter",
    email: "james.carter@gmail.com",
    bookedAt: "2026-06-08T10:00:00Z",
    seatNumbers: ["D14", "D15", "D16"],
  },
  {
    id: "TKT-NEW003",
    matchNumber: "M537460",
    matchId: "m10",
    match: matches.find((m) => m.id === "m10")!,
    category: 1,
    quantity: 2,
    totalPrice: 9980,
    holderName: "James Carter",
    email: "james.carter@gmail.com",
    bookedAt: "2026-06-10T09:30:00Z",
    seatNumbers: ["E1", "E2"],
  },
];

function seedIfNeeded(): void {
  if (typeof window === "undefined") return;
  if (localStorage.getItem(SEEDED_KEY)) return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(dummyTickets));
  localStorage.setItem(SEEDED_KEY, "1");
}

export function getTickets(): Ticket[] {
  if (typeof window === "undefined") return [];
  seedIfNeeded();
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function getTicketById(id: string): Ticket | undefined {
  return getTickets().find((t) => t.id === id);
}

export function saveTicket(ticket: Ticket): void {
  const tickets = getTickets();
  tickets.push(ticket);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(tickets));
}

export function reassignTicket(
  ticketId: string,
  newHolder: { name: string; email: string }
): void {
  const tickets = getTickets();
  const idx = tickets.findIndex((t) => t.id === ticketId);
  if (idx === -1) return;
  tickets[idx].reassignedTo = {
    ...newHolder,
    reassignedAt: new Date().toISOString(),
  };
  localStorage.setItem(STORAGE_KEY, JSON.stringify(tickets));
}

export function clearTickets(): void {
  localStorage.removeItem(STORAGE_KEY);
  localStorage.removeItem(SEEDED_KEY);
}
