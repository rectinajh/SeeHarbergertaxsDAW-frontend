import { createProxyMiddleware } from "http-proxy-middleware";
import { NextApiRequest, NextApiResponse } from "next";
// 创建代理中间件
const apiProxy = createProxyMiddleware({
  target: process.env.NEXT_PUBLIC_API_BASE_URL,
  changeOrigin: true,
  pathRewrite: {
    "^/api/proxy": "", // 去掉内部 API 路由前缀
  },
});

const handler = (req: NextApiRequest, res: NextApiResponse) => {
  return new Promise<void>((resolve, reject) => {
    apiProxy(req, res, (result) => {
      console.log(result, "resultresultresult");
      if (result instanceof Error) {
        reject(result);
      } else {
        resolve();
      }
    });
  });
};
export default handler;
export const config = {
  api: {
    bodyParser: false, // 关闭默认的 bodyParser 中间件
  },
};
