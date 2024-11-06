import { validateRequest } from "@/auth";
import { redirect } from "next/navigation";
import MenuBar from "./MenuBar";
import Navbar from "./Navbar";
import SessionProvider from "./SessionProvider";
import LeftMenuBar from "./LeftMenuBar";
import { SubscribeForm } from "./SubscribeForm";


export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await validateRequest();

  if (!session.user) redirect("/login");

  return (
    <SessionProvider value={session}>
      <div className="flex min-h-screen flex-col">
        <Navbar />
        <LeftMenuBar className="mb-2 h-fit flex overflow-x-auto rounded bg-card px-3 py-1 gap-7 shadow-sm lg:px-5 sm:hidden scrollbar-hide"/>
        <div className="mx-auto flex w-full max-w-7xl grow gap-3 sm:p-5">
          <div className="flex-col gap-2">
            <LeftMenuBar className="sticky top-[5.25rem] hidden h-fit flex-col space-y-3 rounded bg-card px-1 py-2 shadow-sm sm:block lg:px-5 xl:w-80 z-50 "/>
           <SubscribeForm  className="sticky top-[5.25rem] hidden h-fit flex-col space-y-3 rounded bg-card px-1 py-2 shadow-sm sm:block lg:px-5 xl:w-80 z-40 "/>
          </div>
          
          {/*  */}
          {children}
        </div>
        <MenuBar className="sticky bottom-0 flex w-full justify-center gap-5 border-t bg-card p-3 sm:hidden" />
      </div>
    </SessionProvider>
  );
}
