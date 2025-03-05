import React, { useEffect, useMemo, useState } from 'react'
import { useSessionStorageState, useMount, useUnmount, useLocalStorageState, useRequest } from 'ahooks';
import { Image, Button, message } from 'antd';
import dayjs from 'dayjs';
import SuffixText from '@/components/SuffixText';
import Back from '@/components/Back'
import { IAdvertise, AUD_STATUS_TEXT, AUD_STATUS, UserInfo, ILinks, IListRes } from '@/types/response';
import { useSession } from "next-auth/react"
// import { CtxOrReq } from 'next-auth/client/_utils';
import { auditAdvertise, getAuditAdvertise } from '@/services';
import { useSignMessage } from 'wagmi'
import DetailMobile from './components/DetailMobile';
import { LeftIcon, RightIcon, SuccessIcon } from '@/public/icons';
import NotifAlert from '@/components/NotifAlert';

export enum DIRECTION {
    left = -1,
    right = 1
}

const Detail = () => {
    const { signMessageAsync, isSuccess, data: usersignature } = useSignMessage();
    const [status, setStatus] = useState<AUD_STATUS>()
    // const [detail, setDetail] = useState<IAdvertise>()
    const [links, setLinks] = useState<ILinks>()
    const [currPage, setPage] = useState<number>(1)
    const [dir, setDir] = useState<DIRECTION>()
    const { data: session } = useSession()
    const [storageDetail] = useSessionStorageState<IAdvertise>(
        'sui-banner-history-detail'
    );
    const [list, setList] = useState<IAdvertise[]>([])
    const [currIndex, setCurrIndex] = useState<number>(0)

    const [info] = useLocalStorageState<UserInfo>('user-info');
    const [reason, setReason] = useState('')
    useEffect(() => {
        if (storageDetail) {
            setPage(storageDetail.page || 1)
            run(storageDetail.page!);
            (storageDetail).audmsg && setReason((storageDetail).audmsg)
        }
    }, [])


    const currDetail = useMemo(() => list[currIndex], [currIndex, list])
    const dirDisabled = useMemo(() => ({
        [DIRECTION.left]: !links?.previous && currIndex <= 0,
        [DIRECTION.right]: !links?.next && currIndex >= list.length - 1
    }), [currIndex, links?.next, links?.previous, list.length])

    function getAdPage(page: number, direction?: DIRECTION, id?: number | string): Promise<IListRes> {
        console.log(page, 'page')
        let params: { size?: number, page?: number, audstatus?: AUD_STATUS, id?: number | string } = { size: 10, page }
        if (storageDetail?.status !== AUD_STATUS.all) {
            params.audstatus = storageDetail?.status
        }
        if (id) {
            params = { id }
        }

        return getAuditAdvertise(params)
    }
    const { loading, run } = useRequest(getAdPage, {
        manual: true,
        onSuccess: (result, params) => {
            // 存在id 只刷新当前
            if (params[2]) {
                console.log(result)
                setList((prev) => {
                    const newArr = [...prev]
                    // @ts-ignore (后端返回数据格式)
                    newArr.splice(currIndex, 1, result)
                    return newArr
                })

                return
            }
            setLinks(result.links)
            setPage(params[0] || 1)
            // 判断是第一次进来的时候需要定位到当前的index
            if (storageDetail?.page === params[0]) {
                const index = (result.results as IAdvertise[]).findIndex(item => item.id === storageDetail?.id)
                setCurrIndex(index)
            }
            // 页面切换 加载到了下一页 后 index 也要加一, params[2] 是id 有id 不判断切换
            if (params[1]) {
                params[1] === DIRECTION.left ? setCurrIndex(prev => prev - 1) : setCurrIndex(prev => prev + 1)
            }

            setList((prev) => prev.concat(result.results))
        }
    })

    useEffect(() => {
        setTimeout(() => {
            dir && setDir(undefined)
        }, 1000)
    }, [dir])
    const calculateIndex = (direction: DIRECTION, index: number) => {
        if (direction === DIRECTION.left) {
            console.log(index, 'currIndex prev')
            if (index > 0) {
                return index - 1
            } else {
                // 已经到了列表的最左边需要切换上一页面才可以了
                if (links?.previous) {
                    run(currPage - 1)
                }
                return index
            }

        } else {
            // console.log(index, 'currIndex prev')
            // console.log(index, list.length - 1)
            if (index < list.length - 1) {
                return index + 1
            } else {
                if (links?.next) {
                    console.log(currPage)
                    run(currPage + 1, direction)
                }
                return index
            }
        }
    }
    const changeCurr = (direction: DIRECTION, index: number) => {
        !dirDisabled[direction] && setDir(direction)
        let newIndex = calculateIndex(direction, index)
        setCurrIndex(newIndex)
    }

    const handleAudit = (status: AUD_STATUS) => {
        setStatus(status)
        if (!currDetail) return
        signMessageAsync({ message: `id:${currDetail.id}\npcimage:${currDetail.pcimage}\nmobimage:${currDetail.mobimage}\naudstatus:${status}\naudmsg:${reason}` }).then(res => {
            console.log(res, 'audsignature')
            auditAdvertise({
                id: currDetail.id, data: {
                    useraddr: session?.address,
                    pcimage: currDetail.pcimage,
                    mobimage: currDetail.mobimage,
                    audstatus: status,
                    audsignature: res,
                    audmsg: reason
                }
            }).then(res => {
                run(-1, undefined, currDetail.id)
                setNotifShow(true)
            })
        }).catch(error => {
            message.error(error.shortMessage)
        })
    }

    const [notifShow, setNotifShow] = useState(false)
    return (
        <main>
            {currDetail && <>
                <div className="2xl:m-auto 2xl:max-w-[1260px] lg:mx-40 lg:my-0 md:mx-0 ">
                    <div className='w-full max-lg:mx-4'>
                        <Back className="max-lg:pt-2" isNotifi={false} text={<>订单号{currDetail?.id}
                            <span className='text-base text-black text-opacity-60'>（{AUD_STATUS_TEXT[currDetail.audstatus]}）</span></>}></Back></div>
                    {/* <Button onClick={() => run(-1, undefined, currDetail.id)}>shuaix</Button> */}
                    <div className='flex items-center w-full max-lg:hidden '>
                        <LeftIcon className={`cursor-pointer  ${dirDisabled[DIRECTION.left] ? 'opacity-30 cursor-not-allowed' : 'opacity-100'}`} onClick={() => changeCurr(DIRECTION.left, currIndex)}></LeftIcon>
                        <div className={`rounded-xl bg-white overflow-hidden mt-8 flex-1 ${dir ? `animate-[${dir === DIRECTION.right ? 'toggleRight' : 'toggleLeft'}_1s_ease-in-out_infinite]` : ''}`}>
                            <div className={`${currDetail?.audstatus === AUD_STATUS.pending ? 'bg-[#2C2B50]' : currDetail?.audstatus === AUD_STATUS.fail ? 'bg-orange' : 'bg-green'} p-5 flex items-center justify-between  flex-wrap`}>
                                <div className=''>
                                    <span className='text-white text-opacity-60 w-14'>订单号</span>
                                    <span className='text-white ml-5'>{currDetail?.id}</span>
                                </div>
                                <span className="block w-[1px] h-4 bg-white bg-opacity-50"></span>
                                <div className=''>
                                    <span className='text-white text-opacity-60 w-14'>提交时间</span>
                                    <span className='text-white ml-5'>{dayjs(currDetail?.createdate).format('YYYY-MM-DD')}</span>
                                </div>
                                <span className="block w-[1px] h-4 bg-white bg-opacity-50"></span>
                                <div className=''>
                                    <span className='text-white text-opacity-60 w-14'>审核状态</span>
                                    <span className='text-white ml-5'>{AUD_STATUS_TEXT[currDetail?.audstatus! || 0]}</span>
                                </div>
                                <span className="block w-[1px] h-4 bg-white bg-opacity-50"></span>
                                <div className=''>
                                    <span className='text-white text-opacity-60 w-14'>用户信息</span>
                                    <span className='text-white ml-5'><SuffixText content={currDetail?.useraddr || ''}>useraddr</SuffixText></span>
                                </div>
                            </div>

                            <div className='flex w-full'>
                                <div className='border-r border-r-gray-light max-w-[826px] w-full'>
                                    <div className='flex p-5 text-black text-opacity-70 text-sm'>
                                        <div className=''>
                                            <p className='mb-3'>手机端图片</p>
                                            <Image fallback="/images/image_err.png" src={process.env.NEXT_PUBLIC_API_BASE_URL + currDetail.mobimage} alt='' className="max-h-[319px]"></Image>
                                        </div>
                                        <div className='ml-5'>
                                            <p className='mb-3'>电脑端图片</p>
                                            <Image fallback="/images/image_err.png" src={process.env.NEXT_PUBLIC_API_BASE_URL + currDetail.pcimage} alt='' className="max-h-[319px]"></Image>
                                        </div>


                                    </div>
                                    <div className='border-t border-t-gray-light p-5 pr-9'>
                                        <p className='py-4'>申请留言</p>
                                        <textarea value={currDetail.applymsg} disabled className={`w-full h-[112px] p-[22px] bg-[#F4F4F4] rounded-xl`} style={{ resize: "none" }}></textarea>
                                    </div>
                                </div>

                                <div className='pl-5 pr-5 pb-5 flex-1 flex flex-col justify-between'>
                                    <p className='py-4'>审核留言</p>
                                    <textarea value={reason} disabled={currDetail.audstatus !== AUD_STATUS.pending || !(info as UserInfo).auditor} onInput={e => setReason(e.currentTarget.value)}
                                        placeholder='审核不通过必须写明原因' className={`flex-1 mb-4 text-sm max-w-[394px] w-full min-w-[300px] h-[112px] p-[22px] bg-[#F4F4F4] rounded-xl`} style={{ resize: "none" }}></textarea>
                                    <div className='flex items-center gap-4'>
                                        {(currDetail.audstatus === AUD_STATUS.success || currDetail.audstatus === AUD_STATUS.pending) &&
                                            <Button onClick={() => handleAudit(AUD_STATUS.success)} disabled={currDetail.audstatus !== AUD_STATUS.pending || !(info as UserInfo).auditor} type="primary" className='text-sm flex-1 rounded-lg bg-green hover:!bg-green hover:opacity-70 disabled:bg-green disabled:opacity-70 disabled:text-w'>同意</Button>}
                                        {(currDetail.audstatus === AUD_STATUS.fail || currDetail.audstatus === AUD_STATUS.pending) &&
                                            <Button onClick={() => handleAudit(AUD_STATUS.fail)} disabled={currDetail.audstatus !== AUD_STATUS.pending || !(info as UserInfo).auditor} type="primary" className='text-sm flex-1 rounded-lg' danger>不同意</Button>}
                                    </div>
                                </div>
                            </div>
                        </div>
                        <RightIcon className={`${dirDisabled[DIRECTION.right] ? 'opacity-30 cursor-not-allowed' : 'opacity-100 cursor-pointer'}`} onClick={() => changeCurr(DIRECTION.right, currIndex)}></RightIcon>
                    </div>
                </div>

                {/* 移动端 */}
                <div className='lg:hidden mt-2' key={currPage}>
                    <DetailMobile data={list} handleAudit={handleAudit} reason={[reason, setReason]}
                        links={links} run={run} currPage={currPage} currIndex={[currIndex, setCurrIndex]} currDetail={currDetail}
                    ></DetailMobile>
                </div>

            </>}

            {
                loading && <div className='fixed w-full h-full top-0 left-0 bg-black bg-opacity-60 flex items-center justify-center' >
                    <div className="w-40 h-40 rounded-2xl bg-white  flex flex-col items-center justify-center">
                        <svg className='animate-spin' width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M12 1.5C12.1989 1.5 12.3897 1.57902 12.5303 1.71967C12.671 1.86032 12.75 2.05109 12.75 2.25V6.75C12.75 6.94891 12.671 7.13968 12.5303 7.28033C12.3897 7.42098 12.1989 7.5 12 7.5C11.8011 7.5 11.6103 7.42098 11.4697 7.28033C11.329 7.13968 11.25 6.94891 11.25 6.75V2.25C11.25 2.05109 11.329 1.86032 11.4697 1.71967C11.6103 1.57902 11.8011 1.5 12 1.5ZM12 16.5C12.1989 16.5 12.3897 16.579 12.5303 16.7197C12.671 16.8603 12.75 17.0511 12.75 17.25V21.75C12.75 21.9489 12.671 22.1397 12.5303 22.2803C12.3897 22.421 12.1989 22.5 12 22.5C11.8011 22.5 11.6103 22.421 11.4697 22.2803C11.329 22.1397 11.25 21.9489 11.25 21.75V17.25C11.25 17.0511 11.329 16.8603 11.4697 16.7197C11.6103 16.579 11.8011 16.5 12 16.5ZM22.5 12C22.5 12.1989 22.421 12.3897 22.2803 12.5303C22.1397 12.671 21.9489 12.75 21.75 12.75H17.25C17.0511 12.75 16.8603 12.671 16.7197 12.5303C16.579 12.3897 16.5 12.1989 16.5 12C16.5 11.8011 16.579 11.6103 16.7197 11.4697C16.8603 11.329 17.0511 11.25 17.25 11.25H21.75C21.9489 11.25 22.1397 11.329 22.2803 11.4697C22.421 11.6103 22.5 11.8011 22.5 12ZM7.5 12C7.5 12.1989 7.42098 12.3897 7.28033 12.5303C7.13968 12.671 6.94891 12.75 6.75 12.75H2.25C2.05109 12.75 1.86032 12.671 1.71967 12.5303C1.57902 12.3897 1.5 12.1989 1.5 12C1.5 11.8011 1.57902 11.6103 1.71967 11.4697C1.86032 11.329 2.05109 11.25 2.25 11.25H6.75C6.94891 11.25 7.13968 11.329 7.28033 11.4697C7.42098 11.6103 7.5 11.8011 7.5 12ZM4.575 4.575C4.71565 4.4344 4.90638 4.35541 5.10525 4.35541C5.30412 4.35541 5.49485 4.4344 5.6355 4.575L8.82 7.758C8.95662 7.89945 9.03221 8.0889 9.03051 8.28555C9.0288 8.4822 8.94992 8.67031 8.81086 8.80936C8.67181 8.94842 8.4837 9.0273 8.28705 9.02901C8.0904 9.03071 7.90095 8.95512 7.7595 8.8185L4.575 5.6355C4.4344 5.49485 4.35541 5.30412 4.35541 5.10525C4.35541 4.90638 4.4344 4.71565 4.575 4.575ZM15.1815 15.1815C15.3221 15.0409 15.5129 14.9619 15.7118 14.9619C15.9106 14.9619 16.1014 15.0409 16.242 15.1815L19.425 18.3645C19.5616 18.506 19.6372 18.6954 19.6355 18.8921C19.6338 19.0887 19.5549 19.2768 19.4159 19.4159C19.2768 19.5549 19.0887 19.6338 18.8921 19.6355C18.6954 19.6372 18.506 19.5616 18.3645 19.425L15.1815 16.242C15.0409 16.1014 14.9619 15.9106 14.9619 15.7118C14.9619 15.5129 15.0409 15.3221 15.1815 15.1815ZM19.425 4.5765C19.5651 4.71708 19.6438 4.90749 19.6438 5.106C19.6438 5.30451 19.5651 5.49492 19.425 5.6355L16.242 8.82C16.1005 8.95662 15.9111 9.03221 15.7144 9.03051C15.5178 9.0288 15.3297 8.94992 15.1906 8.81086C15.0516 8.67181 14.9727 8.4837 14.971 8.28705C14.9693 8.0904 15.0449 7.90095 15.1815 7.7595L18.3645 4.5765C18.5051 4.4359 18.6959 4.35691 18.8948 4.35691C19.0936 4.35691 19.2844 4.4359 19.425 4.5765ZM8.8185 15.1815C8.9591 15.3221 9.03809 15.5129 9.03809 15.7118C9.03809 15.9106 8.9591 16.1014 8.8185 16.242L5.6355 19.425C5.49405 19.5616 5.3046 19.6372 5.10795 19.6355C4.9113 19.6338 4.72319 19.5549 4.58414 19.4159C4.44508 19.2768 4.3662 19.0887 4.36449 18.8921C4.36279 18.6954 4.43838 18.506 4.575 18.3645L7.758 15.1815C7.89865 15.0409 8.08938 14.9619 8.28825 14.9619C8.48712 14.9619 8.67785 15.0409 8.8185 15.1815Z" fill="black" />
                        </svg>
                        <p className="text-sm mt-2"> 加载中…</p>
                    </div>
                </div>
            }


            <NotifAlert show={notifShow} setShow={setNotifShow}>
                <SuccessIcon className="inline-block" />
                <p className='mt-[6px]'>提交成功</p>
            </NotifAlert>
        </main >
    )
}


export default Detail