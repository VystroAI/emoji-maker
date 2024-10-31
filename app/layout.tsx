import { ClerkProvider } from '@clerk/nextjs';
import { Inter } from 'next/font/google';
import './globals.css';
import { SiteHeader } from '@/components/site-header';
import { Toaster } from "@/components/ui/toaster";
import { ThemeProvider } from "@/components/theme-provider";
import { clerkConfig } from '@/lib/auth-config';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'Emoji AI',
  description: 'Generate custom emojis with AI',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider {...clerkConfig}>
      <html lang="en" suppressHydrationWarning>
        <head>
          <link rel="icon" href="/emoji.png" />
        </head>
        <body className={inter.className}>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <div className="relative flex min-h-screen flex-col">
              <SiteHeader />
              <main className="flex-1">
                {children}
              </main>
              <footer className="py-6 text-center text-sm text-muted-foreground">
                made with <span className="text-muted">❤️</span> by smh
              </footer>
              <Toaster />
            </div>
          </ThemeProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
