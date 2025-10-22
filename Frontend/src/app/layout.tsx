import type { Metadata } from "next";
import { ThemeProvider } from "@/app/components/theme-provider";
import { AppSidebar } from "./components/app-sidebar";
import { Toaster } from "@/components/ui/sonner";
import { SidebarProvider } from "@/components/ui/sidebar";
import "./globals.css";

export const metadata: Metadata = {
  title: "Hash Bytes",
  description: "Educational website to understand cryptographic algorithms",
};

export default function RootLayout({children}: Readonly<{children: React.ReactNode}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`antialiased w-screen h-screen`}>
        <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
          <SidebarProvider defaultOpen={false}>
            <AppSidebar />
            <main>
              {children}
            </main>
            <Toaster richColors closeButton />
          </SidebarProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
