import PlaylistForm from "./PlaylistForm";

export default function Home() {
  return (
    <div className="min-h-screen w-full px-3 sm:px-4 py-8 sm:py-10 md:py-16 flex items-start justify-center font-sans bg-background text-foreground">
      <main className="w-full max-w-xl sm:max-w-2xl md:max-w-3xl flex flex-col gap-4 sm:gap-6">
        <h1 className="text-xl sm:text-2xl md:text-3xl font-semibold tracking-tight">YouTube Playlist Link Fetcher</h1>
        <p className="text-xs sm:text-sm text-muted-foreground">
          Paste a YouTube playlist URL below. The app will fetch all video links and let you copy them at once.
        </p>
        <div className="rounded-lg border border-border bg-card text-card-foreground p-3 sm:p-4 md:p-5 shadow-sm">
          <PlaylistForm />
        </div>
      </main>
    </div>
  );
}
