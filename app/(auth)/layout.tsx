import Image from "next/image";
import React from "react";


const Layout = ({ children }: { chlidren: React.ReactNode }) => {
  return <div className="flex min-h-screen">
    
    <section className="flex w-1/2 items-center justify-center bg-brand p-10">
        <div>
            <Image src="/favicon.ico" alt="logo" width={16} height={16} />
            <div className="space-y-5 text-white">
                <h1 className="text-2xl font-bold">StoreIt</h1>
                <p className="body-1">
                This is a place where you can store all your documents

                </p>

            </div>

        </div>
        </section>{children}</div>;
};

export default Layout;
