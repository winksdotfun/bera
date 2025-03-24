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


type Props = {
  onClose: () => void;
  beraPriceUSD: number;
  stBgtBalance: any;
};

const Stake = ({ onClose, beraPriceUSD, stBgtBalance }: Props) => {
  const [inputValue, setInputValue] = useState('');
  const [isValidInput, setIsValidInput] = useState(false);
  const [insufficientBalance, setInsufficientBalance] = useState(false);
  const [approvalProcessing, setApprovalProcessing] = useState(false);
  const [isTransactionProcessing, setIsTransactionProcessing] = useState(false);
  const [txCompleted, setTxCompleted] = useState(false);
  const [txHash, setTxHash] = useState("");
  const [errorMessage, setErrorMessage] = useState("");


  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/[^0-9.]/g, ''); // Remove non-numeric characters except for decimal point
    const isValid = !isNaN(parseFloat(value)) && value !== '';

    setIsValidInput(isValid);
    setInputValue(value);
  };

  const totalValue = isValidInput ? parseFloat(inputValue) * beraPriceUSD : 0;

  useEffect(() => {
    if (isValidInput) {
      if (totalValue > stBgtBalance) {
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
  const { address } = useAccount();


  const handleStakeClick = async (amount: any) => {
    setApprovalProcessing(true); 
    setErrorMessage("");
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
  
      await publicClient.waitForTransactionReceipt({ hash: approvalTx });
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
          <Button
            className='bg-[#e50571] w-full mt-2 text-foreground'
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
          </Button>
          {/* <Button
            className='bg-[#e50571] w-full mt-2 text-foreground'
            onClick={handleStakeClick}
            disabled={isStaking}
          >
            {isStaking ? 'Processing' : 'Stake'}
          </Button> */}
          {errorMessage && (
            <div className="text-red-500 mt-2 mb-2 text-sm text-center">
              {errorMessage}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Stake;
