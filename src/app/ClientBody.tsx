"use client";

import { useEffect } from "react";
import { cn } from "@/lib/utils";
import { QueryClientProvider, QueryClient } from "@tanstack/react-query";
import { RainbowKitProvider } from "@rainbow-me/rainbowkit";
import { WagmiProvider } from "wagmi";
import { berachain } from "wagmi/chains";
import { ReferrerTracker } from "./referrerTracker";
import { getDefaultConfig } from "@rainbow-me/rainbowkit";

export default function ClientBody({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  useEffect(() => {
    document.body.className = "antialiased";
  }, []);

  const config = getDefaultConfig({
    appName: "My RainbowKit App",
    projectId: "YOUR_PROJECT_ID", // Replace with actual project ID
    chains: [berachain], // Chain configuration stays here
    ssr: true,
  });

  const queryClient = new QueryClient();

  return (
    <body className={cn("antialiased", className)} suppressHydrationWarning>
      <WagmiProvider config={config}>
        <QueryClientProvider client={queryClient}>
          <RainbowKitProvider> 
            <ReferrerTracker />
            {children}
          </RainbowKitProvider>
        </QueryClientProvider>
      </WagmiProvider>
    </body>
  );
}
