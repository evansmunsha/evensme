import loginImage from "@/assets/login-image.jpg";
import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import GoogleSignInButton from "./google/GoogleSignInButton";
import LoginForm from "./LoginForm";

export const metadata: Metadata = {
  title: "Login",
};

export default function Page() {
  return (
    <main className="flex h-screen items-center justify-center p-5 bg-[rgb(var(--background))]">
      <div className="flex h-full max-h-[40rem] w-full max-w-[64rem] overflow-hidden rounded-2xl bg-[rgb(var(--card))] shadow-lg">
        <div className="w-full space-y-10 overflow-y-auto scrollbar-hide p-10 md:w-1/2">
          <h1 className="text-center text-4xl font-extrabold text-[rgb(var(--foreground))]">Welcome Back to Evensme!</h1>
          <p className="text-lg text-[rgb(var(--muted-foreground))] text-center">
            Log in to access your marketing resources, connect with fellow marketers, and continue your journey towards success!
          </p>
          <div className="space-y-5">
            <GoogleSignInButton />
            <div className="flex items-center gap-3">
              <div className="h-px flex-1 bg-[rgb(var(--muted))]" />
              <span className="text-[rgb(var(--muted-foreground))]">OR</span>
              <div className="h-px flex-1 bg-[rgb(var(--muted))]" />
            </div>
            <LoginForm />
            <Link href="/signup" className="block text-center text-[rgb(var(--primary))] hover:underline">
              Don&apos;t have an account? Sign up and join our community!
            </Link>
          </div>
        </div>
        <Image
          src={loginImage}
          alt="Login illustration"
          className="hidden w-1/2 object-cover md:block rounded-r-2xl"
        />
      </div>
    </main>
  );
}
