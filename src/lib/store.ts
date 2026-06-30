"use client";

import { Ticket, matches } from "./data";

const STORAGE_KEY = "wc2026_tickets";
const SEEDED_KEY = "wc2026_seeded";

const dummyTickets: Ticket[] = [
  // ── Past tickets ──────────────────────────────────────────────
  {
    id: "TKT-PAST001",
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
  // ── Upcoming tickets ──────────────────────────────────────────
  {
    id: "TKT-NEW001",
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
