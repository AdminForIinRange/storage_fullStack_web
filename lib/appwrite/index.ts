"use server";

// Import Appwrite SDK components
import { Account, Avatars, Client, Databases, Storage } from "node-appwrite";
import { appwriteConfig } from "@/lib/appwrite/config"; // Appwrite config
import { cookies } from "next/headers"; // For accessing cookies

// Create a client for user session
export const createSessionClient = async () => {
  const client = new Client()
    .setEndpoint(appwriteConfig.endpointUrl)
    .setProject(appwriteConfig.projectId);

  // Get session cookie
  const session = (await cookies()).get("appwrite-session");

  if (!session?.value) throw new Error("Session not found");

  client.setSession(session.value);

  return {
    get account() {
      return new Account(client); // User account services
    },
    get databases() {
      return new Databases(client); // Database services
    },
  };
};

// Create a client with admin privileges

// Yes, exactly! When referring to "admin" in this context, it’s about elevated system privileges 
// rather than a "user" in the traditional sense.
export const createAdminClient = async () => {
  const client = new Client()
    .setEndpoint(appwriteConfig.endpointUrl)
    .setProject(appwriteConfig.projectId)
    .setKey(appwriteConfig.secretKey); // Admin API key

  return {
    get account() {
      return new Account(client); // User account services
    },
    get databases() {
      return new Databases(client); // Database services
    },
    get storage() {
      return new Storage(client); // File storage services
    },
    get avatars() {
      return new Avatars(client); // Avatar services
    },
  };
};
