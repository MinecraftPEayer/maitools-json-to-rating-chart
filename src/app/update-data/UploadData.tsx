"use client";

import Image from "next/image";
import localFont from "next/font/local";
import { useState, useEffect, JSX } from "react";
import axios from "axios";

const imageBaseURL = "https://maimaidx-eng.com/maimai-mobile/img/";

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

const judgementText = {
    critical: "Crit.P",
    perfect: "Perfect",
    great: "Great",
    good: "Good",
    miss: "Miss",
};

const judgements: Array<"critical" | "perfect" | "great" | "good" | "miss"> = [
    "critical",
    "perfect",
    "great",
    "good",
    "miss",
];

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
    fastLate: {
        fast: string;
        late: string;
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

    const [uploadElement, setUploadElement] = useState<JSX.Element | null>(
        <div className="bg-gray-400 hover:bg-gray-500 p-2">Upload Data</div>,
    );
    const [uploadClicked, setUploadClicked] = useState(false);

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

    let ovData = playerData?.overviewData;

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
                        {[
                            {
                                imageURL: "music_icon_sssp.png",
                                value: ovData?.SSSp,
                            },
                            {
                                imageURL: "music_icon_app.png",
                                value: ovData?.APp,
                                bigImage: true,
                            },
                            {
                                imageURL: "music_icon_sss.png",
                                value: ovData?.SSS,
                            },
                            {
                                imageURL: "music_icon_ap.png",
                                value: ovData?.AP,
                                bigImage: true,
                            },
                            {
                                imageURL: "music_icon_ssp.png",
                                value: ovData?.SSp,
                            },
                            {
                                imageURL: "music_icon_fcp.png",
                                value: ovData?.FCp,
                                bigImage: true,
                            },
                            {
                                imageURL: "music_icon_ss.png",
                                value: ovData?.SS,
                            },
                            {
                                imageURL: "music_icon_fc.png",
                                value: ovData?.FC,
                                bigImage: true,
                            },
                            {
                                imageURL: "music_icon_sp.png",
                                value: ovData?.Sp,
                            },
                            {
                                imageURL: "music_icon_fdxp.png",
                                value: ovData?.FDXp,
                                bigImage: true,
                            },
                            {
                                imageURL: "music_icon_s.png",
                                value: ovData?.S,
                            },
                            {
                                imageURL: "music_icon_fdx.png",
                                value: ovData?.FDX,
                                bigImage: true,
                            },
                            {
                                imageURL: "music_icon_clear.png",
                                value: ovData?.CLEAR,
                            },
                            {
                                imageURL: "music_icon_fsp.png",
                                value: ovData?.FSp,
                                bigImage: true,
                            },
                            {
                                imageURL: "music_icon_dxstar_5.png",
                                value: ovData?.dxstar_5,
                                bigImage: true,
                            },
                            {
                                imageURL: "music_icon_fs.png",
                                value: ovData?.FS,
                                bigImage: true,
                            },
                            {
                                imageURL: "music_icon_dxstar_4.png",
                                value: ovData?.dxstar_4,
                                bigImage: true,
                            },
                            {
                                imageURL: "music_icon_sync.png",
                                value: ovData?.SYNCPLAY,
                                bigImage: true,
                            },
                            {
                                imageURL: "music_icon_dxstar_3.png",
                                value: ovData?.dxstar_3,
                                bigImage: true,
                            },
                            {
                                empty: true,
                            },
                            {
                                imageURL: "music_icon_dxstar_2.png",
                                value: ovData?.dxstar_2,
                                bigImage: true,
                            },
                            {
                                empty: true,
                            },
                            {
                                imageURL: "music_icon_dxstar_1.png",
                                value: ovData?.dxstar_1,
                                bigImage: true,
                            },
                        ].map((item, index) =>
                            item.empty ? (
                                <div
                                    key={index}
                                    className="flex rounded-lg overflow-hidden w-48"
                                ></div>
                            ) : (
                                <div
                                    key={index}
                                    className="flex rounded-lg overflow-hidden w-48"
                                >
                                    <div
                                        className={
                                            item.bigImage
                                                ? "bg-blue-400 p-1"
                                                : "bg-blue-400 p-2 w-[76px]"
                                        }
                                    >
                                        <Image
                                            src={imageBaseURL + item.imageURL!}
                                            alt=""
                                            width={68}
                                            height={31}
                                            className={`object-contain ${item.bigImage ? "h-8" : "h-6"}`}
                                        />
                                    </div>
                                    <div className="bg-gray-200 text-black p-2 w-32 text-right leading-[24px] ">
                                        {item.value || "-/-"}
                                    </div>
                                </div>
                            ),
                        )}
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
                                    className="mt-2 cursor-pointer rounded-lg overflow-hidden"
                                    onClick={async () => {
                                        if (uploadClicked) return;
                                        setUploadClicked(true);
                                        setUploadElement(
                                                <div className="bg-gray-700 p-2">
                                                    Uploading...
                                                </div>,
                                            );
                                        const body = {
                                            data: {
                                                playerData,
                                                recentScores,
                                                recentCreditDetail:
                                                    RecentDetail,
                                                allScores,
                                                date: Date.now()
                                            },
                                            userData,
                                        };

                                        let resp = await axios.post(
                                            `${process.env.NEXT_PUBLIC_URL}/api/upload-data`,
                                            body,
                                        );

                                        if (resp.data.success) {
                                            setUploadElement(
                                                <div className="bg-green-500 p-2">
                                                    Success!
                                                </div>,
                                            );
                                        }
                                    }}
                                >
                                    {uploadElement}
                                </div>
                            </div>
                        ) : (
                            <div
                                className="bg-[#5865F2] w-fit h-fit p-4 rounded-2xl cursor-pointer hover:bg-[#4752C4]"
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
                            {[
                                "Track",
                                "Time",
                                "Difficulty",
                                "Level",
                                "Chart Type",
                                "Song Name",
                                "Achievement",
                            ].map((header) => (
                                <th
                                    key={header}
                                    className="p-2 bg-gray-700 text-white px-1"
                                >
                                    {header}
                                </th>
                            ))}
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
                                                {judgements.map((judgement) => (
                                                    <th
                                                        key={judgement}
                                                        className="px-1 border-black border-2"
                                                        style={{
                                                            color: textColor[
                                                                judgement
                                                            ],
                                                        }}
                                                    >
                                                        {
                                                            judgementText[
                                                                judgement
                                                            ]
                                                        }
                                                    </th>
                                                ))}
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {result.map((row, index) => (
                                                <tr key={index}>
                                                    <td className="px-1 border-black border-2 text-gray-700">
                                                        {row[0].toUpperCase()}
                                                    </td>

                                                    {judgements.map(
                                                        (judgement, index) => (
                                                            <td
                                                                key={index}
                                                                className="px-1 border-black border-2"
                                                                style={{
                                                                    color: textColor[
                                                                        judgement
                                                                    ],
                                                                }}
                                                            >
                                                                {row[index + 1]}
                                                            </td>
                                                        ),
                                                    )}
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                );
                            })()}
                            <div>Combo: {detail.combo}</div>
                            <div>Sync: {detail.sync}</div>
                            <div className="absolute right-2 bottom-2 text-xl">
                                <div className="flex text-sm absolute right-0 -top-4">
                                    <p className="text-blue-500">FAST</p>
                                    <p className="mx-1">/</p>
                                    <p className="text-red-500">LATE</p>
                                </div>

                                <div className="flex">
                                    <p className="text-blue-500">
                                        {detail.fastLate.fast}
                                    </p>
                                    <p className="mx-1">/</p>
                                    <p className="text-red-500">
                                        {detail.fastLate.late}
                                    </p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default UploadDataClientPage;
