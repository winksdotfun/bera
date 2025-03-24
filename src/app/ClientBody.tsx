"use client";

import { useEffect } from "react";
import { cn } from "@/lib/utils";

import { QueryClientProvider, QueryClient } from "@tanstack/react-query";
import {
  ConnectButton,
  getDefaultConfig,
  RainbowKitProvider,
} from "@rainbow-me/rainbowkit";
import { WagmiProvider } from "wagmi";
import { berachain } from "wagmi/chains";
import { ReferrerTracker } from "./referrerTracker";


export default function ClientBody({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  // Remove any extension-added classes during hydration
  useEffect(() => {
    // This runs only on the client after hydration
    document.body.className = "antialiased";
  }, []);

  const config = getDefaultConfig({
    appName: "My RainbowKit App",
    projectId: "YOUR_PROJECT_ID",
    chains: [berachain],
    ssr: true,
  });

  const queryClient = new QueryClient();


  return (
    <body className={cn("antialiased", className)} suppressHydrationWarning>
      <WagmiProvider config={config}>
        <QueryClientProvider client={queryClient}>
          <RainbowKitProvider chains={[berachain]}>
          <ReferrerTracker />
            {children}
          </RainbowKitProvider>
        </QueryClientProvider>
      </WagmiProvider>
    </body>
  );
}
