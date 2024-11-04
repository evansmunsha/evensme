
import { PrismaAdapter } from "@lucia-auth/adapter-prisma";
import { Google } from "arctic";
import { Lucia, Session, User } from "lucia";
import { cookies } from "next/headers";
import { cache } from "react";
import prisma from "./lib/prisma";

// Initialize the Prisma adapter
const adapter = new PrismaAdapter(prisma.session, prisma.user);

// Create a new instance of Lucia for authentication
export const lucia = new Lucia(adapter, {
  sessionCookie: {
    expires: false, // Session cookie does not expire
    attributes: {
      secure: process.env.NODE_ENV === "production", // Secure cookie in production
    },
  },
  getUserAttributes(databaseUserAttributes) {
    return {
      id: databaseUserAttributes.id,
      username: databaseUserAttributes.username,
      displayName: databaseUserAttributes.displayName,
      avatarUrl: databaseUserAttributes.avatarUrl,
      googleId: databaseUserAttributes.googleId,
    };
  },
});

// Extend the Lucia module with custom user attributes
declare module "lucia" {
  interface Register {
    Lucia: typeof lucia;
    DatabaseUserAttributes: DatabaseUserAttributes;
  }
}

// Define the structure of database user attributes
interface DatabaseUserAttributes {
  id: string;
  username: string;
  displayName: string;
  avatarUrl: string | null;
  googleId: string | null;
}

// Set up Google OAuth
export const google = new Google(
  process.env.GOOGLE_CLIENT_ID!,
  process.env.GOOGLE_CLIENT_SECRET!,
  `${process.env.NEXT_PUBLIC_BASE_URL}/api/auth/callback/google`,
);

// Validate the user session
export const validateRequest = cache(
  async (): Promise<
    { user: User; session: Session } | { user: null; session: null }
  > => {
    const sessionId = cookies().get(lucia.sessionCookieName)?.value ?? null;

    if (!sessionId) {
      return {
        user: null,
        session: null,
      };
    }

    const result = await lucia.validateSession(sessionId);
    console.log("Session validation result:", result);

    try {
      if (result.session && result.session.fresh) {
        const sessionCookie = lucia.createSessionCookie(result.session.id);
        console.log("Session Cookie:", sessionCookie);
        cookies().set(
          sessionCookie.name,
          sessionCookie.value,
          {
            ...sessionCookie.attributes,
            path: '/', // Ensure the cookie is accessible for all routes
          },
        );
      }
      if (!result.session) {
        // If the session is not valid, create a blank session cookie
        const sessionCookie = lucia.createBlankSessionCookie();
        cookies().set(
          sessionCookie.name,
          sessionCookie.value,
          sessionCookie.attributes,
        );
      }
    } catch (error) {
      console.error("Error during session cookie handling:", error);
    }

    return result;
  },
);
