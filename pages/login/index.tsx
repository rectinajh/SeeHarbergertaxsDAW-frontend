import { signIn, useSession, getCsrfToken } from "next-auth/react";
import { useAccount, useSignMessage } from "wagmi";
import { SiweMessage } from "siwe";
import { useState, useEffect, useCallback } from "react";
import { ConnectButton } from "@/components/WalletButton";
import style from "../../pages/login/index.module.scss";
import { login } from "@/services/index";
import Image from "next/image";
import { useRouter } from "next/router";
import { useLocalStorageState } from "ahooks";

export default function Login() {
    const { data: session } = useSession();
    const [loading, setLoading] = useState(false);
    const [errorMsg, setErrorMsg] = useState("");
    const router = useRouter();
    const { callbackUrl } = router.query;
    const { address, isConnected } = useAccount();
    const { signMessageAsync } = useSignMessage();
    const [customConnect, setCustomConnect] = useState(false);

    const [info, setInfo] = useLocalStorageState('user-info', {
        defaultValue: {},
    });

    const handleLogin = useCallback(async () => {
        try {
            setLoading(true);
            setErrorMsg("");
            
            // 确保在服务端获取 CSRF token
            const csrfToken = await getCsrfToken();
            console.log('CSRF Token:', csrfToken);

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
                nonce: csrfToken
            });

            const messageStr = message.prepareMessage();
            console.log('Message:', messageStr);
            
            // 获取签名
            const signature = await signMessageAsync({
                message: messageStr,
            });
            console.log('Signature:', signature);

            // 调用后端登录接口
            try {
                const loginResponse = await login({
                    useraddr: address!,
                    message: btoa(messageStr),
                    signature: signature
                });
                
                console.log('Login response:', loginResponse);

                // 调用 Next Auth 的 signIn 方法
                await signIn('credentials', {
                    message: messageStr,
                    signature,
                    redirect: false,
                });
            } catch (apiError: unknown) {
                console.error('API error:', apiError);
                
                // 类型安全的错误处理
                let errorMessage = "登录失败，未知错误";
                
                if (apiError instanceof Error) {
                    if (apiError.message.includes('timeout')) {
                        errorMessage = "服务器响应超时，请稍后再试";
                    } else {
                        errorMessage = `登录失败: ${apiError.message}`;
                    }
                }
                setErrorMsg(errorMessage);
            }

        } catch (error) {
            console.error('Login error:', error);
            if (!errorMsg) {
                setErrorMsg("登录失败，请重试");
            }
        } finally {
            setLoading(false);
        }
    }, [address, signMessageAsync, login, signIn]);

    // 自动处理钱包连接
    useEffect(() => {
        if (isConnected && customConnect) {
            handleLogin();
            setCustomConnect(false);
        }
    }, [isConnected, customConnect, handleLogin]);

    // 处理会话状态
    useEffect(() => {
        if (session) {
            setLoading(true);
            const { user } = session;
            const message = btoa(user.message!);
            login({ 
                useraddr: user.address, 
                message, 
                signature: user.signature 
            }).then(res => {
                setInfo(res.data);
                router.push('/');
            });
        }
    }, [session, router, setInfo, login]);

    return (
        <div className={style.logins}>
            <div className={style.loginBox}>
                <h1>登录</h1>
                <div className="flex flex-col space-y-12 w-full items-center">
                    {/* 钱包连接按钮 */}
                    <div>
                        <ConnectButton.Custom>
                            {({ openConnectModal }) => (
                                <button
                                    onClick={() => { 
                                        openConnectModal(); 
                                        setCustomConnect(true);
                                    }}
                                    className={style.metamask}
                                    style={{ 
                                        width: 300,
                                        height: 100,
                                        cursor: loading ? 'wait' : 'pointer',
                                        opacity: loading ? 0.7 : 1
                                    }}
                                    disabled={loading}
                                >
                                    <Image 
                                        src="/images/metamask.svg" 
                                        alt="MetaMask" 
                                        width={300}
                                        height={100}
                                    />
                                </button>
                            )}
                        </ConnectButton.Custom>
                    </div>
                    
                    {/* 错误信息显示 */}
                    {errorMsg && (
                        <div className={style.errorMessage}>
                            {errorMsg}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}