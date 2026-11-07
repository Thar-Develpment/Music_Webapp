import React, { Suspense } from "react";
import { connection } from "next/server";
import MusicClient from "@/components/site/MusicClient";
import { getMusicItems } from "@/lib/supabase/service";

export const metadata = {
  title: "Music & Discography | One Roof Entertainment",
  description:
    "Listen to master analog cuts, high-resolution electronic releases, and orchestral compositions from One Roof artists.",
};

function MusicPageSkeleton() {
  return (
    <div className="min-h-screen pt-32 pb-24 px-6 lg:px-12 max-w-7xl mx-auto space-y-12 animate-pulse">
      <div className="flex flex-col items-center text-center space-y-4">
        <div className="w-28 h-4 bg-red-950/40 rounded-full" />
        <div className="w-96 max-w-full h-12 bg-zinc-800/40 rounded-xl" />
        <div className="w-80 max-w-full h-4 bg-zinc-800/30 rounded-md" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        <div className="lg:col-span-5 h-[460px] rounded-3xl bg-zinc-900/40 border border-white/5" />
        <div className="lg:col-span-7 space-y-3">
          <div className="h-10 bg-zinc-900/40 rounded-xl mb-4" />
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="h-20 bg-zinc-900/30 rounded-2xl border border-white/5" />
          ))}
        </div>
      </div>
    </div>
  );
}

async function MusicDataFetcher() {
  await connection();
  const tracks = await getMusicItems();
  return <MusicClient tracks={tracks} />;
}

export default function MusicPage() {
  return (
    <Suspense fallback={<MusicPageSkeleton />}>
      <MusicDataFetcher />
    </Suspense>
  );
}
