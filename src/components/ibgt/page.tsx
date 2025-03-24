"use client"
import CustomButton from "@/provider/Wallet";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

interface Props {}

const IBGTPage = ({}: Props) => {
  const [statsData, setStatsData] = useState(false);
  const [aprValue, setAprValue] = useState<number>();
  const [tvlvalue, setTvlValue] = useState();

  
  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await fetch("/api/proxy"); // Use Next.js proxy API
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const data = await response.json();
        const rewardToken = data.reward_tokens.find((token: any) => token.apr !== undefined);
        console.log("apr", rewardToken ? rewardToken.apr : null)
        const APR = (rewardToken ? rewardToken.apr : null)*100
        setAprValue(APR);
        setTvlValue(data.tvl)
        setStatsData(data);
      } catch (error) {
        console.error("Error fetching stats:", error);
      }
    };

    fetchStats();
  }, []);

  if (!statsData) {
    return (
      <div className="flex flex-col h-screen justify-center items-center bricolage-font">
        <Image
          src="/images/ibgt-logo.svg"
          width={50}
          height={50}
          className="animate-spin"
          alt="stBGT"
        />
        <p>Loading...</p>
      </div>
    );
  }

  const formatTVL = (tvl: number) => (tvl / 1_000_000).toFixed(2);


  return (
    <>
      <div className="container mx-auto bricolage-font">
        <div className="infrared-card max-w-[450px] mx-auto">
          <div className="infrared-card-header bg-product-header-gradient bg-cover border-gray-300 border rounded-t-xl space-y-2">
            <div className="flex items-center space-x-4 ">
              <Image
                src="/images/ibgt-logo.svg"
                alt="iBGT logo"
                width={30}
                height={30}
              />
              <h1 className="text-2xl font-bold">iBGT</h1>
            </div>
            <p className="">
              Stake iBGT to earn rewards.
            </p>


            <div className="grid grid-cols-3 gap-4">
              <div>
                <div className="text-sm opacity-80">APR</div>
                <div className="text-xl font-medium">{aprValue?.toFixed(2)}%</div>
              </div>
              <div>
                <div className="text-sm opacity-80">TVL</div>
                <div className="text-xl font-medium">$ {tvlvalue !== null ? formatTVL(tvlvalue) : "Loading..."}M</div>
              </div>
              <div>
                <div className="text-sm opacity-80">% of iBGT staked</div>
                <div className="text-xl font-medium">79.03%</div>
              </div>
            </div>
          </div>

          <div className="p-4 border-gray-300 border border-t-0 rounded-b-xl space-y-2">
            <div className=" flex justify-between items-center">
              <p>Available: 0.0 iBGT</p>
              <button className=" bg-gray-800 text-white p-1 px-2 rounded-lg "> MAX</button>
            </div>
            <div className="border p-4 border-gray-300 rounded-xl">
              <div className=" flex">
                <input
                  type="text"
                  className=" w-full bg-transparent focus:outline-none text-xl"
                  placeholder="0.0"
                />
                <Image src="/images/ibgt-logo.svg" width={24} height={24} alt="iBGT" />
              </div>
              <p>$0</p>
            </div>
          <CustomButton />
          </div>

        </div>
      </div>

    </>
  );
}

export default IBGTPage;