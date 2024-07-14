import { Image, Carousel } from 'antd';
import type { GetServerSideProps } from 'next';
import { getAdvertise } from '../services';
import { PrevIcon, NextIcon } from '../public/icons';
import style from './index.module.scss';
import SuffixText from '../components/SuffixText';

import { IAdvertise } from '../types/response';
import { useState } from 'react';



export const getServerSideProps: GetServerSideProps = async ({ req, res }) => {
  return {
    props: {
      data: await getAdvertise(),
    },
  };
};



const Home = ({ data }: { data: IAdvertise[] }) => {

  const onChange = (currentSlide: number) => {
    console.log(currentSlide);
  };
  const [curItemIndex, setCurItemIndex] = useState<number>(0)
  const [curItem, setCurItem] = useState<IAdvertise>(data[curItemIndex])


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

  return (
    <main className='home'>

      <div className="2xl:max-w-[1400px] 2xl:m-auto lg:mx-8 lg:my-0 md:mx-0">
        <h1 className=" lg:pb-[39px] text-xl lg:text-[32px] lg:pt-[44px] pl-[36px] py-[17px] lg:pl-0">历史广告牌</h1>
        {data.map((item: IAdvertise, index) => {
          return (<div className={`${style.billItem} lg:block hidden`} key={item.id}>
            <Image width={'100%'} className={`bg-deep-black drop-shadow-lg w-full max-h-[498px] rounded-3xl object-contain`} src={process.env.NEXT_PUBLIC_API_BASE_URL + item.pcimage} alt={item.useraddr}
              preview={{
                onVisibleChange: () => previewChange(item, index),
                imageRender: () => (
                  <div className={style.previewBox}>
                    <div className={`${style.billButton} ${style.buttonTop} ${curItemIndex > 0 ? 'flex' : 'hidden'}`} onClick={() => changeItem('prev')}>
                      <PrevIcon > </PrevIcon>
                    </div>
                    <div className={style.desc} data-preview>
                      <Image className={style.avar} preview={false} src="/images/avar.png" height={40} width={40} alt={'avar'}></Image>
                      <h3>{curItem.useraddr}</h3>
                      <div className={style.date}>{new Date(curItem.createdate).toLocaleDateString()}</div>
                    </div>
                    <Image className=' h-[498px] max-h-[60vh] w-auto object-contain' src={process.env.NEXT_PUBLIC_API_BASE_URL + curItem.pcimage} alt='' preview={false}></Image>
                    <div className={`${style.billButton} ${curItemIndex < data.length - 1 ? 'flex' : 'hidden'}`} onClick={() => changeItem('next')}>
                      <NextIcon ></NextIcon>
                    </div>
                  </div>
                ),
                toolbarRender: () => null,
              }}
            > </Image>
            <div className={`${style.desc}`}>

              <Image className={style.avar} preview={false} src="/images/avar.png" alt={'avar'}></Image>
              <h3>{item.useraddr}</h3>
              <div className={style.date}>{new Date(item.createdate).toLocaleDateString()}</div>
            </div>
          </div>)
        })}



        <div className='lg:hidden'>
          <Carousel afterChange={onChange} className='w-10/12 m-auto '>

            {data.map((item: any) => {
              return (<div className={style.billItem} key={item.id}>

                <Image width={"100%"} className={style.billImage} src={process.env.NEXT_PUBLIC_API_BASE_URL + item.pcimage} alt=''
                  preview={false}
                > </Image>
                <div className={style.desc}>

                  <Image className={style.avar} preview={false} src="/images/avar.png" alt={'avar'}></Image>
                  <h3><SuffixText content={item.useraddr}></SuffixText></h3>
                  <div className={style.date}>{new Date(item.createdate).toLocaleDateString()}</div>
                </div>
              </div>)
            })}

          </Carousel>
        </div>


      </div >
    </main >
  );
};

export default Home;


