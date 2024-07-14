import React, { useEffect } from 'react'
import Image from 'next/image';
import SideBar from '../components/SideBar';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
type Props = {
    children: React.ReactElement,
    pathname: string
}
export default function Layout({ children, pathname }: Props) {
    const { data: session } = useSession();
    const router = useRouter()
    useEffect(() => {
        if (session) {
            // const redirectUrl = '/';
            router.push('/');
        } else {
            router.replace('/login');
        }
    }, [session]);
    return (
        <>
            {pathname !== '/login' && <>
                <SideBar></SideBar></>}
            {children}</>
    )
}