"use client";

import { useActionState, useEffect, useMemo, useRef, useState } from "react";
import type { ActionState } from "./actions";
import { fetchPlaylistAction } from "./actions";
import { useFormStatus } from "react-dom";

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="inline-flex items-center rounded-md bg-primary text-primary-foreground hover:opacity-95 disabled:opacity-60 px-4 py-2 text-sm font-medium shadow-sm"
    >
      {pending ? "Fetching..." : "Fetch Links"}
    </button>
  );
}

export default function PlaylistForm() {
  const initialState: ActionState = { status: "idle", items: [] };
  const [state, formAction] = useActionState(fetchPlaylistAction, initialState);
  const textAreaRef = useRef<HTMLTextAreaElement | null>(null);
  const [inputUrl, setInputUrl] = useState<string>("");
  const [hasResults, setHasResults] = useState<boolean>(false);
  const [copiedNames, setCopiedNames] = useState<boolean>(false);
  const [copiedLinks, setCopiedLinks] = useState<boolean>(false);
  const [copiedJson, setCopiedJson] = useState<boolean>(false);
  const [toast, setToast] = useState<string>("");
  const [format, setFormat] = useState<"text" | "json">("text");

  useEffect(() => {
    setHasResults(state.status === "success" && state.items.length > 0);
  }, [state]);

  const namesAndLinks = useMemo(() => {
    if (state.status !== "success") return "";
    return state.items.map((it) => `Name: ${it.title}   Link: ${it.url}`).join("\n");
  }, [state]);

  const linksOnly = useMemo(() => {
    if (state.status !== "success") return "";
    return state.items.map((it) => it.url).join("\n");
  }, [state]);

  const jsonString = useMemo(() => {
    if (state.status !== "success") return "";
    const payload = state.items.map((it) => ({ name: it.title, link: it.url }));
    return JSON.stringify(payload, null, 2);
  }, [state]);

  async function copyText(text: string) {
    if (!text) return;
    try {
      await navigator.clipboard.writeText(text);
    } catch {
      const area = textAreaRef.current;
      if (area) {
        area.focus();
        area.select();
        document.execCommand("copy");
      }
    }
  }

  function showToast(message: string) {
    setToast(message);
    const id = setTimeout(() => setToast(""), 1600);
    return () => clearTimeout(id);
  }

  function onClear() {
    setInputUrl("");
    setHasResults(false);
  }

  return (
    <form action={formAction} className="flex flex-col gap-3 relative">
      <input
        name="url"
        value={inputUrl}
        onChange={(e) => setInputUrl(e.target.value)}
        className="w-full rounded-md border border-border bg-card text-card-foreground px-3 py-2 outline-none focus:ring-2 focus:ring-ring shadow-xs text-sm sm:text-base"
        placeholder="Paste a YouTube playlist URL..."
        spellCheck={false}
        aria-label="YouTube playlist URL"
      />
      <div className="flex gap-2 flex-col sm:flex-row">
        <SubmitButton />
        <button
          type="button"
          onClick={onClear}
          className="inline-flex items-center rounded-md border border-border bg-background px-4 py-2 text-sm shadow-xs hover:bg-muted/40 transition"
        >
          Clear
        </button>
      </div>

      {state.status === "error" && (
        <div className="rounded-md border border-destructive bg-destructive text-destructive-foreground px-3 py-2 text-sm/6 shadow-xs">
          {state.message}
        </div>
      )}

      {hasResults && (
        <section className="flex flex-col gap-3">
          <div className="flex items-center justify-between gap-3 flex-col sm:flex-row text-center sm:text-left">
            <div className="flex items-center gap-3">
              <div className="text-xs sm:text-sm text-muted-foreground">
                Found {state.items.length} items via {state.source === "youtube-data-api" ? "YouTube API" : "scrape"}
              </div>
              <div className="hidden sm:block text-muted-foreground">•</div>
              <div className="inline-flex rounded-md border border-border p-0.5 bg-background">
                <button
                  type="button"
                  onClick={() => setFormat("text")}
                  className={`px-2 py-1 text-xs sm:text-sm rounded ${format === "text" ? "bg-card text-card-foreground shadow-xs" : "text-muted-foreground"}`}
                >
                  Text
                </button>
                <button
                  type="button"
                  onClick={() => setFormat("json")}
                  className={`px-2 py-1 text-xs sm:text-sm rounded ${format === "json" ? "bg-card text-card-foreground shadow-xs" : "text-muted-foreground"}`}
                >
                  JSON
                </button>
              </div>
            </div>

            <div className="flex gap-2 w-full sm:w-auto justify-center sm:justify-end">
              {format === "text" ? (
                <>
                  <button
                    type="button"
                    onClick={async () => {
                      await copyText(namesAndLinks);
                      setCopiedNames(true);
                      showToast("Copied Name + Link");
                      setTimeout(() => setCopiedNames(false), 900);
                    }}
                    className={`inline-flex items-center rounded-md bg-secondary text-secondary-foreground px-3 py-1.5 text-xs sm:text-sm shadow-xs transition 
                      hover:opacity-95 active:scale-[0.98] ${copiedNames ? "ring-2 ring-emerald-500 ring-offset-2 animate-pulse" : ""}`}
                  >
                    {copiedNames ? "Copied!" : "Copy Name + Link"}
                  </button>
                  <button
                    type="button"
                    onClick={async () => {
                      await copyText(linksOnly);
                      setCopiedLinks(true);
                      showToast("Copied links");
                      setTimeout(() => setCopiedLinks(false), 900);
                    }}
                    className={`inline-flex items-center rounded-md bg-emerald-600 text-white px-3 py-1.5 text-xs sm:text-sm shadow-xs transition 
                      hover:opacity-95 active:scale-[0.98] ${copiedLinks ? "ring-2 ring-emerald-500 ring-offset-2 animate-pulse" : ""}`}
                  >
                    {copiedLinks ? "Copied!" : "Copy Links Only"}
                  </button>
                </>
              ) : (
                <>
                  <button
                    type="button"
                    onClick={async () => {
                      await copyText(jsonString);
                      setCopiedJson(true);
                      showToast("Copied JSON");
                      setTimeout(() => setCopiedJson(false), 900);
                    }}
                    className={`inline-flex items-center rounded-md bg-secondary text-secondary-foreground px-3 py-1.5 text-xs sm:text-sm shadow-xs transition 
                      hover:opacity-95 active:scale-[0.98] ${copiedJson ? "ring-2 ring-emerald-500 ring-offset-2 animate-pulse" : ""}`}
                  >
                    {copiedJson ? "Copied!" : "Copy JSON"}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      const blob = new Blob([jsonString], { type: "application/json;charset=utf-8" });
                      const url = URL.createObjectURL(blob);
                      const a = document.createElement("a");
                      a.href = url;
                      a.download = "playlist.json";
                      document.body.appendChild(a);
                      a.click();
                      document.body.removeChild(a);
                      URL.revokeObjectURL(url);
                      showToast("JSON downloaded");
                    }}
                    className="inline-flex items-center rounded-md bg-emerald-600 text-white px-3 py-1.5 text-xs sm:text-sm shadow-xs transition hover:opacity-95 active:scale-[0.98]"
                  >
                    Download JSON
                  </button>
                </>
              )}
            </div>
          </div>
          <textarea
            ref={textAreaRef}
            className="w-full h-64 md:h-80 rounded-md border border-border bg-popover text-popover-foreground p-3 font-mono text-[11px] sm:text-xs shadow-xs"
            readOnly
            value={format === "json" ? jsonString : namesAndLinks}
          />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {state.items.slice(0, 12).map((it) => (
              <a
                key={it.url}
                href={it.url}
                target="_blank"
                rel="noreferrer"
                className="truncate text-primary hover:underline text-xs sm:text-sm"
                title={it.title}
              >
                {it.title}
              </a>
            ))}
          </div>
        </section>
      )}

      {toast && (
        <div
          role="status"
          aria-live="polite"
          className="pointer-events-none fixed bottom-6 left-1/2 -translate-x-1/2 z-50 rounded-md bg-foreground text-background px-4 py-2 text-xs sm:text-sm shadow-lg"
        >
          {toast}
        </div>
      )}
    </form>
  );
}


