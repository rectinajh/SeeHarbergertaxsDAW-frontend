import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import Back from '@/components/Back'
import Keypad, { IRef } from '@/components/Keypad';
import { Button, Input } from 'antd'
import style from './transaction.module.scss';
type EditType = 'price' | 'withdraw'
export default function Transaction() {
    const keypadRef = useRef<IRef>(null)
    const [setEdit, setSetEdit] = useState<Record<EditType, boolean>>({
        price: false,
        withdraw: false
    })
    const [withdraw, setWithdraw] = useState<string>('')
    const [price, setPrice] = useState<string>('')
    const [curr, setCurr] = useState<EditType | null>()

    const setVal = useMemo(() => curr === 'price' ? setPrice : setWithdraw, [curr])

    const handleEdit = useCallback((t: EditType) => {
        setSetEdit(prev => ({ ...prev, [t]: true }))
        keypadRef.current?.setOpen(true)
        setCurr(t)
    }, [])

    const keypadOpen = (isOpen: boolean) => {
        setCurr(null)
        if (!isOpen) {
            setSetEdit({
                price: false,
                withdraw: false
            })
        }

    }

    return (
        <main className={`bg-gradient-to-b from-[#F9E8D9] to-[#FFFBF7] max-lg:bg-[#FFFEFA] ${style.transaction}`}>
            <Keypad ref={keypadRef} setInputValue={setVal} onChange={keypadOpen} />
            <div className="lg:w-[816px] w-11/12 m-auto overflow-hidden z-10 relative">
                <Back text="交易配置" ></Back>

                <div className='w-full bg-white rounded-xl overflow-hidden px-8 py-4 mt-8 drop-shadow-md max-lg:border-gray-light max-md:py-3 max-md:px-5'>
                    <div className='w-full flex justify-between border-b-gray-light border-b pb-4'>
                        <p >设置售出价</p>
                        {!setEdit.price && <Button type='link' className='text-sm text-black text-opacity-70 p-0 h-auto' onClick={() => handleEdit('price')}>编辑</Button>}
                    </div>

                    <div className='flex items-center pt-4'>
                        {!setEdit.price ? <p className='text-[32px] font-semibold flex items-center'>20000 <span className='ml-3 text-base text-black text-opacity-20 '>See</span></p>
                            : <><div onClick={() => handleEdit('price')} className='w-full'><Input value={price} className={`${curr == 'price' ? "bg-purple_sub" : "bg-[#F6F6F6]"} rounded bg-[#F6F6F6] text-black h-12 border-0 text-xl max-md:text-lg max-md:h-8 max-md:py-0 `}
                                suffix={<span className='text-black text-opacity-20 text-base'>See</span>} /></div>
                                <Button className="ml-3 w-[120px] h-12 rounded text-sm max-md:h-8 max-md:w-[60px]" type="primary" ghost>提交</Button></>}
                    </div>

                    <div className='text-black text-opacity-70 pt-4 max-lg:text-xs'>
                        <p>当前质押余额： xxx see</p>
                        <p>需质押：xxx see</p>
                        <p>每天使用费：xxx see</p>
                    </div>
                </div>

                <div className='w-full bg-white rounded-xl overflow-hidden px-8 py-4 mt-8 drop-shadow-md max-lg:border-gray-light'>
                    <div className='w-full flex justify-between border-b-gray-light border-b pb-4 '>
                        <p >质押提取</p>
                        {!setEdit.withdraw && <Button type='link' className='text-sm text-black text-opacity-70 p-0 h-auto' onClick={() => handleEdit("withdraw")}>编辑</Button>}
                    </div>
                    <div className='flex items-center pt-4'>
                        {!setEdit.withdraw ? <p className='text-[32px] font-semibold flex items-center'>20000 <span className='ml-3 text-base text-black text-opacity-20 '>See</span></p>
                            : <>
                                <div onClick={() => handleEdit('withdraw')} className='w-full'><Input value={withdraw} className={`rounded  text-black h-12 border-0 text-xl max-md:text-lg max-md:h-8 ${curr == 'withdraw' ? "bg-purple_sub" : "bg-[#F6F6F6]"}`}
                                    suffix={<span className='text-black text-opacity-20 text-base'>See</span>} /></div>
                                <Button className="ml-3 w-[120px] h-12 rounded text-sm max-md:h-8 max-md:w-[60px]" type="primary" ghost>提交</Button></>}
                    </div>
                </div>
            </div>
        </main>
    )
}




