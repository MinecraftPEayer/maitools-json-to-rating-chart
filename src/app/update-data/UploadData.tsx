"use client";

import Image from "next/image";
import localFont from "next/font/local";
import { useState, useEffect } from "react";

const mai = localFont({
    src: "../../../public/fonts/SEGAMaruGothicDB.ttf",
    display: "swap",
});

const TitleBackgroundURL = {
    Normal: "https://maimaidx-eng.com/maimai-mobile/img/trophy_normal.png",
    Bronze: "https://maimaidx-eng.com/maimai-mobile/img/trophy_bronze.png",
    Silver: "https://maimaidx-eng.com/maimai-mobile/img/trophy_silver.png",
    Gold: "https://maimaidx-eng.com/maimai-mobile/img/trophy_gold.png",
    Rainbow: "https://maimaidx-eng.com/maimai-mobile/img/trophy_rainbow.png",
};

const difficultyColor = {
    basic: "#45c124",
    advanced: "#ffba01",
    expert: "#ff7b7b",
    master: "#9f51dc",
    remaster: "#dbaaff",
    utage: "#ff6ffd",
};

const difficulties = {
    basic: "BASIC",
    advanced: "ADVANCED",
    expert: "EXPERT",
    master: "MASTER",
    remaster: "Re:MASTER",
};

const textColor = {
    critical: "#ffbc09",
    perfect: "#ff9d00",
    great: "#f75ea3",
    good: "#2fca4c",
    miss: "#8c8c8c",
};

type PlayerData = {
    playerName: string;
    rating: number;
    class: string;
    course: string;
    title: {
        text: string;
        type: "Normal" | "Bronze" | "Silver" | "Gold" | "Rainbow";
    };
    avatar: string;
    playCount: {
        all: number;
        version: number;
    };
    overviewData: {
        SSSp: string;
        SSS: string;
        SSp: string;
        SS: string;
        Sp: string;
        S: string;
        CLEAR: string;
        APp: string;
        AP: string;
        FCp: string;
        FC: string;
        FDXp: string;
        FDX: string;
        FSp: string;
        FS: string;
        SYNCPLAY: string;
        dxstar_5: string;
        dxstar_4: string;
        dxstar_3: string;
        dxstar_2: string;
        dxstar_1: string;
    };
};

type SimpleScoreData = {
    track: number;
    time: Date;
    difficulty: "basic" | "advanced" | "expert" | "master" | "remaster";
    level: string;
    chartType: string;
    songName: string;
    achievement: string;
    achievementNewRecord: boolean;
    dxScore: string;
    dxScoreNewRecord: boolean;
    dxStar: number;
    fcType: string;
    syncType: string;
    idx: string;
};

type DetailedScoreData = {
    track: number;
    time: Date;
    difficulty: "basic" | "advanced" | "expert" | "master" | "remaster";
    level: string;
    chartType: string;
    songName: string;
    achievement: string;
    achievementNewRecord: boolean;
    dxScore: string;
    dxScoreNewRecord: boolean;
    dxStar: number;
    fcType: string;
    syncType: string;
    idx: string;
    noteDetail: {
        tap: string[];
        hold: string[];
        slide: string[];
        touch: string[];
        break: string[];
    };
    combo: string;
    sync: string;
};

type AllScoreData = {
    achievement: string;
    chartType: string;
    comboType: string;
    difficulty: string;
    dxScore: string;
    level: string;
    name: string;
    playCount: string;
    syncType: string;
};

function getRatingColor(rating: number): string {
    if (rating >= 15000) return "rainbow";
    if (rating >= 14500) return "platinum";
    if (rating >= 14000) return "gold";
    if (rating >= 13000) return "silver";
    if (rating >= 12000) return "bronze";
    if (rating >= 10000) return "purple";
    if (rating >= 7000) return "red";
    if (rating >= 4000) return "orange";
    if (rating >= 2000) return "green";
    if (rating >= 1000) return "blue";
    return "normal";
}

