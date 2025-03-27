import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import CustomButton from "@/provider/Wallet";
import StakeModal from "../modals/Stake";
import { useAccount, usePublicClient } from "wagmi";
import { useCallback, useEffect, useState } from "react";
import { ethers } from "ethers";

interface StakingCardProps {
  title: string;
  description: string;
  apr: string;
  poolValue: number;
  rewardType: string;
  rewardIcon: string;
  tokenIcons: string[];
  userBalance: string;
  userBalanceLabel: string;
  beraPriceUSD: number
}

const StakingCard = ({
  title,
  description,
  apr,
  poolValue,
  rewardType,
  rewardIcon,
  tokenIcons,
  userBalance,
  userBalanceLabel,
  beraPriceUSD
}: StakingCardProps) => {

  const { isConnected, address } = useAccount();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [stBgtBalance, setStBgtBalance] = useState(''); 
  const [winkpoints, setWinkpoints] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  const onClose = () => {
    setIsModalOpen(false);
  }

  const publicClient = usePublicClient();

  const fetchWinkpoints = useCallback(async () => {
    if (!address) return;
  
    try {
      setIsLoading(true); // Optional: Show loading state
  
      // ✅ Await the fetch request
      const response = await fetch(
        `https://inner-circle-seven.vercel.app/api/action/getPoints?address=${address}`,
        { method: "GET" }
      );
  
      if (!response.ok) {
        throw new Error(`Failed to fetch: ${response.statusText}`);
      }
  
      // ✅ Await the JSON parsing
      const data = await response.json();
      console.log("Winkpoints data:", data);
  
      if (data && data.points !== undefined) {
        setWinkpoints(data.points);
      } else {
        console.warn("Invalid data format received:", data);
        setWinkpoints(0);
      }
    } catch (error) {
      console.error("Error fetching winkpoints:", error);
      setWinkpoints(0);
    } finally {
      setIsLoading(false);
    }
  }, [address]); // ✅ Added `address` as a dependency
  
  


  useEffect(() => {
    const fetchBalances = async () => {
      if (!address) return;

      try {
        // Fetch stMON balance
        const stBgtBalance = await publicClient.readContract({
          address: "0x2CeC7f1ac87F5345ced3D6c74BBB61bfAE231Ffb",
          abi: [
            {
              name: "balanceOf",
              type: "function",
              stateMutability: "view",
              inputs: [{ name: "account", type: "address" }],
              outputs: [{ name: "", type: "uint256" }],
            },
          ],
          functionName: "balanceOf",
          args: [address],
        });

        setStBgtBalance(ethers.utils.formatUnits(stBgtBalance as bigint, 18));
        console.log(stBgtBalance);
      } catch (error) {
        console.error("Error fetching balances:", error);
      }
    };

    fetchBalances();
    fetchWinkpoints();
  }, [address]);

  return (
    <Card className="gradient-border overflow-hidden">
      <CardHeader className="pb-2">
        <CardTitle className="text-xl font-semibold"><div className="flex justify-between items-center">{title} <p className="bg-[#e50571]/50 w-fit p-1 px-2 text-sm rounded-md text-foreground"> Wink points: {winkpoints}</p></div></CardTitle>
        <CardDescription className="text-muted-foreground/70">
          {description}
        </CardDescription>
      </CardHeader>

      <div className="grid grid-cols-3 gap-4 px-6 py-4 border-t border-b border-border/20">
        <div className="space-y-1">
          <p className="text-xl font-bold text-[#e50571]">{apr}%</p>
          <p className="text-xs uppercase font-medium text-muted-foreground/70">APR</p>
        </div>
        <div className="space-y-1">
          <p className="text-xl font-bold text-[#e50571]">${poolValue}</p>
          <p className="text-xs font-medium text-muted-foreground/70">{
            rewardType === "Points" ? "Pool liquidity" : "Total stBGT staked"
          }</p>
        </div>
        <div className=" items-center">
          <div className="flex gap-1 items-center">
            <Image
              src={rewardIcon}
              alt={rewardType}
              width={20}
              height={20}
              className="w-5 h-5"
            />
            <span className="text-[#e50571] font-bold text-xl">{rewardType}</span>
          </div>
          <span className="text-muted-foreground/70 text-sm font-medium">Rewards</span>
        </div>
      </div>

      <CardContent className="pt-4">
        <div className="flex items-center justify-between">
          <div className=" items-center">
            <div className="flex gap-1 items-center">
              {tokenIcons.map((icon, index) => (
                <Image
                  key={index}
                  src={icon}
                  alt={`Token ${index + 1}`}
                  width={24}
                  height={24}
                  className={`w-6 h-6 ${index > 0 ? '-ml-2' : ''}`}
                />
              ))}
              <p className="text-2xl font-bold text-[#e50571]">{parseFloat(stBgtBalance || '0') < 0.01 ? '<0.01' : stBgtBalance || '0.0'}</p>
            </div>
            <div className="">
              <p className="text-sm text-muted-foreground/70">{userBalanceLabel}</p>
            </div>
          </div>
          {isConnected ? (
            <Button
              className="bg-[#e50571] w-40 text-foreground"
              onClick={() => setIsModalOpen(true)}
            >
              Stake
            </Button>
          ) : (
            <CustomButton />
          )}
        </div>
      </CardContent>

      {isModalOpen &&
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
        <StakeModal onClose={onClose} fetchWinkPoints={fetchWinkpoints} setWinkPoints={setWinkpoints} beraPriceUSD={beraPriceUSD} stBgtBalance={stBgtBalance} />
      </div>
      }
     

    </Card>
  );
};

export default StakingCard;
