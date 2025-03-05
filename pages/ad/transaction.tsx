import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import Back from '@/components/Back'
import Keypad, { IRef } from '@/components/Keypad';
import { Button, Input, message } from 'antd'
import style from './transaction.module.scss';
import { contractMsg } from '@/wagmi';
import { useSession } from 'next-auth/react';
import { useReadContracts, useReadContract, useWriteContract } from 'wagmi'
import { formatEther, parseEther } from 'viem';
import Deposit from '@/components/Deposit';
import UnUse, { IRef as IUseRef } from '@/components/UnUse';
type EditType = 'price' | 'withdraw'
export default function Transaction() {
    const { data: session } = useSession();
    // _calculateDepositFees
    const { data, isSuccess } = useReadContracts({
        contracts: [
            {
                ...contractMsg,
                functionName: "checkFundsOf",
                args: [session?.address]

            }
            , {
                ...contractMsg,
                functionName: "_calculateCurrentUsageFees",
                args: ["0"]
            }
            , {
                ...contractMsg,
                functionName: "getCurrentPrice",
                args: ["0"]
            }
        ]
    })

    const [funds, usagefee, currPrice] = data || []
    const cprice = useMemo(() => currPrice?.result ? formatEther(currPrice?.result as bigint) : '0', [currPrice])
    const myFund = useMemo(() => funds?.result ? formatEther(funds?.result as bigint) : '0', [funds])

    const { data: totalUsageFee } = useReadContract({
        ...contractMsg,
        functionName: '_calculateDepositFees',
        args: [currPrice?.result || 0]
    })
    const totalFee = useMemo(() => totalUsageFee ? formatEther(totalUsageFee as bigint) : '0', [totalUsageFee])
    const keypadRef = useRef<IRef>(null)

    const unUseRef = useRef<IUseRef>(null)

    const [setEdit, setSetEdit] = useState<Record<EditType, boolean>>({
        price: false,
        withdraw: false
    })
    const [withdraw, setWithdraw] = useState<string>('')
    const [price, setPrice] = useState<string>('')
    const [curr, setCurr] = useState<EditType | null>()

    const setVal = useMemo(() => curr === 'price' ? setPrice : setWithdraw, [curr])

    const handleEdit = useCallback((t: EditType) => {
        const isCanUse = unUseRef.current?.handleCheckCanUse()
        if (!isCanUse) {
            return
        }
        setSetEdit({
            ...{
                price: false,
                withdraw: false
            }, ...{ [t]: true }
        })
        keypadRef.current?.setOpen(true)
        t === "withdraw" ? setWithdraw(myFund) : setPrice(cprice)
        setCurr(t)
    }, [cprice, myFund])

    const keypadOpen = (isOpen: boolean) => {
        setCurr(null)
        if (!isOpen) {
            setSetEdit({
                price: false,
                withdraw: false
            })
        }

    }

    const cancelEdit = () => {
        keypadRef.current?.setOpen(false)
        setSetEdit({
            price: false,
            withdraw: false
        })
    }
    const [depositOpen, setDepositOpen] = useState(false)
    const { writeContractAsync, isPending } = useWriteContract()
    const changePrice = () => {

        if (price) {
            cancelEdit()
            if (totalUsageFee as bigint > 0) {
                setDepositOpen(true)
            } else {
                writeContractAsync({
                    ...contractMsg,
                    functionName: "setPrice",
                    account: session?.address as `0x${string}`,
                    args: ["0", parseEther(price)]
                }).then(() => {
                    message.success("修改价格成功!")
                }).catch(error => {
                    message.error(error.message)
                })
            }
        } else {
            message.error('价格不能为空!')
        }
    }


    const handleWithDraw = () => {
        const isCanWithDraw = unUseRef.current?.handleCheckCanWithdow()
        if (!isCanWithDraw) {
            return
        }
        cancelEdit()
        writeContractAsync({
            ...contractMsg,
            functionName: "withdraw",
            account: session?.address as `0x${string}`,
            args: ["0", session?.address, parseEther(withdraw)]
        }).then(() => {
            message.success("提现成功!")
        }).catch(error => {
            message.error(error.message)
        })
    }







    return (
        <main className={`bg-gradient-to-b from-[#F9E8D9] to-[#FFFBF7] max-lg:bg-[#FFFEFA] ${style.transaction}`}>
            <Keypad ref={keypadRef} setInputValue={setVal} onChange={keypadOpen} onOk={curr === "withdraw" ? handleWithDraw : changePrice} />
            <div className="lg:w-[816px] w-11/12 m-auto overflow-hidden z-10 relative max-lg:pt-3">
                <Back text="交易配置" isNotifi={false}></Back>

                <div className='w-full bg-white rounded-xl overflow-hidden px-8 py-4 mt-3 drop-shadow-md max-lg:border-gray-light max-md:py-3 max-md:px-5'>
                    <div className='w-full flex justify-between border-b-gray-light border-b pb-4'>
                        <p>设置售出价</p>
                        {!setEdit.price && <Button type='link' className='text-sm text-black text-opacity-70 p-0 h-auto' onClick={() => handleEdit('price')}>编辑</Button>}
                    </div>

                    <div className='flex items-center pt-4'>
                        {!setEdit.price ? <p className='text-[32px] font-semibold flex items-center'>{cprice} <span className='ml-3 text-base text-black text-opacity-20 '>See</span></p>
                            : <><div onClick={() => handleEdit('price')} className='w-full'><Input value={price} className={`${curr == 'price' ? "bg-purple_sub" : "bg-[#F6F6F6]"} rounded bg-[#F6F6F6] text-black h-12 border-0 text-xl max-md:text-lg max-md:h-8 max-md:py-0 `}
                                suffix={<span className='text-black text-opacity-20 text-base'>See</span>} /></div>
                                <Button onClick={changePrice} loading={isPending} className="ml-3 w-[120px] h-12 rounded text-sm max-md:h-8 max-md:w-[60px]" type="primary" ghost>提交</Button></>}
                    </div>


                    {isSuccess ? <p className='text-black text-opacity-70 pt-4 max-lg:text-xs'>
                        当前质押余额： {myFund} see <br />
                        需质押 {totalUsageFee ? formatEther(totalUsageFee as bigint) : 0} see<br />
                        每天使用费：{usagefee?.result ? formatEther(usagefee?.result as bigint) : 0} see
                    </p> : <div className='animate-pulse mt-2.5'>
                        <div className="h-4 bg-gray-200 rounded-full mb-2.5"></div>
                        <div className="h-4 bg-gray-200 rounded-full mb-2.5"></div>
                        <div className="h-4 bg-gray-200 rounded-full"></div>
                    </div>}
                </div>

                <div className='w-full bg-white rounded-xl overflow-hidden px-8 py-4 mt-8 drop-shadow-md max-lg:border-gray-light'>
                    <div className='w-full flex justify-between border-b-gray-light border-b pb-4 '>
                        <p >质押提取</p>
                        {(!setEdit.withdraw && Number(myFund) > 0) && <Button type='link' className='text-sm text-black text-opacity-70 p-0 h-auto' onClick={() => handleEdit("withdraw")}>编辑</Button>}
                    </div>
                    <div className='flex items-center pt-4'>
                        {!setEdit.withdraw ? <p className='text-[32px] font-semibold flex items-center'>{myFund} <span className='ml-3 text-base text-black text-opacity-20 '>See</span></p>
                            : <>
                                <div onClick={() => handleEdit('withdraw')} className='w-full'><Input value={withdraw} className={`rounded  text-black h-12 border-0 text-xl max-md:text-lg max-md:h-8 ${curr == 'withdraw' ? "bg-purple_sub" : "bg-[#F6F6F6]"}`}
                                    suffix={<span className='text-black text-opacity-20 text-base'>See</span>} /></div>
                                <Button loading={isPending} onClick={handleWithDraw} className="ml-3 w-[120px] h-12 rounded text-sm max-md:h-8 max-md:w-[60px]" type="primary" ghost>提交</Button></>}
                    </div>
                </div>
            </div>
            <Deposit depositOpen={depositOpen} setDepositOpen={setDepositOpen}
                totalUsageFee={totalFee}></Deposit>

            <UnUse ref={unUseRef}></UnUse>
        </main>
    )
}



