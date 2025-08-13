"use client";

import { useState, useEffect } from "react";

import backgroundImg from "@/../public/background.png";
import logo from "@/../public/logo.png";

import localFont from "next/font/local";
import {
    calculateB50,
    getComboTypeIdFromName,
    getDifficultyIdFromName,
    getSyncTypeIdFromName,
} from "@/lib/Utils";

import { B50Data, SongDatabase } from "../../../types/SongDatabase";
import { ChartType, Difficulty } from "@/lib/CommonEnums";

const SEGAMaruGothic = localFont({
    src: "../../../public/fonts/SEGAMaruGothicDB.ttf",
    variable: "--font-maru-gothic",
});
const font = SEGAMaruGothic.style.fontFamily;

const WIDTH = 1920,
    HEIGHT = 1080,
    URL = process.env.NEXT_PUBLIC_URL;

type RatingData = {
    backgroundImg: string;
    title: string;
    type: string;
    ranking: string;
    rating: number;
    achievement: number;
    constant: number;
    difficulty: string;
};

type JSONRatingData = {
    songName: string;
    chartType: 0 | 1;
    achievement: number;
    difficulty: Difficulty;
    level: number;
};

const ratingBaseImage = {
    normal: "normal",
    blue: "blue",
    green: "green",
    yellow: "orange",
    red: "red",
    purple: "purple",
    bronze: "bronze",
    silver: "silver",
    gold: "gold",
    platinum: "platinum",
    rainbow: "rainbow",
};

const DifficultyColor = {
    [Difficulty.Basic]: ["#45c124", "#daf3d0"],
    [Difficulty.Advanced]: ["#ffba01", "#f3ecae"],
    [Difficulty.Expert]: ["#ff7b7b", "#f8e7e7"],
    [Difficulty.Master]: ["#9f51dc", "#efe7fa"],
    [Difficulty.ReMaster]: ["#dbaaff", "#501e89"],
    [Difficulty.UTAGE]: ["#ff6ffd", "#f8e8f6"],
};

function getRatingBaseImage(rating: number) {
    if (rating >= 15000) return ratingBaseImage.rainbow;
    if (rating >= 14500) return ratingBaseImage.platinum;
    if (rating >= 14000) return ratingBaseImage.gold;
    if (rating >= 13000) return ratingBaseImage.silver;
    if (rating >= 12000) return ratingBaseImage.bronze;
    if (rating >= 10000) return ratingBaseImage.purple;
    if (rating >= 7000) return ratingBaseImage.red;
    if (rating >= 4000) return ratingBaseImage.yellow;
    if (rating >= 2000) return ratingBaseImage.green;
    if (rating >= 1000) return ratingBaseImage.blue;
    return ratingBaseImage.normal;
}

function drawRoundRect(options: {
    ctx: CanvasRenderingContext2D;
    x: number;
    y: number;
    width: number;
    height: number;
    radius: number;
    fillStyle: string;
}) {
    const { ctx, x, y, width, height, radius, fillStyle } = options;
    let originalFillStyle = ctx.fillStyle;
    ctx.fillStyle = fillStyle;
    ctx.beginPath();
    ctx.roundRect(x, y, width, height, radius);
    ctx.fill();
    ctx.fillStyle = originalFillStyle;
}

function drawCustomRoundRect(options: {
    ctx: CanvasRenderingContext2D;
    x: number;
    y: number;
    width: number;
    height: number;
    radius?: {
        topLeft?: number;
        topRight?: number;
        bottomLeft?: number;
        bottomRight?: number;
    };
    fillStyle: string;
}) {
    const { ctx, x, y, width, height, radius, fillStyle } = options;
    const topLeft = radius?.topLeft ?? 0,
        topRight = radius?.topRight ?? 0,
        bottomLeft = radius?.bottomLeft ?? 0,
        bottomRight = radius?.bottomRight ?? 0;
    let originalFillStyle = ctx.fillStyle;
    ctx.beginPath();
    ctx.moveTo(x + topLeft, y);
    ctx.lineTo(x + width - topRight, y);
    ctx.quadraticCurveTo(x + width, y, x + width, y + topRight);
    ctx.lineTo(x + width, y + height - bottomRight);
    ctx.quadraticCurveTo(
        x + width,
        y + height,
        x + width - bottomRight,
        y + height,
    );
    ctx.lineTo(x + bottomLeft, y + height);
    ctx.quadraticCurveTo(x, y + height, x, y + height - bottomLeft);
    ctx.lineTo(x, y + topLeft);
    ctx.quadraticCurveTo(x, y, x + topLeft, y);
    ctx.closePath();
    ctx.fillStyle = fillStyle;
    ctx.fill();
    ctx.fillStyle = originalFillStyle;
}

