/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        remotePatterns: [
            {
                protocol: "https",
                hostname:"res.cloudinary.com",
                port: "",
                pathname:"/di4zfsied/**"
            },
            {
                protocol: "https",
                hostname:"lh3.googleusercontent.com",
                port: "",
                pathname:"/a/**"
            },
            {
                protocol: "https",
                hostname:"avatars.githubusercontent.com",
                port: "",
                pathname:"/u/**"
            }
        ]
    }
};

export default nextConfig;
