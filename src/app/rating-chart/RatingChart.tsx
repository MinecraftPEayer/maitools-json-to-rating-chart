"use client";

import Image from "next/image";
import { Inter } from "next/font/google";
import { useState } from "react";
import { useSearchParams } from "next/navigation";

const inter = Inter({ subsets: ["latin"], weight: ["400", "700"] });

import diffBsc from "../../../public/diff_bsc.png";
import diffAdv from "../../../public/diff_adv.png";
import diffExp from "../../../public/diff_exp.png";
import diffMas from "../../../public/diff_mas.png";
import diffRem from "../../../public/diff_rem.png";

import RatingChartImagePage from "./RatingChartImage";

type RatingData = {
    backgroundImg: string;
    title: string;
    type: string;
    ranking: string;
    rating: number;
    achievement: number;
    constant: number;
    difficulty: Difficulty;
};

type JSONRatingData = {
    songName: string;
    chartType: 0 | 1;
    achievement: number;
    difficulty: Difficulty;
    level: number;
};

enum Difficulty {
    Basic = 0,
    Advanced = 1,
    Expert = 2,
    Master = 3,
    ReMaster = 4,
}

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

const diffTip = {
    4: diffRem,
    3: diffMas,
    2: diffExp,
    1: diffAdv,
    0: diffBsc,
};

const chartType = {
    0: "STD",
    1: "DX",
};

function convertAchievementToRank(achievement: number) {
    if (achievement >= 100.5) return "SSS+";
    if (achievement >= 100.0) return "SSS";
    if (achievement >= 99.5) return "SS+";
    if (achievement >= 99.0) return "SS";
    if (achievement >= 98) return "S+";
    if (achievement >= 97) return "S";
    if (achievement >= 94) return "AAA";
    if (achievement >= 90) return "AA";
    if (achievement >= 80) return "A";
    return "";
}

const RankFactor = {
    "SSS+": 0.224,
    SSS: 0.216,
    "SS+": 0.211,
    SS: 0.208,
    "S+": 0.203,
    S: 0.2,
    AAA: 0.168,
    AA: 0.152,
    A: 0.136,
    "": 0,
};
// 99.41% 9.5 0.206
function generateRatingData(data: RatingData[], length: number) {
    let returnValue = data.map((item) => (
        <div
            className="w-48 h-32 bg-cover bg-no-repeat bg-center rounded-lg overflow-hidden relative"
            key={data.indexOf(item) + 1}
        >
            <img
                src={`${process.env.NEXT_PUBLIC_URL}/api/proxy/img?url=https://dp4p6x0xfi5o9.cloudfront.net/maimai/img/cover-m/${item.backgroundImg}`}
                alt=""
                width={192}
                height={128}
                className="w-full h-full object-cover absolute left-0 top-0 blur-[2px]"
            />
            <div className="bg-black/40 p-2 rounded-lg w-full h-full relative">
                <p className="text-sm leading-3.5">#{data.indexOf(item) + 1}</p>
                <p className="truncate">{item.title}</p>
                <p className="text-sm font-light leading-3.5">{item.type}</p>
                <Image
                    src={diffTip[item.difficulty]}
                    width={24}
                    height={24}
                    alt=""
                    className="absolute top-0 right-0"
                />
                <div className="absolute left-2 bottom-2">
                    <p className="text-sm font-light">
                        {item.achievement.toFixed(4)}
                    </p>
                    <p className="text-2xl font-bold leading-6">
                        {item.ranking}
                    </p>
                </div>
                <div className="absolute right-2 bottom-2">
                    <p className="text-right">{item.constant.toFixed(1)}</p>
                    <p className="text-right text-4xl leading-8 font-bold">
                        {item.rating}
                    </p>
                </div>
            </div>
        </div>
    ));

    if (returnValue.length < length) {
        for (let i = returnValue.length; i < length; i++) {
            returnValue.push(
                <div
                    className="w-48 h-32 bg-[#444] rounded-lg overflow-hidden relative"
                    key={i + 1}
                ></div>,
            );
        }
    }

    return returnValue;
}

