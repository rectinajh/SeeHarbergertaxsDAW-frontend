/** @type {import('next').NextConfig} */
const path = require("path");
const fs = require("fs");
const nextConfig = {
  debug: true,
  // reactStrictMode: true,
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
        destination: "https://35.77.218.53:9101/:path*",
      },
    ];
  },
  transpilePackages: ["@ant-design/icons"],
  // devServer: {
  //   https: {
  //     key: fs.readFileSync(path.join(__dirname, "key.pem")),
  //     cert: fs.readFileSync(path.join(__dirname, "cert.pem")),
  //   },
  // },
};

module.exports = nextConfig;
