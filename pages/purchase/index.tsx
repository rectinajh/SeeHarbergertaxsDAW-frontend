import React from 'react'
import Image from 'next/image';
import { Button } from 'antd';
import style from './index.module.scss';
import SuffixText from '@/components/SuffixText';

export default function purchase() {
    return (

        <main>
            <div className={`${style.container} flex-col`}>
                <h1 className="lg:text-[32px] lg:absolute lg:top-[60px] lg:text-center w-full top-0 sticky text-xl h-14 flex items-center justify-center max-lg:backdrop-blur-md max-lg:bg-mh max-lg:shadow-2xl">购买广告</h1>
                <div className={style.purchaseList}>
                    <div className={style.purItem}>
                        <picture>
                            <source media="(max-width: 1024px)" srcSet="/images/textmobile.png" />
                            <img src="/images/billimage.png" alt='' />
                        </picture>


                        <div className='max-lg:flex flex-col justify-between max-lg:min-w-[40vw]'>
                            <div>
                                <h3 >一块广告牌</h3>
                                <div className={style.desc}>
                                    <div className={`${style.descItems} max-lg:flex-col`}>
                                        <span className={`${style.left} ml-0`}>购买人： </span>
                                        <div className={`${style.right} max-lg:mt-[6px]`}>
                                            <Image src="/images/avar.png" width={31} height={31} alt=''></Image>
                                            <span className="text-xs"><SuffixText content="0x12121212121212121212"></SuffixText></span>
                                        </div>
                                    </div>
                                    <div className={style.descItems}>
                                        <span className={style.left}>展示开始日期： </span>
                                        <span className={style.right}>24/2/12</span>
                                    </div>
                                    <div className={style.descItems}>
                                        <span className={style.left}>展示结束日期： </span>
                                        <span className={style.right}>24/2/12</span>
                                    </div>


                                </div>
                            </div>
                            <div>
                                <div className={style.amount}>
                                    <p className='max-lg:mr-[17px]'>金额</p>
                                    <span className='max-lg:text-base'>See 200000.00</span>
                                </div>
                                <Button block className={style.button} type="primary" >购买</Button>
                            </div>
                        </div>


                    </div>
                </div>
            </div>
        </main>
    )
}