const nextConfig = {
  reactStrictMode: true,
  // Browsers probe /favicon.ico by default; we ship an SVG icon instead, so serve that
  // (200) rather than letting the default probe 404.
  async rewrites() {
    return [{ source: "/favicon.ico", destination: "/icon.svg" }];
  },
};

export default nextConfig;
