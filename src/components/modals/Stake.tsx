import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Loader2, X } from 'lucide-react';
import Image from 'next/image';
import { Button } from '../ui/button';
import { useAccount, usePublicClient, useWriteContract } from "wagmi";
import contractABI from "@/abi/contractABI.json";
import approvalContractABI from "@/abi/stBGTcontractABI.json"
import { sepolia, berachain } from 'viem/chains';
import { ethers } from 'ethers';
import CustomButton from '@/provider/Wallet';
import TransactionModal from './TransactionModal';

interface StakeModalProps {
  onClose: () => void;
  fetchWinkPoints: () => void;
  setWinkPoints: (points: number) => void;
  beraPriceUSD: number;
  stBgtBalance: string;
}

const Stake = ({ onClose, beraPriceUSD, stBgtBalance, fetchWinkPoints, setWinkPoints }: StakeModalProps) => {
  const [inputValue, setInputValue] = useState('');
  const [isValidInput, setIsValidInput] = useState(false);
  const [insufficientBalance, setInsufficientBalance] = useState(false);
  const [approvalProcessing, setApprovalProcessing] = useState(false);
  const [isTransactionProcessing, setIsTransactionProcessing] = useState(false);
  const [txCompleted, setTxCompleted] = useState(false);
  const [txHash, setTxHash] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);


  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/[^0-9.]/g, ''); // Remove non-numeric characters except for decimal point
    const isValid = !isNaN(parseFloat(value)) && value !== '';

    setIsValidInput(isValid);
    setInputValue(value);
  };

  const totalValue = isValidInput ? parseFloat(inputValue) * beraPriceUSD : 0;

  useEffect(() => {
    if (isValidInput) {
      if (totalValue > parseFloat(stBgtBalance)) {
        setInsufficientBalance(true);
      } else {
        setInsufficientBalance(false);
      }
    } else {
      setInsufficientBalance(false);
    }
  }, [totalValue, stBgtBalance, isValidInput]);

  const { writeContractAsync } = useWriteContract();
  const publicClient = usePublicClient();
  const { address, isConnected } = useAccount();


  const handleStakeClick = async () => {
    setApprovalProcessing(true); 
    setErrorMessage("");
    setIsModalOpen(true);
    console.log(address, "amount", inputValue);
  
    let txHash = "";
  
    try {
      // First, execute the approval contract
      const approvalTx = await writeContractAsync({
        address: "0x2CeC7f1ac87F5345ced3D6c74BBB61bfAE231Ffb",
        abi: approvalContractABI,
        functionName: "approve",
        args: [
          "0xC03226d5d68FEaDa37E0328b2B954acB579a3C9a",
          ethers.utils.parseEther(inputValue),
        ],
        chain: berachain,
        account: address as `0x${string}`,
      });
  
      await publicClient?.waitForTransactionReceipt({ hash: approvalTx });
      setApprovalProcessing(false); // Approval is done
  
      // After approval, execute the stake contract
      setIsTransactionProcessing(true); // New state to track transaction processing
      const stakeTx = await writeContractAsync({
        address: "0xC03226d5d68FEaDa37E0328b2B954acB579a3C9a",
        abi: contractABI,
        functionName: "stake",
        args: [ethers.utils.parseEther(inputValue)],
        chain: berachain,
        account: address as `0x${string}`,
      });
  
      txHash = stakeTx;
      await publicClient?.waitForTransactionReceipt({ hash: stakeTx });
      setIsTransactionProcessing(false); // Transaction is done
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
      setIsModalOpen(false);
    } finally {
      setTxCompleted(!!txHash);
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
      setWinkPoints(0);
      fetchWinkPoints();
    } catch (error) {
      console.error("Error updating points:", error);
    }
  };



  const buttonDisabled = !isValidInput || insufficientBalance || isTransactionProcessing || approvalProcessing ;



  return (
    <div className='w-[450px]'>
      <Card className="card-bg bg-[#e50571] border-0 overflow-hidden">
        <CardHeader className="pb-2">
          <div className="flex justify-between items-center">
            <CardTitle className="font-semibold">Stake stBGT</CardTitle>
            <X onClick={onClose} className='hover:cursor-pointer' />
          </div>
        </CardHeader>
        <CardContent>
          <div className=" flex justify-between items-center">
          <p className='text-muted-foreground/70'>Available: {stBgtBalance} stBGT</p>
          <button className='bg-[#e50571] w-fit p-1 px-2 rounded text-sm text-foreground' onClick={() => setInputValue(stBgtBalance)}>MAX</button>
          </div>
          <div className="bg-black/30 mt-2 rounded-md p-3 px-5 flex justify-between items-center">
            <div className="flex items-center gap-2">
              <Image src="https://ext.same-assets.com/2446876795/1753465442.svg" width={48} height={48} alt="stBGT" />
              <div className="">
                <p>stBGT</p>
                <p className='text-muted-foreground/70'>Stride BGT</p>
              </div>
            </div>
            <div className="">
              <input
                type="text"
                className='bg-transparent focus:outline-none w-full text-end text-lg font-semibold'
                placeholder='0.0'
                value={inputValue}
                onChange={handleInputChange}
              />
              <p className='text-muted-foreground/70 text-end'>~${totalValue.toFixed(2)}</p>
            </div>
          </div>
          {isConnected ? (
              <Button
                className='bg-[#e50571] w-full text-foreground mt-2'
                disabled={buttonDisabled}
                onClick={handleStakeClick}
              >
                {insufficientBalance
                  ? 'Insufficient Balance'
                  : 'Stake'
                }
              </Button>
            ) : (
              <CustomButton />
            )}
          {errorMessage && (
            <div className="text-red-500 mt-2 mb-2 text-sm text-center">
              {errorMessage}
            </div>
          )}
        </CardContent>
      </Card>
      <TransactionModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        txHash={txHash}
        isProcessing={isTransactionProcessing}
        isApproving={approvalProcessing}
      />
    </div>
  );
};

export default Stake;
