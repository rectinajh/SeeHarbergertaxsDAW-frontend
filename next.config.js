/** @type {import('next').NextConfig} */
const path = require("path");
const nextConfig = {
  reactStrictMode: true,
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
    // return {
    //   fallback: [
    //     {
    //       source: "/:path*",
    //       destination: "http://35.77.218.53:9101/:path*",
    //     },
    //   ],
    // };
    return [
      // request proxy
      {
        source: "/text-api/:path*",
        destination: "https://35.77.218.53:9101/:path*",
      },
    ];
  },
  transpilePackages: ["@ant-design/icons"],
};

module.exports = nextConfig;
