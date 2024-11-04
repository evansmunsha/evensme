import SearchField from "@/components/SearchField";
import UserButton from "@/components/UserButton";
import Image from "next/image";
import Link from "next/link";
import MenuBar from "./MenuBar";
import { UserPlus } from "lucide-react";

export default function Navbar() {
  return (
    <header className="sticky top-0 z-10 moving-gradient shadow-sm mb-2">
      <div className="flex items-center justify-between gap-2 px-5 py-3">
        {/* Logo */}
        <Link href='/' className=' moving-gradient flex gap-1 items-center p-2 bg-[rgb(var(--card))] rounded-lg shadow-md transition-transform transform hover:scale-105' aria-label="Go to Evensme homepage">
          <Image 
            src='/thumbnail.png' 
            width={40} 
            height={40} 
            alt='Evensme Logo' 
            className='hover:animate-bounce rounded-full shadow-lg transition-shadow duration-300 hover:shadow-xl' 
          />
          <span className='hidden md:flex flex-col items-start mr-2'>
            <b className='text-[rgb(var(--foreground))] text-xl font-semibold animate-bounce'>vensme</b>
          </span>
        </Link>
        
        {/* Search Field */}
        <SearchField />
        {/* Menu Bar */}
        <MenuBar className="hidden sm:flex flex-row" />
          <Link href={'/tofollow'} className="z-10 p-2 rounded-lg shadow-md transition-transform transform hover:scale-105">
            <UserPlus className="bg-[rgba(0,0,0,0.5)] text-white p-2 rounded-full hover:bg-[rgba(0,0,0,0.7)] hover:text-[rgb(var(--accent))]" />
          </Link>
        {/* User Button */}
        <UserButton />
      </div>
    </header>
  );
}
