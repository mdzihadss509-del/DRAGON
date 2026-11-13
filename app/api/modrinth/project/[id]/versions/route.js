import { NextResponse } from "next/server";

export async function GET(_request, { params }) {
  const { id } = await params;
  try {
    const response = await fetch("https://api.modrinth.com/v2/project/" + encodeURIComponent(id) + "/version", {
      headers: { "User-Agent": "mdzihadss509-del/ArcticForge/1.0 (marketplace discovery)" },
      next: { revalidate: 300 }
    });
    if (!response.ok) return NextResponse.json({ error: "Versions are unavailable." }, { status: response.status });
    const versions = await response.json();
    return NextResponse.json(versions, { headers: { "Cache-Control": "s-maxage=300, stale-while-revalidate=900" } });
  } catch {
    return NextResponse.json({ error: "Could not load versions." }, { status: 502 });
  }
}
