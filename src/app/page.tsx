import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import HeroSection from "@/components/earn/HeroSection";
import StakingCard from "@/components/earn/StakingCard";

export default function Home() {
  // Sample data for the staking cards
  const liquidityStakingData = {
    title: "Supply stBGT/wBERA liquidity",
    description: "Earn yield from swap fees and points by providing stBGT/wBERA liquidity and staking the receipt tokens.",
    apr: "173.95%",
    poolValue: "$614.37K",
    rewardType: "Points",
    rewardIcon: "https://ext.same-assets.com/2446876795/1314914229.svg",
    tokenIcons: [
      "https://ext.same-assets.com/2446876795/1753465442.svg",
      "https://ext.same-assets.com/569822123/3790231366.png"
    ],
    userBalance: "$0.00",
    userBalanceLabel: "Your liquidity"
  };

  const stakeStBGTData = {
    title: "Stake stBGT",
    description: "Stake stBGT to earn HONEY staking rewards. Withdraw stBGT at any time.",
    apr: "112.07%",
    poolValue: "$531.34K",
    rewardType: "HONEY",
    rewardIcon: "https://ext.same-assets.com/569822123/336870244.png",
    tokenIcons: [
      "https://ext.same-assets.com/2446876795/1753465442.svg"
    ],
    userBalance: "$0.00",
    userBalanceLabel: "Your staked balance"
  };

  return (
    <main className="flex min-h-screen items-center">

          <div className="mx-auto">
            <HeroSection />
            <StakingCard {...stakeStBGTData} />
          </div>

    </main>
  );
}
