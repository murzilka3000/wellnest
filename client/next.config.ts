// client/next.config.js

import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'Content-Security-Policy',
            value: "frame-ancestors *;", // <-- Разрешаем встраивать с любого домена
          },
        ],
      },
    ];
  },
};

export default nextConfig;