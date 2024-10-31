import { ClerkProvider } from "@clerk/nextjs";
import { dark } from "@clerk/themes";

export const clerkConfig = {
  appearance: {
    baseTheme: dark,
  },
  // Specify Node.js runtime for Clerk
  runtimeEnvironment: "nodejs",
}; 