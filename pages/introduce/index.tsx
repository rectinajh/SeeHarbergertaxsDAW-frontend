import React, { CSSProperties } from 'react'
import type { CollapseProps } from 'antd';
import { Collapse, theme } from 'antd';



const getItems: (panelStyle: CSSProperties) => CollapseProps['items'] = (panelStyle) => [
    {
        key: '1',
        label: <h3 className='text-2xl max-md:text-base px-1 pt-2 flex justify-between'><span>了解哈伯格税（Harberg tax）</span> </h3>,
        children: <p className='text-black break-words  max-md:text-sm  pt-5 text-opacity-80 p-2 border-t border-t-gray-light'>https://mp.weixin.qq.com/s/KTkMiKsWVdrmuP9IP1Wzyg</p>,
        style: panelStyle,
    },
    {
        key: '2',
        label: <h3 className='text-2xl max-md:text-base px-1 pt-2 flex justify-between'><span>关于一块广告牌</span></h3>,
        children: <p className='text-black  break-words max-md:text-sm pt-5 text-opacity-80 p-2 border-t border-t-gray-light'>https://mp.weixin.qq.com/s/KTkMiKsWVdrmuP9IP1Wzyg</p>,
        style: panelStyle,
    }
];

export default function Introduce() {

    const { token } = theme.useToken();

    const panelStyle: React.CSSProperties = {
        marginBottom: 24,
        padding: 0,
        background: "#fff",
        borderRadius: token.borderRadiusLG,
        border: 'none',
        content: "#fff"
    };
    return (
        <main>
            <div className='max-w-[816px] max-lg:w-11/12 pt-[60px] m-auto max-lg:pt-4'>
                <h1 className='text-[32px] mb-8 max-lg:text-xl text-center max-lg:mb-4'>介绍</h1>

                <Collapse
                    defaultActiveKey={[1, 2]}
                    ghost
                    expandIconPosition="end"
                    expandIcon={({ isActive }) => <span className='text-2xl'>{isActive ? "-" : "+"}</span>}
                    items={getItems(panelStyle)}
                />
            </div>
        </main>
    )
}