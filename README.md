This is a [RainbowKit](https://rainbowkit.com) + [wagmi](https://wagmi.sh) + [Next.js](https://nextjs.org/) project bootstrapped with [`create-rainbowkit`](/packages/create-rainbowkit).

## 开发环境说明:


测试环境：http://141.98.196.188:9101/
原型：https://www.figma.com/design/PHflikH7AR05AF8kvTuXRR/%E8%AE%BE%E8%AE%A1%E6%96%87%E4%BB%B6?node-id=0-1&t=M6nPekNzo6yAozFZ-1
接口列表：https://apifox.com/apidoc/shared-a5723af3-a98e-4ebe-b2b4-b4ddce1346d1/api-196044190
合约地址：0xda4d015C835538F075a38C148c249c3acBca4901
合约源码：https://amoy.polygonscan.com/address/0xda4d015c835538f075a38c148c249c3acbca4901#code


node: 20+

next: ^14.2.3

## 进度报表:

### 项目进度:

- 项目初始化: 已完成
- 登陆: 已完成
- 首页, 购买, 配置广告, 介绍, 审核: 已完成
- 移动端适配: 已完成

## BUG 文档:

未进入测试阶段

## 本地服务:

先生成本地的 HTTPS pem , 生成到项目根目录下 (windows 系统生成命令要去自己找一下) :
(不记得为什么要在本地搞 https 了)

```bash
 Mac/Linux: openssl req -x509 -newkey rsa:4096 -keyout key.pem -out cert.pem -days 365 -nodes
```

在根目录下新建一个.env.local 文件, 把内容复制进去

<b>NEXTAUTH_URL 一定要对上本地的地址,不然会登陆失败</b>

```
NEXT_PUBLIC_API_BASE_URL="https://35.77.218.53:9101"
#  NEXT_PUBLIC_API_BASE_URL="text-api"
# Mac/Linux: `openssl rand -hex 32` or go to https://generate-secret.now.sh/32
# Mac/Linux: openssl req -x509 -newkey rsa:4096 -keyout key.pem -out cert.pem -days 365 -nodes
NEXTAUTH_SECRET="57d35527e54199fd6cf1a53b9ee7a82d"

NEXTAUTH_URL="https://localhost:3000"
NEXT_PUBLIC_ENABLE_TESTNETS=false
NEXT_PUBLIC_CONTRACT_ADDRESS="0xda4d015C835538F075a38C148c249c3acBca4901"
INFURA_URL="https://polygon-amoy.infura.io/v3/e56f974b3c484f52af1975ca21d5f1ed"
NEXT_PUBLIC_PROJECT_ID="2c01535b38b05886544b0c8c2b544d28"

NODE_TLS_REJECT_UNAUTHORIZED="0"

```

```bash
npm run dev
```

### 2. 构建和在服务区上运行

```
npm run build


npm start

```

#### 1.1 安装 Node.js

检查服务器上是否安装了 Node.js：

```bash
node -v
```

如果未安装，可以通过 Node.js 官方网站 或包管理工具安装推荐的 LTS 版本。

#### 1.2 安装 npm 或 yarn

检查包管理工具是否可用：

```
npm -v
yarn -v
```

2. 获取项目代码
   2.1 从代码仓库拉取代码
   使用 Git 将项目代码克隆到服务器：

```
git clone https://your-repository-link.git
cd your-project
```

#### 打包构建:

##### 1. 修改 .env.productiotn

```js
//后端域名/地址
NEXT_PUBLIC_API_BASE_URL = "https://35.77.218.53:9101";

// Mac/Linux: `openssl rand -hex 32` or go to https://generate-secret.now.sh/32

NEXTAUTH_SECRET = "57d35527e54199fd6cf1a53b9ee7a82d";

// 前端域名/地址 (一定要匹配上不然无法登陆!!)
NEXTAUTH_URL = "https://billboard-orcin.vercel.app";

NEXT_PUBLIC_ENABLE_TESTNETS = false;
// 合约地址
NEXT_PUBLIC_CONTRACT_ADDRESS = "0xda4d015C835538F075a38C148c249c3acBca4901";

// walletConnectWallet 的 projectID
NEXT_PUBLIC_PROJECT_ID = "2c01535b38b05886544b0c8c2b544d28";

//INFURA_URL="https://polygon-mainnet.infura.io/v3/e56f974b3c484f52af1975ca21d5f1ed"

// INFURA_URL 是 Infura API 的 URL，用于以太坊区块链交互。
// 这个具体的 URL 是用于 Polygon（以前称为 Matic）网络的 Amoy 测试网。
// URL 后面的长字符串是 Infura API 的项目 ID。
INFURA_URL =
  "https://polygon-amoy.infura.io/v3/e56f974b3c484f52af1975ca21d5f1ed";
```

#### 3. 安装依赖

在项目根目录运行以下命令安装依赖包：

```
pnpm install
# 或
yarn install
```

4. 构建项目
   运行构建命令将项目编译为生产环境可用的静态和服务端文件：

```
npm run build
# 或
yarn build
```

构建完成后，/.next 目录会包含项目的编译文件。

5. 启动服务
   5.1 启动生产服务器
   直接启动 Next.js 内置服务器：

```
npm start
# 或
yarn start
```

默认运行在 **http://localhost:3000**。

5.2 使用 PM2 或其他进程管理工具
PM2 可确保应用在服务器重启或崩溃后自动重启：

```
# 安装 PM2
npm install -g pm2

# 启动服务

pm2 start npm --name "nextjs-app" -- start

# 查看运行状态

pm2 list

# 设置 PM2 开机启动

pm2 startup
pm2 save
```

### 6. 配置反向代理（如 Nginx）

为了通过域名访问项目并启用 HTTPS，使用 Nginx 作为反向代理。

#### 6.1 安装 Nginx

```
sudo apt update
sudo apt install nginx
```

### 6.2 配置 Nginx

编辑配置文件 /etc/nginx/sites-available/yourdomain：

```
server {
listen 80;
server_name yourdomain.com www.yourdomain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }

}
```

激活配置并重启 Nginx：

```
sudo ln -s /etc/nginx/sites-available/yourdomain /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

#### 6.3 启用 HTTPS

使用 Certbot 安装免费 SSL 证书：

```
sudo apt install certbot python3-certbot-nginx
sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com
```

证书自动更新：

```
sudo crontab -e


# 添加以下行

0 0 \* \* \* certbot renew --quiet && systemctl reload nginx
```

7. 测试项目
   访问域名检查项目是否正常运行：
   ```
   curl -I http://yourdomain.com
   ```
   检查 Nginx 和 Next.js 的运行日志：

```
   sudo journalctl -u nginx
   pm2 logs nextjs-app
```
