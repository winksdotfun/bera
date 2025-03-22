import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Image from "next/image";

interface StakingCardProps {
  title: string;
  description: string;
  apr: string;
  poolValue: string;
  rewardType: string;
  rewardIcon: string;
  tokenIcons: string[];
  userBalance: string;
  userBalanceLabel: string;
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
}: StakingCardProps) => {
  return (
    <Card className="gradient-border overflow-hidden">
      <CardHeader className="pb-2">
        <CardTitle className="text-xl font-semibold">{title}</CardTitle>
        <CardDescription className="text-muted-foreground">
          {description}
        </CardDescription>
      </CardHeader>

      <div className="grid grid-cols-3 gap-4 px-6 py-4 border-t border-b border-border/20">
        <div className="space-y-1">
          <p className="text-3xl font-bold text-primary">{apr}</p>
          <p className="text-xs uppercase font-medium text-muted-foreground">APR</p>
        </div>
        <div className="space-y-1">
          <p className="text-xl font-semibold">{poolValue}</p>
          <p className="text-xs uppercase font-medium text-muted-foreground">{
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
            <span className="text-muted-foreground font-medium">{rewardType}</span>
          </div>
          <span className="text-muted-foreground ml-2">Rewards</span>
        </div>
      </div>

      <CardContent className="pt-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <div className="flex">
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
            </div>
            <div className="ml-2">
              <p className="text-2xl font-bold">{userBalance}</p>
              <p className="text-sm text-muted-foreground">{userBalanceLabel}</p>
            </div>
          </div>
          <Button className="bg-primary hover:bg-primary/90 text-foreground">
            Connect wallet
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default StakingCard;
