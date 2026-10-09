/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  // Beat store hidden for now - send visitors to the homepage.
  // Remove this to bring the store back.
  async redirects() {
    return [
      { source: "/beatstore", destination: "/", permanent: false },
      { source: "/cart", destination: "/", permanent: false },
    ]
  },
}

export default nextConfig