function drawChartType(
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    chartType: "dx" | "std",
) {
    let originalFillStyle = ctx.fillStyle,
        originalFont = ctx.font;
    switch (chartType) {
        case "dx":
            ctx.fillStyle = "#FFFFFF";
            ctx.beginPath();
            ctx.moveTo(x, y);
            ctx.lineTo(x - 10, y + 20);
            ctx.lineTo(x - 10 + 61, y + 20);
            ctx.lineTo(x + 61, y);
            ctx.lineTo(x, y);
            ctx.fill();

            const TextColor = [
                "#FF1C00",
                "#FFAB00",
                "#FFEB00",
                "#A4FF00",
                "#0081FF",
            ];
            const Text = "でらっくす";
            ctx.font = `10px ${font}`;
            for (let i = 0; i < 50; i += 10) {
                ctx.fillStyle = TextColor[i / 10];
                ctx.fillText(Text[i / 10], x + 1 + i, y + 5 + 8);
            }
            break;
        case "std":
            ctx.fillStyle = "#73ADF8";
            ctx.beginPath();
            ctx.moveTo(x, y);
            ctx.lineTo(x - 10, y + 20);
            ctx.lineTo(x - 10 + 75, y + 20);
            ctx.lineTo(x + 75, y);
            ctx.lineTo(x, y);
            ctx.fill();

            ctx.fillStyle = "#FFFFFF";
            ctx.font = `10px ${font}`;
            ctx.fillText("スタンダード", x + 3, y + 5 + 8);
            break;
    }
    ctx.font = originalFont;
    ctx.fillStyle = originalFillStyle;
}

