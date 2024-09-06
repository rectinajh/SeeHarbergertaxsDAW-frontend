import { Image, Carousel, Pagination, Skeleton, Divider } from 'antd';
import { getAdvertise } from '../services';
import { PrevIcon, NextIcon } from '../public/icons';
import style from './index.module.scss';
import SuffixText from '../components/SuffixText';
import Avatar from "@/components/Avatar"

import { IAdvertise, ILinks, IListRes } from '../types/response';
import { useState } from 'react';
import dayjs from 'dayjs';
import { useReadContract } from 'wagmi';
import { contractMsg } from '@/wagmi';
import { formatEther } from 'viem';
import { useRequest } from 'ahooks';
import InfiniteScroll from 'react-infinite-scroll-component';




const Home = () => {


  const [curItemIndex, setCurItemIndex] = useState<number>(0)
  const [data, setData] = useState<IAdvertise[]>([])
  const [links, setLinks] = useState<ILinks>()
  const [curItem, setCurItem] = useState<IAdvertise>(data[curItemIndex])

  const [total, setTotal] = useState<number>(0)
  const [currPage, setCurrPage] = useState<number>(1)
  function getAdPage(page: number): Promise<IListRes> {
    return getAdvertise({ page, size: 10 })
  }
  const { loading, run } = useRequest(getAdPage, {
    manual: false,
    onSuccess: (result, params) => {
      setCurrPage(params[0] || 1)
      setData(result.results as IAdvertise[])
      setTotal(result.count)
      setLinks(result.links)
    }
  })
  // Carousel change 
  const onChange = (currentSlide: number) => {
    if (currentSlide >= data.length - 1 && data.length < total) {
      run(currPage + 1)
    }
  };
  const changeItem = (type: 'prev' | 'next') => {
    if (type === 'prev') {
      setCurItemIndex(prev => {
        if (prev > 0) {
          const index = --prev;
          setCurItem(data[index])
          return index
        }
        return prev
      })
    } else if (type === 'next') {
      setCurItemIndex(prev => {
        if (prev < data.length - 1) {
          const index = ++prev;
          setCurItem(data[index])
          return index
        }
        return prev
      })
    }
  }

  const previewChange = (item: IAdvertise, index: number) => {
    setCurItem(item)
    setCurItemIndex(index)
  }

  const { data: price } = useReadContract({
    ...contractMsg,
    functionName: 'getCurrentPrice',
    args: ['0']
  })

  return (
    <main className='home' id='home'>
      <div className="3xl:max-w-[1400px] 3xl:m-auto lg:mx-40  lg:my-0 md:mx-0 ">
        <h1 className=" lg:pb-[39px] text-xl lg:text-[32px] lg:pt-[44px] pl-[36px] py-[17px] lg:pl-0">历史广告牌</h1>
        {!(!data.length && loading) ? <InfiniteScroll
          dataLength={total}
          next={() => run(currPage + 1)}
          hasMore={!!links?.next}
          loader={<Skeleton avatar paragraph={{ rows: 1 }} active />}
          endMessage={<Divider plain>暂时没有更多了</Divider>}
          scrollableTarget="home"
          className="max-lg:hidden"
        >
          <div className='lg:block hidden'> {data.map((item: IAdvertise, index) => {
            return (<div className={`${style.billItem} `} key={item.id}>
              <Image width={'100%'} fallback="/images/image_err.png" className={`bg-deep-black drop-shadow-lg w-full max-h-[498px] rounded-3xl object-contain`} src={process.env.NEXT_PUBLIC_API_BASE_URL + item.pcimage} alt={item.useraddr}
                preview={{
                  getContainer: false,
                  onVisibleChange: () => previewChange(item, index),
                  imageRender: () => (
                    <div className={style.previewBox}>
                      <div className={`${style.billButton} ${style.buttonTop} ${curItemIndex > 0 ? 'flex' : 'hidden'}`} onClick={() => changeItem('prev')}>
                        <PrevIcon > </PrevIcon>
                      </div>
                      <div className={`${style.desc} justify-between`} data-preview>
                        <div className='flex items-center'>
                          <Avatar className={style.avar} address={curItem?.useraddr} />
                          {/* <Image className={style.avar} preview={false} src="/images/avar.png" height={40} width={40} alt={'avar'}></Image> */}
                          <h3>{curItem?.useraddr}</h3>
                          <div className={`font-light ${style.date}`}>{dayjs(curItem?.createdate).format('YYYY-MM-DD')}</div>
                        </div>
                        <div>
                          <span className="text-[28px]">{price ? formatEther(price as bigint) : 0}</span>
                          <span className='text-2xl font-light ml-1'>See</span>
                        </div>
                      </div>
                      <Image className=' h-[498px] max-h-[60vh] w-auto object-contain' fallback="/images/image_err.png" src={process.env.NEXT_PUBLIC_API_BASE_URL + curItem?.pcimage} alt='' preview={false}></Image>
                      <div className={`${style.billButton} ${curItemIndex < data.length - 1 ? 'flex' : 'hidden'}`} onClick={() => changeItem('next')}>
                        <NextIcon ></NextIcon>
                      </div>
                    </div>
                  ),
                  toolbarRender: () => null,
                }}
              > </Image>
              <div className={`${style.desc} justify-between`} >
                <div className='flex items-center'>
                  {item.useraddr && <Avatar className={style.avar} address={item.useraddr} />}
                  {/* <Image className={style.avar} preview={false} src="/images/avar.png" height={40} width={40} alt={'avar'}></Image> */}
                  <h3>{item.useraddr}</h3>
                  <div className={`font-normal ${style.date}`}>{dayjs(item.createdate).format('YYYY-MM-DD')}</div>
                </div>
                <div>
                  <span className="text-[28px]">{price ? formatEther(price as bigint) : 0}</span>
                  <span className='text-2xl font-normal ml-1'>See</span>
                </div>
              </div>


            </div>)
          })}

            {/* <Pagination onChange={run} total={total} align="end" hideOnSinglePage={true} /> */}
          </div>
        </InfiniteScroll>

          : <div className="w-full mx-auto max-lg:mx-3 max-lg:w-auto">
            <div className='bg-white rounded-lg overflow-hidden'>
              <div className="w-full h-96 bg-gray-200 animate-pulse"></div>
              <div className="flex items-center justify-between p-4 bg-gray-100">
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 bg-gray-200 rounded-full animate-pulse"></div>
                  <div className="h-4 bg-gray-200 animate-pulse rounded w-64"></div>
                </div>
                <div className="h-4 bg-gray-200 animate-pulse rounded w-12"></div>
              </div>
            </div>
            <div className='bg-white rounded-lg overflow-hidden max-lg:hidden'>
              {/* <!-- Image Section --> */}
              <div className="w-full h-96 bg-gray-200 animate-pulse mt-5"></div>
              {/* <!-- Info Section --> */}
              <div className="flex items-center justify-between p-4 bg-gray-100">
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 bg-gray-200 rounded-full animate-pulse"></div>
                  <div className="h-4 bg-gray-200 animate-pulse rounded w-64"></div>
                </div>
                <div className="h-4 bg-gray-200 animate-pulse rounded w-12"></div>
              </div>
            </div>
          </div>
        }


        <div className='lg:hidden'>
          <Carousel afterChange={onChange} infinite={false} className='w-10/12 m-auto home-caroual'>

            {data.map((item: any) => {
              return (<div className={style.billItem} key={item.id}>

                <Image width={"100%"} className={style.billImage} src={process.env.NEXT_PUBLIC_API_BASE_URL + item.pcimage} alt=''
                  preview={false}
                > </Image>
                <div className={style.desc}>
                  <Avatar className={style.avar} address={item.useraddr} />
                  <h3><SuffixText content={item.useraddr}></SuffixText></h3>
                  <div className={style.date}>{dayjs(item.createdate).format('YYYY-MM-DD')}</div>
                </div>
              </div>)
            })}

          </Carousel>
          {/* <Pagination onChange={run} total={total} simple align="end" hideOnSinglePage={true} /> */}
        </div>


      </div >

    </main >
  );
};

export default Home;


