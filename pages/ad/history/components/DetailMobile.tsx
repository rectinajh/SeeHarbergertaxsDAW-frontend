import { Button, Carousel, Collapse, Image } from 'antd'
import React, { Dispatch, SetStateAction, useCallback, useEffect, useRef, useState } from 'react'
import { AUD_STATUS, IAdvertise, AUD_STATUS_TEXT, UserInfo, ILinks } from '@/types/response';
import SuffixText from '@/components/SuffixText';

import dayjs from 'dayjs';
import { useLocalStorageState } from 'ahooks';
import { DIRECTION } from '../detail';
import { CarouselRef } from 'antd/es/carousel';

type Props = {
    data: IAdvertise[],
    currIndex: [number, Dispatch<SetStateAction<number>>],
    reason: [string, Dispatch<SetStateAction<string>>],
    links: ILinks | undefined,
    // changeCurr: (direction: DIRECTION) => void,
    currDetail: IAdvertise,
    run: (page: number, direction?: DIRECTION | undefined) => void,
    currPage: number,
    handleAudit: (status: AUD_STATUS) => void
}

const DetailMobile = ({ data = [], currIndex: [index, setIndex] = [0, () => { }], links, currDetail, currPage, run, reason: [reason, setReason] = ['', () => { }], handleAudit }: Props) => {
    const carouselRef = useRef<CarouselRef>(null)
    const onChange = useCallback((currentSlide: number) => {
        setIndex(currentSlide)
        if (currentSlide >= data.length - 1 && links?.next) {
            run(currPage + 1)
        } else if (currentSlide <= 0 && links?.previous) {
            run(currPage - 1)
        }
    // 添加所有使用的变量作为依赖项
    }, [currPage, data.length, links?.next, links?.previous, run, setIndex])


    const [info] = useLocalStorageState<UserInfo>('user-info');

    useEffect(() => {
        carouselRef.current?.goTo(index, true)
    }, [index])

    const collapseItems = (item: IAdvertise) => {
        const items = [{
            key: '1',
            label: '申请留言',
            style: {
            },
            children: <div className='text-sm text-black text-opacity-60 bg-[#F6F6F6] rounded-lg py-2 px-3'>{item.applymsg}</div>,
        }]
        if (!info?.auditor) {
            items.push(
                {
                    key: '2',
                    label: '审核留言',
                    style: {
                    },
                    children: <div className='text-sm text-black text-opacity-60 bg-[#F6F6F6] rounded-lg py-2 px-3'>{item.audmsg}</div>,
                }
            )
        }
        return items
    }



    return (
        <>
            <Carousel afterChange={onChange} dots={false} infinite={false} className='w-10/12 m-auto ad-history-carousel' ref={carouselRef}>
                {data?.map((item: IAdvertise) => {
                    return (<div className="rounded-xl relative overflow-hidden cursor-pointer px-2" key={item.id} >
                        <div className={` rounded-t-xl ${item.audstatus === AUD_STATUS.pending ? 'bg-[#2C2B50]' : item.audstatus === AUD_STATUS.success ? 'bg-green' : 'bg-orange'} pt-5 pb-8 px-5`}>
                            <p className='flex items-center mb-[10px] '>
                                <span className='text-white text-opacity-60 w-16'>提交时间</span>
                                <span className='text-white ml-5'>{dayjs(item.createdate).format('YYYY-MM-DD')}</span>
                            </p>
                            <p className='flex items-center mb-[10px]'>
                                <span className='text-white text-opacity-60 w-16'>审核结果</span>
                                <span className='text-white ml-5'>{AUD_STATUS_TEXT[item.audstatus]}</span>
                            </p>
                            <p className='flex items-center mb-[10px]'>
                                <span className='text-white text-opacity-60 w-16'>订单编号</span>
                                <span className='text-white ml-5'>{item.id}</span>
                            </p>
                            <p className='flex items-center mb-[10px]'>
                                <span className='text-white text-opacity-60 w-16'>用户信息</span>
                                <span className='text-white ml-5'><SuffixText className="text-white" content={item.useraddr}></SuffixText></span>
                            </p>
                        </div>
                        <div className='bg-white rounded-xl w-full relative  -top-5 border border-gray-light '>
                            <div className='p-5 flex justify-start'>
                                <div>
                                    <p className='text-black text-opacity-60 mb-3'>手机端图片</p>
                                    <Image src={process.env.NEXT_PUBLIC_API_BASE_URL + item.mobimage} alt={item.useraddr} className="max-h-[115px]"></Image>
                                </div>

                                <div><p className='text-black text-opacity-60 mb-3'>电脑端图片</p>
                                    <Image src={process.env.NEXT_PUBLIC_API_BASE_URL + item.pcimage} alt={item.useraddr} className="max-h-[115px]"></Image></div>
                            </div>


                            <div className='cursor-pointer py-1 px-1 border-t border-gray-light history-collapse'>
                                <Collapse items={collapseItems(item)} bordered={false} ghost expandIconPosition="end" />

                            </div>

                        </div>


                    </div>)
                })}




            </Carousel>

            {currDetail && info?.auditor && <div className='fixed bottom-[76px] w-full rounded-t-xl bg-white z-20 shadow-md py-3 px-5'>
                <p className='pb-1 text-sm'>审核留言</p>
                <textarea value={reason} disabled={currDetail.audstatus !== AUD_STATUS.pending || !(info as UserInfo).auditor} onInput={e => setReason(e.currentTarget.value)}
                    placeholder='审核不通过必须写明原因' className={`flex-1 mb-1 text-sm w-full h-[45px] p-3 bg-[#F4F4F4] rounded-xl`} style={{ resize: "none" }}></textarea>
                {(info as UserInfo).auditor && <div className='flex items-center gap-4 '>
                    {(currDetail.audstatus === AUD_STATUS.success || currDetail.audstatus === AUD_STATUS.pending) &&
                        <Button disabled={currDetail.audstatus !== AUD_STATUS.pending} type="primary"
                            onClick={() => handleAudit(AUD_STATUS.success)}
                            className='text-sm flex-1 rounded-lg bg-green hover:!bg-green hover:opacity-70 disabled:bg-green  disabled:opacity-70 disabled:text-white h-[40px]'
                        >
                            同意</Button>}
                    {(currDetail.audstatus === AUD_STATUS.fail || currDetail.audstatus === AUD_STATUS.pending) &&
                        <Button disabled={currDetail.audstatus !== AUD_STATUS.pending} type="primary"
                            onClick={() => handleAudit(AUD_STATUS.fail)}
                            className='text-sm flex-1 rounded-lg h-[40px]' danger>不同意</Button>}
                </div>}
            </div>}
        </>
    )
}
export default DetailMobile