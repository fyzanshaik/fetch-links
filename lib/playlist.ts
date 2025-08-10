type SourceType = "youtube-data-api" | "scrape";

export type PlaylistItem = {
  title: string;
  url: string;
};

export type PlaylistFetchResult = {
  items: PlaylistItem[];
  source: SourceType;
};

function extractPlaylistId(inputUrl: string): string | null {
  try {
    const url = new URL(inputUrl);
    const list = url.searchParams.get("list");
    if (list && /^[A-Za-z0-9_-]+$/.test(list)) {
      return list;
    }
    return null;
  } catch {
    return null;
  }
}

type YouTubePlaylistItemsResponse = {
  items?: Array<{
    contentDetails?: { videoId?: string };
    snippet?: { title?: string };
  }>;
  nextPageToken?: string;
};

async function fetchWithYouTubeDataApi(
  playlistId: string,
  apiKey: string,
): Promise<PlaylistItem[]> {
  let pageToken: string | undefined = undefined;
  const itemsOut: PlaylistItem[] = [];

  for (let i = 0; i < 200; i++) {
    const params = new URLSearchParams({
      part: "snippet,contentDetails",
      maxResults: "50",
      playlistId,
      key: apiKey,
    });
    if (pageToken) params.set("pageToken", pageToken);

    const apiUrl = `https://www.googleapis.com/youtube/v3/playlistItems?${params.toString()}`;
    const res = await fetch(apiUrl, {
      headers: { Accept: "application/json" },
      cache: "no-store",
    });
    if (!res.ok) {
      throw new Error(
        `YouTube Data API error: ${res.status} ${res.statusText}`,
      );
    }
    const data = (await res.json()) as YouTubePlaylistItemsResponse;
    const items = Array.isArray(data.items) ? data.items : [];
    for (const it of items) {
      const vid =
        it && it.contentDetails ? it.contentDetails.videoId : undefined;
      if (typeof vid === "string" && vid.length > 0) {
        const title =
          typeof it?.snippet?.title === "string"
            ? it.snippet!.title
            : "Untitled";
        itemsOut.push({
          title,
          url: `https://www.youtube.com/watch?v=${vid}&list=${playlistId}`,
        });
      }
    }
    pageToken = data.nextPageToken;
    if (!pageToken) break;
  }

  // Deduplicate by URL
  const seen = new Set<string>();
  return itemsOut.filter((i) =>
    seen.has(i.url) ? false : (seen.add(i.url), true),
  );
}

function tryExtractInitialDataJson(html: string): unknown | null {
  const patterns = [
    /var\s+ytInitialData\s*=\s*(\{[\s\S]*?\});/,
    /ytInitialData\s*=\s*(\{[\s\S]*?\});/,
    /window\["ytInitialData"\]\s*=\s*(\{[\s\S]*?\});/,
    /\"ytInitialData\"\s*:\s*(\{[\s\S]*?\})\s*,\s*\"ytcfg/,
  ];
  for (const pattern of patterns) {
    const match = html.match(pattern);
    if (match && match[1]) {
      try {
        return JSON.parse(match[1]);
      } catch {
        // continue
      }
    }
  }
  return null;
}

function collectVideoNodesFromObject(
  root: unknown,
): Array<{ id: string; title: string }> {
  const results: Array<{ id: string; title: string }> = [];
  const stack: unknown[] = [root];
  const seen = new Set<unknown>();
  while (stack.length > 0) {
    const node = stack.pop();
    if (!node || typeof node !== "object") continue;
    if (seen.has(node)) continue;
    seen.add(node);

    const obj = node as Record<string, unknown>;
    const pvr = obj["playlistVideoRenderer"] as unknown;
    if (pvr && typeof pvr === "object") {
      const pvrObj = pvr as Record<string, unknown>;
      const videoId = pvrObj["videoId"] as unknown;
      let title = "Untitled";
      const titleObj = pvrObj["title"] as Record<string, unknown> | undefined;
      if (titleObj && typeof titleObj === "object") {
        const simple = (titleObj as Record<string, unknown>)["simpleText"];
        if (typeof simple === "string" && simple.length > 0) {
          title = simple;
        } else {
          const runs = (titleObj as Record<string, unknown>)["runs"] as
            | Array<Record<string, unknown>>
            | undefined;
          if (Array.isArray(runs) && runs.length > 0) {
            const first = runs[0]?.text;
            if (typeof first === "string" && first.length > 0) title = first;
          }
        }
      }
      if (typeof videoId === "string" && videoId.length > 0) {
        results.push({ id: videoId, title });
      }
    }

    for (const key of Object.keys(obj)) {
      const child = obj[key];
      if (child && typeof child === "object") {
        stack.push(child);
      }
    }
  }
  // Deduplicate by id
  const seenIds = new Set<string>();
  return results.filter((r) =>
    seenIds.has(r.id) ? false : (seenIds.add(r.id), true),
  );
}

async function scrapePlaylist(
  videoPlaylistId: string,
): Promise<PlaylistItem[]> {
  const url = `https://www.youtube.com/playlist?hl=en&list=${encodeURIComponent(videoPlaylistId)}`;
  const res = await fetch(url, {
    headers: {
      Accept: "text/html,application/xhtml+xml,application/xml",
      "User-Agent":
        "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36",
    },
    cache: "no-store",
  });
  if (!res.ok) {
    throw new Error(
      `Failed to fetch playlist page: ${res.status} ${res.statusText}`,
    );
  }
  const html = await res.text();
  const data = tryExtractInitialDataJson(html);
  if (!data) return [];
  const nodes = collectVideoNodesFromObject(data);
  return nodes.map((n) => ({
    title: n.title,
    url: `https://www.youtube.com/watch?v=${n.id}&list=${videoPlaylistId}`,
  }));
}

export async function getPlaylistItems(
  inputUrl: string,
): Promise<PlaylistFetchResult> {
  const playlistId = extractPlaylistId(inputUrl);
  if (!playlistId) {
    throw new Error("Invalid YouTube playlist URL");
  }
  const apiKey = process.env.YOUTUBE_API_KEY;
  if (apiKey && apiKey.length > 0) {
    try {
      console.log("Using Data API:");
      const items = await fetchWithYouTubeDataApi(playlistId, apiKey);
      return { items, source: "youtube-data-api" };
    } catch {
      console.log("Using scrape function:");
      const items = await scrapePlaylist(playlistId);
      return { items, source: "scrape" };
    }
  }
  const items = await scrapePlaylist(playlistId);
  return { items, source: "scrape" };
}
