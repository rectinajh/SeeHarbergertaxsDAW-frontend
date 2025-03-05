import React, { useEffect } from 'react'

type Props = {
    children: React.ReactNode,
    setShow: React.Dispatch<React.SetStateAction<boolean>>,
    show: boolean,
    dur?: number,
    className?: string
}

const NotifAlert = ({ children, setShow, show, dur = 2000, className }: Props) => {

    useEffect(() => {
        if (show) {
            setTimeout(() => {
                setShow(false)
            }, dur)
        }
    }, [dur, setShow, show])
    return (
        <div className={`fixed z-30 bg-deep-black bg-opacity-50 top-0 left-0 h-full w-full ${show ? 'block' : 'hidden'}`}>
            <div className={`p-5 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white rounded-2xl text-center ${className}`}>{children}</div>
        </div >
    )
}
export default NotifAlert