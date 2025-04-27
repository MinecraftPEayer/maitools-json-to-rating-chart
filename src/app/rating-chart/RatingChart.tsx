'use client'

import Image from 'next/image';
import { Inter } from 'next/font/google';
import { useState } from 'react';
import { useSearchParams } from 'next/navigation';

const inter = Inter({ subsets: ['latin'], weight: ['400', '700'] });

import diffExp from '../../../public/diff_exp.png'
import diffMas from '../../../public/diff_mas.png'
import RatingChartImagePage from './RatingChartImage';
const diffBsc = '',
    diffAdv = '',
    diffRem = ''

type RatingData = {
    backgroundImg: string;
    title: string;
    type: string;
    ranking: string;
    rating: number;
    achievement: number;
    constant: number;
    difficulty: Difficulty;
}

type JSONRatingData = {
    songName: string;
    chartType: 0 | 1;
    achievement: number;
    difficulty: Difficulty;
    level: number;
}

enum Difficulty {
    Basic = 0,
    Advanced = 1,
    Expert = 2,
    Master = 3,
    ReMaster = 4,
}

const diffTip = {
    4: diffRem,
    3: diffMas,
    2: diffExp,
    1: diffAdv,
    0: diffBsc,
}

const chartType = {
    0: 'STD',
    1: 'DX'
}

function convertAchievementToRank(achievement: number) {
    if (achievement >= 100.5) return 'SSS+'
    if (achievement >= 100.0) return 'SSS'
    if (achievement >= 99.5) return 'SS+'
    if (achievement >= 99.0) return 'SS'
    if (achievement >= 98) return 'S+'
    if (achievement >= 97) return 'S'
    if (achievement >= 94) return 'AAA'
    if (achievement >= 90) return 'AA'
    if (achievement >= 80) return 'A'
    return ''
}

const RankFactor = {
    'SSS+': 0.224,
    'SSS': 0.216,
    'SS+': 0.211,
    'SS': 0.208,
    'S+': 0.203,
    'S': 0.200,
    'AAA': 0.168,
    'AA': 0.152,
    'A': 0.136,
    '': 0
}
// 99.41% 9.5 0.206
function generateRatingData(data: RatingData[]) {
    return data.map((item) => (<div className='w-48 h-32 bg-cover bg-no-repeat bg-center rounded-lg overflow-hidden relative' key={data.indexOf(item) + 1}>
        <img src={`${process.env.NEXT_PUBLIC_URL}/api/proxy/img?url=https://dp4p6x0xfi5o9.cloudfront.net/maimai/img/cover-m/${item.backgroundImg}`} alt="" width={192} height={128} className='w-full h-full object-cover absolute left-0 top-0 blur-[2px]' />
        <div className='bg-black/40 p-2 rounded-lg w-full h-full relative'>
            <p className='text-sm'>#{data.indexOf(item) + 1}</p>
            <p className="truncate">{item.title}</p>
            <p className="text-sm font-light">{item.type}</p>
            <Image src={diffTip[item.difficulty]} width={24} height={24} alt="" className="absolute top-0 right-0"/>
            <div className='absolute left-2 bottom-2'>
                <p className="text-sm font-light">{item.achievement.toFixed(4)}</p>
                <p className="text-2xl font-bold leading-6">{item.ranking}</p>
            </div>
            <div className="absolute right-2 bottom-2">
                <p className="text-right">{item.constant.toFixed(1)}</p>
                <p className="text-right text-4xl leading-8 font-bold">{item.rating}</p>
            </div>
        </div>
    </div>))
}

