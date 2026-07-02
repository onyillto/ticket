export type Stage = "Group Stage" | "Round of 16" | "Quarter-Final" | "Semi-Final" | "Final";

export interface Match {
  id: string;
  homeTeam: string;
  awayTeam: string;
  homeFlag: string;
  awayFlag: string;
  date: string;
  time: string;
  venue: string;
  city: string;
  stage: Stage;
  group?: string;
  capacity: number;
  availableSeats: number;
  prices: {
    category1: number;
    category2: number;
    category3: number;
    category4: number;
  };
}

export interface Ticket {
  id: string;
  matchNumber: string;
  matchId: string;
  match: Match;
  category: 1 | 2 | 3 | 4;
  quantity: number;
  totalPrice: number;
  holderName: string;
  email: string;
  bookedAt: string;
  seatNumbers: string[];
  reassignedTo?: { name: string; email: string; reassignedAt: string };
}

export const matches: Match[] = [
  {
    id: "m1",
    homeTeam: "Brazil",
    awayTeam: "Argentina",
    homeFlag: "🇧🇷",
    awayFlag: "🇦🇷",
    date: "2026-06-14",
    time: "18:00",
    venue: "MetLife Stadium",
    city: "New York / New Jersey",
    stage: "Group Stage",
    group: "Group C",
    capacity: 82500,
    availableSeats: 12400,
    prices: { category1: 990, category2: 590, category3: 350, category4: 175 },
  },
  {
    id: "m2",
    homeTeam: "France",
    awayTeam: "England",
    homeFlag: "🇫🇷",
    awayFlag: "🏴󠁧󠁢󠁥󠁮󠁧󠁿",
    date: "2026-06-15",
    time: "21:00",
    venue: "AT&T Stadium",
    city: "Dallas",
    stage: "Group Stage",
    group: "Group A",
    capacity: 80000,
    availableSeats: 8200,
    prices: { category1: 890, category2: 490, category3: 290, category4: 150 },
  },
  {
    id: "m3",
    homeTeam: "Germany",
    awayTeam: "Spain",
    homeFlag: "🇩🇪",
    awayFlag: "🇪🇸",
    date: "2026-06-17",
    time: "18:00",
    venue: "SoFi Stadium",
    city: "Los Angeles",
    stage: "Group Stage",
    group: "Group B",
    capacity: 70240,
    availableSeats: 5100,
    prices: { category1: 890, category2: 490, category3: 290, category4: 150 },
  },
  {
    id: "m4",
    homeTeam: "Portugal",
    awayTeam: "Netherlands",
    homeFlag: "🇵🇹",
    awayFlag: "🇳🇱",
    date: "2026-06-18",
    time: "21:00",
    venue: "Levi's Stadium",
    city: "San Francisco Bay Area",
    stage: "Group Stage",
    group: "Group D",
    capacity: 68500,
    availableSeats: 22000,
    prices: { category1: 790, category2: 450, category3: 270, category4: 135 },
  },
  {
    id: "m5",
    homeTeam: "USA",
    awayTeam: "Mexico",
    homeFlag: "🇺🇸",
    awayFlag: "🇲🇽",
    date: "2026-06-20",
    time: "20:00",
    venue: "Rose Bowl Stadium",
    city: "Los Angeles",
    stage: "Group Stage",
    group: "Group E",
    capacity: 90888,
    availableSeats: 3200,
    prices: { category1: 1100, category2: 650, category3: 390, category4: 195 },
  },
  {
    id: "m6",
    homeTeam: "Morocco",
    awayTeam: "Japan",
    homeFlag: "🇲🇦",
    awayFlag: "🇯🇵",
    date: "2026-06-22",
    time: "15:00",
    venue: "Hard Rock Stadium",
    city: "Miami",
    stage: "Group Stage",
    group: "Group F",
    capacity: 65326,
    availableSeats: 18700,
    prices: { category1: 690, category2: 390, category3: 230, category4: 115 },
  },
  {
    id: "m7",
    homeTeam: "Croatia",
    awayTeam: "Belgium",
    homeFlag: "🇭🇷",
    awayFlag: "🇧🇪",
    date: "2026-06-24",
    time: "18:00",
    venue: "Arrowhead Stadium",
    city: "Kansas City",
    stage: "Group Stage",
    group: "Group G",
    capacity: 76416,
    availableSeats: 30000,
    prices: { category1: 690, category2: 390, category3: 230, category4: 115 },
  },
  {
    id: "m8",
    homeTeam: "Portugal",
    awayTeam: "Croatia",
    homeFlag: "🇵🇹",
    awayFlag: "🇭🇷",
    date: "2026-07-03",
    time: "19:00",
    venue: "Toronto Stadium",
    city: "Toronto",
    stage: "Quarter-Final",
    capacity: 82500,
    availableSeats: 40000,
    prices: { category1: 1990, category2: 1190, category3: 750, category4: 390 },
  },
  {
    id: "m9",
    homeTeam: "TBD",
    awayTeam: "TBD",
    homeFlag: "🏳",
    awayFlag: "🏳",
    date: "2026-07-08",
    time: "21:00",
    venue: "AT&T Stadium",
    city: "Dallas",
    stage: "Semi-Final",
    capacity: 80000,
    availableSeats: 35000,
    prices: { category1: 2990, category2: 1790, category3: 1100, category4: 590 },
  },
  {
    id: "m10",
    homeTeam: "TBD",
    awayTeam: "TBD",
    homeFlag: "🏳",
    awayFlag: "🏳",
    date: "2026-07-19",
    time: "18:00",
    venue: "MetLife Stadium",
    city: "New York / New Jersey",
    stage: "Final",
    capacity: 82500,
    availableSeats: 20000,
    prices: { category1: 4990, category2: 2990, category3: 1990, category4: 990 },
  },
];

export const stageColors: Record<Stage, string> = {
  "Group Stage": "bg-blue-600",
  "Round of 16": "bg-purple-600",
  "Quarter-Final": "bg-orange-600",
  "Semi-Final": "bg-red-600",
  "Final": "bg-yellow-500",
};

export function generateSeatNumbers(quantity: number): string[] {
  const rows = ["A", "B", "C", "D", "E", "F", "G", "H"];
  const seats: string[] = [];
  const row = rows[Math.floor(Math.random() * rows.length)];
  const startSeat = Math.floor(Math.random() * 20) + 1;
  for (let i = 0; i < quantity; i++) {
    seats.push(`${row}${startSeat + i}`);
  }
  return seats;
}
