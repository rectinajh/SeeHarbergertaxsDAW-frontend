import React, { useEffect, useMemo, useRef, useState } from 'react'
import { Button, Skeleton, Space, Modal, Input, message } from 'antd';
import style from './index.module.scss';
import SuffixText from '@/components/SuffixText';
import { getAuditAdvertise } from '@/services';
import { IAdvertise, IShdDetails } from '@/types/response';
import { useReadContracts, useWriteContract, useWatchContractEvent, usePublicClient, type UseReadContractsReturnType, useReadContract } from 'wagmi'

import { useSession } from 'next-auth/react';
import { contractMsg } from '@/wagmi';
import Avatar from '@/components/Avatar';
import dayjs from 'dayjs';
import { parseEther, formatEther, size } from 'viem'
import Deposit from '@/components/Deposit';
import * as echarts from 'echarts';
import { ethers } from 'ethers';
import { CloseIcon } from '@/public/icons';
import Steps from '@/components/Steps';
import { getMouth } from '@/libs/utils';
import { useMount, useUnmount } from 'ahooks';
// import { Line } from '@ant-design/charts';
interface IbuyProps {
    setOpen: React.Dispatch<React.SetStateAction<boolean>>,
    open: boolean,
    price: string,
    depositOpen: boolean,
    setDepositOpen: React.Dispatch<React.SetStateAction<boolean>>,
}

const modalClassNames = {
    content: 'max-w-[88%] h-[322px] max-md:mx-[6%] md:min-w-[540px] md:min-h-[346px] !py-0',
}
const Buy = ({ setOpen, open, price, depositOpen, setDepositOpen }: IbuyProps) => {
    const { writeContractAsync, isPending } = useWriteContract()
    const { data: session } = useSession();
    const comfirmBuy = () => {
        writeContractAsync({
            ...contractMsg,
            functionName: "purchase",
            args: ["0"],
            account: session?.address as `0x${string}`,
            value: parseEther(price), // 将金额转换为 Wei
        }).then(() => {
            setOpen(false)
            setPriceOpen(true)
        }).catch(error => {
            // console.log(error.message)
            message.error(error.shortMessage)
        })
    }

    const { data, isSuccess } = useReadContracts({
        contracts: [
            {
                ...contractMsg,
                functionName: "checkFundsOf",
                args: [session?.address]

            }
            , {
                ...contractMsg,
                functionName: "_calculateCurrentUsageFees",
                args: ["0"]
            }
        ]
    })

    const [funds, usagefee] = data || []


    const [priceOpen, setPriceOpen] = useState(false)
    const [selPrice, setSelPrice] = useState('')
    const { data: totalUsageFee } = useReadContract({
        ...contractMsg,
        functionName: '_calculateDepositFees',
        args: [selPrice ? parseEther(selPrice) : 0]
    })
    const submitPrice = () => {
        if (totalUsageFee as bigint > 0) {
            setPriceOpen(false)
            setDepositOpen(true)
        } else {
            writeContractAsync({
                ...contractMsg,
                functionName: "setPrice",
                args: ["0", selPrice],
                account: session?.address as `0x${string}`,
            }).then(() => {
                setPriceOpen(false)
            }).catch(error => {
                message.error(error.message)
            })
        }

    }



    const needDeposit = useMemo(() => {

    }, [])



    return <>
        <Modal
            footer={null}
            onCancel={() => setOpen(false)}
            classNames={modalClassNames}
            centered
            open={open}
            closeIcon={<CloseIcon />}
        >
            <Steps step={1}></Steps>
            <div className="text-center flex flex-col justify-center items-center h-[300px] max-md:h-[260px]">
                <p className="text-2xl max-md:text-lg text-center pr-6  max-md:pt-0 font-semibold max-w-[80%] mx-auto">是否已 {price} See
                    <br />购买广告牌30天的使用权</p>
                <Button loading={isPending} type="primary" className='w-[288px] h-[48px] mt-10 max-md:mt-8 text-sm' onClick={comfirmBuy}>{price} See/Buy</Button>
            </div>
        </Modal>

        <Modal
            footer={null}
            onCancel={() => setPriceOpen(false)}
            classNames={modalClassNames}
            centered
            open={priceOpen}
        >
            <Steps step={2}></Steps>
            <div className="text-center flex flex-col justify-center items-center max-w-[288px] mx-auto h-[300px] max-md:h-[300px]">
                <h3 className='text-center text-lg max-lg:text-lg font-semibold'>设置广告牌售出价</h3>
                <Input value={selPrice} onInput={(e) => setSelPrice(e.currentTarget.value)} className={`rounded  text-black !bg-[#F6F6F6] py-0 mt-4 h-8 border-0 text-lg max-md:text-lg max-md:h-8 `}
                    suffix={<span className='text-black text-opacity-20 text-base'>See</span>} />

                {isSuccess ? <p className='text-black text-opacity-70 mt-4  max-lg:text-sm'>
                    当前质押余额： {funds?.result ? formatEther(funds?.result as bigint) : 0} see <br />
                    需质押 {totalUsageFee ? formatEther(totalUsageFee as bigint) : 0} see<br />
                    <span className="md:text-nowrap">每天使用费：{usagefee?.result ? formatEther(usagefee?.result as bigint) : 0} see</span>
                </p> : <div className='animate-pulse mt-2.5'>
                    <div className="h-4 bg-gray-200 rounded-full mb-2.5"></div>
                    <div className="h-4 bg-gray-200 rounded-full mb-2.5"></div>
                    <div className="h-4 bg-gray-200 rounded-full"></div>
                </div>}
                <Button loading={isPending} type="primary" className='w-full mt-8 max-md:mt-8 text-sm' onClick={submitPrice}>下一步</Button>
            </div>
        </Modal>

        <Deposit depositOpen={depositOpen} setDepositOpen={setDepositOpen}
            errorCb={() => setPriceOpen(true)} totalUsageFee={totalUsageFee ? formatEther(totalUsageFee as bigint) : "0"}></Deposit>

    </>
}

