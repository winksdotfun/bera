"use client"
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import HeroSection from "@/components/earn/HeroSection";
import StakingCard from "@/components/earn/StakingCard";
import { useEffect, useState } from "react";
import Image from "next/image";


export default function Home() {

  interface StatsData {
    stbgt_staking_apr: number;
    stbgt_staking_deposits_usd: number;
    bera_price_usd: number
  }

  const [statsData, setStatsData] = useState<StatsData | null>(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await fetch('https://berachain.main.stridenet.co/stats');
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        setStatsData(data);
      } catch (error) {
        console.log("error")
      }
    };

    fetchStats();
  }, []);

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!statsData) {
    return (
      <div className="flex flex-col h-screen justify-center items-center bricolage-font">
        <Image
          src="https://ext.same-assets.com/2446876795/1753465442.svg"
          width={50}
          height={50}
          className="animate-spin"
          alt="stBGT"
        />
        <p>Loading...</p>
      </div>
    );
  }


  const apr = statsData.stbgt_staking_apr;
  const formattedApr = Number(apr).toFixed(2);

  function formatToK(value: number) {
    if (value >= 1000) {
      return (value / 1000).toFixed(2) + 'K';
    }
    return value.toString();
  }


  const poolValue = statsData.stbgt_staking_deposits_usd;
  const formattedPoolValue = formatToK(poolValue);



  const stakeStBGTData = {
    title: "Stake stBGT",
    description: "Stake your stBGT and earn rewards",
    apr: "44.21%",
    poolValue: 282050,
    rewardType: "AMM",
    rewardIcon: "/images/honey.svg",
    tokenIcons: ["/path/to/icon1.svg", "/path/to/icon2.svg"],
    userBalance: "0.0",
    userBalanceLabel: "stBGT",
    beraPriceUSD: 15.5
  };

  return (
    <main className="flex min-h-screen items-center bricolage-font">

      <div className="mx-auto">
        <HeroSection />
        <StakingCard {...stakeStBGTData} />
        <p className=" pt-2 text-center">Powered by winks.fun</p>
      </div>

    </main>
  );
}
