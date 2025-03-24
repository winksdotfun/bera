"use client"
import CustomButton from "@/provider/Wallet";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useAccount, usePublicClient, useWriteContract } from "wagmi";
import contractABI from "@/abi/contractABI.json";
import approvalContractABI from "@/abi/iBGTcontractABI.json"
import { berachain } from 'viem/chains';
import { ethers } from 'ethers';
import { Loader2 } from "lucide-react";


interface Props { }

const IBGTPage = ({ }: Props) => {
  const [statsData, setStatsData] = useState(false);
  const [aprValue, setAprValue] = useState<number>();
  const [tvlvalue, setTvlValue] = useState<number>();
  const [iBgtPrice, setiBgtPrice] = useState<number>(0);
  const [inputValue, setInputValue] = useState('');
  const [isValidInput, setIsValidInput] = useState(false);
  const [insufficientBalance, setInsufficientBalance] = useState(false);
  const [approvalProcessing, setApprovalProcessing] = useState(false);
  const [isTransactionProcessing, setIsTransactionProcessing] = useState(false);
  const [txCompleted, setTxCompleted] = useState(false);
  const [txHash, setTxHash] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [iBgtBalance, setiBgtBalance] = useState<any>();


  const { isConnected, address } = useAccount();
  const { writeContractAsync } = useWriteContract();
  const publicClient = usePublicClient();


  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/[^0-9.]/g, ''); // Remove non-numeric characters except for decimal point
    const isValid = !isNaN(parseFloat(value)) && value !== '';

    setIsValidInput(isValid);
    setInputValue(value);
  };


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
        const APR = (rewardToken ? rewardToken.apr : null) * 100
        const iBGTPrice = data.underlying_tokens.find(token => token.symbol === "iBGT")?.price;
        setiBgtPrice(iBGTPrice)
        setAprValue(APR);
        setTvlValue(data.tvl)
        setStatsData(data);
      } catch (error) {
        console.error("Error fetching stats:", error);
      }
    };

    fetchStats();
  }, []);

  useEffect(() => {
    fetchBalances();
  }, [address]);

  const totalValue = isValidInput ? parseFloat(inputValue) * iBgtPrice : 0;

  useEffect(() => {
    if (isValidInput) {
      if (totalValue > iBgtBalance) {
        setInsufficientBalance(true);
      } else {
        setInsufficientBalance(false);
      }
    } else {
      setInsufficientBalance(false);
    }
  }, [totalValue, iBgtBalance, isValidInput]);


  const handleStakeClick = async (amount: any) => {
    setApprovalProcessing(true);
    setErrorMessage("");
    console.log(address, "amount", inputValue);

    let txHash = "";

    try {
      // First, execute the approval contract
      console.log(inputValue,"i/p")
      const approvalTx = await writeContractAsync({
        address: "0xac03CABA51e17c86c921E1f6CBFBdC91F8BB2E6b",
        abi: approvalContractABI,
        functionName: "approve",
        args: [
          "0x75F3Be06b02E235f6d0E7EF2D462b29739168301",
          ethers.utils.parseEther(inputValue),
        ],
        chain: berachain,
        account: address as `0x${string}`,
      });

      await publicClient.waitForTransactionReceipt({ hash: approvalTx });
      setApprovalProcessing(false); // Approval is done

      // After approval, execute the stake contract
      setIsTransactionProcessing(true); // New state to track transaction processing
      const stakeTx = await writeContractAsync({
        address: "0x75F3Be06b02E235f6d0E7EF2D462b29739168301",
        abi: contractABI,
        functionName: "stake",
        args: [ethers.utils.parseEther(inputValue)],
        chain: berachain,
        account: address as `0x${string}`,
      });

      txHash = stakeTx;
      await publicClient.waitForTransactionReceipt({ hash: stakeTx });
      setIsTransactionProcessing(false); // Transaction is done
      setTxHash(txHash);
    } catch (error) {
      console.error("Error:", error);
      // Extract a user-friendly error message
      let errorMsg = "Transaction failed";
      if (error instanceof Error) {
        // Try to extract a more specific message
        if (error.message.includes("user rejected transaction")) {
          errorMsg = "Transaction rejected by user";
        } else if (error.message.includes("insufficient funds")) {
          errorMsg = "Insufficient funds for gas";
        } else {
          // Get the most relevant part of the error
          errorMsg = `Error: ${error.message.split('\n')[0]}`;
        }
      }
      setErrorMessage(errorMsg);
      setApprovalProcessing(false);
    } finally {
      setTxCompleted(!!txHash);
    }
  };

  const fetchBalances = async () => {
    if (!address) return;

    try {
      // Fetch stMON balance
      const iBgtBalance = await publicClient.readContract({
        address: "0xac03CABA51e17c86c921E1f6CBFBdC91F8BB2E6b",
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

      setiBgtBalance(ethers.utils.formatUnits(iBgtBalance as bigint, 18));
      console.log(iBgtBalance);
    } catch (error) {
      console.error("Error fetching balances:", error);
    }
  };

  const formatTVL = (tvl: number) => (tvl / 1_000_000).toFixed(2);
  const buttonDisabled = !isValidInput || insufficientBalance || isTransactionProcessing || approvalProcessing;


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
              <p>Available: {iBgtBalance} iBGT</p>
              <button className=" bg-gray-800 text-white p-0.5 px-2 rounded-lg" onClick={() => setInputValue(iBgtBalance)}> MAX</button>
            </div>
            <div className="border p-4 border-gray-300 rounded-xl">
              <div className=" flex">
                <input
                  type="text"
                  className=" w-full bg-transparent focus:outline-none text-xl"
                  placeholder="0.0"
                  value={inputValue}
                  onChange={handleInputChange}
                />
                <Image src="/images/ibgt-logo.svg" width={24} height={24} alt="iBGT" />
              </div>
              <p>${totalValue?.toFixed(2) || 0.0}</p>
            </div>

            {isConnected ? (
              <button
                className='connect-button w-full flex justify-center'
                disabled={buttonDisabled}
                onClick={txCompleted ? () => window.open(`https://berascan.com/tx/${txHash}`, '_blank') : handleStakeClick}
              >
                {insufficientBalance
                  ? 'Insufficient Balance'
                  : approvalProcessing
                    ? <div className="flex items-center">
                      <Loader2 className="animate-spin mr-2" size={16} />
                      Processing Approval...
                    </div>
                    : isTransactionProcessing
                      ? <div className="flex items-center">
                        <Loader2 className="animate-spin mr-2" size={16} />
                        Processing Transaction...
                      </div>
                      : txCompleted
                        ? 'View Transaction'
                        : 'Stake'
                }
              </button>
            ) : (
              <CustomButton />
            )}
          </div>

        </div>
        <p className=" text-center text-black mt-2">Powered by winks.fun</p>
      </div>

    </>
  );
}

export default IBGTPage;