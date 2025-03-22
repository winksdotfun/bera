import React from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card'
import { X } from 'lucide-react'
import Image from 'next/image'
import { Button } from '../ui/button'

type Props = {
    onClose: () => void
}

const Stake = ({ onClose }: Props) => {
    return (
        <div className=' w-[450px]'>
            <Card className="card-bg bg-[#e50571] border-0 overflow-hidden">
                <CardHeader className="pb-2 ">
                    <div className="flex justify-between items-center">
                        <CardTitle className=" font-semibold">Stake stBGT</CardTitle>
                        <X onClick={onClose} className=' hover:cursor-pointer' />
                    </div>
                </CardHeader>
                <CardContent>
                    <p className='text-muted-foreground/70'>Available: 0 stBGT</p>
                    <div className="bg-black/30 mt-2 rounded-md p-3 px-5 flex justify-between items-center">
                        <div className=" flex items-center gap-2">
                            <Image src="https://ext.same-assets.com/2446876795/1753465442.svg" width={48} height={48} alt="stBGT" />
                            <div className="">
                                <p>stBGT</p>
                                <p className=' text-muted-foreground/70'>Stride BGT</p>
                            </div>
                        </div>
                        <div className="">
                            <input type="text" className=' bg-transparent focus:outline-none w-12 text-end text-lg font-semibold' placeholder='0.0'/>
                            <p className='text-muted-foreground/70 text-end'>~$0</p>
                        </div>
                    </div>
                    <Button>Stake</Button>
                </CardContent>
            </Card>
        </div>
    )
}

export default Stake;