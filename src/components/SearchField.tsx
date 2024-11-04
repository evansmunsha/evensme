"use client";

import { SearchIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { Input } from "./ui/input";
import { useState } from "react";
import Loading from "@/app/loading";

export default function SearchField() {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false); // State to manage loading

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault(); // Prevent the default form submission
    const trimmedQuery = query.trim();
    if (!trimmedQuery) return; // Do not search if the query is empty

    setLoading(true); // Set loading to true when search starts
    await router.push(`/search?q=${encodeURIComponent(trimmedQuery)}`); // Navigate to the search page
    setLoading(false); // Reset loading after navigation
  }

  return (
    <form onSubmit={handleSubmit} className="w-full md:w-1/2">
      <div className="relative">
        <Input
          name="q"
          placeholder="Search"
          aria-label="Search"
          value={query}
          onChange={(e) => setQuery(e.target.value)} // Controlled input
          className="pe-10 pr-12 pl-1 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200"
        />
        <button 
          type="submit" 
          className="absolute right-3 top-1/2 -translate-y-1/2 transform text-muted-foreground focus:outline-none"
          aria-label="Submit search" // Added aria-label for accessibility
          disabled={loading} // Disable button while loading
        >
          {loading ? (
            <div className="loader" aria-label="Loading..."> {<Loading/>}
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-500"></div>
            </div>
          ) : (
            <SearchIcon className="size-5" />
          )}
        </button>
      </div>
    </form>
  );
}
