import React, { useRef, useState } from 'react'
import { Button } from 'antd';
import Link from 'next/link';
import style from './index.module.scss';
import { getAuditAdvertise } from '@/services';
import { useRequest } from 'ahooks';
import { useRouter } from 'next/router';
import NotifAlert from '@/components/NotifAlert';
import UnUse, { IRef as IUseRef } from '@/components/UnUse';

export default function Ad() {
    const unUseRef = useRef<IUseRef>(null)
    const router = useRouter()
    const [audLen, setAudLen] = useState<number>(0)
    const [notifShow, setNotifShow] = useState(false)
    const { loading, run } = useRequest(getAuditAdvertise, {
        manual: false,
        onSuccess: (result, params) => {
            setAudLen(result.count)
        }
    })


    const handleLook = () => {
        if (audLen) {
            router.push('/ad/history')
        } else {
            setNotifShow(true)
        }
    }

    const handleSettle = () => {
        const isCanUse = unUseRef.current?.handleCheckCanUse()
        if (!isCanUse) {
            return
        }
        router.push('/ad/image')
    }
    return (
        <main className='ad lg:flex lg:flex-col items-center justify-center max-lg:bg-[#F8F7F6]'>
            <h1 className='lg:hidden text-center w-full mb-5 text-xl top-0  sticky h-14 max-lg:backdrop-blur-md max-lg:bg-mh max-lg:shadow-2xl max-lg:mb-5 flex items-center justify-center'>广告配置</h1>
            {/* <h1 className="lg:text-[32px] lg:static lg:text-center w-full top-0 sticky text-xl h-14 flex items-center justify-center max-lg:backdrop-blur-md max-lg:bg-mh max-lg:shadow-2xl max-lg:mb-5">广告配置</h1> */}

            <div className="2xl:max-w-[1338px] xl:max-w-screen-lg lg:max-w-screen-md flex xl:h-[700px] lg:h-[500px] max-lg:flex-col max-lg:w-full max-lg:h-auto max-lg:px-[15px]">
                <div className="mr-6 flex flex-col justify-between w-[500px] text-[#726DF9] rounded-xl pt-8 pb-8 pr-6 pl-6 bg-gradient-to-b from-[#fff] from-0% lg:via-[#F7F7FF] via-15.08% to-[#D4D2FF] to-98.93% max-lg:w-full max-lg:mb-5 max-lg:from-[#E9EBFF] max-lg:to-[#E0E4FF] max-lg:rounded">
                    <div className='max-lg:flex justify-between'>
                        <div className='xl:mb-[70px] lg:mb-[30px]'>
                            <h3 className="text-lg  md:text-2xl mb-3 font-semibold">图片配置</h3>
                            <p className='text-xs md:text-base'>配置PC端广告图片 <br />&移动端广告图片</p>
                        </div>
                        <img src="/images/adimgset.svg" alt="set" className='xl:my-[70px] lg:my-[30px] max-lg:mb-[17px] max-lg:w-[33vw]' />
                    </div>
                    <Button block type="primary" className="h-14 rounded-lg flex-shrink-0 max-lg:h-10" onClick={handleSettle}>去配置</Button>
                </div>

                <div className={`mr-6 flex flex-col justify-between  w-[500px] text-[#E99430] rounded-xl pt-8 pb-8 pr-6 pl-6 bg-gradient-to-b from-[#FFFBF7] from-0% to-[#F9E8D9] to-100% ${style.transItem} max-lg:w-full max-lg:mb-5 max-lg:rounded`}>
                    <div className='max-lg:flex justify-between'>
                        <div className=''>
                            <h3 className="text-lg  md:text-2xl mb-3 font-semibold">交易设置</h3>
                            <p className='text-xs md:text-base'> 设置广告牌售出价，  <br />&提取或补充质押金额</p>
                        </div>
                        <img src="/images/adtranset.svg" alt="set" className='xl:my-[70px] lg:my-[30px] max-lg:mb-[17px] max-lg:w-[33vw]' />
                    </div>

                    <Link href="/ad/transaction"> <Button block className={`h-14 bg-[#E99430] rounded-lg ${style.transBtn} max-lg:h-10`} type="primary">去配置</Button></Link>
                </div>
                <div className='max-lg:hidden flex flex-col justify-between  bg-[#fff] width-[300px] text-[#726DF9] rounded-xl pt-8 pb-8 pr-6 pl-6 border-[#E9E9E9] max-lg:w-full'>
                    <div>
                        <h3 className='text-2xl mb-3 font-semibold'>申请历史记录</h3>
                        <p >查看历史申请记录和审核结果</p>
                    </div>
                    <Button block onClick={handleLook} className='h-14 text-[#726DF9] rounded-lg border-none'>去查看</Button>
                </div>
                <NotifAlert show={notifShow} setShow={setNotifShow}>
                    <p className='max-lg:text-sm'>暂无申请记录，<br className='max-lg:hidden' />
                        快去首页购买广告进行配置吧</p>
                </NotifAlert>
                <div onClick={handleLook} className="flex bg-white h-12 justify-between py-[13px] px-6 lg:hidden max-lg:rounded">

                    <span className="text-sm font-semibold">历史申请记录</span>

                    {loading ?
                        <div className='animate-pulse mt-2.5'>
                            <div className="h-4 bg-gray-200 rounded-full "></div>
                        </div>
                        : <span className='text-black text-opacity-50 text-sm'>{`${audLen}条记录`} </span>}
                </div>
            </div>
            <UnUse ref={unUseRef}></UnUse>
        </main >
    )
}

