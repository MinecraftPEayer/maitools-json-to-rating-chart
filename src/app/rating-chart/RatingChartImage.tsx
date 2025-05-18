"use client";

import { useEffect } from "react";

import background from "../../../public/background.png";
import { getRatingBaseImage, RatingData } from "./RatingChart";
import { Inter } from "next/font/google";

import diffBsc from "../../../public/diff_bsc.png";
import diffAdv from "../../../public/diff_adv.png";
import diffExp from "../../../public/diff_exp.png";
import diffMas from "../../../public/diff_mas.png";
import diffRem from "../../../public/diff_rem.png";

const diffTip = {
    4: diffRem.src,
    3: diffMas.src,
    2: diffExp.src,
    1: diffAdv.src,
    0: diffBsc.src,
};

const inter = Inter({
    subsets: ["latin"],
    weight: "400",
});

const RatingChartImagePage = ({
    data,
}: {
    data: {
        playerName: string;
        avatar: string;
        B15: RatingData[];
        B35: RatingData[];
        timestamp: Date;
    };
}) => {
    useEffect(() => {
        const canvas = document.getElementById(
            "rating-chart",
        ) as HTMLCanvasElement;
        if (!canvas) return;

        canvas.width = 1088;
        canvas.height = 1674;

        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        ctx.clearRect(0, 0, canvas.width, canvas.height);

        const bgImg = new Image();
        bgImg.crossOrigin = "anonymous";
        bgImg.src = background.src;

        bgImg.onload = () => {
            ctx.drawImage(bgImg, 896, 0, 1088, 1620, 0, 0, 1088, 1674);

            ctx.fillStyle = "white";
            ctx.beginPath();
            ctx.roundRect(16, 16, 314, 112, 16);
            ctx.fill();

            const avatarImg = new Image();
            avatarImg.src = `${process.env.NEXT_PUBLIC_URL}/api/proxy/img?url=${data.avatar}`;

            avatarImg.onload = () => {
                ctx.drawImage(avatarImg, 24, 24, 96, 96);
            };

            ctx.fillStyle = "#f7f7ff";
            ctx.beginPath();
            ctx.roundRect(128, 24, 194, 48, 6);
            ctx.fill();

            ctx.fillStyle = "black";
            ctx.font = `20px ${inter.style.fontFamily}`;
            ctx.textAlign = "center";
            ctx.textBaseline = "middle";
            ctx.fillText(data.playerName, 220, 48);

            const rating =
                data.B15.map((item) => item.rating).reduce((a, b) => a + b, 0) +
                data.B35.map((item) => item.rating).reduce((a, b) => a + b, 0);

            const ratingImg = new Image();
            ratingImg.src = `${process.env.NEXT_PUBLIC_URL}/api/proxy/img?url=https://maimaidx-eng.com/maimai-mobile/img/rating_base_${getRatingBaseImage(rating)}.png`;

            ratingImg.onload = () => {
                ctx.drawImage(
                    ratingImg,
                    0,
                    0,
                    296,
                    86,
                    128,
                    24 + 48 + 4,
                    165,
                    48,
                );

                const parsedRating =
                    `${" ".repeat("00000".length - rating.toString().length)}${rating}`.split(
                        "",
                    );

                ctx.fillStyle = "white";
                ctx.font = `24px ${inter.style.fontFamily}`;
                ctx.textAlign = "center";
                ctx.textBaseline = "middle";
                ctx.fillText(parsedRating[0], 206, 102);
                ctx.fillText(parsedRating[1], 224, 102);
                ctx.fillText(parsedRating[2], 241.5, 102);
                ctx.fillText(parsedRating[3], 258.5, 102);
                ctx.fillText(parsedRating[4], 276, 102);
            };

            ctx.fillStyle = "rgba(0, 0, 0, 0.4)";
            ctx.beginPath();
            ctx.roundRect(16, 144, 1056, 1514, 16);
            ctx.fill();

            ctx.fillStyle = "oklch(0.446 0.03 256.802)";
            ctx.font = `14px ${inter.style.fontFamily}`;
            ctx.textAlign = "left";
            ctx.textBaseline = "middle";
            ctx.fillText("B15", 32, 168);

            for (let i = 0; i < 3; i++) {
                for (let j = 0; j < 5; j++) {
                    const baseX = 32 + j * (192 + 16);
                    const baseY = 176 + i * (128 + 16);

                    ctx.fillStyle = "#444";
                    ctx.beginPath();
                    ctx.roundRect(baseX, baseY, 192, 128, 8);
                    ctx.fill();

                    let index = i * 5 + j;
                    let chartInfo = data.B15[index];

                    if (chartInfo) {
                        const songImg = new Image();
                        songImg.src = `${process.env.NEXT_PUBLIC_URL}/api/proxy/img?url=https://dp4p6x0xfi5o9.cloudfront.net/maimai/img/cover-m/${chartInfo.backgroundImg}`;

                        songImg.onload = () => {
                            ctx.save();
                            ctx.filter = "blur(2px)";
                            ctx.beginPath();
                            ctx.roundRect(baseX, baseY, 192, 128, 8);
                            ctx.clip();
                            ctx.drawImage(
                                songImg,
                                0,
                                31,
                                190,
                                128,
                                baseX,
                                baseY,
                                192,
                                128,
                            );
                            ctx.restore();

                            ctx.fillStyle = "rgba(0, 0, 0, 0.4)";
                            ctx.beginPath();
                            ctx.roundRect(baseX, baseY, 192, 128, 8);
                            ctx.fill();

                            ctx.fillStyle = "white";
                            ctx.font = `16px ${inter.style.fontFamily}`;
                            ctx.textAlign = "left";
                            ctx.textBaseline = "middle";
                            ctx.fillText(
                                `#${index + 1}`,
                                baseX + 8,
                                baseY + 20,
                            );

                            const maxWidth = 176;
                            let title = chartInfo.title;
                            const currentFont = ctx.font;
                            if (ctx.measureText(title).width > maxWidth) {
                                while (
                                    ctx.measureText(title + "...").width >
                                        maxWidth &&
                                    title.length > 0
                                ) {
                                    title = title.slice(0, -1);
                                }
                                title += "...";
                            }
                            ctx.fillText(title, baseX + 8, baseY + 40);
                            ctx.font = currentFont;

                            ctx.font = `12px ${inter.style.fontFamily}`;
                            ctx.fillText(chartInfo.type, baseX + 8, baseY + 56);

                            const difficultyImg = new Image();
                            difficultyImg.crossOrigin = "anonymous";
                            difficultyImg.src = diffTip[chartInfo.difficulty];
                            difficultyImg.onload = () => {
                                ctx.save();
                                ctx.beginPath();
                                ctx.moveTo(baseX + 168, baseY);
                                ctx.lineTo(baseX + 188, baseY);
                                ctx.arcTo(
                                    baseX + 192,
                                    baseY,
                                    baseX + 192,
                                    baseY + 4,
                                    8,
                                );
                                ctx.lineTo(baseX + 192, baseY + 24);
                                ctx.lineTo(baseX + 168, baseY + 24);
                                ctx.closePath();
                                ctx.clip();
                                ctx.drawImage(
                                    difficultyImg,
                                    baseX + 168,
                                    baseY,
                                    24,
                                    24,
                                );
                                ctx.restore();
                            };

                            ctx.font = `12px ${inter.style.fontFamily}`;
                            ctx.fillText(
                                chartInfo.achievement.toFixed(4),
                                baseX + 8,
                                baseY + 92,
                            );
                            ctx.font = `bold 24px ${inter.style.fontFamily}`;
                            ctx.fillText(
                                chartInfo.ranking,
                                baseX + 8,
                                baseY + 110,
                            );

                            ctx.textAlign = "right";
                            ctx.font = `12px ${inter.style.fontFamily}`;
                            ctx.fillText(
                                chartInfo.constant.toFixed(1),
                                baseX + 184,
                                baseY + 88,
                            );
                            ctx.font = `bold 32px ${inter.style.fontFamily}`;
                            ctx.fillText(
                                chartInfo.rating.toString(),
                                baseX + 184,
                                baseY + 108,
                            );
                        };
                    }
                }
            }

            ctx.strokeStyle = "oklch(0.446 0.03 256.802)";
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.moveTo(32, 176 + 3 * (128 + 16));
            ctx.lineTo(1056, 176 + 3 * (128 + 16));
            ctx.stroke();

            ctx.fillStyle = "oklch(0.446 0.03 256.802)";
            ctx.font = `14px ${inter.style.fontFamily}`;
            ctx.textAlign = "left";
            ctx.textBaseline = "middle";
            ctx.fillText("B35", 32, 176 + 3 * (128 + 16) + 30);

            for (let i = 0; i < 7; i++) {
                for (let j = 0; j < 5; j++) {
                    const baseX = 32 + j * (192 + 16);
                    const baseY = 650 + i * (128 + 16);

                    ctx.fillStyle = "#444";
                    ctx.beginPath();
                    ctx.roundRect(baseX, baseY, 192, 128, 8);
                    ctx.fill();

                    let index = i * 5 + j;
                    let chartInfo = data.B35[index];

                    if (chartInfo) {
                        const songImg = new Image();
                        songImg.src = `${process.env.NEXT_PUBLIC_URL}/api/proxy/img?url=https://dp4p6x0xfi5o9.cloudfront.net/maimai/img/cover-m/${chartInfo.backgroundImg}`;

                        songImg.onload = () => {
                            ctx.save();
                            ctx.filter = "blur(2px)";
                            ctx.beginPath();
                            ctx.roundRect(baseX, baseY, 192, 128, 8);
                            ctx.clip();
                            ctx.drawImage(
                                songImg,
                                0,
                                31,
                                190,
                                128,
                                baseX,
                                baseY,
                                192,
                                128,
                            );
                            ctx.restore();

                            ctx.fillStyle = "rgba(0, 0, 0, 0.4)";
                            ctx.beginPath();
                            ctx.roundRect(baseX, baseY, 192, 128, 8);
                            ctx.fill();

                            ctx.fillStyle = "white";
                            ctx.font = `16px ${inter.style.fontFamily}`;
                            ctx.textAlign = "left";
                            ctx.textBaseline = "middle";
                            ctx.fillText(
                                `#${index + 1}`,
                                baseX + 8,
                                baseY + 20,
                            );

                            const maxWidth = 176; // 192 - 16 for padding
                            let title = chartInfo.title;
                            const currentFont = ctx.font;
                            if (ctx.measureText(title).width > maxWidth) {
                                while (
                                    ctx.measureText(title + "...").width >
                                        maxWidth &&
                                    title.length > 0
                                ) {
                                    title = title.slice(0, -1);
                                }
                                title += "...";
                            }
                            ctx.fillText(title, baseX + 8, baseY + 40);
                            ctx.font = currentFont;

                            ctx.font = `12px ${inter.style.fontFamily}`;
                            ctx.fillText(chartInfo.type, baseX + 8, baseY + 56);

                            const difficultyImg = new Image();
                            difficultyImg.crossOrigin = "anonymous";
                            difficultyImg.src = diffTip[chartInfo.difficulty];
                            difficultyImg.onload = () => {
                                ctx.save();
                                ctx.beginPath();
                                ctx.moveTo(baseX + 168, baseY);
                                ctx.lineTo(baseX + 188, baseY);
                                ctx.arcTo(
                                    baseX + 192,
                                    baseY,
                                    baseX + 192,
                                    baseY + 4,
                                    8,
                                );
                                ctx.lineTo(baseX + 192, baseY + 24);
                                ctx.lineTo(baseX + 168, baseY + 24);
                                ctx.closePath();
                                ctx.clip();
                                ctx.drawImage(
                                    difficultyImg,
                                    baseX + 168,
                                    baseY,
                                    24,
                                    24,
                                );
                                ctx.restore();
                            };

                            ctx.font = `12px ${inter.style.fontFamily}`;
                            ctx.fillText(
                                chartInfo.achievement.toFixed(4),
                                baseX + 8,
                                baseY + 92,
                            );
                            ctx.font = `bold 24px ${inter.style.fontFamily}`;
                            ctx.fillText(
                                chartInfo.ranking,
                                baseX + 8,
                                baseY + 110,
                            );

                            ctx.textAlign = "right";
                            ctx.font = `12px ${inter.style.fontFamily}`;
                            ctx.fillText(
                                chartInfo.constant.toFixed(1),
                                baseX + 184,
                                baseY + 88,
                            );
                            ctx.font = `bold 32px ${inter.style.fontFamily}`;
                            ctx.fillText(
                                chartInfo.rating.toString(),
                                baseX + 184,
                                baseY + 108,
                            );
                        };
                    }
                }
            }
        };
    }, [data.timestamp]);
    return (
        <div className="flex">
            <canvas id="rating-chart"></canvas>
            <button
                className="h-16 p-5 ml-5 bg-gray-500 rounded-2xl whitespace-nowrap"
                onClick={() => {
                    const canvas = document.getElementById(
                        "rating-chart",
                    ) as HTMLCanvasElement;
                    if (!canvas) return;

                    const link = document.createElement("a");
                    link.download = "rating-chart.png";
                    link.href = canvas.toDataURL("image/png");
                    link.click();
                }}
            >
                Download Chart
            </button>
        </div>
    );
};

export default RatingChartImagePage;
