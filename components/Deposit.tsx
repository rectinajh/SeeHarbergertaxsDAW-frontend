import { SuccessIcon } from "@/public/icons"
import { contractMsg } from "@/wagmi"
import { message, Modal, Input, Button } from "antd"
import { useState } from "react"
import { formatEther, parseEther } from "viem"
import NotifAlert from "./NotifAlert"
import { useWriteContract } from "wagmi"
import { useSession } from "next-auth/react"
import Steps from "./Steps"
import { useRouter } from 'next/router';
interface IDeposit {
    totalUsageFee: string,
    errorCb?: () => void,
    depositOpen: boolean,
    setDepositOpen: React.Dispatch<React.SetStateAction<boolean>>

}
const modalClassNames = {
    content: 'max-w-[88%] h-[322px] max-md:mx-[6%] md:min-w-[540px] md:min-h-[346px] !py-0',
}
const Deposit = ({ totalUsageFee, errorCb, depositOpen, setDepositOpen }: IDeposit) => {
    const router = useRouter()
    const { data: session } = useSession();
    const { writeContractAsync, isPending } = useWriteContract()
    // const [depositOpen, setDepositOpen] = useState(false)
    const [deposit, setdeposit] = useState(totalUsageFee || '')
    const [notifShow, setNotifShow] = useState(false)
    const supplyDeposit = () => {
        writeContractAsync({
            ...contractMsg,
            functionName: "deposit",
            args: ["0"],
            account: session?.address as `0x${string}`,
            value: parseEther(deposit)
        }).then(res => {
            setNotifShow(true)
        }).catch(error => {
            message.error(error.message)
            setDepositOpen(false)
            // setPriceOpen(true)
            errorCb && errorCb()

        })
    }


    return <>
        <Modal
            footer={null}
            classNames={modalClassNames}
            onCancel={() => setDepositOpen(false)}
            centered
            open={depositOpen}
        >
            <Steps step={3}></Steps>
            <div className="text-center flex flex-col justify-center items-center max-w-[288px] mx-auto h-[300px] max-md:h-[300px]">
                <h3 className='text-center text-2xl max-lg:text-lg font-semibold'>请补充质押额</h3>
                <Input value={deposit} onInput={(e) => setdeposit(e.currentTarget.value)} className={`rounded  text-black !bg-[#F6F6F6] mt-8 py-0 h-8 border-0 text-lg max-md:text-lg max-md:h-8 max-md:py-1 `}
                    suffix={<span className='text-black text-opacity-20 text-base'>See</span>} />

                <Button loading={isPending} type="primary" className='w-full mt-10 max-md:mt-8 text-sm max-md:text-md' onClick={supplyDeposit}>下一步</Button>
            </div>
        </Modal>
        {/* <NotifAlert show={notifShow} setShow={setNotifShow}>
            <SuccessIcon className="inline-block" />
            <p className='mt-[6px]'>补充成功</p>
        </NotifAlert> */}


        <Modal
            footer={null}
            classNames={modalClassNames}
            onCancel={() => setNotifShow(false)}
            centered
            open={notifShow}
        >
            <div className="text-center flex flex-col justify-center items-center max-w-[288px] mx-auto h-[300px] max-md:h-[300px]">
                <SuccessIcon className="block mb-3" />
                <h3 className='text-center text-lg max-lg:text-lg font-semibold'>提交成功<br /> 赶紧去配置广告图片吧！</h3>

                <Button loading={isPending} type="primary" className='w-full mt-10 max-md:mt-8 text-sm max-md:text-md' onClick={() => router.push('/ad/image')}>去配置广告图片</Button>
            </div>
        </Modal>
    </>



}

export default Deposit