import React from "react";
import "@rainbow-me/rainbowkit/styles.css";
import {
  ConnectButton
} from "@rainbow-me/rainbowkit";
import { Button } from "@/components/ui/button";


const CustomButton = () => {
  return (
          <ConnectButton.Custom>
            {({
              account,
              chain,
              openAccountModal,
              openChainModal,
              openConnectModal,
              authenticationStatus,
              mounted,
            }) => {
              const ready = mounted && authenticationStatus !== "loading";
              const connected =
                ready &&
                account &&
                chain &&
                (!authenticationStatus ||
                  authenticationStatus === "authenticated");

              return (
                <div
                  {...(!ready && {
                    "aria-hidden": true,
                    style: {
                      opacity: 0,
                      pointerEvents: "none",
                      userSelect: "none",
                    },
                  })}
                >
                  {(() => {
                    if (!connected) {
                      return (
                        <Button
                          className="bg-[#e50571] text-foreground"
                          onClick={openConnectModal}
                          type="button"
                        >
                          Connect Wallet
                        </Button>
                      );
                    }

                    if (chain.unsupported) {
                      return (
                        <Button
                          className=" bg-red-500"
                          onClick={openChainModal}
                          type="button"
                        >
                          Wrong network
                        </Button>
                      );
                    }

                    return (
                      <div className="">
                        <Button
                          className=" bg-[#e50571] text-foreground"
                          onClick={openAccountModal}
                          type="button"
                        >
                          {account.displayName}
                          {account.displayBalance
                            ? ` (${account.displayBalance})`
                            : ""}
                        </Button>
                      </div>
                    );
                  })()}
                </div>
              );
            }}
          </ConnectButton.Custom>
  );
};

export default CustomButton;