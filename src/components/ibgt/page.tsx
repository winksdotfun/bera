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
import TransactionModal from "../modals/TransactionModal";



interface Token {
  symbol: string;
  price: number;
}

interface RewardToken {
  apr?: number; // Assuming `apr` can be undefined
}

const IBGTPage = () => {
  const [statsData, setStatsData] = useState(false);
  const [aprValue, setAprValue] = useState<number>();
  const [tvlvalue, setTvlValue] = useState<number>(0);
  const [iBgtPrice, setiBgtPrice] = useState<number>(0);
  const [inputValue, setInputValue] = useState('');
  const [isValidInput, setIsValidInput] = useState(false);
  const [insufficientBalance, setInsufficientBalance] = useState(false);
  const [approvalProcessing, setApprovalProcessing] = useState(false);
  const [isTransactionProcessing, setIsTransactionProcessing] = useState(false);
  const [txCompleted, setTxCompleted] = useState(false);
  const [txHash, setTxHash] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [iBgtBalance, setiBgtBalance] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [winkpoints, setWinkpoints] = useState(0);
  const [isLoading, setIsLoading] = useState(false);


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
        const rewardToken = data.reward_tokens.find((token: RewardToken) => token.apr !== undefined);
        console.log("apr", rewardToken ? rewardToken.apr : null)
        const APR = (rewardToken ? rewardToken.apr : null) * 100
        const iBGTPrice = data.underlying_tokens.find((token: Token) => token.symbol === "iBGT")?.price;
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

  const fetchWinkpoints = async () => {
    if (!address) {
      return;
    }
  
    try {
      setIsLoading(true); // Optional: Set loading state if needed
  
      const response = await fetch(
        `https://inner-circle-seven.vercel.app/api/action/getPoints?address=${address}`,
        {
          method: "GET",
        }
      );
  
      if (!response.ok) {
        throw new Error(`Failed to fetch: ${response.statusText}`);
      }
  
      const data = await response.json();
      console.log("Winkpoints data:", data);
  
      if (data && data.points !== undefined) {
        setWinkpoints(data.points);
      } else {
        console.warn("Invalid data format received:", data);
        setWinkpoints(0); // Set default value if data is unexpected
      }
    } catch (error) {
      console.error("Error fetching winkpoints:", error);
      setWinkpoints(0); // Set default value in case of an error
    } finally {
      setIsLoading(false); // Optional: Reset loading state
    }
  };
  

  

  const totalValue = isValidInput ? parseFloat(inputValue) * iBgtPrice : 0;

  useEffect(() => {
    if (isValidInput) {
      if (totalValue > parseFloat(iBgtBalance)) {
        setInsufficientBalance(true);
      } else {
        setInsufficientBalance(false);
      }
    } else {
      setInsufficientBalance(false);
    }
  }, [totalValue, iBgtBalance, isValidInput]);


  const checkAllowance = async () => {
    if (!address) return BigInt(0);

    try {
      const allowance = await publicClient?.readContract({
        address: "0xac03CABA51e17c86c921E1f6CBFBdC91F8BB2E6b",
        abi: [
          {
            name: "allowance",
            type: "function",
            stateMutability: "view",
            inputs: [
              { name: "owner", type: "address" },
              { name: "spender", type: "address" }
            ],
            outputs: [{ name: "", type: "uint256" }],
          },
        ],
        functionName: "allowance",
        args: [address, "0x75F3Be06b02E235f6d0E7EF2D462b29739168301"], // owner, spender
      });

      return allowance as bigint;
    } catch (error) {
      console.error("Error checking allowance:", error);
      return BigInt(0);
    }
  };

  const handleStakeClick = async () => {
    setErrorMessage("");
    setIsModalOpen(true);
    console.log(address, "amount", inputValue);

    let txHash = "";

    try {
      const inputAmount = ethers.utils.parseEther(inputValue).toString();
      const currentAllowance = await checkAllowance();

      console.log(currentAllowance, "currentAllowance");
      console.log(inputAmount, "inputAmount");
      // Check if approval is needed
      if (BigInt(currentAllowance) < BigInt(inputAmount)) {
        setApprovalProcessing(true);
        // Execute the approval contract
        const approvalTx = await writeContractAsync({
          address: "0xac03CABA51e17c86c921E1f6CBFBdC91F8BB2E6b",
          abi: approvalContractABI,
          functionName: "approve",
          args: [
            "0x75F3Be06b02E235f6d0E7EF2D462b29739168301",
            inputAmount,
          ],
          chain: berachain,
          account: address as `0x${string}`,
        });

        await publicClient?.waitForTransactionReceipt({ hash: approvalTx });
        setApprovalProcessing(false);
      }

      // After approval (or if approval wasn't needed), execute the stake contract
      setIsTransactionProcessing(true);
      const stakeTx = await writeContractAsync({
        address: "0x75F3Be06b02E235f6d0E7EF2D462b29739168301",
        abi: contractABI,
        functionName: "stake",
        args: [inputAmount],
        chain: berachain,
        account: address as `0x${string}`,
      });

      txHash = stakeTx;
      await publicClient?.waitForTransactionReceipt({ hash: stakeTx });
      setIsTransactionProcessing(false);
      setTxHash(txHash);

      await postUserAddressForPoints();

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
      setIsModalOpen(false); // Close modal on error
    } finally {
      setTxCompleted(!!txHash);
      fetchWinkpoints()
    }
  };

  const postUserAddressForPoints = async () => {
    try {
      const response = await fetch(
        "https://inner-circle-seven.vercel.app/api/action/setPoints",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            to: address,
          }),
        }
      );
  
      if (!response.ok) {
        throw new Error("Failed to update points");
      }
  
      const data = await response.json();
      console.log("Points updated:", data);
  
      // ✅ Fetch updated Winkpoints after posting user address
      setWinkpoints(0)
      fetchWinkpoints();
    } catch (error) {
      console.error("Error updating points:", error);
    }
  };

  useEffect(() => {

  const fetchBalances = async () => {
    if (!address || ! publicClient) return;

    try {
      const iBgtBalance = await publicClient?.readContract({
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
  fetchBalances();
}, [address, publicClient]);


  useEffect(() => {
    // fetchBalances();
    fetchWinkpoints();
  }, [address, fetchWinkpoints, publicClient]);

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
            <div className=" flex justify-between items-center">
            <div className="flex items-center space-x-4 ">
              <Image
                src="/images/ibgt-logo.svg"
                alt="iBGT logo"
                width={30}
                height={30}
              />
              <h1 className="text-2xl font-bold">iBGT</h1>
            </div>
            <p className=" bg-gray-800/50 text-white p-2 rounded-xl text-sm px-3">Wink points: {winkpoints}</p>
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
                onClick={handleStakeClick}
              >
                {insufficientBalance
                  ? 'Insufficient Balance'
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

      <TransactionModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        txHash={txHash}
        isProcessing={isTransactionProcessing}
        isApproving={approvalProcessing}
      />

    </>
  );
}

export default IBGTPage;