import { signIn, useSession, getCsrfToken } from "next-auth/react";
import { useAccount, useSignMessage } from "wagmi";
import { SiweMessage } from "siwe";
import { useState, useEffect } from "react";
import { WalletButton, ConnectButton } from "@/components/WalletButton";
import style from "../../pages/login/index.module.scss";
import { login } from "@/services/index";
import Image from "next/image";
import { useRouter } from "next/router";
import { useLocalStorageState } from "ahooks";


const LoginButton = ({ type }: { type: "metamask" | "WalletConnect" }) => {
    const { address, isConnected } = useAccount();
    const { signMessageAsync } = useSignMessage();
    const [customConnect, setCustomConnect] = useState(false);
  
    const handleLogin = async () => {
      try {
        // 确保在服务端获取 CSRF token
        const csrfToken = await getCsrfToken();
        console.log('CSRF Token:', csrfToken); // 调试用
  
        if (!csrfToken) {
          throw new Error('Failed to get CSRF token');
        }
  
        // 创建签名消息
        const message = new SiweMessage({
          domain: window.location.host,
          address: address,
          statement: "Sign in with Ethereum to the app",
          uri: window.location.origin,
          version: "1",
          chainId: 80002,
          nonce: csrfToken  // 使用获取到的 CSRF token
        });
  
        const messageStr = message.prepareMessage();
        console.log('Message:', messageStr); // 调试用
        
        // 获取签名
        const signature = await signMessageAsync({
          message: messageStr,
        });
        console.log('Signature:', signature); // 调试用
  
        // 调用后端登录接口
        const loginResponse = await login({
          useraddr: address!,
          message: btoa(messageStr),
          signature: signature
        });
  
        console.log('Login response:', loginResponse); // 调试用
  
        // 调用 Next Auth 的 signIn 方法，发送签名结果
        await signIn('credentials', {
          message: messageStr,
          signature,
          redirect: false,
        });
  
      } catch (error) {
        console.error('Login error:', error);
      }
    };
  
    return !isConnected ? (
      <WalletButton.Custom wallet={type}>
        {({ ready, connect }) => (
          <button
            type="button"
            disabled={!ready}
            onClick={() => { connect(); setCustomConnect(true) }}
            className={`${style.loginButton} ${style[type]}`}
            style={{ padding: '20px' }}
          >
            <Image 
              src={`/images/${type}.svg`} 
              alt={type} 
              width={150}
              height={150}
              style={{ cursor: 'pointer' }}
            />
          </button>
        )}
      </WalletButton.Custom>
    ) : (
      <ConnectButton.Custom>
        {({
          account,
          chain,
          openConnectModal,
          authenticationStatus,
          mounted,
        }) => {
          const ready = mounted && authenticationStatus !== 'loading';
          const walletConnected = ready && account && chain;
          const authed = (!authenticationStatus || authenticationStatus === 'authenticated');
  
          if (walletConnected && customConnect) {
            handleLogin();
            setCustomConnect(false);
          }
  
          return (
            <div
              className='w-full'
              {...(!ready && {
                'aria-hidden': true,
                'style': {
                  opacity: 0,
                  pointerEvents: 'none',
                  userSelect: 'none',
                },
              })}
            >
              {(() => {
                if (walletConnected && !authed) {
                  return (
                    <button 
                      onClick={openConnectModal} 
                      type="button"
                      className={`${style.loginButton} ${style[type]}`}
                      style={{ padding: '20px' }}
                    >
                      <Image 
                        src={`/images/${type}.svg`} 
                        alt={type} 
                        width={150}
                        height={150}
                        style={{ cursor: 'pointer' }}
                      />
                    </button>
                  );
                }
              })()}
            </div>
          );
        }}
      </ConnectButton.Custom>
    );
  };

export default function Login() {
    const { data: session } = useSession();
    const [loading, setLoading] = useState(false)
    const router = useRouter();
    const { callbackUrl } = router.query;

    const [info, setInfo] = useLocalStorageState('user-info', {
        defaultValue: {},
    });

    useEffect(() => {
        if (session) {
            setLoading(true)

            const { user } = session

            const message = btoa(user.message!)
            login({ useraddr: user.address, message, signature: user.signature }).then(res => {
                setInfo(res.data)
                router.push('/')
            })
        }
    }, [session, router, setInfo]);

    return (
        <div className={style.logins}>
            {/* {session.address} */}
            <div className={style.loginBox}>
            <p data-a={process.env.NEXT_PUBLIC_API_BASE_URL}>欢迎来到&ldquo;一块广告牌&rdquo;</p>
                <h1 >登陆</h1>
                <div className="flex flex-col space-y-12 w-full items-center">
                  <div>
                    <ConnectButton.Custom>
                      {({ account, chain, openConnectModal, authenticationStatus, mounted }) => {
                        const ready = mounted && authenticationStatus !== 'loading';
                        return (
                          <button
                            onClick={openConnectModal}
                            type="button"
                            className={style.metamask}
                            style={{ 
                              padding: '10px',
                              width: '300px',
                              height: '100px',
                              background: '#F2F2FF', 
                              borderRadius: '8px',
                              border: 'none',
                              cursor: 'pointer'
                            }}
                          >
                            <Image 
                              src="/images/metamask.svg" 
                              alt="MetaMask" 
                              width={300}
                              height={100}
                            />
                          </button>
                        );
                      }}
                    </ConnectButton.Custom>
                  </div>
                  <div>
                    <ConnectButton.Custom>
                      {({ account, chain, openConnectModal, authenticationStatus, mounted }) => {
                        const ready = mounted && authenticationStatus !== 'loading';
                        return (
                          <button
                            onClick={openConnectModal}
                            type="button"
                            className={style.WalletConnect}
                            style={{ 
                              padding: '10px',
                              width: '300px',
                              height: '100px',
                              background: '#F2F2FF', 
                              borderRadius: '8px',
                              border: 'none',
                              cursor: 'pointer'
                            }}
                          >
                            <Image 
                              src="/images/WalletConnect.svg" 
                              alt="WalletConnect" 
                              width={300}
                              height={100}
                            />
                          </button>
                        );
                      }}
                    </ConnectButton.Custom>
                  </div>
                </div>
            </div>
        </div>
    )
}
