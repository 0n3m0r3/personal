import { fileURLToPath } from "node:url";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin();

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "standalone",
  outputFileTracingRoot: fileURLToPath(new URL(".", import.meta.url)),
  poweredByHeader: false,
  webpack: (config) => {
    config.module.rules.push({
      test: /\.pdf$/,
      use: {
        loader: "file-loader",
        options: {
          name: "[path][name].[ext]",
        },
      },
    });
    return config;
  },
};

export default withNextIntl(nextConfig);