function drawSongBox(
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    song: B50Data,
    songBoxDim: { width: number; height: number },
    index: number,
) {
    const score = song,
        X = x,
        Y = y;
    let songBackgroundImg = new Image();
    songBackgroundImg.src = `${URL}/api/proxy/img?url=https://dp4p6x0xfi5o9.cloudfront.net/maimai/img/cover-m/${score.backgroundImg}`;
    songBackgroundImg.onload = async () => {
        ctx.save();
        ctx.filter = "blur(2px)";
        ctx.beginPath();
        ctx.roundRect(X, Y, songBoxDim.width, songBoxDim.height, 8);
        ctx.clip();
        const scale = songBackgroundImg.width / songBoxDim.width; // 倍率
        const scaledHeight = songBackgroundImg.height / scale; // 倍率縮放後的高度
        const yOffset = (scaledHeight - songBoxDim.height) / 2; // 需要移動的高度
        ctx.drawImage(
            songBackgroundImg,
            0,
            yOffset * scale,
            songBackgroundImg.width,
            songBoxDim.height * scale,
            X,
            Y,
            songBoxDim.width,
            songBoxDim.height,
        );
        ctx.restore();

        drawRoundRect({
            ctx,
            x: X,
            y: Y,
            width: songBoxDim.width,
            height: songBoxDim.height,
            radius: 8,
            fillStyle: "rgba(0, 0, 0, 0.5)",
        });

        drawCustomRoundRect({
            ctx,
            x: X,
            y: Y,
            width: songBoxDim.width,
            height: 28,
            radius: {
                topLeft: 8,
                topRight: 8,
                bottomLeft: 0,
                bottomRight: 0,
            },
            fillStyle: "#D9D9D9",
        });

        drawCustomRoundRect({
            ctx,
            x: X + 18,
            y: Y,
            width: songBoxDim.width - 18,
            height: 24,
            radius: {
                topRight: 8,
                bottomLeft: 4,
            },
            fillStyle: "white",
        });

        ctx.font = `6px ${font}`;
        ctx.fillStyle = "black";
        ctx.fillText("#", X + 2, Y + 20 + 6, songBoxDim.width - 20);

        ctx.font = `8px ${font}`;
        ctx.fillText(
            `${index + 1}`.length === 1 ? `0${index + 1}` : `${index + 1}`,
            X + 6,
            Y + 18 + 8,
        );

        ctx.font = `14px ${font}`;
        const MaxWidth = 142;
        let text = score.title;
        if (ctx.measureText(text).width > MaxWidth) {
            while (
                ctx.measureText(text + "...").width > MaxWidth &&
                text.length > 0
            ) {
                text = text.slice(0, -1);
            }
            text += "...";
        }
        ctx.fillText(text, X + 22, Y + 4 + 14);

        ctx.beginPath();
        ctx.moveTo(X, Y + 28);
        ctx.lineTo(X, Y + 28 + 28);
        ctx.lineTo(X + (106 - 64), Y + 28 + 28);
        ctx.lineTo(X + (120 - 64), Y + 28);
        ctx.lineTo(X, Y + 28);
        ctx.closePath();
        ctx.fillStyle = DifficultyColor[score.difficulty as Difficulty][0];
        ctx.fill();

        ctx.font = `20px ${font}`;
        ctx.fillStyle = DifficultyColor[score.difficulty as Difficulty][1];
        ctx.fillText(
            score.constant.toString().split(".")[0],
            X + 3,
            Y + 28 + 6 + 16,
        );

        ctx.font = `12px ${font}`;
        ctx.fillText(
            "." + (score.constant.toString().split(".")[1] ?? "0"),
            X + 30,
            Y + 28 + 11 + 10.5,
        );

        if (parseInt(score.constant.toString().split(".")[1]) > 5) {
            ctx.fillText("+", X + 30, Y + 28 + 2 + 8);
        }

        drawChartType(
            ctx,
            X + (120 - 64),
            Y + 28,
            score.type.toLowerCase() as "dx" | "std",
        );

        ctx.fillStyle = "white";
        ctx.font = `12px ${font}`;
        ctx.fillText(
            `${score.achievement.toFixed(4)}%`,
            X + 6,
            Y + songBoxDim.height - 6 - 2,
        );

        const RankImg = new Image();
        RankImg.src = (
            await import(
                `@/../public/ranking/${score.ranking.toLowerCase().replace(/[+]/g, "plus")}.png`
            )
        ).default.src;
        RankImg.onload = () => {
            ctx.drawImage(
                RankImg,
                X + 6,
                Y + songBoxDim.height - 16 - 20 - 2,
                45,
                20,
            );
        };

        ctx.font = `28px ${font}`;
        ctx.save();
        ctx.lineWidth = 0.5;
        ctx.strokeStyle = "white";
        ctx.fillText(
            score.rating.toString(),
            X + songBoxDim.width - 55 - 4 - 2,
            Y + songBoxDim.height - 2 - 4 - 2,
        );
        ctx.strokeText(
            score.rating.toString(),
            X + songBoxDim.width - 55 - 4 - 2,
            Y + songBoxDim.height - 2 - 4 - 2,
        );
    };
}

