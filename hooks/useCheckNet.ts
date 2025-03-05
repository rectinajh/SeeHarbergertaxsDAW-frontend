import { useEffect } from "react";
import { message, Modal } from "antd";
import { useAccount, useChainId, useSwitchChain } from "wagmi";

export default function useCheckNet() {
  const { chainId, isConnected } = useAccount();
  const allowChainId = useChainId();
  const { chains, switchChainAsync } = useSwitchChain();
  useEffect(() => {
    if (isConnected && chainId !== allowChainId) {
      Modal.error({
        title: "错误的网络",
        content: `您似乎没有切换到支持的网络上`,
        okText: "切换网络",
        onOk() {
          switchChainAsync({ chainId: allowChainId })
            .then((res) => {
              message.success(`已成功切换到${res.name}!`);
            })
            .catch((error) => {
              message.error(error.shortMessage);
            });
        },
      });
    }
  }, [allowChainId, chainId, isConnected, switchChainAsync]);
}
