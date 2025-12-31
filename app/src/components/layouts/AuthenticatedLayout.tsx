"use client";

import MainNavigation from "../../features/layout/components/MainNavigation";
import BetaBanner from "../../features/layout/components/BetaBanner";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "@/src/lib/react-query/queryClient";
import { ReactNode } from "react";
import UserDataProvider from "@/src/features/authentication/data_providers/UserDataProvider";
import { NuqsAdapter } from "nuqs/adapters/next/app";
import { SkipLinks } from "./SkipLinks";

interface AuthenticatedLayoutProps {
  children: ReactNode;
  mainClass?: string;
}

export const AuthenticatedLayout = ({
  children,
  mainClass,
}: AuthenticatedLayoutProps) => {
  const bodyContainerStyle = {
    display: "flex",
    flexDirection: "column",
    width: "100%",
  } as const;

  return (
    <NuqsAdapter>
      <QueryClientProvider client={queryClient}>
        <UserDataProvider>
          <div style={bodyContainerStyle}>
            <SkipLinks />
            <header>
              <BetaBanner />
              <MainNavigation />
            </header>
            <main id="main-content" className={mainClass}>
              {children}
            </main>
          </div>
        </UserDataProvider>
      </QueryClientProvider>
    </NuqsAdapter>
  );
};
