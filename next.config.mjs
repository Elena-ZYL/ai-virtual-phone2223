/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  distDir: '.next',
  webpack: (config, { isServer, webpack }) => {
    // 关键修复：在客户端构建时，把所有 node: 开头的模块替换为空对象
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        path: false,
        module: false,
        os: false,
        crypto: false,
        stream: false,
        buffer: false,
      };
      
      // 额外添加：拦截所有 node: 协议的请求
      config.plugins.push(
        new webpack.NormalModuleReplacementPlugin(/^node:/, (resource) => {
          resource.request = resource.request.replace(/^node:/, '');
        })
      );
    }
    return config;
  },
};

export default nextConfig;
