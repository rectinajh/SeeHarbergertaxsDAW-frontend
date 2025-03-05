import React, { useCallback, useEffect, useState } from 'react'
import type { UploadProps, } from 'antd';
import { message, Upload, Button, Input, Image } from 'antd';
import { PlusIcon, Step1Icon, Step2Icon, Step3Icon, MStep1Icon, MStep2Icon, MStep3Icon, SuccessIcon } from '~/icons';
import { CloseOutlined } from '@ant-design/icons';
import style from './image.module.scss';
import Back from '@/components/Back';
import NotifAlert from '@/components/NotifAlert';
import { addAdvertise } from '@/services';
import { getCsrfToken, useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import { useSignMessage } from 'wagmi'
import { CtxOrReq } from 'next-auth/client/_utils';
import { error } from 'console';


const STEPS = [
    {
        title: "step1",
        lable: "PC端图片上传"
    },
    {
        title: "step2",
        lable: "手机端图片上传"
    },
    {
        title: "step3",
        lable: "审核附注"
    }
]
const { Dragger } = Upload;



export function StepsIcon({ index, isMobile, ...props }: { index: number, isMobile?: boolean, className?: string }): React.ReactElement {
    const icons = [Step1Icon, Step2Icon, Step3Icon];
    const micons = [MStep1Icon, MStep2Icon, MStep3Icon]

    index = index <= 0 ? 0 : index
    let IconComponent = icons[index];
    if (isMobile) {
        IconComponent = micons[index];
    }

    return <IconComponent {...props} />;
}
export default function Images({ csrfToken }: { csrfToken: string }) {
    const { data: session } = useSession();
    const { signMessageAsync } = useSignMessage();
    const router = useRouter()
    const [currStep, setCurrStep] = useState<number>(0)
    const [note, setNote] = useState<string>('')

    const [imgUrls, setImgUrls] = useState<string[]>([])


    const props: UploadProps =
    {
        name: 'image',
        multiple: false,
        action: `${process.env.NEXT_PUBLIC_API_BASE_URL}/v1/image/`,
        data: { type: currStep },
        listType: 'picture',
        accept: "image/png, image/jpeg",
        maxCount: 1,
        beforeUpload: (file) => {

            if (file.size > 5 * (1024 ** 2)) {
                message.error("上传的图片大小必须小于5M")
                return false
            }
            return true
        },
        onChange(info) {
            const { status } = info.file;
            if (status !== 'uploading') {
            }
            if (status === 'done') {
                console.log(currStep, 1, info.file.response.image)
                setImgUrls(prev => {
                    let arr = [...prev]
                    arr[currStep] = info.file.response.image
                    return arr
                })
                message.success(`${info.file.name} 上传成功!`);
            } else if (status === 'error') {
                message.error(`${info.file.name} 上传失败.`);
            }
        },
        onDrop(e) {
            console.log('Dropped files', e.dataTransfer.files);
        },
    };


    const [notifShow, setNotifShow] = useState(false)


    const handleNext = useCallback(() => {
        setCurrStep(prev => prev + 1)
    }, [setCurrStep])


    const handlePrev = useCallback(() => {
        setCurrStep(prev => prev - 1)
    }, [setCurrStep])

    const handleDelte = () => {
        setImgUrls(prev => {
            console.log(prev)
            return [...prev.splice(currStep, 1)]
        })
    }
    const handleSubmit = () => {
        // console.log(document.)
        signMessageAsync({ message: `useraddr:${session?.address}\npcimage:${imgUrls[0]}\nmobimage:${imgUrls[1]}\napplymsg:${note}` }).then(res => {
            addAdvertise({ useraddr: session?.address, usersignature: res, applymsg: note, pcimage: imgUrls[0], mobimage: imgUrls[1] }
            ).then((res: any) => {
                setNotifShow(true)
                setTimeout(() => {
                    router.push('/ad')
                }, 2000)
            }).catch(error => {
                message.error(error.toString())
            })
        }).catch(error => {
            message.error(error.shortMessgae)
        })
    }

    return (
        <main className='ad inset w-full overflow-hidden relative'>
            <div className={`md:w-[816px] w-11/12 m-auto overflow-hidden text-white  relative z-[1] ${style.ad}`}>

                <Back text="图片配置" >
                    {currStep > 0 && <span className='text-xl' onClick={handlePrev}>上一步</span>}
                </Back>

                <div className='mt-8 relative'>
                    <div className='absolute flex items-center w-full lg:mx-4 z-10 mx-1'>
                        {STEPS.map((item, index) => (
                            <div className={`lg:w-1/3 px-2 py-3 cursor-pointer mt-1 ${currStep === index ? 'text-purple' : 'text-white'} ${index === 2 ? 'w-[22.6%]' : 'w-[37.6%]'}`} key={item.title}>
                                <p className={`${currStep === index ? 'text-purple' : 'text-white'} text-xs text-opacity-60`}>{item.title}</p>
                                <p className='text-sm mt-1'>{item.lable}</p>
                            </div>
                        ))}
                    </div>
                    <StepsIcon index={currStep} className='max-md:hidden' />
                    <StepsIcon index={currStep} isMobile={true} className="md:hidden w-full max-md:-translate-x-1" />
                </div>
                <div className='w-full lg:h-[468px] bg-purple_sub max-lg:bg-[#FAFBFF] flex items-center rounded-md  overflow-hidden justify-center border-[#A9A6FF] drop-shadow-md '>
                    {
                        currStep === 0 && (
                            <>
                                {imgUrls[0] ? <div className='relative w-full h-[200px] overflow-hidden'>
                                    <Button onClick={handleDelte} className="absolute top-3 right-3 z-10" size="small" type="primary" shape="circle" icon={<CloseOutlined />} />
                                    <Image className="w-full h-[200px]" src={`${process.env.NEXT_PUBLIC_API_BASE_URL}${imgUrls[0]}`} alt="pc img"></Image>
                                </div> :
                                    <Dragger {...props} className={`w-full h-[200px] text-center lg:bg-white block border-none ${style.upload}`}>

                                        <p className="text-purple inline-block">
                                            <PlusIcon></PlusIcon>
                                        </p>
                                        <p className=" text-center text-base text-black mt-2 max-lg:text-opacity-45 max-lg:text-sm">
                                            建议上传比例？？图片，<br />
                                            图片小于5M
                                        </p>
                                    </Dragger>}</>

                        )
                    }


                    {
                        currStep == 1 && (
                            <>
                                {imgUrls[1] ? <div className='relative lg:h-full lg:w-[300px] w-full h-[122.36vw]'>
                                    <Button onClick={handleDelte} className="absolute top-3 right-3 z-10" size="small" type="primary" shape="circle" icon={<CloseOutlined />} />
                                    <Image src={`${process.env.NEXT_PUBLIC_API_BASE_URL}${imgUrls[1]}`} alt="pc img" style={{ height: "100%", width: 'auto' }}></Image>
                                </div> :
                                    <Dragger {...props} className={`lg:h-full lg:w-[300px] w-full h-[122.36vw] text-center bg-white max-lg:bg-[#FAFBFF] block border-none ${style.upload}`}>

                                        <p className=" text-purple inline-block">
                                            <PlusIcon ></PlusIcon>
                                        </p>
                                        <p className=" text-center text-base text-black mt-2 max-lg:text-opacity-45 max-lg:text-sm">
                                            建议上传比例？？图片，<br />
                                            图片小于5M
                                        </p>
                                    </Dragger>
                                }</>
                        )
                    }

                    {
                        currStep == 2 && (
                            <div className={`w-full h-[122.36vw] bg-[#F6F7F8] lg:w-full lg:h-full  lg:bg-purple_sub relative rounded-md text-black border border-[#A9A6FF] overflow-hidden`}>
                                <textarea value={note} onInput={e => { setNote(e.currentTarget.value) }}
                                    className={`w-full h-full p-[22px]  `} style={{ height: "100%", resize: "none" }}></textarea>
                                {!note && <p className='absolute top-[22px] left-[22px] z-10 text-[#000] text-opacity-20'>
                                    本项目是XXXX <br />
                                    联系方式为1234567890
                                </p>}
                            </div>
                        )
                    }
                </div>

                {currStep < 2 ?
                    <Button block disabled={!imgUrls[currStep]} className='h-12 lg:h-14 text-purple rounded-lg border-none mt-8 bg-white' onClick={handleNext}>下一步</Button> :
                    <Button block disabled={!note} type="primary" className="h-11 lg:h-14 rounded-lg flex-shrink-0 mt-8" onClick={handleSubmit}>提交</Button>}
            </div>
            <NotifAlert show={notifShow} setShow={setNotifShow}>
                <SuccessIcon className="inline-block" />
                <p className='mt-[6px]'>提交成功</p>
            </NotifAlert>
        </main >
    )


}
