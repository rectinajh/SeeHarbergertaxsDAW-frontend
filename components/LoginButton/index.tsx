import { signIn } from "next-auth/react";
import { useAccount, useSignMessage } from "wagmi";
import { SiweMessage } from "siwe";
import { getCsrfToken } from "next-auth/react";
import { useState } from "react";
import { WalletButton, ConnectButton } from "@/components/WalletButton";
import style from "@/styles/LoginButton.module.css";
import { login } from "@/services/index";
import Image from "next/image";

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

      if (loginResponse) {
        // 确保传递正确的消息和签名到 NextAuth
        const response = await signIn("web3", {
          message: JSON.stringify(message), // 传递完整的 SIWE 消息对象
          signature,
          redirect: false,
          callbackUrl: "/"
        });

        if (response?.error) {
          throw new Error(response.error);
        }
      }
    } catch (error) {
      console.error('Login Error:', error);
    }
  };

  return (
    //<!-- wallet={type} -->
    <>{!isConnected ? (
      <ConnectButton.Custom>
  {({ account, chain, openConnectModal, openAccountModal, authenticationStatus, mounted }) => {
    const ready = mounted && authenticationStatus !== 'loading';
    const walletConnected = ready && account && chain;
    
    return (
      <button
        type="button"
        disabled={!ready}
        onClick={() => openConnectModal()}
      >
        {walletConnected ? account.displayName : "Connect Wallet"}
      </button>
    );
  }}
</ConnectButton.Custom>
      // <WalletButton.Custom wallet={type}>
      //   {({ ready, connect }) => (
      //     <button
      //       type="button"
      //       disabled={!ready}
      //       onClick={() => { connect(); setCustomConnect(true) }}
      //       className={`${style.loginButton} ${style[type]}`}
      //     >
      //       <img src={`/images/${type}.svg`} alt={type} />
      //     </button>
      //   )}
      // </WalletButton.Custom>
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
                        width={100}
                        height={100}
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
    )}</>
  );
};

export default LoginButton;