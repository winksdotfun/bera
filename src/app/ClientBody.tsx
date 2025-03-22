"use client";

import { useEffect } from "react";
import { cn } from "@/lib/utils";

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

  return (
    <body className={cn("antialiased", className)} suppressHydrationWarning>
      {children}
    </body>
  );
}
