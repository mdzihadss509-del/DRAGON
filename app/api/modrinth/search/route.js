import { NextResponse } from "next/server";

const TYPE_FACETS = {
  mods: "project_type:mod",
  modpacks: "project_type:modpack",
  plugins: "all_project_types:plugin",
  datapacks: "all_project_types:datapack",
  resourcepacks: "project_type:resourcepack",
  shaders: "project_type:shader"
};

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const type = searchParams.get("type") || "mods";
  const query = searchParams.get("q") || "";
  const index = searchParams.get("index") || "downloads";
  const offset = Math.max(0, Number(searchParams.get("offset") || 0));
  const limit = Math.min(30, Math.max(1, Number(searchParams.get("limit") || 18)));
  const facets = [];
  if (TYPE_FACETS[type]) facets.push([TYPE_FACETS[type]]);
  const loader = searchParams.get("loader");
  const version = searchParams.get("version");
  if (loader) facets.push(["categories:" + loader]);
  if (version) facets.push(["versions:" + version]);
  const params = new URLSearchParams({ limit: String(limit), offset: String(offset), index, facets: JSON.stringify(facets) });
  if (query.trim()) params.set("query", query.trim());
  try {
    const response = await fetch("https://api.modrinth.com/v2/search?" + params.toString(), {
      headers: { "User-Agent": "mdzihadss509-del/ArcticForge/1.0 (marketplace discovery)" },
      next: { revalidate: 300 }
    });
    if (!response.ok) return NextResponse.json({ hits: [], total_hits: 0, error: "Modrinth discovery is temporarily unavailable." }, { status: 502 });
    const data = await response.json();
    return NextResponse.json(data, { headers: { "Cache-Control": "s-maxage=300, stale-while-revalidate=900" } });
  } catch {
    return NextResponse.json({ hits: [], total_hits: 0, error: "Could not reach Modrinth right now." }, { status: 502 });
  }
}
