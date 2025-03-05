const path = require("path");
const fs = require("fs");
const withBundleAnalyzer = require("@next/bundle-analyzer")({
  enabled: process.env.ANALYZE === "true", // 当设置了 ANALYZE 环境变量时启用
});

/** @type {import('next').NextConfig} */
const nextConfig = withBundleAnalyzer({
  debug: true,
  productionBrowserSourceMaps: false,
  transpilePackages: [
    "antd",
    "@ant-design",
    "rc-util",
    "rc-pagination",
    "rc-picker",
    "rc-notification",
    "rc-tooltip",
    "rc-tree",
    "rc-table",
    "@ant-design/icons",
    "rc-input",
  ],
  webpack: (config, { buildId, dev, isServer, defaultLoaders, webpack }) => {
    config.module.rules.push({
      test: /\.svg$/,
      use: ["@svgr/webpack"],
    });

    config.resolve.alias["@"] = path.resolve("./");
    config.resolve.alias["~"] = path.resolve("./public");
    return config;
  },
  sassOptions: {
    includePaths: [path.join(__dirname, ""), path.join(__dirname, "public")],
  },
  async rewrites() {
    return [
      // request proxy
      {
        source: "/text-api/:path*",
        destination: "http://141.98.196.188:9101/:path*",
      },
    ];
  },
  // devServer: {
  //   https: {
  //     key: fs.readFileSync(path.join(__dirname, "key.pem")),
  //     cert: fs.readFileSync(path.join(__dirname, "cert.pem")),
  //   },
  // },
});

module.exports = nextConfig;
