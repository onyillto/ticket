import { notFound } from "next/navigation";
import { matches } from "@/lib/data";
import MatchDetailClient from "./MatchDetailClient";

export function generateStaticParams() {
  return matches.map((m) => ({ id: m.id }));
}

export default async function MatchDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const match = matches.find((m) => m.id === id);
  if (!match) notFound();
  return <MatchDetailClient match={match} />;
}
