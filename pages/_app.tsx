import '../public/styles/globals.scss';
import '@rainbow-me/rainbowkit/styles.css';
import '~/styles/output.css';
import type { AppProps } from 'next/app';
import Layout from './layout';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { WagmiProvider } from 'wagmi';
import { RainbowKitProvider } from '@rainbow-me/rainbowkit';

import { SessionProvider } from 'next-auth/react';
import type { Session } from 'next-auth';
import {
  RainbowKitSiweNextAuthProvider,
  GetSiweMessageOptions,
} from '@rainbow-me/rainbowkit-siwe-next-auth';


import { config } from '../wagmi';
import { ConfigProvider } from 'antd';

import { useRouter } from 'next/router';

if (typeof window !== 'undefined') {
  const originalFetch = window.fetch;
  window.fetch = function(input, init) {
      if (input.toString().includes('alchemy')) {
          console.log('Alchemy request URL:', input);
          console.log('Request method:', init?.method);
          console.log('Request headers:', init?.headers);
          
          // 解码请求体
          if (init?.body instanceof Uint8Array) {
              const decoder = new TextDecoder();
              const jsonString = decoder.decode(init.body);
              console.log('Decoded request body:', JSON.parse(jsonString));
          }
          
          // 获取调用栈
          console.log('Stack trace:', new Error().stack?.split('\n').slice(1).join('\n'));
          
          // 打印当前组件上下文
          console.log('Current component context:', this);
      }
      return originalFetch(input, init);
  };
}

const getSiweMessageOptions: GetSiweMessageOptions = () => ({
  statement: 'sign in',
});

const queryClient = new QueryClient();


export default function App({
  Component,
  pageProps,
}: AppProps<{
  session: Session;
}>) {
  const { pathname } = useRouter()
  return (
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: '#726DF9',
          colorError: '#EB6E5D',
          borderRadius: 12,
          colorBgContainer: '#F1F0FF',
          fontSize: 16,
          controlHeight: 47
        },
      }}
    >
      <SessionProvider refetchInterval={0} session={pageProps.session}>
        <WagmiProvider config={config}>
          <QueryClientProvider client={queryClient}>
            <RainbowKitSiweNextAuthProvider
              getSiweMessageOptions={getSiweMessageOptions}
            >
              <RainbowKitProvider modalSize="compact">
                <Layout pathname={pathname}>
                  <Component {...pageProps} />
                </Layout>
              </RainbowKitProvider>
            </RainbowKitSiweNextAuthProvider>
          </QueryClientProvider>
        </WagmiProvider>
      </SessionProvider>
    </ConfigProvider>
  );
}