const RatingChart = ({
    songDatabase,
    expection,
}: {
    songDatabase: any;
    expection: any;
}) => {
    const [chartComponent, setChartComponent] = useState(<div></div>);
    const [chartImageComponent, setChartImageComponent] = useState(<div></div>);
    const [userInfo, setUserInfo] = useState({
        avatar: "",
        name: "",
    });
    const [checkUserComponent, setCheckUserComponent] = useState(<div></div>);
    const [fileName, setFileName] = useState("");
    const [errorText, setErrorText] = useState("");
    const [checked, setChecked] = useState(false);

    const params = useSearchParams();
    const playerName = params.get("playerName");
    const avatar = params.get("avatar");

    const diffLabel = songDatabase.difficulties.map(
        (diff: any) => diff.difficulty,
    );

    async function fetchFriendCode() {
        let data = await fetch(
            `/api/userInfo?friendCode=${(document.getElementById("friendCode") as HTMLInputElement).value}`,
        );
        if (data.ok) {
            let res = await data.json();
            console.log(res);
            if (res.error) {
                setErrorText(res.error);
                return;
            }
            setUserInfo({
                avatar: res.avatar,
                name: res.name,
            });
            setCheckUserComponent(
                <div className="flex">
                    <img
                        src={`${process.env.NEXT_PUBLIC_URL}/api/proxy/img?url=${res.avatar}`}
                        alt="avatar"
                        width={68}
                        height={68}
                    />
                    <p className="text-xl text-gray-100 p-2 leading-16 h-16 ml-5">
                        {res.name}
                    </p>
                </div>,
            );
        }
    }

    return (
        <div className="p-4 w-[1120px] h-[1706px] bg-black">
            <div className="flex mb-5">
                <input
                    type="text"
                    id="friendCode"
                    placeholder="Friend Code"
                    className="border-gray-600 border-2 flex p-5 rounded-2xl cursor-pointer text-white w-128 relative overflow-hidden"
                />
                <button
                    className="ml-5 p-5 bg-gray-700 rounded-2xl cursor-pointer"
                    onClick={async () => {
                        setCheckUserComponent(
                            <div className="text-white">
                                Checking, Please wait...
                            </div>,
                        );
                        if (userInfo.avatar === "" && userInfo.name === "")
                            await fetchFriendCode();
                        setChecked(true);
                    }}
                >
                    Check
                </button>

                <div className="ml-5">{checkUserComponent}</div>
            </div>
            <div className="flex mb-5">
                <input
                    type="file"
                    accept=".json"
                    onClick={(e) => ((e.target as HTMLInputElement).value = "")}
                    onChange={(e) => {
                        setFileName(e.target.files?.item(0)?.name ?? "");
                    }}
                    className="hidden"
                    id="file-input"
                />
                <label
                    htmlFor="file-input"
                    className="border-gray-600 border-2 flex p-5 rounded-2xl cursor-pointer text-white w-128 relative overflow-hidden"
                >
                    {fileName ? fileName : "Upload a JSON file..."}
                    <div className="absolute right-0 p-5 top-0 bg-gray-600 text-white">
                        Browse
                    </div>
                </label>
                <button
                    className="ml-5 p-5 bg-gray-700 rounded-2xl cursor-pointer text-white"
                    id="loadChart"
                    onClick={async () => {
                        if (
                            (
                                document.getElementById(
                                    "friendCode",
                                ) as HTMLInputElement
                            ).value &&
                            !checked &&
                            !avatar &&
                            !playerName
                        ) {
                            setErrorText("Please check the user first.");
                            return;
                        }
                        const input = document.querySelector(
                            'input[type="file"]',
                        ) as HTMLInputElement;
                        const file = input.files?.[0];
                        if (file) {
                            const text = await file.text();
                            try {
                                const data = JSON.parse(
                                    text,
                                ) as JSONRatingData[];
                                setErrorText("");
                                if (
                                    data.some(
                                        (item) =>
                                            !item.songName ||
                                            item.chartType === null ||
                                            item.chartType === undefined ||
                                            item.achievement === null ||
                                            item.achievement === undefined ||
                                            item.level === null ||
                                            item.level === undefined ||
                                            !item.level,
                                    )
                                ) {
                                    setErrorText(
                                        "Invalid JSON format. Please check the file and try again.",
                                    );
                                    return;
                                }
                                setChartImageComponent(<div></div>);
                                let B15Data: RatingData[] = [],
                                    B35Data: RatingData[] = [];
                                for (const item of data) {
                                    const song = songDatabase.songs.find(
                                        (song: any) =>
                                            song.songId ===
                                            (expection[item.songName] ??
                                                item.songName),
                                    );
                                    if (song) {
                                        let sheet = song.sheets.find(
                                            (sht: any) =>
                                                sht.type.toUpperCase() ===
                                                    chartType[item.chartType] &&
                                                sht.difficulty ===
                                                    diffLabel[item.difficulty],
                                        );
                                        if (sheet) {
                                            const constant = item.level,
                                                rating = Math.floor(
                                                    ((item.achievement > 100.5
                                                        ? 100.5
                                                        : item.achievement) /
                                                        100) *
                                                        RankFactor[
                                                            convertAchievementToRank(
                                                                item.achievement,
                                                            )
                                                        ] *
                                                        constant *
                                                        100,
                                                ),
                                                imageURL = song.imageName;

                                            ((sheet.regionOverrides.intl
                                                .version ??
                                                sheet.version ??
                                                song.version) === "PRiSM"
                                                ? B15Data
                                                : B35Data
                                            ).push({
                                                type: chartType[item.chartType],
                                                title:
                                                    expection[item.songName] ??
                                                    item.songName,
                                                achievement: item.achievement,
                                                ranking:
                                                    convertAchievementToRank(
                                                        item.achievement,
                                                    ),
                                                backgroundImg: imageURL,
                                                rating: rating,
                                                constant: constant,
                                                difficulty: item.difficulty,
                                            });
                                        }
                                    }
                                }

                                B15Data = B15Data.slice(0, 15);
                                B35Data = B35Data.slice(0, 35);

                                const rating =
                                    B15Data.map((item) => item.rating).reduce(
                                        (a, b) => a + b,
                                        0,
                                    ) +
                                    B35Data.map((item) => item.rating).reduce(
                                        (a, b) => a + b,
                                        0,
                                    );

                                let ratingNumberIndex = 0;
                                setChartComponent(
                                    <div className="flex">
                                        <div
                                            className={`p-4 w-[1088px] h-[1674px] bg-[url('../../public/background.png')] bg-center bg-cover ${inter.className}`}
                                        >
                                            <div className="bg-white w-[296px] h-fit p-2 flex rounded-xl">
                                                <img
                                                    src={`${process.env.NEXT_PUBLIC_URL}/api/proxy/img?url=${userInfo.avatar ?? `https://maimaidx-eng.com/maimai-mobile/img/Icon/${avatar}.png`}`}
                                                    alt="avatar"
                                                    width={96}
                                                    height={96}
                                                />
                                                <div className="ml-2">
                                                    <p className="text-black h-12 text-xl leading-[32px] bg-gray-100 p-2 rounded-md">
                                                        {userInfo.name ??
                                                            playerName}
                                                    </p>
                                                    <div className="w-fit h-fit relative">
                                                        <img
                                                            src={`${process.env.NEXT_PUBLIC_URL}/api/proxy/img?url=https://maimaidx-eng.com/maimai-mobile/img/rating_base_${getRatingBaseImage(rating)}.png`}
                                                            alt="rating"
                                                            width={296}
                                                            height={86}
                                                            className="h-12 w-auto"
                                                        />
                                                        <div className="absolute right-2 top-0 flex">
                                                            {`${rating}`
                                                                .split("")
                                                                .map((char) => {
                                                                    ratingNumberIndex++;
                                                                    return (
                                                                        <p
                                                                            key={`ratingNum${ratingNumberIndex}`}
                                                                            className="text-2xl w-[17.5px] leading-12 text-center"
                                                                        >
                                                                            {
                                                                                char
                                                                            }
                                                                        </p>
                                                                    );
                                                                })}
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="w-fit h-fit mt-4 bg-[rgba(0,0,0,0.4)] rounded-xl">
                                                <div className="p-4">
                                                    <p className="text-sm font-bold text-gray-600">
                                                        B15
                                                    </p>
                                                    <div className="grid grid-cols-5 gap-4">
                                                        {" "}
                                                        {/* B15 */}
                                                        {generateRatingData(
                                                            B15Data.slice(
                                                                0,
                                                                15,
                                                            ),
                                                            15,
                                                        )}
                                                    </div>
                                                </div>
                                                <div className="mx-4 py-4 border-gray-600 border-t-2">
                                                    <p className="text-sm font-bold text-gray-600">
                                                        B35
                                                    </p>
                                                    <div className="grid grid-cols-5 gap-4">
                                                        {" "}
                                                        {/* B35 */}
                                                        {generateRatingData(
                                                            B35Data.slice(
                                                                0,
                                                                35,
                                                            ),
                                                            35,
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>,
                                );

                                setChartImageComponent(
                                    <RatingChartImagePage
                                        data={{
                                            playerName: (userInfo.name ??
                                                playerName) as string,
                                            avatar: (userInfo.avatar ??
                                                `https://maimaidx-eng.com/maimai-mobile/img/Icon/${avatar}.png`) as string,
                                            B15: B15Data,
                                            B35: B35Data,
                                            timestamp: new Date(),
                                        }}
                                    />,
                                );
                            } catch (error) {
                                console.error("Error parsing JSON:", error);
                            }
                        } else {
                            setErrorText("Please upload a JSON file.");
                        }
                    }}
                >
                    Load Chart
                </button>
                <p className="ml-5 p-5 text-2xl leading-6 text-red-500">
                    {errorText}
                </p>
            </div>

            {chartComponent}

            <div className="mt-5">{chartImageComponent}</div>
        </div>
    );
};

export default RatingChart;

export { getRatingBaseImage };

export type { RatingData };