const ChartElement = ({
    data,
    database,
}: {
    data: any;
    database: SongDatabase;
}) => {
    useEffect(() => {
        const { B15Data, B35Data } = calculateB50(
            database,
            Object.values(data.allScores)
                .flat()
                .map((value: unknown) => {
                    const song = value as {
                        name: string;
                        chartType: string;
                        level: string;
                        difficulty: string;
                        achievement: string;
                        dxScore: string;
                        syncType: string;
                        comboType: string;
                        playCount: string;
                    };
                    return {
                        title: song.name,
                        type:
                            song.chartType === "dx"
                                ? ChartType.DX
                                : ChartType.STD,
                        difficulty: getDifficultyIdFromName(
                            song.difficulty,
                        ) as Difficulty,
                        achievement: parseFloat(song.achievement),
                        comboType: getComboTypeIdFromName(song.comboType),
                        syncType: getSyncTypeIdFromName(song.syncType),
                    };
                }),
        );

        console.log(B15Data);
        console.log(B35Data);

        const canvas = document.getElementById(
            "mainCanvas",
        ) as HTMLCanvasElement;
        if (!canvas) return;

        canvas.width = WIDTH;
        canvas.height = HEIGHT;

        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        ctx.clearRect(0, 0, WIDTH, HEIGHT);

        const bgImg = new Image();
        bgImg.src = backgroundImg.src;

        bgImg.onload = () => {
            ctx.drawImage(bgImg, 0, 0, WIDTH, HEIGHT);

            drawRoundRect({
                ctx,
                x: 30,
                y: 30,
                width: WIDTH - 60,
                height: HEIGHT - 60,
                radius: 54,
                fillStyle: "rgba(0, 0, 0, 0.5)",
            });

            const logoImg = new Image();
            logoImg.src = logo.src;
            logoImg.onload = () => {
                ctx.drawImage(logoImg, 1558, 64, 298, 108);
            };

            drawRoundRect({
                ctx,
                x: 64,
                y: 64,
                width: 390,
                height: 108,
                radius: 8,
                fillStyle: "rgba(183, 183, 183, 0.45)",
            });

            const avatarImg = new Image();
            avatarImg.src = `${URL}/api/proxy/img?url=${data.playerData.avatar}`;
            avatarImg.onload = () => {
                ctx.drawImage(avatarImg, 72, 72, 92, 92);
            };

            const ratingImg = new Image();
            ratingImg.src = `${process.env.NEXT_PUBLIC_URL}/api/proxy/img?url=https://maimaidx-eng.com/maimai-mobile/img/rating_base_${getRatingBaseImage(parseInt(data.playerData.rating))}.png`;
            ratingImg.onload = () => {
                ctx.drawImage(ratingImg, 172, 70, 104, 30);
                ctx.font = `14px ${font}`;
                ctx.fillStyle = "white";
                let baseX = 217;
                let rating = data.playerData.rating;
                ctx.fillText(rating[0], baseX, 90);
                ctx.fillText(rating[1], baseX + 10.5, 90);
                ctx.fillText(rating[2], baseX + 21.5, 90);
                ctx.fillText(rating[3], baseX + 32.5, 90);
                ctx.fillText(rating[4], baseX + 43.5, 90);
            };

            const classImg = new Image();
            classImg.src = `${URL}/api/proxy/img?url=${data.playerData.class}`;
            classImg.onload = () => {
                ctx.drawImage(classImg, 276, 68, 58, 32);
            };

            drawRoundRect({
                ctx,
                x: 172,
                y: 100,
                width: 244,
                height: 36,
                radius: 4,
                fillStyle: "white",
            });
            ctx.font = `20px ${font}`;
            ctx.fillStyle = "black";
            ctx.fillText(data.playerData.playerName, 180, 106 + 20);

            const courseImg = new Image();
            courseImg.src = `${URL}/api/proxy/img?url=${data.playerData.course}`;
            courseImg.onload = () => {
                ctx.drawImage(courseImg, 341, 104, 71, 28);
            };

            const titleBackImg = new Image();
            titleBackImg.src = `${URL}/api/proxy/img?url=https://maimaidx-eng.com/maimai-mobile/img/trophy_${data.playerData.title.type.toLowerCase()}.png`;
            titleBackImg.onload = () => {
                ctx.drawImage(titleBackImg, 172, 138, 270, 25);

                ctx.font = `16px ${font}`;
                ctx.fillStyle = "white";
                ctx.lineWidth = 1;
                ctx.strokeStyle = "black";
                const MaxWidth = 256;
                let text = data.playerData.title.text;
                if (ctx.measureText(text).width > MaxWidth) {
                    while (
                        ctx.measureText(text).width > MaxWidth &&
                        text.length > 0
                    ) {
                        text = text.slice(0, -1);
                    }
                }
                ctx.fillText(text, 178, 141 + 16);
                ctx.strokeText(text, 178, 141 + 16);
            };

            drawRoundRect({
                ctx,
                x: 64,
                y: 187,
                width: 100,
                height: 20,
                radius: 64,
                fillStyle: "#73ADF8",
            });

            ctx.font = `12px ${font}`;
            ctx.fillStyle = "white";
            ctx.fillText("OLD CHART", 74, 192 + 10);

            const B35BaseX = 64,
                B35BaseY = 216,
                Gap = 10;

            const songBoxDim = {
                width: 168,
                height: 152,
            };

            for (let i = 0; i < 5; i++) {
                for (let j = 0; j < 7; j++) {
                    const X = B35BaseX + j * (songBoxDim.width + Gap),
                        Y = B35BaseY + i * (songBoxDim.height + Gap);

                    const index = i * 7 + j;
                    const score = B35Data[index];

                    drawSongBox(ctx, X, Y, score, songBoxDim, index);
                }
            }

            ctx.fillStyle = "white";
            ctx.font = `8px ${font}`;
            ctx.fillText("B35", B35BaseX + 116, B35BaseY - 8 - 2);
            ctx.font = `20px ${font}`;
            let B35Total = 0;
            B35Data.forEach((b35) => (B35Total += b35.rating));
            ctx.fillText(B35Total.toString(), B35BaseX + 134, B35BaseY - 8 - 2);

            ctx.font = `8px ${font}`;
            ctx.fillText("AVG", B35BaseX + 215, B35BaseY - 8 - 2);
            ctx.font = `20px ${font}`;
            ctx.fillText(
                Math.floor(B35Total / 35).toString(),
                B35BaseX + 236,
                B35BaseY - 8 - 2,
            );

            ctx.font = `8px ${font}`;
            ctx.fillText("RANGE", B35BaseX + 300, B35BaseY - 8 - 2);
            ctx.font = `20px ${font}`;
            ctx.fillText(
                `${B35Data[0].rating} / ${B35Data[34].rating}`,
                B35BaseX + 334,
                B35BaseY - 8 - 2,
            );

            ctx.save();
            ctx.beginPath();
            ctx.moveTo(1316, 173);
            ctx.lineTo(1316, 1015);
            ctx.lineTo(1316 + 1, 1015);
            ctx.closePath();
            ctx.strokeStyle = "white";
            ctx.lineWidth = 2;
            ctx.stroke();

            const B15BaseX = 1332,
                B15BaseY = 216;

            ctx.fillStyle = "white";
            ctx.roundRect(B15BaseX, B15BaseY - 8 - 20, 100, 20, 16);
            ctx.fill();

            ctx.fillStyle = "black";
            ctx.font = `12px ${font}`;
            ctx.fillText("NEW", B15BaseX + 10, B15BaseY - 8 - 20 + 15);

            let text = "CHART";
            const TextColor = [
                "#FF1C00",
                "#FFAB00",
                "#FFEB00",
                "#A4FF00",
                "#0081FF",
            ];

            for (let i = 0; i < 10 * 5; i += 10) {
                ctx.fillStyle = TextColor[i / 10];
                ctx.fillText(
                    text[i / 10],
                    B15BaseX + 42 + i,
                    B15BaseY - 8 - 20 + 15,
                );
            }

            for (let i = 0; i < 5; i++) {
                for (let j = 0; j < 3; j++) {
                    const X = B15BaseX + j * (songBoxDim.width + Gap),
                        Y = B15BaseY + i * (songBoxDim.height + Gap);

                    const index = i * 3 + j;
                    const score = B15Data[index];

                    drawSongBox(ctx, X, Y, score, songBoxDim, index);
                }
            }

            ctx.fillStyle = "white";
            ctx.font = `8px ${font}`;
            ctx.fillText("B15", B15BaseX + 116, B15BaseY - 8 - 2);
            ctx.font = `20px ${font}`;
            let B15Total = 0;
            B15Data.forEach((b15) => (B15Total += b15.rating));
            ctx.fillText(B15Total.toString(), B15BaseX + 134, B15BaseY - 8 - 2);

            ctx.font = `8px ${font}`;
            ctx.fillText("AVG", B15BaseX + 215, B15BaseY - 8 - 2);
            ctx.font = `20px ${font}`;
            ctx.fillText(
                Math.floor(B15Total / 15).toString(),
                B15BaseX + 236,
                B15BaseY - 8 - 2,
            );

            ctx.font = `8px ${font}`;
            ctx.fillText("RANGE", B15BaseX + 300, B15BaseY - 8 - 2);
            ctx.font = `20px ${font}`;
            ctx.fillText(
                `${B15Data[0].rating} / ${B15Data[14].rating}`,
                B15BaseX + 334,
                B15BaseY - 8 - 2,
            );
        };
    }, []);

    return (
        <div>
            <canvas id="mainCanvas"></canvas>
        </div>
    );
};

export default ChartElement;