const UploadDataClientPage = () => {
    const [playerData, setPlayerData] = useState<PlayerData>();
    const [recentScores, setRecentScores] = useState<SimpleScoreData[]>([]);
    const [RecentDetail, setRecentDetail] = useState<DetailedScoreData[]>([]);
    const [allScores, setAllScores] = useState<{
        [diff: string]: AllScoreData[];
    }>({});
    const [userData, setUserData] = useState<any>();

    let scoreData = {
        basic: [],
        advanced: [],
        expert: [],
        master: [],
        remaster: [],
    };

    useEffect(() => {
        if (!window.opener) return;
        window.opener.postMessage("request_playerData", "*");
        window.opener.postMessage("request_recentAll", "*");
        window.opener.postMessage("request_allScores__basic", "*");
        window.addEventListener("message", async (event) => {
            if (!event.data) return;
            if (event.data.type === "playerData") {
                setPlayerData(event.data.data);
            }
            if (event.data.type === "recentAll") {
                setRecentScores(event.data.data.records);
                let latestCreditTrackCount = event.data.data.records[0].track;
                for (let i = 0; i < latestCreditTrackCount; i++) {
                    window.opener.postMessage(
                        `request_recentDetail__${event.data.data.records[i].idx}`,
                        "*",
                    );
                }
            }
            if (event.data.type === "recentDetail") {
                RecentDetail.push(event.data.data);
                RecentDetail.sort((a, b) => a.track - b.track);
                setRecentDetail([...RecentDetail]);
            }
            if (event.data.type === "scoresData") {
                let diffs = [
                    "basic",
                    "advanced",
                    "expert",
                    "master",
                    "remaster",
                    "END",
                ];
                let nowDifficulty = event.data.data.difficulty as
                    | "basic"
                    | "advanced"
                    | "expert"
                    | "master"
                    | "remaster";
                let nextDifficulty = diffs[diffs.indexOf(nowDifficulty) + 1];
                scoreData[nowDifficulty] = event.data.data.records;
                if (nextDifficulty !== "END") {
                    window.opener.postMessage(
                        `request_allScores__${nextDifficulty}`,
                        "*",
                    );
                } else {
                    setAllScores(scoreData);
                }
            }

            if (typeof event.data !== "string") return;

            if (event.data.startsWith("userData__")) {
                let data = event.data.split("__")[1];
                let userData = JSON.parse(data);

                setUserData(userData);
            }
        });
    }, []);

    return (
        <div className="bg-gray-900">
            <div className={`w-[100vw] h-fit p-4 flex ${mai.className}`}>
                <div>
                    <div className="flex">
                        {/** User card */}
                        <div className="mr-5">
                            <Image
                                src={
                                    playerData?.avatar ||
                                    "https://maimaidx-eng.com/maimai-mobile/img/Icon/34f0363f4ce86d07.png"
                                }
                                alt=""
                                width={128}
                                height={128}
                            ></Image>
                        </div>
                        <div>
                            <div className="flex">
                                <div className="relative w-36">
                                    <Image
                                        src={`https://maimaidx-eng.com/maimai-mobile/img/rating_base_${getRatingColor(playerData?.rating || 0)}.png`}
                                        alt=""
                                        width={296}
                                        height={86}
                                        className="object-contain w-[144px] h-[42px] z-0"
                                    />
                                    {(() => {
                                        let ratingText =
                                            playerData?.rating.toString() ||
                                            "0";
                                        if (ratingText.length < 5) {
                                            ratingText = ratingText.padStart(
                                                5,
                                                "-",
                                            );
                                        }
                                        return (
                                            <div className="flex absolute top-0 z-10 text-xl leading-[42px] right-[8.5px]">
                                                <p className="mr-[1px]">
                                                    {ratingText[0] === "-"
                                                        ? ""
                                                        : ratingText[0]}
                                                </p>
                                                <p className="mr-[2.5px]">
                                                    {ratingText[1] === "-"
                                                        ? ""
                                                        : ratingText[1]}
                                                </p>
                                                <p className="mr-[2px]">
                                                    {ratingText[2] === "-"
                                                        ? ""
                                                        : ratingText[2]}
                                                </p>
                                                <p className="mr-[2px]">
                                                    {ratingText[3] === "-"
                                                        ? ""
                                                        : ratingText[3]}
                                                </p>
                                                <p>
                                                    {ratingText[4] === "-"
                                                        ? ""
                                                        : ratingText[4]}
                                                </p>
                                            </div>
                                        );
                                    })()}
                                </div>
                                <Image
                                    src={
                                        playerData?.class ||
                                        "https://maimaidx-eng.com/maimai-mobile/img/class/class_rank_s_00ZqZmdpb8.png"
                                    }
                                    alt=""
                                    width={126}
                                    height={70}
                                    className="object-contain h-[42px]"
                                ></Image>
                            </div>
                            <div className="text-xl bg-gray-200 w-[272px] h-12 text-black rounded-lg pr-[96px] flex relative">
                                <div className="p-3 pr-0">
                                    {playerData?.playerName}
                                </div>
                                <Image
                                    src={
                                        playerData?.course ||
                                        "https://maimaidx-eng.com/maimai-mobile/img/course/course_rank_00T7GHJvGe.png"
                                    }
                                    alt=""
                                    width={80}
                                    height={48}
                                    className="object-contain m-2 pl-0 absolute right-0 top-0"
                                ></Image>
                            </div>
                            <div className="mt-2 relative">
                                <Image
                                    src={
                                        TitleBackgroundURL[
                                            playerData?.title.type || "Normal"
                                        ]
                                    }
                                    alt=""
                                    width={268}
                                    height={25}
                                    className="object-contain top-0 left-0 absolute z-0"
                                ></Image>
                                <p className="z-10 relative text-white p-1 text-[12px] pl-2 w-[268px] h-[25px] overflow-hidden text-center [text-shadow:_-1px_-1px_0_#000,_1px_-1px_0_#000,_-1px_1px_0_#000,_1px_1px_0_#000] [webkit-text-stroke:_0.5px_#000]">
                                    {playerData?.title.text ?? "No title"}
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4 mt-4 w-96">
                        <div className="flex rounded-lg overflow-hidden w-48">
                            <div className="bg-blue-400 p-2 w-[76px]">
                                <Image
                                    src="https://maimaidx-eng.com/maimai-mobile/img/music_icon_sssp.png"
                                    alt=""
                                    width={68}
                                    height={31}
                                    className="object-contain h-6"
                                />
                            </div>
                            <div className="bg-gray-200 text-black p-2 w-32 text-right leading-[24px] ">
                                {playerData?.overviewData.SSSp || "-/-"}
                            </div>
                        </div>
                        <div className="flex rounded-lg overflow-hidden w-48">
                            <div className="bg-blue-400 p-1">
                                <Image
                                    src="https://maimaidx-eng.com/maimai-mobile/img/music_icon_app.png"
                                    alt=""
                                    width={68}
                                    height={31}
                                    className="object-contain h-8"
                                />
                            </div>
                            <div className="bg-gray-200 text-black p-2 w-32 text-right leading-[24px] ">
                                {playerData?.overviewData.APp || "-/-"}
                            </div>
                        </div>
                        <div className="flex rounded-lg overflow-hidden w-48">
                            <div className="bg-blue-400 p-2 w-[76px]">
                                <Image
                                    src="https://maimaidx-eng.com/maimai-mobile/img/music_icon_sss.png"
                                    alt=""
                                    width={68}
                                    height={31}
                                    className="object-contain h-6"
                                />
                            </div>
                            <div className="bg-gray-200 text-black p-2 w-32 text-right leading-[24px] ">
                                {playerData?.overviewData.SSS || "-/-"}
                            </div>
                        </div>
                        <div className="flex rounded-lg overflow-hidden w-48">
                            <div className="bg-blue-400 p-1">
                                <Image
                                    src="https://maimaidx-eng.com/maimai-mobile/img/music_icon_ap.png"
                                    alt=""
                                    width={68}
                                    height={31}
                                    className="object-contain h-8"
                                />
                            </div>
                            <div className="bg-gray-200 text-black p-2 w-32 text-right leading-[24px] ">
                                {playerData?.overviewData.AP || "-/-"}
                            </div>
                        </div>
                        <div className="flex rounded-lg overflow-hidden w-48">
                            <div className="bg-blue-400 p-2 w-[76px]">
                                <Image
                                    src="https://maimaidx-eng.com/maimai-mobile/img/music_icon_ssp.png"
                                    alt=""
                                    width={68}
                                    height={31}
                                    className="object-contain h-6"
                                />
                            </div>
                            <div className="bg-gray-200 text-black p-2 w-32 text-right leading-[24px] ">
                                {playerData?.overviewData.SSp || "-/-"}
                            </div>
                        </div>
                        <div className="flex rounded-lg overflow-hidden w-48">
                            <div className="bg-blue-400 p-1">
                                <Image
                                    src="https://maimaidx-eng.com/maimai-mobile/img/music_icon_fcp.png"
                                    alt=""
                                    width={68}
                                    height={31}
                                    className="object-contain h-8"
                                />
                            </div>
                            <div className="bg-gray-200 text-black p-2 w-32 text-right leading-[24px] ">
                                {playerData?.overviewData.FCp || "-/-"}
                            </div>
                        </div>
                        <div className="flex rounded-lg overflow-hidden w-48">
                            <div className="bg-blue-400 p-2 w-[76px]">
                                <Image
                                    src="https://maimaidx-eng.com/maimai-mobile/img/music_icon_ss.png"
                                    alt=""
                                    width={68}
                                    height={31}
                                    className="object-contain h-6"
                                />
                            </div>
                            <div className="bg-gray-200 text-black p-2 w-32 text-right leading-[24px] ">
                                {playerData?.overviewData.SS || "-/-"}
                            </div>
                        </div>
                        <div className="flex rounded-lg overflow-hidden w-48">
                            <div className="bg-blue-400 p-1">
                                <Image
                                    src="https://maimaidx-eng.com/maimai-mobile/img/music_icon_fc.png"
                                    alt=""
                                    width={68}
                                    height={31}
                                    className="object-contain h-8"
                                />
                            </div>
                            <div className="bg-gray-200 text-black p-2 w-32 text-right leading-[24px] ">
                                {playerData?.overviewData.FC || "-/-"}
                            </div>
                        </div>
                        <div className="flex rounded-lg overflow-hidden w-48">
                            <div className="bg-blue-400 p-2 w-[76px]">
                                <Image
                                    src="https://maimaidx-eng.com/maimai-mobile/img/music_icon_sp.png"
                                    alt=""
                                    width={68}
                                    height={31}
                                    className="object-contain h-6"
                                />
                            </div>
                            <div className="bg-gray-200 text-black p-2 w-32 text-right leading-[24px] ">
                                {playerData?.overviewData.Sp || "-/-"}
                            </div>
                        </div>
                        <div className="flex rounded-lg overflow-hidden w-48">
                            <div className="bg-blue-400 p-1">
                                <Image
                                    src="https://maimaidx-eng.com/maimai-mobile/img/music_icon_fdxp.png"
                                    alt=""
                                    width={68}
                                    height={31}
                                    className="object-contain h-8"
                                />
                            </div>
                            <div className="bg-gray-200 text-black p-2 w-32 text-right leading-[24px] ">
                                {playerData?.overviewData.FDXp || "-/-"}
                            </div>
                        </div>
                        <div className="flex rounded-lg overflow-hidden w-48">
                            <div className="bg-blue-400 p-2 w-[76px]">
                                <Image
                                    src="https://maimaidx-eng.com/maimai-mobile/img/music_icon_s.png"
                                    alt=""
                                    width={68}
                                    height={31}
                                    className="object-contain h-6"
                                />
                            </div>
                            <div className="bg-gray-200 text-black p-2 w-32 text-right leading-[24px] ">
                                {playerData?.overviewData.S || "-/-"}
                            </div>
                        </div>
                        <div className="flex rounded-lg overflow-hidden w-48">
                            <div className="bg-blue-400 p-1">
                                <Image
                                    src="https://maimaidx-eng.com/maimai-mobile/img/music_icon_fdx.png"
                                    alt=""
                                    width={68}
                                    height={31}
                                    className="object-contain h-8"
                                />
                            </div>
                            <div className="bg-gray-200 text-black p-2 w-32 text-right leading-[24px] ">
                                {playerData?.overviewData.FDX || "-/-"}
                            </div>
                        </div>
                        <div className="flex rounded-lg overflow-hidden w-48">
                            <div className="bg-blue-400 p-2 w-[76px]">
                                <Image
                                    src="https://maimaidx-eng.com/maimai-mobile/img/music_icon_clear.png"
                                    alt=""
                                    width={68}
                                    height={31}
                                    className="object-contain h-6"
                                />
                            </div>
                            <div className="bg-gray-200 text-black p-2 w-32 text-right leading-[24px] ">
                                {playerData?.overviewData.CLEAR || "-/-"}
                            </div>
                        </div>
                        <div className="flex rounded-lg overflow-hidden w-48">
                            <div className="bg-blue-400 p-1">
                                <Image
                                    src="https://maimaidx-eng.com/maimai-mobile/img/music_icon_fsp.png"
                                    alt=""
                                    width={68}
                                    height={31}
                                    className="object-contain h-8"
                                />
                            </div>
                            <div className="bg-gray-200 text-black p-2 w-32 text-right leading-[24px] ">
                                {playerData?.overviewData.FSp || "-/-"}
                            </div>
                        </div>
                        <div className="flex rounded-lg overflow-hidden w-48">
                            <div className="bg-blue-400 p-2 w-[76px]">
                                <Image
                                    src="https://maimaidx-eng.com/maimai-mobile/img/music_icon_dxstar_5.png"
                                    alt=""
                                    width={68}
                                    height={31}
                                    className="object-contain h-6"
                                />
                            </div>
                            <div className="bg-gray-200 text-black p-2 w-32 text-right leading-[24px] ">
                                {playerData?.overviewData.dxstar_5 || "-/-"}
                            </div>
                        </div>
                        <div className="flex rounded-lg overflow-hidden w-48">
                            <div className="bg-blue-400 p-1">
                                <Image
                                    src="https://maimaidx-eng.com/maimai-mobile/img/music_icon_fs.png"
                                    alt=""
                                    width={68}
                                    height={31}
                                    className="object-contain h-8"
                                />
                            </div>
                            <div className="bg-gray-200 text-black p-2 w-32 text-right leading-[24px] ">
                                {playerData?.overviewData.FS || "-/-"}
                            </div>
                        </div>
                        <div className="flex rounded-lg overflow-hidden w-48">
                            <div className="bg-blue-400 p-2 w-[76px]">
                                <Image
                                    src="https://maimaidx-eng.com/maimai-mobile/img/music_icon_dxstar_4.png"
                                    alt=""
                                    width={68}
                                    height={31}
                                    className="object-contain h-6"
                                />
                            </div>
                            <div className="bg-gray-200 text-black p-2 w-32 text-right leading-[24px] ">
                                {playerData?.overviewData.dxstar_4 || "-/-"}
                            </div>
                        </div>
                        <div className="flex rounded-lg overflow-hidden w-48">
                            <div className="bg-blue-400 p-1">
                                <Image
                                    src="https://maimaidx-eng.com/maimai-mobile/img/music_icon_sync.png"
                                    alt=""
                                    width={68}
                                    height={31}
                                    className="object-contain h-8"
                                />
                            </div>
                            <div className="bg-gray-200 text-black p-2 w-32 text-right leading-[24px] ">
                                {playerData?.overviewData.SYNCPLAY || "-/-"}
                            </div>
                        </div>
                        <div className="flex rounded-lg overflow-hidden w-48">
                            <div className="bg-blue-400 p-2 w-[76px]">
                                <Image
                                    src="https://maimaidx-eng.com/maimai-mobile/img/music_icon_dxstar_3.png"
                                    alt=""
                                    width={68}
                                    height={31}
                                    className="object-contain h-6"
                                />
                            </div>
                            <div className="bg-gray-200 text-black p-2 w-32 text-right leading-[24px] ">
                                {playerData?.overviewData.dxstar_3 || "-/-"}
                            </div>
                        </div>
                        <div className="flex rounded-lg overflow-hidden w-48"></div>
                        <div className="flex rounded-lg overflow-hidden w-48">
                            <div className="bg-blue-400 p-2 w-[76px]">
                                <Image
                                    src="https://maimaidx-eng.com/maimai-mobile/img/music_icon_dxstar_2.png"
                                    alt=""
                                    width={68}
                                    height={31}
                                    className="object-contain h-6"
                                />
                            </div>
                            <div className="bg-gray-200 text-black p-2 w-32 text-right leading-[24px] ">
                                {playerData?.overviewData.dxstar_2 || "-/-"}
                            </div>
                        </div>
                        <div className="flex rounded-lg overflow-hidden w-48"></div>
                        <div className="flex rounded-lg overflow-hidden w-48">
                            <div className="bg-blue-400 p-2 w-[76px]">
                                <Image
                                    src="https://maimaidx-eng.com/maimai-mobile/img/music_icon_dxstar_1.png"
                                    alt=""
                                    width={68}
                                    height={31}
                                    className="object-contain h-6"
                                />
                            </div>
                            <div className="bg-gray-200 text-black p-2 w-32 text-right leading-[24px] ">
                                {playerData?.overviewData.dxstar_1 || "-/-"}
                            </div>
                        </div>
                    </div>
                    <div className="mt-4">
                        {userData ? (
                            <div>
                                <div className="flex">
                                    <Image
                                        src={`https://cdn.discordapp.com/avatars/${userData.id}/${userData.avatar}`}
                                        width={96}
                                        height={96}
                                        alt="avatar"
                                        className="rounded-full"
                                    />
                                    <div className="ml-4 text-white align-middle">
                                        <p className="text-2xl">
                                            {userData.username}
                                        </p>
                                        <p className="text-gray-500 text-sm">
                                            {userData.id}
                                        </p>
                                    </div>
                                </div>

                                <div
                                    className="bg-gray-400 p-2 rounded-lg mt-2 cursor-pointer hover:bg-gray-500"
                                    onClick={() => {
                                        const dataStr =
                                            "data:text/json;charset=utf-8," +
                                            encodeURIComponent(
                                                JSON.stringify({
                                                    playerData,
                                                    recentScores,
                                                    recentCreditDetail:
                                                        RecentDetail,
                                                    allScores,
                                                    userData,
                                                }),
                                            );
                                        const downloadAnchorNode =
                                            document.createElement("a");
                                        downloadAnchorNode.setAttribute(
                                            "href",
                                            dataStr,
                                        );
                                        downloadAnchorNode.setAttribute(
                                            "download",
                                            "maimai-data.json",
                                        );
                                        document.body.appendChild(
                                            downloadAnchorNode,
                                        );
                                        downloadAnchorNode.click();
                                        downloadAnchorNode.remove();
                                    }}
                                >
                                    Download data
                                </div>
                            </div>
                        ) : (
                            <div
                                className="bg-[#5865F2] w-fit h-fit p-4 rounded-2xl"
                                onClick={() => {
                                    let authPage = window.open(
                                        `https://discord.com/oauth2/authorize?client_id=${process.env.NEXT_PUBLIC_CLIENT_ID}&response_type=code&redirect_uri=${process.env.NEXT_PUBLIC_REDIRECT_URI}&scope=identify`,
                                        "authPage",
                                    );

                                    if (!authPage) {
                                        alert(
                                            "Please allow pop-ups for this site to link your Discord account.",
                                        );
                                        return;
                                    }
                                }}
                            >
                                Link with Discord
                            </div>
                        )}
                    </div>
                </div>
                <table className="ml-8 h-fit rounded-2xl overflow-hidden border-spacing-x-1">
                    <thead>
                        <tr>
                            <th className="p-2 bg-gray-700 text-white px-1">
                                Track
                            </th>
                            <th className="p-2 bg-gray-700 text-white px-1">
                                Time
                            </th>
                            <th className="p-2 bg-gray-700 text-white px-1">
                                Difficulty
                            </th>
                            <th className="p-2 bg-gray-700 text-white px-1">
                                Level
                            </th>
                            <th className="p-2 bg-gray-700 text-white px-1">
                                Chart Type
                            </th>
                            <th className="p-2 bg-gray-700 text-white px-1">
                                Song Name
                            </th>
                            <th className="p-2 bg-gray-700 text-white px-1">
                                Achievement
                            </th>
                        </tr>
                    </thead>
                    <tbody className="border-spacing-4">
                        {recentScores.map((score) => (
                            <tr
                                className={`p-2 text-center [text-shadow:_-1px_-1px_0_#000,_1px_-1px_0_#000,_-1px_1px_0_#000,_1px_1px_0_#000] [webkit-text-stroke:_0.5px_#000]`}
                                style={{
                                    backgroundColor:
                                        difficultyColor[score.difficulty],
                                    borderBottom:
                                        score.track === 1
                                            ? "2px solid #101828"
                                            : "",
                                }}
                                key={recentScores.indexOf(score)}
                            >
                                <td className="px-1">{score.track}</td>
                                <td className="px-1">
                                    {score.time.toDateString()}
                                </td>
                                <td className="px-1">
                                    {difficulties[score.difficulty]}
                                </td>
                                <td className="px-1">{score.level}</td>
                                <td className="px-1">
                                    {score.chartType.toUpperCase()}
                                </td>
                                <td className="px-1">{score.songName}</td>
                                <td className="px-1">{score.achievement}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                <div className="bg-gray-600 p-4 rounded-2xl ml-5 h-fit [text-shadow:_-1px_-1px_0_#000,_1px_-1px_0_#000,_-1px_1px_0_#000,_1px_1px_0_#000] [webkit-text-stroke:_0.5px_#000]">
                    Latest credit
                    {RecentDetail.map((detail) => (
                        <div
                            style={{
                                backgroundColor:
                                    difficultyColor[detail.difficulty],
                            }}
                            className="p-2 rounded-lg mb-2 relative"
                            key={detail.track}
                        >
                            <div className="absolute top-2 right-2">
                                <p className="text-2xl">{detail.level}</p>
                                <p className="text-sm text-right">
                                    {detail.chartType.toUpperCase()}
                                </p>
                            </div>
                            <p className="text-gray-300 text-[8px] [text-shadow:none] [webkit-text-stroke:none]">
                                TRACK {detail.track} (
                                {detail.time.toDateString()})
                            </p>
                            {detail.songName}
                            <div className="flex align-text-bottom">
                                <p className="text-2xl">
                                    {detail.achievement.split(".")[0]}
                                </p>
                                <p className="self-end">
                                    .{detail.achievement.split(".")[1]}
                                </p>
                                {detail.achievementNewRecord ? (
                                    <p className="ml-2 text-[12px] align-middle">
                                        (New Record)
                                    </p>
                                ) : (
                                    ""
                                )}
                            </div>
                            <div className="text-sm mt-1 flex">
                                ✦{detail.dxStar} {detail.dxScore}
                                {detail.dxScoreNewRecord ? (
                                    <p className="ml-2 text-[12px] align-middle">
                                        (New Record)
                                    </p>
                                ) : (
                                    ""
                                )}
                            </div>
                            {(() => {
                                let rows = [
                                    "tap",
                                    "hold",
                                    "slide",
                                    "touch",
                                    "break",
                                ];

                                let result = [];

                                for (let i = 0; i < rows.length; i++) {
                                    let type = rows[i];
                                    let notes = detail.noteDetail[
                                        type as keyof typeof detail.noteDetail
                                    ].map((note) => note.toString());
                                    result.push([type, ...notes]);
                                }

                                return (
                                    <table className="text-center bg-gray-200 border-black border-2 text-sm rounded-sm [text-shadow:none] [webkit-text-stroke:none]">
                                        <thead>
                                            <tr>
                                                <th className="px-1 border-black border-2"></th>
                                                <th
                                                    className="px-1 border-black border-2"
                                                    style={{
                                                        color: textColor.critical,
                                                    }}
                                                >
                                                    Crit.P
                                                </th>
                                                <th
                                                    className="px-1 border-black border-2"
                                                    style={{
                                                        color: textColor.perfect,
                                                    }}
                                                >
                                                    Perfect
                                                </th>
                                                <th
                                                    className="px-1 border-black border-2"
                                                    style={{
                                                        color: textColor.great,
                                                    }}
                                                >
                                                    Great
                                                </th>
                                                <th
                                                    className="px-1 border-black border-2"
                                                    style={{
                                                        color: textColor.good,
                                                    }}
                                                >
                                                    Good
                                                </th>
                                                <th
                                                    className="px-1 border-black border-2"
                                                    style={{
                                                        color: textColor.miss,
                                                    }}
                                                >
                                                    Miss
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {result.map((row, index) => (
                                                <tr key={index}>
                                                    <td className="px-1 border-black border-2 text-gray-700">
                                                        {row[0].toUpperCase()}
                                                    </td>
                                                    <td
                                                        className="px-1 border-black border-2"
                                                        style={{
                                                            color: textColor.critical,
                                                        }}
                                                    >
                                                        {row[1]}
                                                    </td>
                                                    <td
                                                        className="px-1 border-black border-2"
                                                        style={{
                                                            color: textColor.perfect,
                                                        }}
                                                    >
                                                        {row[2]}
                                                    </td>
                                                    <td
                                                        className="px-1 border-black border-2"
                                                        style={{
                                                            color: textColor.great,
                                                        }}
                                                    >
                                                        {row[3]}
                                                    </td>
                                                    <td
                                                        className="px-1 border-black border-2"
                                                        style={{
                                                            color: textColor.good,
                                                        }}
                                                    >
                                                        {row[4]}
                                                    </td>
                                                    <td
                                                        className="px-1 border-black border-2"
                                                        style={{
                                                            color: textColor.miss,
                                                        }}
                                                    >
                                                        {row[5]}
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                );
                            })()}
                            <div>Combo: {detail.combo}</div>
                            <div>Sync: {detail.sync}</div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default UploadDataClientPage;
