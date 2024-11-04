import signupImage from "@/assets/signup-image.jpg";
import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import SignUpForm from "./SignUpForm";

export const metadata: Metadata = {
  title: "Sign Up",
};

export default function Page() {
  return (
    <main className="flex h-screen items-center justify-center p-5 bg-[rgb(var(--background))]">
      <div className="flex h-full max-h-[40rem] w-full max-w-[64rem] overflow-hidden rounded-2xl bg-[rgb(var(--card))] shadow-lg">
        <div className="w-full space-y-10 overflow-y-auto scrollbar-hide p-10 md:w-1/2">
          <div className="space-y-1 text-center">
            <h1 className="text-4xl font-extrabold text-[rgb(var(--foreground))]">Join the Evensme Community!</h1>
            <p className="text-lg text-[rgb(var(--muted-foreground))]">
              Unlock exclusive resources, tools, and insights tailored for online marketers. 
              Connect with industry experts and elevate your marketing strategies!
            </p>
            <blockquote className="text-md italic text-[rgb(var(--muted-foreground))] border-l-4 border-[rgb(var(--primary))] pl-4">
              "Evensme provides invaluable support for marketers of all levels, helping everyone connect, learn, and grow together!"
            </blockquote>
          </div>
          <div className="space-y-5">
            <SignUpForm />
            <Link href="/login" className="block text-center text-[rgb(var(--primary))] hover:underline">
              Already a member? Log in to continue your journey!
            </Link>
          </div>
        </div>
        <Image
          src={signupImage}
          alt="Sign up illustration"
          className="hidden w-1/2 object-cover md:block rounded-r-2xl"
        />
      </div>
    </main>
  );
}
