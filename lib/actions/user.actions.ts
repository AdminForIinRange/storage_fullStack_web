"use server";

import { createAdminClient, createSessionClient } from "@/lib/appwrite";
import { appwriteConfig } from "@/lib/appwrite/config";
import { Query, ID } from "node-appwrite";
import { parseStringify } from "@/lib/utils";
import { cookies } from "next/headers";
import { avatarPlaceholderUrl } from "@/constants";
import { redirect } from "next/navigation";

// This function retrieves a user document by email from the database using the Appwrite client.
// It returns the user document if found, otherwise it returns null.
const getUserByEmail = async (email: string) => {
  const { databases } = await createAdminClient();
  // Create an admin client to access database services.
  // Note: We are not creating an "admin user." Instead, we are performing
  // system-level administrative commands, like creating users, finding users, etc.
  // This is about executing system-level operations, not managing an admin user account.

  const result = await databases.listDocuments(
    appwriteConfig.databaseId, // The ID of the database to query
    appwriteConfig.usersCollectionId, // The ID of the collection within the database
    [Query.equal("email", [email])], // Query to match the email field with the provided email
  );

  return result.total > 0 ? result.documents[0] : null; // Return the first document if any, otherwise null
};

const handleError = (error: unknown, message: string) => {
  console.log(error, message);
  throw error;
};

export const sendEmailOTP = async ({ email }: { email: string }) => {
  const { account } = await createAdminClient();

  try {
    // Generate a unique email token for account verification
    const emailToken = await account.createEmailToken(ID.unique(), email);

    // Return the user ID associated with the created email token
    return emailToken.userId;
  } catch (error) {
    handleError(error, "Failed to send email OTP");
  }
};

export const createAccount = async ({
  fullName,
  email,
}: {
  fullName: string;
  email: string;
}) => {
  const existingUser = await getUserByEmail(email);

  const accountId = await sendEmailOTP({ email });
  if (!accountId) throw new Error("Failed to send an OTP");

  if (!existingUser) {
    const { databases } = await createAdminClient();
    // Create an admin client to access database services.
    // Note: We are not creating an "admin user." Instead, we are performing
    // system-level administrative commands, like creating users, finding users, etc.
    // This is about executing system-level operations, not managing an admin user account.
    await databases.createDocument(
      appwriteConfig.databaseId,
      appwriteConfig.usersCollectionId,
      ID.unique(),
      {
        fullName,
        email,
        avatar: avatarPlaceholderUrl,
        accountId,
      },
    );
  }
  return parseStringify({ accountId });
};

export const verifySecret = async ({
  accountId,
  password,
}: {
  accountId: string;
  password: string;
}) => {
  try {
    const { account } = await createSessionClient();
    const session = await account.createSession(accountId, password);
    (await cookies()).set("appwrite.session", session.secret, {
      path: "/",
      httpOnly: true,
      sameSite: "strict",
      secure: true,
    });
    return parseStringify({ sessionId: session.$id });
  } catch (error) {
    handleError(error, "Failed to verify secret");
  }
};

export const signInUser = async ({email} : {email: string}) => {
  try {
    const existingUser = await getUserByEmail(email);

    if (existingUser){
      await sendEmailOTP({email})
      return parseStringify({accountId: existingUser.accountId})
    }

    return parseStringify({ accountId: null, error: "User not found" });


  } catch (error) {
    handleError(error, "failed to sign in user");
    
  }
}
