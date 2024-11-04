import TrendsSidebar from "@/components/TrendsSidebar";
import { Metadata } from "next";
import Notifications from "./Notifications";

export const metadata: Metadata = {
  title: "Notifications",
};

export default function Page() {
  return (
    <main className="flex w-full min-w-0 gap-5">
      <div className="w-full min-w-0 space-y-2">
        <div className="rounded bg-card p-2 shadow-sm">
          <h1 className="text-center text-xl font-bold">Notifications</h1>
        </div>
        <Notifications />
      </div>
      <TrendsSidebar />
    </main>
  );
}
