import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { X } from 'lucide-react';
import Image from 'next/image';
import { Button } from '../ui/button';

type Props = {
  onClose: () => void;
  beraPriceUSD: number;
  stBgtBalance: any;
};

const Stake = ({ onClose, beraPriceUSD, stBgtBalance }: Props) => {
  const [inputValue, setInputValue] = useState('');
  const [isValidInput, setIsValidInput] = useState(false);
  const [insufficientBalance, setInsufficientBalance] = useState(false);

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
          <p className='text-muted-foreground/70'>Available: {stBgtBalance} stBGT</p>
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
                className='bg-transparent focus:outline-none w-12 text-end text-lg font-semibold'
                placeholder='0.0'
                value={inputValue}
                onChange={handleInputChange}
              />
              <p className='text-muted-foreground/70 text-end'>~${totalValue.toFixed(2)}</p>
            </div>
          </div>
          <Button
            className='bg-[#e50571] w-full mt-2 text-foreground'
            disabled={!isValidInput || insufficientBalance}
          >
            {insufficientBalance ? 'Insufficient Balance' : 'Stake'}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default Stake;
