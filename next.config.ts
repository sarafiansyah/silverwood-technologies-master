import type { NextConfig } from "next";
const pkgNext = require("next/package.json");
const pkgReact = require("react/package.json");
const pkgAntd = require("antd/package.json");
const pkgFramer = require("framer-motion/package.json");
const pkgGdrive = require("googleapis/package.json");
const pkgRedux = require("@reduxjs/toolkit/package.json");

const nextConfig: NextConfig = {
  reactCompiler: true,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "drive.google.com",
      },
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com",
      },
    ],
  },
   env: {
 NEXT_PUBLIC_NEXT_VERSION: pkgNext.version,
    NEXT_PUBLIC_REACT_VERSION: pkgReact.version,
    NEXT_PUBLIC_ANTD_VERSION: pkgAntd.version,
    NEXT_PUBLIC_FRAMER_VERSION: pkgFramer.version,
    NEXT_PUBLIC_GOOGLE_API_VERSION: pkgGdrive.version,
    NEXT_PUBLIC_REDUX_VERSION: pkgRedux.version,
  },
};

export default nextConfig;
