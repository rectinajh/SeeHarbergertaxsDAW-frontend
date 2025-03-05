import { UserInfo } from '@/types/response'
import { contractMsg } from '@/wagmi'
import { useLocalStorageState } from 'ahooks'
import { Button, Modal } from 'antd'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/router'
import React, { useImperativeHandle, useMemo, useState } from 'react'
import { useReadContracts } from 'wagmi'

type Props = {
    // unUseOpen?: boolean,
    // setUnUseOpen?: React.Dispatch<React.SetStateAction<boolean>>,
    // unDeposit?: boolean,
    // setUnDeposit?: React.Dispatch<React.SetStateAction<boolean>>
}

export interface IRef {
    handleCheckCanUse: () => boolean,
    handleCheckCanWithdow: () => boolean
}
const modalClassNames = {
    content: 'max-w-[88%] h-[176px] max-md:mx-[6%] md:min-w-[390px] md:min-h-[176px] !py-0',
}
const UnUse = React.forwardRef<IRef, Props>(({ }, ref) => {
    const { data: session } = useSession();
    const router = useRouter()
    const [unUseOpen, setUnUseOpen] = useState(false)
    const [unWithdraw, setUnWithdraw] = useState(false)

    const { isPending, data, isSuccess } = useReadContracts({
        contracts: [{
            ...contractMsg,
            functionName: 'getCurrentShdKeeper',
            args: ['0']
        }, {
            ...contractMsg,
            functionName: 'checkShdKeeperUsageTime',
            args: ['0']
        }, {
            ...contractMsg,
            functionName: 'checkUsePermissionForShd',
            args: ['0'],
        }]

    })

    const [keeper, usageTime, checkCanUse] = data || []
    const checkIsShdOwner = useMemo(() => keeper === session?.address, [keeper, session?.address])
    // 判断是否还在使用有效期内
    const checkIsInPeriodTime = useMemo(() => usageTime?.result ? new Date() <= new Date(usageTime.result.toString()) : false, [usageTime])
    // const checkCanUse = useMemo(() => checkIsShdOwner && checkIsInPeriodTime, [checkIsInPeriodTime, checkIsShdOwner])


    const handleCheckCanUse = () => {
        setUnUseOpen(!checkCanUse?.result)
        return checkCanUse?.result as boolean
    }

    const handleCheckCanWithdow = () => {
        setUnWithdraw(!checkIsInPeriodTime)
        return checkIsInPeriodTime
    }

    useImperativeHandle(ref, () => ({
        handleCheckCanUse,
        handleCheckCanWithdow
    }))
    return (
        <>
            {/* 无使用权弹窗 */}
            <Modal
                footer={null}
                classNames={modalClassNames}
                onCancel={() => setUnUseOpen?.(false)}
                centered
                open={unUseOpen}
            >
                <div className="text-center flex flex-col justify-center items-center max-w-[288px] mx-auto h-[176px]">
                    <h3 className='text-center text-lg font-semibold'>当前无使用权</h3>

                    <Button type="primary" className='w-full mt-10 max-md:mt-8 text-sm max-md:text-md' onClick={() => router.push("/purchase")}>去质押</Button>
                </div>
            </Modal>
            {/* 无法提取弹窗 */}
            <Modal
                footer={null}
                classNames={modalClassNames}
                onCancel={() => setUnWithdraw?.(false)}
                centered
                open={unWithdraw}
            >
                <div className="text-center flex flex-col justify-center items-center max-w-[288px] mx-auto h-[176px] ">
                    <h3 className='text-center text-lg font-semibold'>当前质押正在使用，无法提取</h3>

                    <Button type="primary" className='w-full mt-10 max-md:mt-8 text-sm max-md:text-md' onClick={() => setUnWithdraw?.(false)}>确定</Button>
                </div>
            </Modal >
        </>



    )
})

UnUse.displayName = "UnUse"
export default UnUse;