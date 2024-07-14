import React, { ReactNode } from 'react'
import { Button, notification, Space } from 'antd';
import { BackIcon } from '~/icons';
import { useRouter } from 'next/router';

type Props = {
    children?: ReactNode | null,
    text: ReactNode | string,
    isNotifi?: boolean,
    backRoute?: any
}
const Back = ({ children, text, isNotifi = true, backRoute }: Props) => {

    const router = useRouter()

    const comfimBack = () => {
        backRoute ? router.push(backRoute) : router.back();
    }
    const openNotification = () => {
        const key = `open${Date.now()}`;
        const handleBack = () => {
            notification.destroy(key)
            comfimBack()
        }
        const btn = (
            <Space>
                <Button type="link" size="small" onClick={() => notification.destroy(key)}>
                    取消
                </Button>
                <Button type="primary" size="small" onClick={handleBack}>
                    确认
                </Button>
            </Space>
        );
        notification.open({
            message: '提示',
            description:
                '退出页面,您所填写的信息会丢失!',
            btn,
            key
        });
    }
    return (
        <div className="cursor-pointer flex justify-between items-center lg:pt-[60px] max-lg:pt-10 relative  ">
            <h1 className='flex items-center '>
                <BackIcon className="lg:size-8 size-6 relative" onClick={isNotifi ? openNotification : comfimBack} />
                <span className='lg:ml-4 lg:text-[32px] text-xl max-lg:text-center max-lg:absolute max-lg:w-full -z-10' >{text}</span>
            </h1>
            {children}
        </div>
    )
}

export default Back