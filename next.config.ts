import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    images: {
        remotePatterns: [
            new URL("https://maimaidx-eng.com/**"),
            new URL("https://dp4p6x0xfi5o9.cloudfront.net/**"),
            new URL(`http://127.0.0.1/**`),
            new URL(`https://chart.minecraftpeayer.me/**`),
        ],
    },
    webpack(config) {
        config.module.rules.push({
            test: /\.svg$/,
            use: [
                {
                    loader: "@svgr/webpack",
                    options: {
                        svgo: true,
                        svgoConfig: {
                            plugins: [
                                {
                                    name: "preset-default",
                                    params: {
                                        overrides: {
                                            removeViewBox: false,
                                        },
                                    },
                                },
                            ],
                        },
                    },
                },
            ],
        });
        return config;
    },
};

export default nextConfig;
