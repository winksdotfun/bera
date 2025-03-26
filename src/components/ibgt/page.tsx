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


interface Props { }

const tokenContractAddress = "0x38fdD999Fe8783037dB1bBFE465759e312f2d809";
const stakeContractAddress = "0x78beda3a06443f51718d746aDe95b5fAc094633E";

const KODIAK_MINT_URL = "https://hub.berachain.com/pools/0x38fdd999fe8783037db1bbfe465759e312f2d809000200000000000000000004/deposit/"


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
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [winkpoints, setWinkpoints] = useState(0);
  const [isLoading, setIsLoading] = useState(false);


  const { isConnected, address } = useAccount();
  const { writeContractAsync } = useWriteContract();
  const publicClient = usePublicClient();


  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/[^0-9.]/g, '');
    const isValid = !isNaN(parseFloat(value)) && value !== '' && parseFloat(value) > 0;

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

        console.log("data", data);
        const rewardToken = data.reward_tokens.find((token: any) => token.apr !== undefined);
        console.log("apr", rewardToken ? rewardToken.apr : null)
        const APR = (rewardToken ? rewardToken.apr : null) * 100
        const iBGTPrice = data?.stake_token?.price;

        console.log("iBGTPrice", iBGTPrice);
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
  

  useEffect(() => {
    fetchBalances();
    fetchWinkpoints();
  }, [address]);

  const totalValue = isValidInput ? parseFloat(inputValue) * iBgtPrice : 0;

  useEffect(() => {
    if (isValidInput && iBgtBalance) {
      const inputValueNumber = parseFloat(inputValue);
      const balanceNumber = parseFloat(iBgtBalance);
      
      if (inputValueNumber > balanceNumber) {
        setInsufficientBalance(true);
      } else {
        setInsufficientBalance(false);
      }
    } else {
      setInsufficientBalance(false);
    }
  }, [inputValue, iBgtBalance, isValidInput]);


  const checkAllowance = async () => {
    if (!address) return BigInt(0);

    try {
      const allowance = await publicClient?.readContract({
        address: tokenContractAddress,
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
        args: [address, stakeContractAddress], // owner, spender
      });

      return allowance as bigint;
    } catch (error) {
      console.error("Error checking allowance:", error);
      return BigInt(0);
    }
  };

  const handleStakeClick = async (amount: any) => {
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
          address: tokenContractAddress,
          abi: approvalContractABI,
          functionName: "approve",
          args: [
            stakeContractAddress,
            inputAmount,
          ],
          chain: berachain,
          account: address as `0x${string}`,
        });

        await publicClient.waitForTransactionReceipt({ hash: approvalTx });
        setApprovalProcessing(false);
      }

      // After approval (or if approval wasn't needed), execute the stake contract
      setIsTransactionProcessing(true);
      const stakeTx = await writeContractAsync({
        address: stakeContractAddress,
        abi: contractABI,
        functionName: "stake",
        args: [inputAmount],
        chain: berachain,
        account: address as `0x${string}`,
      });

      txHash = stakeTx;
      await publicClient.waitForTransactionReceipt({ hash: stakeTx });
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

  const fetchBalances = async () => {
    if (!address) return;

    try {
      // Fetch stMON balance
      const iBgtBalance = await publicClient.readContract({
        address: tokenContractAddress,
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

  const formatTVL = (tvl: number) => (tvl / 1_000).toFixed(2) + "M";
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
        <div className="infrared-card max-w-[550px] mx-auto">
          <div className="infrared-card-header bg-product-header-gradient bg-cover border-gray-300 border rounded-t-xl space-y-2 p-4">
            <div className="flex justify-between items-center">
              <div className="flex items-center space-x-4">
                <div className="relative w-[30px] h-[30px]">
                  <Image
                    src="/images/wbtc.svg"
                    alt="WBTC logo"
                    width={30}
                    height={30}
                    className="absolute left-0"
                  />
                  <Image
                    src="/images/wbera.svg"
                    alt="WBERA logo"
                    width={30}
                    height={30}
                    className="absolute left-3"
                  />
                </div>
                <h1 className="text-2xl">WBTC-WBERA
                </h1>
              </div>
              <p className="bg-gray-800/50 text-white p-2 rounded-xl text-sm px-3 mx-3">
                Wink points: {winkpoints}
              </p>
            </div>

            <div className="flex items-center">
                <Image src="/images/kodaik.svg" width={30} height={30} alt="Kodiak" />
                <span className="ml-2">Kodiak</span>
              </div>

            <div className="grid grid-cols-3 gap-4">
              <div>
                <div className="text-sm opacity-80">APR</div>
                <div className="text-xl font-medium">{aprValue?.toFixed(2)}%</div>
              </div>
              <div>
                <div className="text-sm opacity-80">TVL</div>
                <div className="text-xl font-medium">${tvlvalue !== null ? formatTVL(tvlvalue) : "Loading..."}</div>
              </div>
              <div>
                <div className="text-sm opacity-80">Type</div>
                <div className="text-xl font-medium">AMM</div>
              </div>
            </div>
          </div>

          <div className="flex border-b border-gray-300">
            <button className="flex-1 py-2 border-b-2 border-black font-medium">
              Stake
            </button>
       
          </div>

          <div className="p-4 space-y-6">
            <div className="flex justify-between items-center">
              <p>Available: {iBgtBalance} WBTC</p>
              <button className="bg-gray-800 text-white p-0.5 px-2 rounded-lg" onClick={() => setInputValue(iBgtBalance)}>MAX</button>
            </div>

            <div className="border p-4 border-gray-300 rounded-xl">
              <div className="flex">
                <input
                  type="text"
                  className="w-full bg-transparent focus:outline-none text-xl"
                  placeholder="0.0"
                  value={inputValue}
                  onChange={handleInputChange}
                />
<div className="relative w-[30px] h-[30px]">
                  <Image
                    src="/images/wbera.svg"
                    alt="WBERA logo"
                    width={30}
                    height={30}
                    className="absolute left-0"
                  />
                  <Image
                    src="/images/wbtc.svg"
                    alt="WBTC logo"
                    width={30}
                    height={30}
                    className="absolute left-3"
                  />
                </div>               </div>
              <p>${totalValue?.toFixed(4) || 0.0}</p>
            </div>

            {insufficientBalance ? (
              <div className="space-y-2">
                <p className="text-sm text-red-500 flex items-center space-x-2">
           
                  <span>You only have {iBgtBalance} WBERA-WETH</span>
                </p>
                <div className="flex items-center space-x-2 border p-2 rounded-xl text-sm">
                  {/* <Image src="/images/info.svg" width={20} height={20} alt="info" /> */}
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-info size-4"><circle cx="12" cy="12" r="10"></circle><path d="M12 16v-4"></path><path d="M12 8h.01"></path></svg>
                  <p className="text-gray-600 text-sm">
                    Mint on Beraswap then stake your LP tokens here.
                  </p>
                </div>
                <button 
                  onClick={() => window.open(KODIAK_MINT_URL, '_blank')}
                  className="w-full bg-black text-white rounded-xl py-3 flex items-center justify-center space-x-2"
                >
                  <span>Mint</span>
                  <span>↗</span>
                </button>
              </div>
            ) : (
              isConnected ? (
                <button
                  className='connect-button w-full'
                  disabled={buttonDisabled}
                  onClick={handleStakeClick}
                >
                  Stake
                </button>
              ) : (
                <CustomButton />
              )
            )}
          </div>
          
        </div>

        <div className="flex justify-center items-center text-center">
        Powered by Winks.fun
        </div>
        
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