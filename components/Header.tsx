// the header is a server component

import React from "react";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import Search from "@/components/Search";
import FileUploader from "@/components/FileUploader";
import { signOutUser } from "@/lib/actions/user.actions";

const Header = ({
  userId,
  accountId,
}: {
  userId: string;
  accountId: string;
}) => {
  return (
    <header className="header">
      <Search />
      <div className="header-wrapper">
        <FileUploader />
        {/* This form is used to sign out the user. 
      When the form is submitted, it will call the `signOutUser` 
        function which will delete the session and redirect the user to the sign 
        in page. The `use server` comment is used to tell next.js to run 
        this code on the server, which is necessary because the `signOutUser` 
        function is not available on the client. */}
        <form
          action={async () => {
            // react 19, form attribute allows us to use async functions as handlers as if they
            // were client side functions

            // we coudl also just use an
            // onClick={async () => await signOutUser()}
            // but that would make the function run on the client
            "use server";

            await signOutUser();
          }}
        >
          <Button type="submit" className="sign-out-button">
            <Image
              src="/assets/icons/logout.svg"
              alt="logo"
              width={24}
              height={24}
              className="w-6"
            />
          </Button>
        </form>
      </div>
    </header>
  );
};

export default Header;
