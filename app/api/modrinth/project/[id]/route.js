import { NextResponse } from "next/server";

export async function GET(_request, { params }) {
  const { id } = await params;
  try {
    const headers = { "User-Agent": "mdzihadss509-del/ArcticForge/1.0 (marketplace discovery)" };
    const [projectResponse, teamResponse] = await Promise.all([
      fetch("https://api.modrinth.com/v2/project/" + encodeURIComponent(id), { headers, next: { revalidate: 300 } }),
      fetch("https://api.modrinth.com/v2/project/" + encodeURIComponent(id) + "/members", { headers, next: { revalidate: 300 } })
    ]);
    if (!projectResponse.ok) return NextResponse.json({ error: "Project not found." }, { status: projectResponse.status });
    const project = await projectResponse.json();
    const team = teamResponse.ok ? await teamResponse.json() : [];
    return NextResponse.json({ project, team }, { headers: { "Cache-Control": "s-maxage=300, stale-while-revalidate=900" } });
  } catch {
    return NextResponse.json({ error: "Could not load this project." }, { status: 502 });
  }
}
