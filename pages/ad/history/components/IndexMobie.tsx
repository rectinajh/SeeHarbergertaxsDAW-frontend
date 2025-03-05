import SuffixText from '@/components/SuffixText'
import { AUD_STATUS, AUD_STATUS_TEXT, IAdvertise, Tabs } from '@/types/response'
import { ArrawIcon } from '@/public/icons';
import { DownOutlined } from '@ant-design/icons';
import type { MenuProps, CollapseProps } from 'antd';
import { Dropdown, Space, Collapse, Pagination } from 'antd';
import dayjs from 'dayjs'
import React from 'react'
import { emptyText } from '../index';
import Back from '@/components/Back';

type Props = {
  pageChange: (page: number) => void,
  total: number,
  data: IAdvertise[],
  handleDetail: (item: IAdvertise) => void,
  setCurrTab: (key: AUD_STATUS) => void,
  currTab: AUD_STATUS,
}

export default function IndexMobie({ pageChange, total, data, handleDetail, currTab, setCurrTab }: Props) {

  const items: MenuProps['items'] = Tabs;

  const menuClick: MenuProps['onClick'] = ({ key }) => {
    setCurrTab(Number(key))
  };
  return (
    <> <div className='w-full max-lg:mx-4'><Back text={<>历史申请记录</>} isNotifi={false}></Back></div>
      <div className="w-full flex justify-center pt-2 pb-2">

        <Dropdown menu={{ items, onClick: menuClick }} trigger={['click']}>
          <a onClick={(e) => e.preventDefault()} className='hover:text-black'>
            <Space>
              {AUD_STATUS_TEXT[currTab]}<span className="text-[#C1C1C1] text-xl">({total})</span>
              <DownOutlined />
            </Space>
          </a>
        </Dropdown>
      </div>
      {data?.length ?
        <> <div className='px-4 pb-20'>
          {data?.map((item, index) => (
            <div onClick={() => handleDetail(item)} key={item.id} className={` rounded-xl ${item.audstatus === AUD_STATUS.pending ? 'bg-[#2C2B50]' : item.audstatus === AUD_STATUS.success ? 'bg-green' : 'bg-orange'} pt-5 pb-8 px-5 mb-3`}>
              <p className='flex items-center mb-[10px] '>
                <span className='text-white text-opacity-60 w-16'>提交时间</span>
                <span className='text-white ml-5'>{dayjs(item.createdate).format('YYYY-MM-DD')}</span>
              </p>
              <p className='flex items-center mb-[10px]'>
                <span className='text-white text-opacity-60 w-16'>审核结果</span>
                <span className='text-white ml-5'>{AUD_STATUS_TEXT[item.audstatus]}</span>
              </p>
              <p className='flex items-center mb-[10px]'>
                <span className='text-white text-opacity-60 w-16'>订单编号</span>
                <span className='text-white ml-5'>{item.id}</span>
              </p>
              <p className='flex items-center mb-[10px]'>
                <span className='text-white text-opacity-60 w-16'>用户信息</span>
                <span className='text-white ml-5'><SuffixText className="text-white" content={item.useraddr}></SuffixText></span>
              </p>
            </div>))}
        </div>
          <div className='bottom-6 absolute z-10 w-full'>
            <Pagination onChange={pageChange} total={total} simple align="center" />
          </div>
        </> : emptyText}
    </>
  )
}