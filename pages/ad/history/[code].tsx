import React, { useState } from 'react'
import { Image, Button } from 'antd';
import Back from '@/components/Back'

const Detail = () => {
    const [reason, setReason] = useState('')
    return (
        <main>
            <div className="max-w-[1400px]  m-auto translate-x-6 overflow-hidden">
                <Back isNotifi={false} text={<>订单号000000002<span className='text-base text-black text-opacity-60'>（待审核）</span></>}></Back>

                <div className="rounded-xl bg-white overflow-hidden mt-8"  >
                    <div className='bg-purple p-5 flex items-center justify-between '>
                        <div className=''>
                            <span className='text-white text-opacity-60 w-14'>订单号</span>
                            <span className='text-white ml-5'>000000002</span>
                        </div>
                        <span className="block w-[1px] h-4 bg-white bg-opacity-50"></span>
                        <div className=''>
                            <span className='text-white text-opacity-60 w-14'>订单号</span>
                            <span className='text-white ml-5'>000000002</span>
                        </div>
                        <span className="block w-[1px] h-4 bg-white bg-opacity-50"></span>
                        <div className=''>
                            <span className='text-white text-opacity-60 w-14'>订单号</span>
                            <span className='text-white ml-5'>000000002</span>
                        </div>
                        <span className="block w-[1px] h-4 bg-white bg-opacity-50"></span>
                        <div className=''>
                            <span className='text-white text-opacity-60 w-14'>订单号</span>
                            <span className='text-white ml-5'>000000002</span>
                        </div>
                    </div>

                    <div className='flex w-full'>
                        <div className='border-r border-r-gray-light max-w-5xl w-full'>
                            <div className='flex p-5 text-black text-opacity-70 text-sm'>
                                <div className=''>
                                    <p className='mb-3'>手机端图片</p>
                                    <Image src='/images/textmobile.png' alt='' className="max-h-[319px]"></Image>
                                </div>
                                <div className='ml-5'>
                                    <p className='mb-3'>电脑端图片</p>
                                    <Image src='/images/textpx.png' alt='' className="max-h-[319px]"></Image>
                                </div>


                            </div>
                            <div className='border-t border-t-gray-light p-5 pr-9'>
                                <p className='py-4'>申请留言</p>
                                <textarea value={''} disabled className={`w-full h-[112px] p-[22px] bg-[#F4F4F4] rounded-xl`} style={{ resize: "none" }}></textarea>
                            </div>
                        </div>

                        <div className='pl-9 pr-5 pb-5 flex-1 flex flex-col justify-between'>
                            <p className='py-4'>审核留言</p>
                            <textarea value={reason} onInput={e => setReason(e.currentTarget.value)}
                                placeholder='审核不通过必须写明原因' className={`flex-1 mb-4 text-sm w-full h-[112px] p-[22px] bg-[#F4F4F4] rounded-xl`} style={{ resize: "none" }}></textarea>
                            <div className='flex items-center'>
                                <Button type="primary" className='text-sm mr-4 flex-1 rounded-lg'>同意</Button>
                                <Button type="primary" className='text-sm flex-1 rounded-lg' danger>不同意</Button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

        </main>
    )
}


export default Detail