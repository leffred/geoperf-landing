/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Allow images from Supabase Storage signed URLs
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "qfdvdcvqknoqfxetttch.supabase.co" },
    ],
  },
  // Wildcard subdomain support : *.geoperf.com all route here, the [sous_cat] segment
  // is read from the host header in middleware.
  experimental: {
    serverActions: { bodySizeLimit: "2mb" },
  },
};
export default nextConfig;
