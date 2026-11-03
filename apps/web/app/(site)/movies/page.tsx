import React, { Suspense } from "react";
import MoviesClient from "@/components/site/MoviesClient";
import { getMovies } from "@/lib/supabase/service";

export const metadata = {
  title: "Movies & Cinema | Velvet Noir Recordings",
  description:
    "Explore feature-length documentaries, 4K concert films, and cinematic visual releases from Velvet Noir Studios.",
};

function MoviesPageSkeleton() {
  return (
    <div className="min-h-screen pt-32 pb-24 px-6 lg:px-12 max-w-7xl mx-auto space-y-12 animate-pulse">
      <div className="flex flex-col items-center text-center space-y-4">
        <div className="w-28 h-4 bg-red-950/40 rounded-full" />
        <div className="w-96 max-w-full h-12 bg-zinc-800/40 rounded-xl" />
        <div className="w-80 max-w-full h-4 bg-zinc-800/30 rounded-md" />
      </div>

      <div className="h-[420px] rounded-3xl bg-zinc-900/40 border border-white/5" />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pt-4">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div key={i} className="h-72 rounded-2xl bg-zinc-900/30 border border-white/5" />
        ))}
      </div>
    </div>
  );
}

async function MoviesDataFetcher() {
  const movies = await getMovies();
  return <MoviesClient movies={movies} />;
}

export default function MoviesPage() {
  return (
    <Suspense fallback={<MoviesPageSkeleton />}>
      <MoviesDataFetcher />
    </Suspense>
  );
}
