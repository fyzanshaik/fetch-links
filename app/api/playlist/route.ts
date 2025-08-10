import { NextResponse } from "next/server";
import { getPlaylistItems } from "@/lib/playlist";

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as { url?: string } | undefined;
    const inputUrl = body?.url?.trim();
    if (!inputUrl) {
      return NextResponse.json({ error: "Missing 'url' in request body" }, { status: 400 });
    }
    const { items, source } = await getPlaylistItems(inputUrl);
    return NextResponse.json({ items, source });
  } catch (error: unknown) {
    let message: string;
    if (typeof error === "object" && error !== null && "message" in error) {
      const maybeMessage = (error as Record<string, unknown>)["message"];
      message = typeof maybeMessage === "string" ? maybeMessage : "Unknown error";
    } else {
      message = String(error);
    }
    return NextResponse.json({ error: message }, { status: 500 });
  }
}


