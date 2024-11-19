import React from "react";
import Sidebar from "@/components/Sidebar";
import MobileNavigation from "@/components/MobileNavigation";
import Header from "@/components/Header";
// import { getCurrentUser } from "@/lib/actions/user.actions";
// import { redirect } from "next/navigation";
// import { Toaster } from "@/components/ui/toaster";

import "../globals.css";
const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <main className="flex h-screen">
      <Sidebar fullName="" avatar="" email="" />
      <section className="flex h-full flex-1 flex-col">
        <MobileNavigation accountId="" fullName="" avatar="" email="" userId=""  />
        <Header accountId="" userId="" />
        <div className="main-content">{children}</div>
      </section>
      {/* <Toaster /> */}
    </main>
  );
};

export default Layout;
