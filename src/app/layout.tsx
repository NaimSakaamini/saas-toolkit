import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/ui/ThemeProvider";
import { FirebaseProvider } from "@/services/firebase/FirebaseProvider";
import { AuthProvider } from "@/services/auth/AuthProvider";
import { OrganizationProvider } from "@/services/organization/OrganizationProvider";
import { InvitationProvider } from "@/services/invitation/InvitationProvider";
import { SubscriptionProvider } from "@/services/subscription/SubscriptionProvider";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Naim SaaS Toolkit",
  description: "A comprehensive toolkit for building SaaS applications with Next.js and Firebase",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        {/* No script here to avoid hydration mismatches */}
      </head>
      <body className={inter.className}>
        <ThemeProvider>
          <FirebaseProvider>
            <AuthProvider>
              <OrganizationProvider>
                <InvitationProvider>
                  <SubscriptionProvider>
                    {children}
                  </SubscriptionProvider>
                </InvitationProvider>
              </OrganizationProvider>
            </AuthProvider>
          </FirebaseProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
