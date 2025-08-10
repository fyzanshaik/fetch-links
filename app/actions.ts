"use server";

import { getPlaylistItems, type PlaylistItem } from "@/lib/playlist";

export type ActionState =
  | { status: "idle"; items: PlaylistItem[]; message?: string; source?: "youtube-data-api" | "scrape" }
  | { status: "success"; items: PlaylistItem[]; message?: string; source: "youtube-data-api" | "scrape" }
  | { status: "error"; items: PlaylistItem[]; message: string; source?: "youtube-data-api" | "scrape" };

export async function fetchPlaylistAction(_prevState: ActionState, formData: FormData): Promise<ActionState> {
  const url = (formData.get("url") as string | null)?.trim() || "";
  if (!url) {
    return { status: "error", message: "Please enter a playlist URL", items: [] };
  }
  try {
    const { items, source } = await getPlaylistItems(url);
    return { status: "success", items, source };
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    return { status: "error", message, items: [] };
  }
}


