import TrendsSidebar from "@/components/TrendsSidebar";
import { Metadata } from "next";
import Bookmarks from "./Bookmarks";

export const metadata: Metadata = {
  title: "Bookmarks",
};

export default function Page() {
  return (
    <main className="flex w-full min-w-0 gap-5">
      <div className="w-full min-w-0 space-y-3">
        <div className="rounded bg-card p-2 shadow-sm">
          <h1 className="text-center text-lg font-bold">Bookmarks</h1>
        </div>
        <Bookmarks />
      </div>
      <TrendsSidebar />
    </main>
  );
}
