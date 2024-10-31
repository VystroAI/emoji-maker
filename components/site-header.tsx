'use client';

import { SignInButton, SignUpButton, UserButton, useUser } from "@clerk/nextjs";
import { Button } from "./ui/button";
import { Coins, ImageIcon } from "lucide-react";
import { Card } from "./ui/card";
import { useCredits } from "@/hooks/use-credits";
import { ThemeToggle } from "./theme-toggle";
import Link from "next/link";
import { usePathname } from "next/navigation";

export function SiteHeader() {
  const { isSignedIn } = useUser();
  const { credits, isLoading } = useCredits();
  const pathname = usePathname();

  return (
    <header className="w-full border-b">
      <div className="w-full px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center gap-2">
            <Link href="/">
              <span className="text-xl font-bold">😊 Emoji Maker</span>
            </Link>
          </div>
          <div className="flex items-center gap-4 absolute right-4 sm:right-6 lg:right-8">
            <ThemeToggle />
            {isSignedIn && (
              <Link href="/my-emojis">
                <Button 
                  variant={pathname === '/my-emojis' ? 'default' : 'ghost'}
                  className="gap-2"
                >
                  <ImageIcon className="h-4 w-4" />
                  My Emojis
                </Button>
              </Link>
            )}
            {!isSignedIn ? (
              <>
                <SignInButton mode="modal">
                  <Button variant="ghost">Sign In</Button>
                </SignInButton>
                <SignUpButton mode="modal">
                  <Button>Sign Up</Button>
                </SignUpButton>
              </>
            ) : (
              <>
                <Card className="flex items-center gap-2 px-3 py-1.5 bg-secondary">
                  <Coins className="h-4 w-4 text-yellow-500" />
                  <span className="text-sm font-medium">
                    {isLoading ? "..." : `${credits} Credits`}
                  </span>
                </Card>
                <UserButton 
                  appearance={{
                    elements: {
                      avatarBox: "w-10 h-10",
                      userButtonTrigger: "w-10 h-10"
                    }
                  }}
                />
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
} 