const RatingChart = ({ songDatabase }: { songDatabase: any }) => {
    const [chartComponent, setChartComponent] = useState(<div></div>);
    const [chartImageComponent, setChartImageComponent] = useState(<div></div>);
    const [fileName, setFileName] = useState('');
    const [errorText, setErrorText] = useState('');

    const params = useSearchParams()
    const playerName = params.get('playerName');
    const avatar = params.get('avatar');

    const diffLabel = songDatabase.difficulties.map((diff: any) => diff.difficulty)

    return(<div className="p-4">
        <div className='flex mb-5'>
            <input
                type="file"
                accept=".json"
                onClick={(e) => (e.target as HTMLInputElement).value = ''}
                onChange={(e) => {setFileName(e.target.files?.item(0)?.name ?? '');}}
                className="hidden"
                id="file-input"
            />
            <label 
                htmlFor="file-input" 
                className="border-gray-600 border-2 flex p-5 rounded-2xl cursor-pointer text-white w-128 relative overflow-hidden"
            >
                {fileName ? fileName : 'Upload a JSON file...'}
                <div className='absolute right-0 p-5 top-0 bg-gray-600'>Browse</div>
            </label>
            <button
                className='ml-5 p-5 bg-gray-700 rounded-2xl cursor-pointer'
                onClick={async () => {
                    const input = document.querySelector('input[type="file"]') as HTMLInputElement;
                    const file = input.files?.[0];
                    if (file) {
                        const text = await file.text();
                        try {
                            const data = JSON.parse(text) as JSONRatingData[];
                            setErrorText('');
                            if (data.some((item) => !item.songName || (item.chartType === null || item.chartType === undefined) || (item.achievement === null || item.achievement === undefined) || (item.level === null || item.level === undefined) || !item.level)) {
                                setErrorText('Invalid JSON format. Please check the file and try again.');
                                return;
                            }
                            let B15Data: RatingData[] = [],
                                B35Data: RatingData[] = [];
                            for (const item of data) {
                                const song = songDatabase.songs.find((song: any) => song.songId === item.songName);
                                console.log(item)
                                console.log(song)
                                if (song) {
                                    let sheet = song.sheets.find((sht: any) => sht.type.toUpperCase() === chartType[item.chartType] && sht.difficulty === diffLabel[item.difficulty]);
                                    if (sheet) {
                                        const constant = item.level,
                                            rating = Math.floor(((item.achievement > 100.5 ? 100.5 : item.achievement) / 100) * RankFactor[convertAchievementToRank(item.achievement)] * constant * 100),
                                            imageURL = song.imageName;

                                        (song.version === 'PRiSM' ? B15Data : B35Data).push({
                                            type: chartType[item.chartType],
                                            title: item.songName,
                                            achievement: item.achievement,
                                            ranking: convertAchievementToRank(item.achievement),
                                            backgroundImg: imageURL,
                                            rating: rating,
                                            constant: constant,
                                            difficulty: item.difficulty
                                        })
                                    }
                                }
                            }

                            B15Data = B15Data.slice(0, 15)
                            B35Data = B35Data.slice(0, 35)

                            let ratingNumberIndex = 0
                            setChartComponent(
                                <div className='flex'>
                                    <div className={`p-4 w-[1088px] h-[1674px] bg-[url('../../public/background.png')] bg-center bg-cover ${inter.className}`}>
                                        <div className='bg-white w-[296px] h-fit p-2 flex rounded-xl'>
                                            <img src={`${process.env.NEXT_PUBLIC_URL}/api/proxy/img?url=https://maimaidx-eng.com/maimai-mobile/img/Icon/${avatar}.png`} alt="avatar" width={96} height={96}/>
                                            <div className="ml-2">
                                                <p className='text-black h-12 text-xl leading-[32px] bg-gray-100 p-2 rounded-md'>{playerName}</p>
                                                <div className='w-fit h-fit relative'>
                                                    <img src={`${process.env.NEXT_PUBLIC_URL}/api/proxy/img?url=https://maimaidx-eng.com/maimai-mobile/img/rating_base_purple.png`} alt="rating" width={296} height={86} className='h-12 w-auto' />
                                                    <div className='absolute right-2 top-0 flex'>
                                                        {`${B15Data.map(item => item.rating).reduce((a, b) => a + b, 0) + B35Data.map(item => item.rating).reduce((a, b) => a + b, 0)}`.split('').map((char) => {
                                                            ratingNumberIndex++
                                                            return <p key={`ratingNum${ratingNumberIndex}`} className='text-2xl w-[17.5px] leading-12 text-center'>{char}</p>
                                                        })}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        <div className='w-fit h-fit mt-4 bg-[rgba(0,0,0,0.4)] rounded-xl'>
                                            <div className='p-4'>
                                                <p className='text-sm font-bold text-gray-600'>B15</p>
                                                <div className='grid grid-cols-5 gap-4'> {/* B15 */}
                                                    {generateRatingData(B15Data.slice(0, 15))}
                                                </div>
                                            </div>
                                            <div className='mx-4 py-4 border-gray-600 border-t-2'>
                                                <p className='text-sm font-bold text-gray-600'>B35</p>
                                                <div className='grid grid-cols-5 gap-4'> { /* B35 */ }
                                                    {generateRatingData(B35Data.slice(0, 35))}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>);

                                setChartImageComponent(<RatingChartImagePage data={{
                                        playerName: playerName as string,
                                        avatar: avatar as string,
                                        B15: B15Data,
                                        B35: B35Data
                                    }}/>)  
                        } catch (error) {
                            console.error('Error parsing JSON:', error);
                        }
                    }
                }}
            >
                Load Chart
            </button>
            <p className='ml-5 p-5 text-2xl leading-6 text-red-500'>{errorText}</p>
        </div>
        
        {chartComponent}
        
        <div className='mt-5'>
            {chartImageComponent}
        </div>
        </div>)
}

export default RatingChart;

export type { RatingData }