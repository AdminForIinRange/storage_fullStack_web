// Async/Await Requirement:

// When using await, the function containing it must be declared as async. Otherwise, JavaScript will throw a syntax error.
// Issue of Missing async:

// If you forget to declare a function as async but use await inside it, the function will not behave as expected. It may lead to runtime errors or unexpected behavior, like the function skipping the try block and going directly to the catch block.
// Catch Without Try:

// In your case, the issue seems to be that the lack of async caused the promise rejection to bypass normal flow, leading to confusion about why the function immediately hit the catch block.

import React from "react";
import Sidebar from "@/components/Sidebar";
import MobileNavigation from "@/components/MobileNavigation";
import Header from "@/components/Header";
import { getCurrentUser } from "@/lib/actions/user.actions";
// import { redirect } from "next/navigation";
// import { Toaster } from "@/components/ui/toaster";

import "../globals.css";
import { redirect } from "next/navigation";
const Layout = async ({ children }: { children: React.ReactNode }) => {
  // if your using await, for any level/type of
  // DB server acation call, please turn it into the function async
  // i had an issue with this before becuse i forgot to make it async and
  // wondering why the function always went to catch block wouthout any attemping try block

  const currentUser = await getCurrentUser();

  if (!currentUser) {
    return redirect("/sign-in");
  }

  return (
    <main className="flex h-screen">
      <Sidebar {...currentUser} />
      {/* so the currentUser holds fullname, avatar, email, so by spreding it we can access all the values Without teh need of duplicating them */}
      <section className="flex h-full flex-1 flex-col">
        <MobileNavigation {...currentUser} />
        <Header accountId="" userId="" />
        <div className="main-content">{children}</div>
      </section>
      {/* <Toaster /> */}
    </main>
  );
};

export default Layout;