export default function Purchase() {
    const { data: session } = useSession();
    const [openBuy, setOpenBuy] = useState(false)
    const [depositOpen, setDepositOpen] = useState(false)
    const { isPending, data, isSuccess } = useReadContracts({
        contracts: [{
            ...contractMsg,
            functionName: 'getShdDetails',
            args: ['0']
        }, {
            ...contractMsg,
            functionName: 'checkShdKeeperUsageTime',
            args: ['0']
        }]

    })

    const [details, usageTime] = data || []

    // const [billboard, setBillboard] = useState<IAdvertise>()
    // const init = async () => {

    //     await getAuditAdvertise().then(res => {
    //         setBillboard(res[0])
    //     })
    // }
    // useEffect(() => {
    //     init()
    // }, [])
    const isShdOwner = useMemo(() => (details?.result as IShdDetails)?.keeper === session?.address, [details?.result, session?.address])

    const buyButton = <>
        {
            isShdOwner ?
                <Button block className={style.button} type="primary" onClick={() => setDepositOpen(true)} >去质押</Button> :
                <Button block className={style.button} type="primary" onClick={() => setOpenBuy(true)} >购买</Button>
        }</>

    const priceItem = <p className="text-purple text-2xl max-sm:text-lg"> {formatEther((details?.result as IShdDetails)?.price || BigInt(0))} <span className='text-sm max-lg:text-sm'>See</span></p>
    return (

        <main>
            <h1 className="lg:text-[32px] lg:static lg:text-center lg:pb-10 lg:pt-[50px] w-full z-30 top-0 sticky text-xl h-14 flex items-center justify-center max-lg:backdrop-blur-md max-lg:bg-mh max-lg:shadow-2xl">购买广告</h1>
            <div className={`max-w-[1400px] max-2xl:mx-36 max-lg:mx-[5%] max-sm:mx-[15px] flex-col lg:justify-center m-auto pb-44 lg:pb-52  max-lg:mt-5 `}>

                {/* <div className="max-w-[1400px]"> */}
                {isSuccess ?
                    <> <div className={`${style.purItem} bg-white rounded-lg p-5 max-sm:p-3 `}>
                        <div className='flex lg:items-center'>

                            <picture className='max-lg:mr-4 max-sm:flex-shrink-0'>
                                <source media="(max-width: 1024px)" srcSet="/images/ad_m.png" />
                                <img className="w-full" src="/images/ad_pc.png" alt='' />
                            </picture>


                            <div className='ml-6 max-sm:ml-0 relative max-w-[434px] max-xl:w-[300px] lg:flex-shrink-0 lg:self-start'>
                                <div className='flex items-center justify-between'>
                                    <h3 className='text-2xl font-semibold max-lg:text-lg max-lg:!mt-0 max-lg:!mb-3'>一块广告牌</h3>
                                    <div className='max-lg:hidden'>{priceItem}</div>
                                </div>
                                <div className={style.desc}>

                                    <div className={style.descItems}>
                                        <span className={style.left}>展示开始日期： </span>
                                        <span className={style.right}>{(details?.result as IShdDetails)?.keeperReceiveTime ? dayjs((details?.result as IShdDetails)?.keeperReceiveTime?.toString()).format('YY /MM/DD') : '--'}</span>
                                    </div>
                                    <div className={style.descItems}>
                                        <span className={style.left}>展示结束日期： </span>
                                        <span className={style.right}>{usageTime?.result ? dayjs(usageTime?.result?.toString()).format('YY/MM/DD') : '--'}</span>
                                    </div>
                                    <div className={`${style.descItems} max-lg:flex-col`}>
                                        <span className={`${style.left} ml-0`}>购买人： </span>
                                        <div className={`${style.right} max-lg:mt-[6px] max-w-[40vw]`}>
                                            <Avatar address={(details?.result as IShdDetails)?.keeper} className="!size-6" />
                                            <span className="text-xs"><SuffixText content={(details?.result as IShdDetails)?.keeper}></SuffixText></span>
                                        </div>
                                    </div>

                                </div>

                                <div className="lg:hidden absolute bottom-0 left-0">{priceItem}</div>
                                <div className='max-lg:hidden'>{buyButton}</div>
                            </div>
                        </div>

                        <div className='lg:hidden'>{buyButton}</div>
                    </div>


                        {/* </div> */}
                        <Buy depositOpen={depositOpen} setDepositOpen={setDepositOpen}
                            open={openBuy} setOpen={setOpenBuy}
                            price={formatEther((details?.result as IShdDetails)?.price || BigInt(0))}>
                        </Buy>
                    </>
                    : <Loading />

                }
                <div className='bg-white rounded-lg p-5 w-full mt-5'>
                    <h3 className='text-xl font-semibold text-black text-center pt-2 pb-6 max-md:pb-3 max-md:text-sm'>历史价格 (see)</h3>
                    <PricesChart></PricesChart>
                </div>

            </div  >
        </main >
    )
}


