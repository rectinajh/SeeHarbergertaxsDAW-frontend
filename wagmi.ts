import { connectorsForWallets } from "@rainbow-me/rainbowkit";
import {
  metaMaskWallet,
  walletConnectWallet,
} from "@rainbow-me/rainbowkit/wallets";
import { createConfig, http } from "wagmi";
import { mainnet, polygonAmoy, polygon } from "wagmi/chains";
import { coinbaseWallet, metaMask, walletConnect } from "wagmi/connectors";
import abi from "@/libs/abi.json";

const appName = "一块广告牌";

const connectors = connectorsForWallets(
  [
    {
      groupName: "Recommended",
      wallets: [metaMaskWallet, walletConnectWallet],
    },
  ],
  {
    projectId: process.env.NEXT_PUBLIC_PROJECT_ID!,
    appName,
  }
);

export const config = createConfig({
  connectors,
  chains: [process.env.NODE_ENV === "development" ? polygonAmoy : polygonAmoy],
  transports: {
    [polygon.id]: http(process.env.INFURA_URL),
    [polygonAmoy.id]: http(process.env.INFURA_URL),
  },
  multiInjectedProviderDiscovery: false,
  ssr: true,
});
export const contractMsg = {
  abi,
  address: process.env.NEXT_PUBLIC_CONTRACT_ADDRESS! as `0x${string}`,
};
