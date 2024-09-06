
import { useEffect, useMemo, useState } from 'react';
import Back from '@/components/Back';
import { Button, Image, Spin, Table, Typography } from 'antd';
import { useSessionStorageState, useLocalStorageState } from 'ahooks';
import type { TableProps } from 'antd';
import { ArrawIcon } from '~/icons';
import { getAuditAdvertise } from '@/services';
import { AUD_STATUS, IAdvertise, AUD_STATUS_TEXT, Tabs, UserInfo, IListRes } from '@/types/response';
import SuffixText from '@/components/SuffixText';
import { useRouter } from 'next/router';
import dayjs from 'dayjs';
import IndexMobile from './components/IndexMobie';
import { useRequest } from 'ahooks';
import { LoadingOutlined } from '@ant-design/icons';
type GetAudParamsType = {
    page: number,
    audstatus?: number
}
export const emptyText = <p className="h-[calc(100vh-180px)] max-w-[203] m-auto flex items-center justify-center">暂无申请记录，快去首页购买广告进行配置吧</p>

const History = () => {
    const [data, setData] = useState<IAdvertise[]>([])
    const [total, setTotal] = useState<number>(0)
    const [page, setPage] = useState<number>(1)
    const PageSize = 10
    function getAuditPage(params: GetAudParamsType | number): Promise<IListRes> {
        let newParams: GetAudParamsType
        if (typeof params !== 'object') {
            newParams = { page: params }
            if (currTab !== AUD_STATUS.all) {
                newParams.audstatus = currTab
            }
        } else {
            newParams = params
        }

        return getAuditAdvertise({ ...newParams, size: PageSize })

    }
    const { loading, run } = useRequest(getAuditPage, {
        manual: false,
        onSuccess: (result, params) => {
            let p0 = params[0]
            const page = typeof p0 === "object" ? p0?.page : p0
            setPage(page || 1)
            setData(result.results as IAdvertise[])
            setTotal(result.count)
        }
    })

    const [info] = useLocalStorageState<UserInfo>('user-info');
    const { Paragraph } = Typography;
    const router = useRouter()

    const [currTab, setCurrTab] = useState<AUD_STATUS>(AUD_STATUS.all)
    const [_, setStorageDetail] = useSessionStorageState<IAdvertise | {}>(
        'sui-banner-history-detail',
        { defaultValue: {} },
    );

    const handleDetail = (detail: IAdvertise) => {
        setStorageDetail({ ...detail, page: page, status: currTab })
        router.push(`/ad/history/detail`)
    }

    const haneldChangeTab = (key: AUD_STATUS) => {
        setCurrTab(key)
        const params: GetAudParamsType = { page }
        if (key !== AUD_STATUS.all) {
            params.audstatus = key
        }
        run(params)
    }


    const columns: TableProps<IAdvertise>['columns'] = [
        {
            title: '订单号',
            dataIndex: 'id',
            key: 'id',
        },
        {
            title: '提交时间',
            dataIndex: 'createdate',
            key: 'createdate',
            render: (_, { createdate }) => dayjs(createdate).format('YYYY-MM-DD')
        },
        {
            title: '用户信息',
            dataIndex: 'useraddr',
            key: 'useraddr',
            render: (_, { useraddr }) => {
                return <SuffixText content={useraddr}>useraddr</SuffixText>
            }
        },
        {
            title: '申请留言',
            dataIndex: 'useraddr',
            key: 'useraddr',
            render: (_, { applymsg }) => (
                <div className="w-52">
                    <Paragraph ellipsis={{ rows: 3 }}>
                        {applymsg}
                    </Paragraph>
                </div>
            )
        },
        {
            title: '审核留言',
            dataIndex: 'useraddr',
            key: 'useraddr',
            render: (_, { audmsg }) => (
                <div className="w-52">
                    <Paragraph ellipsis={{ rows: 3 }}>
                        {audmsg}
                    </Paragraph>
                </div>
            )
        },
        {
            title: '审核状态',
            dataIndex: 'audstatus',
            key: 'audstatus',
            render: (_: any, { audstatus }: { audstatus: AUD_STATUS }) => (
                <span className={audstatus === AUD_STATUS.fail ?
                    'text-red' : audstatus === AUD_STATUS.success ?
                        'text-green' : 'text-black'}>
                    {AUD_STATUS_TEXT[audstatus]}</span>
            )
        },
    ];

    if (info?.auditor) {
        columns.push(
            {
                title: '操作',
                key: 'action',
                align: 'center',
                render: (_: any, record: IAdvertise, index: number) => {
                    return (
                        <div className="cursor-pointer w-[170px]" onClick={() => handleDetail(record)}>
                            {
                                record.audstatus === AUD_STATUS.pending ?
                                    <span className="text-purple hover:text-opacity-70" >去审核</span> :
                                    <span className="text-black hover:text-opacity-70" >去查看</span>
                            }
                        </div>
                    )
                },
            },
        )
    }

    return (
        <main >
            {<div className="2xl:max-w-[1400px] 2xl:m-auto lg:mx-40  lg:my-0 md:mx-0 relative z-10">

                {/* pc 端 */}
                <div className='max-lg:hidden'>
                    <Back text={<>历史申请记录<span className='text-black text-opacity-60 text-2xl'>（{total}）</span></>} isNotifi={false}></Back>

                    <div className='flex items-center my-8 max-md:flex-wrap max-md:my-4'>
                        {Tabs.map((item, index) => (
                            <p onClick={() => haneldChangeTab(item.key)}
                                className={`mr-4 max-md:mb-2 rounded-[47px] px-5 py-[6px] h-10 text-lg cursor-pointer ${item.key === currTab ? ' bg-purple text-white' : "bg-white text-black"}`}
                                key={item.label}>{item.label}</p>
                        ))}
                    </div>
                    {data.length ? <>

                        <Table locale={{ emptyText: emptyText }} pagination={{ total, onChange: run }} loading={loading} className="rounded-t-xl overflow-hidden " scroll={{ x: '1200px' }} rowClassName="bg-white px-20" dataSource={data} columns={columns}></Table></> : emptyText}
                </div>


                {/* 移动端 */}

                <div className='lg:hidden '>
                    <Spin spinning={loading} indicator={<LoadingOutlined spin />}>
                        < IndexMobile data={data} pageChange={run} total={total} handleDetail={handleDetail} setCurrTab={haneldChangeTab} currTab={currTab} />
                    </Spin>
                </div>

            </div>}
        </main >
    )
}


export default History
/* 审核留言 */