const Loading = () => {
    return <div className="bg-gray-100">
        <div className="mx-auto bg-white rounded-lg p-4">
            {/* <!-- Image Section --> */}
            <div className="w-full h-80 bg-gray-200 animate-pulse rounded-lg"></div>

            {/* <!-- Info Section --> */}
            <div className="flex justify-between items-center mt-4">
                <div className="w-1/2">
                    <div className="h-4 bg-gray-200 animate-pulse rounded w-1/3 mb-2"></div>
                    <div className="h-4 bg-gray-200 animate-pulse rounded w-1/4 mb-2"></div>
                    <div className="h-4 bg-gray-200 animate-pulse rounded w-1/4"></div>
                </div>
                <div className="w-1/2 text-right">
                    <div className="h-4 bg-gray-200 animate-pulse rounded w-1/3 mx-auto"></div>
                    <div className="h-8 bg-gray-200 animate-pulse rounded w-1/4 mx-auto mt-2"></div>
                </div>
            </div>
        </div>


    </div >
}

// 定义价格更新事件的类型
interface IChartData {
    prices: string[];
    dates: string[];
}
const PricesChart: React.FC = () => {
    const [loading, setLoading] = useState(true)
    const [data, setDate] = useState<IChartData>()
    const chartRef = useRef(null);
    const chartInstance = useRef<echarts.ECharts>()

    useUnmount(() => {
        chartInstance.current?.dispose()
    });
    useMount(() => {
        window.onresize = function () {
            chartInstance.current?.resize();
        }
    })
    // const publicClient = usePublicClient(); // 使用 usePublicClient 获取 provider

    // 获取过去的 PriceUpdate 事件
    const fetchPastEvents = async () => {
        const provider = new ethers.providers.Web3Provider(window.ethereum)
        const contract = new ethers.Contract(contractMsg.address, contractMsg.abi, provider);
        const events = await contract.queryFilter('PriceUpdate', 0, 'latest');
        const prices: string[] = []
        const dates: string[] = []
        events.forEach((event => {

            prices.push(event.args?.newPrice ? formatEther(event.args?.newPrice) : '0')
            // console.log(parseInt(event.args?.priceUpdateTime))
            dates.push(event.args?.priceUpdateTime ? getMouth(parseInt(event.args.priceUpdateTime)) : '--')
        }));
        setDate({ prices, dates })
        return { prices, dates }
    };

    const drawChart = (prices: string[], dates: string[]) => {
        // console.log(prices, dates)
        let grid = {
            x: 100,
            y: 40,
            x2: 60,
            y2: 50
        }, symbolSize = 12
        if (document.body.clientWidth < 1080) {
            grid = {
                x: 40,
                y: 10,
                x2: 20,
                y2: 40
            }
            symbolSize = 8
        }
        chartInstance.current = echarts.init(chartRef.current);
        const option = {
            // title: {
            //     text: '历史价格 (see)',
            //     left: 'center',
            //     top: 'top',
            // },
            tooltip: {
                trigger: 'axis',
                backgroundColor: '#fff',
                borderColor: '#EDEDED',
                borderWidth: 0.5,
                borderRadius: 4,
                shadowColor: "gba(0, 0, 0, 0.13)",
                shadowOffsetX: "0px",
                shadowOffsetY: "0.422794px",
                shadowBlur: "13.5294px",
                padding: 5,
                width: 140,
                height: 76,
                // boxShadow: "0px 0.422794px 13.5294px rgba(0, 0, 0, 0.13)",
                textStyle: {
                    color: '#000',
                    size: 12
                },
                formatter: function (params: any) {
                    const { data, name } = params[0];
                    return `<div style="width: 140px; text-align:center;">
                    <p>${data} See</p>
                    <p style="color: #7D7B7B">
                    ${name}. price: ${data} See<br/>
                    Num. sales: 1
                    </p>
                    </div>`;
                },
                axisPointer: {
                    type: 'none', // 去掉标线
                }
            },
            xAxis: {
                type: 'category',
                boundaryGap: false,
                // data: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
                data: dates,
                axisTick: {
                    show: false, // 去掉标尺
                },
                axisLabel: {//x轴文字的配置
                    show: true,
                    textStyle: {
                        color: "#000",
                        fontSize: "14px",
                    },
                    margin: 20
                },
                axisLine: {
                    lineStyle: {
                        color: '#e0e0e0'
                    }
                }
            },
            yAxis: {
                type: 'value',
                axisLine: {
                    show: false,
                },
                axisTick: {
                    show: false,
                },
                splitLine: {
                    lineStyle: {
                        color: '#f5f5f5'
                    }
                },
                axisLabel: {//x轴文字的配置
                    show: true,
                    margin: 20,
                    textStyle: {
                        color: "#000",
                        fontSize: "14px"
                    }
                },
            },
            series: [
                {
                    symbol: 'circle',
                    symbolSize: symbolSize,
                    showSymbol: false,
                    itemStyle: {
                        normal: {
                            color: 'rgba(102, 102, 255,1)',
                            borderColor: 'rgba(255, 255, 255, 1)',
                            borderWidth: 2
                        }
                    },
                    name: 'Price',
                    type: 'line',
                    // data: [820, 932, 901, 934, 1290, 1330],
                    data: prices,
                    lineStyle: {
                        color: 'rgba(102, 102, 255, 0.8)'
                    },
                }
            ],
            grid: grid,
        };
        chartInstance.current.setOption(option);
    }
    useEffect(() => {
        fetchPastEvents().then(({ prices, dates }) => {
            setLoading(false)
            drawChart(prices, dates)
        })
    }, [])
    return (
        <>
            <div className="mt-6 bg-white p-5" style={{ "display": loading ? "block" : "none" }}>
                {/* <div className="h-4 bg-gray-200 animate-pulse rounded w-1/3 mb-2"></div> */}
                <div className="h-80 bg-gray-200 animate-pulse rounded-lg"></div>
            </div>
            <div ref={chartRef} className="w-full h-[253px] lg:h-[400px]"></div>
        </>)
};

