"use client";

import { useActionState, useMemo, useRef } from "react";
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

  const namesAndLinks = useMemo(() => {
    if (state.status !== "success") return "";
    return state.items.map((it) => `Name: ${it.title}   Link: ${it.url}`).join("\n");
  }, [state]);

  const linksOnly = useMemo(() => {
    if (state.status !== "success") return "";
    return state.items.map((it) => it.url).join("\n");
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

  return (
    <form action={formAction} className="flex flex-col gap-3">
      <input
        name="url"
        className="w-full rounded-md border border-border bg-card text-card-foreground px-3 py-2 outline-none focus:ring-2 focus:ring-ring shadow-xs text-sm sm:text-base"
        placeholder="https://www.youtube.com/playlist?list=..."
        spellCheck={false}
      />
      <div className="flex gap-2 flex-col sm:flex-row">
        <SubmitButton />
        <button
          type="reset"
          className="inline-flex items-center rounded-md border border-border bg-background px-4 py-2 text-sm shadow-xs"
        >
          Clear
        </button>
      </div>

      {state.status === "error" && (
        <div className="rounded-md border border-destructive bg-destructive text-destructive-foreground px-3 py-2 text-sm/6 shadow-xs">
          {state.message}
        </div>
      )}

      {state.status === "success" && (
        <section className="flex flex-col gap-3">
          <div className="flex items-center justify-between gap-2 flex-col sm:flex-row text-center sm:text-left">
            <div className="text-xs sm:text-sm text-muted-foreground">
              Found {state.items.length} items via {state.source === "youtube-data-api" ? "YouTube API" : "scrape"}
            </div>
            <div className="flex gap-2 w-full sm:w-auto justify-center sm:justify-end">
              <button
                type="button"
                onClick={() => copyText(namesAndLinks)}
                className="inline-flex items-center rounded-md bg-secondary text-secondary-foreground hover:opacity-95 px-3 py-1.5 text-xs sm:text-sm shadow-xs"
              >
                Copy Name + Link
              </button>
              <button
                type="button"
                onClick={() => copyText(linksOnly)}
                className="inline-flex items-center rounded-md bg-emerald-600 text-white hover:opacity-95 px-3 py-1.5 text-xs sm:text-sm shadow-xs"
              >
                Copy Links Only
              </button>
            </div>
          </div>
          <textarea
            ref={textAreaRef}
            className="w-full h-64 md:h-80 rounded-md border border-border bg-popover text-popover-foreground p-3 font-mono text-[11px] sm:text-xs shadow-xs"
            readOnly
            value={namesAndLinks}
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
    </form>
  );
}


