import React, { useMemo, useState } from 'react'
import style from './index.module.scss';
import { adIcon, homeIcon, introduceIcon, purchaseIcon, SlogenIcon } from '~/icons'
import Link from 'next/link';
import { useRouter } from 'next/router';
import Image from 'next/image';
import { signOut, useSession } from 'next-auth/react';
import { Popover, Typography } from 'antd';
import SuffixText from '../SuffixText';

const sidebarList = [
    {
        href: '/',
        icon: homeIcon,
        label: "首页"
    },
    {
        href: '/purchase',
        icon: purchaseIcon,
        label: "购买"
    },
    {
        href: '/ad',
        icon: adIcon,
        label: "配置广告"
    },
    {
        href: '/introduce',
        icon: introduceIcon,
        label: "介绍"
    }
]


export default function SideBar({ }) {
    const { pathname, push } = useRouter()
    const { data: session } = useSession();
    const rootPath = useMemo(() => {
        return '/' + pathname.split('/')[1]
    }, [pathname])


    const handleLogout = async () => {
        await signOut({ redirect: false });
        push('/login');
    };

    return (
        <>
            {pathname == '/' && <Popover
                placement="bottom"
                content={<><span onClick={handleLogout}>退出登陆</span></>}
                arrow={false} overlayClassName="loginoutTip">

                <div className=" w-full flex lg:hidden p-4 justify-between items-center sticky h-14 top-0 left-0 backdrop-blur-md bg-mh shadow-xl z-30">

                    <Image src="/images/logo.svg" alt="logo" width={40} height={36} />

                    <div className='w-2/5 flex'>
                        <img src={session?.user?.image || '/images/avar.png'} className="w-6 w-6 rounded-full mr-4" />
                        <SuffixText className="text-base flex-1" content={session?.user?.name || ''} />
                    </div>
                </div>

            </Popover>}
            <div className='h-[76px] fixed bottom-0 left-0 w-full flex lg:hidden justify-around items-center px-2 backdrop-blur-md bg-mh shadow-2xl z-30'>
                {
                    sidebarList.map(item => {
                        return (
                            <Link href={item.href} key={item.href} className={`flex flex-col items-center justify-center text-base ${style.mbarItem} ${rootPath == item.href ? "text-purple" : "text-[#A3A3A3]"}`}>
                                <item.icon></item.icon>
                                <span className='text-xs mt-2'>{item.label}</span>
                            </Link>
                        )
                    })
                }
            </div>
            <div className='absolute bottom-[110px] w-full text-center lg:hidden'>
                <SlogenIcon className="inline-block" />
            </div>

            <>

                <div className="logo lg:block hidden">
                    <Image src="/images/logo.svg" alt="logo" width={50} height={48} />
                </div>
                <div className={`${style.sideBar} lg:flex hidden`}>
                    <div className={style.barLinks}>
                        {
                            sidebarList.map(item => {
                                return (
                                    <Link href={item.href} key={item.href} className={`${style.barItem} ${rootPath == item.href ? style.curr : ""}`}>
                                        <item.icon></item.icon>
                                        <span>{item.label}</span>
                                    </Link>
                                )
                            })
                        }
                    </div>
                    <Popover
                        placement="right"
                        content={<><span onClick={handleLogout}>退出登陆</span></>}
                        arrow={false} overlayClassName="loginoutTip">
                        <Image className={style.avar} src="/images/avar.png" height={40} width={40} alt={'avar'}></Image>
                    </Popover>
                </div>
            </>
        </>
    )
}