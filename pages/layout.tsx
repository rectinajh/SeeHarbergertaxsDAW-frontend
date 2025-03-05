import React, { useEffect } from 'react'
import SideBar from '../components/SideBar';
import useCheckNet from '@/hooks/useCheckNet';
import Head from 'next/head';
type Props = {
    children: React.ReactElement,
    pathname: string
}
export default function Layout({ children, pathname }: Props) {
    useCheckNet()
    return (
        <>
            <Head>
                <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=0;" />
            </Head>
            <div className='max-lg:pb-[76px]'>
                {pathname !== '/login' && <>
                    <SideBar></SideBar></>}
                {children}</div></>
    )
}