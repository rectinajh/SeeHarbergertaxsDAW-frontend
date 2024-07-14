
import { useMemo, useState } from 'react';
import Back from '@/components/Back';
import { Image } from 'antd';
import { ArrawIcon } from '~/icons';
import { GetServerSideProps } from 'next/types';
import { getAdvertise } from '@/services';
import { AUD_STATUS, IAdvertise } from '@/types/response';
import SuffixText from '@/components/SuffixText';
import { useRouter } from 'next/router';
export const getServerSideProps: GetServerSideProps = async ({ req, res }) => {
    return {
        props: {
            data: await getAdvertise(),
        },
    };
};
const Tabs = [{
    text: "全部",
    audstatus: AUD_STATUS.all
},
{
    text: "待审核",
    audstatus: AUD_STATUS.pending
}, {
    text: "审核失败",
    audstatus: AUD_STATUS.fail
}, {
    text: '审核成功',
    audstatus: AUD_STATUS.success
}]
const History = ({ data }: { data: IAdvertise[] }) => {
    const router = useRouter()

    const [currTab, setCurrTab] = useState<AUD_STATUS>(AUD_STATUS.all)

    const showList = useMemo(() => {
        if (currTab >= 0) {
            return data.filter(item => item.audstatus === currTab)
        }
        return data
    }, [currTab, data])
    return (
        <main >
            <div className="w-[1428px] max-2xl:w-11/12 m-auto relative z-10">
                <Back text={<>历史申请记录<span>（262）</span></>} isNotifi={false}></Back>

                <div className='flex items-center my-8 max-md:flex-wrap max-md:my-4'>
                    {Tabs.map((item, index) => (
                        <p onClick={() => setCurrTab(item.audstatus)}
                            className={`mr-4 max-md:mb-2 rounded-[47px] px-5 py-1 h-8 bg-white cursor-pointer border ${item.audstatus === currTab ? ' border-purple' : "border-white"}`}
                            key={item.text}>{item.text}</p>
                    ))}
                </div>

                <div className='grid gap-2 grid-cols-4 max-2xl:grid-cols-3 max-lg:grid-cols-2 max-sm:grid-cols-1 text-sm' >
                    {showList.map(item => {
                        return <div className="rounded-xl  relative overflow-hidden cursor-pointer" key={item.id} onClick={() => router.push(`/ad/history/${item.id}`)}>
                            <div className={`${item.audstatus === AUD_STATUS.pending ? 'bg-gray' : item.audstatus === AUD_STATUS.success ? 'bg-purple' : 'bg-orange'} pt-5 pb-8 px-5`}>
                                <p className='flex items-center mb-[10px]'>
                                    <span className='text-white text-opacity-60 w-14'>提交时间</span>
                                    <span className='text-white ml-5'>{new Date(item.createdate).toLocaleDateString()}</span>
                                </p>
                                <p className='flex items-center mb-[10px]'>
                                    <span className='text-white text-opacity-60 w-14'>订单编号</span>
                                    <span className='text-white ml-5'>{item.id}</span>
                                </p>
                                <p className='flex items-center mb-[10px]'>
                                    <span className='text-white text-opacity-60 w-14'>用户信息</span>
                                    <span className='text-white ml-5'><SuffixText className="text-white" content={item.useraddr}></SuffixText></span>
                                </p>
                            </div>
                            <div className='bg-white rounded-xl w-full relative  -top-5 border border-gray-light '>
                                <div className='p-5'>
                                    <p className='text-black text-opacity-60 mb-3'>手机端图片</p>
                                    <Image src={process.env.NEXT_PUBLIC_API_BASE_URL + item.mobimage} alt={item.useraddr} className="max-h-[115px]"></Image>

                                    <p className='text-black text-opacity-60 my-3'>电脑端图片</p>
                                    <Image src={process.env.NEXT_PUBLIC_API_BASE_URL + item.pcimage} alt={item.useraddr} className="max-h-[115px]"></Image>
                                </div>


                                <div className='flex items-center justify-between cursor-pointer py-4 px-5 border-t border-gray-light text-sm text-black text-opacity-60'>
                                    <span>审核留言</span>
                                    <ArrawIcon />
                                </div>
                                <div className='flex items-center justify-between cursor-pointer py-4 px-5 border-t border-gray-light text-sm text-black text-opacity-60'>
                                    <span>审核留言</span>
                                    <ArrawIcon />
                                </div>
                            </div>
                        </div>
                    })}


                </div>


            </div>
        </main >
    )
}

export default History
/* 审核留言 */
