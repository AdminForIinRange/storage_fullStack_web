"use server";

// Import Appwrite SDK components
import { Account, Avatars, Client, Databases, Storage } from "node-appwrite";
import { appwriteConfig } from "@/lib/appwrite/config"; // Appwrite config
import { cookies } from "next/headers"; // For accessing cookies

// Create a client for user session
export const createSessionClient = async () => {
  // Step 1: Create a new client instance and configure it with endpoint and project ID
  const client = new Client()
    .setEndpoint(appwriteConfig.endpointUrl) // Set the API endpoint URL
    .setProject(appwriteConfig.projectId); // Set the project ID for the client

  // Step 2: Retrieve the session cookie named "appwrite-session"
  const session = (await cookies()).get("appwrite-session");

  // Step 3: If the session cookie is not found, throw an error
  if (!session?.value) throw new Error("Session not found");

  // Step 4: Set the session value in the client for authentication
  client.setSession(session.value);

  // Step 5: Return an object with dynamic "account" and "databases" services
  return {
    // Getter for "account" service
    get account() {
      // Create and return an Account instance using the configured client
      return new Account(client);
    },
    // Getter for "databases" service
    get databases() {
      // Create and return a Databases instance using the configured client
      return new Databases(client);
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
