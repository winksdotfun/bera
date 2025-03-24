import { Loader2, X, ExternalLink, CheckCircle2 } from "lucide-react";

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
      <div className="bg-white rounded-xl p-6 max-w-md w-full mx-4 relative">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-gray-500 hover:text-gray-700"
        >
          <X size={24} />
        </button>

        <div className="text-center space-y-4">
          {(isProcessing || isApproving) && (
            <>
              <Loader2 className="animate-spin mx-auto" size={48} />
              <h3 className="text-xl font-medium">
                {isApproving ? "Approving Transaction..." : "Processing Transaction..."}
              </h3>
              <p className="text-gray-600">
                {isApproving
                  ? "Please wait while we approve your transaction"
                  : "Please wait while your transaction is being processed"}
              </p>
            </>
          )}

          {txHash && !isProcessing && !isApproving && (
            <>
              <CheckCircle2 className="text-green-500 mx-auto" size={48} />
              <h3 className="text-xl font-medium">Transaction Successful!</h3>
              <p className=" text-black"> You just scored <span className="font-semibold">100</span> wink points!</p>
              <div className="flex justify-center gap-4 mt-4">
                <button
                  onClick={() => window.open(`https://berascan.com/tx/${txHash}`, '_blank')}
                  className="flex items-center gap-2 bg-gray-800 text-white px-4 py-2 rounded-lg hover:bg-gray-700"
                >
                  View Transaction <ExternalLink size={16} />
                </button>
                <button
                  onClick={onClose}
                  className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  Close
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default TransactionModal; 