import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Loader2, X, ExternalLink, CheckCircle2 } from "lucide-react";
import { Button } from "../ui/button";

interface TransactionModalProps {
  isOpen: boolean;
  onClose: () => void;
  txHash: string;
  isProcessing: boolean;
  isApproving: boolean;
}

const TransactionModal = ({
  isOpen,
  onClose,
  txHash,
  isProcessing,
  isApproving,
}: TransactionModalProps) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <Card className="w-[400px] card-bg bg-[#e50571] border-0 overflow-hidden">
        <CardHeader className="pb-2">
          <div className="flex justify-between items-center ">
            <CardTitle className="font-semibold">Transaction Status</CardTitle>
            <X onClick={onClose} className="hover:cursor-pointer" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center text-center">
            {isApproving ? (
              <div className="flex items-center gap-2 text-white">
                <Loader2 className="animate-spin" size={24} />
                <p>Approving Transaction...</p>
              </div>
            ) : isProcessing ? (
              <div className="flex items-center gap-2 text-white">
                <Loader2 className="animate-spin" size={24} />
                <p>Processing Transaction...</p>
              </div>
            ) : (
              <div className="flex flex-col items-center text-white">
                <CheckCircle2 size={40} className="text-green-400 mb-2" />
                <p className="font-semibold">Transaction Completed</p>
                <p className=" text-gray-300"> You just scored <span className="font-semibold text-white">100</span> wink points!</p>
              </div>
            )}

            {txHash && (
              <a
                href={`https://berascan.com/tx/${txHash}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center mt-3 text-white underline"
              >
                View on Explorer <ExternalLink className="ml-1" size={16} />
              </a>
            )}

            <Button className="bg-white text-[#e50571] mt-4 w-full" onClick={onClose}>
              Close
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default TransactionModal;
