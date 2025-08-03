// ==UserScript==
// @name         New Userscript
// @namespace    http://tampermonkey.net/
// @version      2025-07-26
// @description  try to take over the world!
// @author       You
// @match        https://maimaidx-eng.com/maimai-mobile/home/
// @icon         https://www.google.com/s2/favicons?sz=64&domain=maimaidx-eng.com
// @grant        none
// ==/UserScript==

const indexDefine = ['SSSp', 'APp', 'SSS', 'AP', 'SSp', 'FCp', 'SS', 'FC', 'Sp', 'FDXp', 'S', 'FDX', 'CLEAR', 'FSp', 'dxstar_5', 'FS', 'dxstar_4', 'SYNCPLAY', 'dxstar_3', 'dxstar_2', 'dxstar_1'];

const difficultyNumber = {
    basic: 0,
    advanced: 1,
    expert: 2,
    master: 3,
    remaster: 4
};

const ToolURL = 'https://chart.minecraftpeayer.me/update-data';

(function () {
    'use strict';

    let commentBox = document.querySelector('.comment_block')
    let urlSpan = document.createElement('span')
    let url = document.createElement('a')
    url.href = ToolURL
    url.innerText = 'HaHa'
    url.target = "ratingChart"
    url.class = 'f_14'
    url.style = 'color: rgb(20, 119, 230);'
    urlSpan.onclick = (e) => {
        let win = window.open(ToolURL, 'ratingChart')

        window.addEventListener('message', async (e) => {
            if (e.data === 'request_playerData') {
                let playerData = { type: 'playerData', data: {} }
                let data = await fetch('https://maimaidx-eng.com/maimai-mobile/playerData')
                let dom = new DOMParser().parseFromString(await data.text(), 'text/html')
                let playerName = dom.querySelector('.name_block').textContent
                playerData.data.playerName = playerName

                let rating = dom.querySelector('.rating_block').textContent
                playerData.data.rating = rating

                let trophyElement = dom.querySelector('.trophy_inner_block');
                let title = { text: trophyElement.textContent.replace(/[\t\n]+/g, '') };
                if (dom.querySelector('.trophy_Normal')) {
                    title.type = 'Normal';
                } else if (dom.querySelector('.trophy_Bronze')) {
                    title.type = 'Bronze';
                } else if (dom.querySelector('.trophy_Silver')) {
                    title.type = 'Silver';
                } else if (dom.querySelector('.trophy_Gold')) {
                    title.type = 'Gold';
                } else if (dom.querySelector('.trophy_Rainbow')) {
                    title.type = 'Rainbow';
                }
                playerData.data.title = title

                let avatarURL = dom.querySelector('.basic_block > img').src;
                playerData.data.avatar = avatarURL;

                playerData.data.overviewData = {}
                let overviewData = dom.querySelectorAll('.musiccount_block')
                for (let i = 0; i < overviewData.length; i++) {
                    let index = indexDefine[i]
                    let text = overviewData[i].textContent.replace(/[\t\n]+/g, '').replace(/,/g, '')
                    playerData.data.overviewData[index] = text
                }

                let courseImage = dom.querySelectorAll('.h_35.f_l')[0].getAttribute('src')
                let classImage = dom.querySelectorAll('.h_35.f_l')[1].getAttribute('src')

                playerData.data.course = courseImage
                playerData.data.class = classImage

                let playCountMsg = dom.querySelector('.m_5.m_b_5.t_r.f_12').innerHTML.replace('<br>', '\n')
                let playCountAll = parseInt(playCountMsg.split('\n')[1].split('：')[1])
                let playCountCurrent = parseInt(playCountMsg.split('\n')[0].split('：')[1])
                playerData.data.playCount = { all: playCountAll, current: playCountCurrent }
                win.postMessage(playerData, '*')
            }

            if (e.data === 'request_recentAll') {
                let recentData = { type: 'recentAll', data: { records: [] } }
                let data = await fetch('https://maimaidx-eng.com/maimai-mobile/record/')
                let dom = new DOMParser().parseFromString(await data.text(), 'text/html')

                let allRecords = dom.querySelectorAll('.p_10.t_l.f_0.v_b')
                allRecords.forEach((record) => {
                    let track = parseInt(record.querySelectorAll('.playlog_top_container.p_r > .sub_title > span')[0].textContent.replace(/TRACK /g, ''))
                    let time = new Date(`${record.querySelectorAll('.playlog_top_container.p_r > .sub_title > span')[1].textContent} GMT+9`)

                    let difficulty
                    if (record.querySelector('.playlog_remaster_container')) difficulty = 'remaster'
                    else if (record.querySelector('.playlog_master_container')) difficulty = 'master'
                    else if (record.querySelector('.playlog_expert_container')) difficulty = 'expert'
                    else if (record.querySelector('.playlog_advanced_container')) difficulty = 'advanced'
                    else if (record.querySelector('.playlog_basic_container')) difficulty = 'basic'

                    let songName = record.querySelector(`.playlog_${difficulty}_container > .basic_block`).textContent.replace(record.querySelector('.w_80.f_r > .music_lv_back').textContent, '').replace(/[\t\n]+/g, '')

                    let level = record.querySelector('.w_80.f_r > .music_lv_back').textContent

                    let chartType
                    let chartTypeSrc = record.querySelector('.playlog_music_kind_icon').getAttribute('src').split('?')[0].split('/')
                    switch (chartTypeSrc[chartTypeSrc.length - 1].replace('.png', '')) {
                        case 'music_standard':
                            chartType = 'std';
                            break;
                        case 'music_dx':
                            chartType = 'dx';
                            break;
                    }

                    let achievement = record.querySelector('.playlog_achievement_txt').textContent
                    let achievementNewRecord = !!record.querySelector('.playlog_achievement_newrecord')

                    let dxScore = record.querySelector('.playlog_score_block').textContent.replace(/[\t\n]+/g, '')
                    let dxScoreNewRecord = !!record.querySelector('.playlog_deluxscore_newrecord')
                    let dxStar
                    if (record.querySelector('.playlog_deluxscore_star') === null) {
                        dxStar = 0;
                    } else {
                        let srcArray = record.querySelector('.playlog_deluxscore_star').getAttribute('src').split('?')[0].split('/')
                        switch (srcArray[srcArray.length - 1].replace('.png', '')) {
                            case 'dxstar_1':
                                dxStar = 1;
                                break;
                            case 'dxstar_2':
                                dxStar = 2;
                                break;
                            case 'dxstar_3':
                                dxStar = 3;
                                break;
                            case 'dxstar_4':
                                dxStar = 4;
                                break;
                            case 'dxstar_5':
                                dxStar = 5;
                                break;
                            default:
                                dxStar = 0;
                                break;
                        }
                    }

                    let fcType
                    let fcTypeSrc = record.querySelectorAll('.playlog_result_innerblock > img')[0].getAttribute('src').split('?')[0].split('/')
                    switch (fcTypeSrc[fcTypeSrc.length - 1].replace('.png', '')) {
                        case 'fc':
                            fcType = 'FC';
                            break;
                        case 'fcplus':
                            fcType = 'FC+';
                            break;
                        case 'ap':
                            fcType = 'AP';
                            break;
                        case 'applus':
                            fcType = 'AP+';
                            break;
                        default:
                            fcType = '';
                            break;
                    }

                    let syncType
                    let syncTypeSrc = record.querySelectorAll('.playlog_result_innerblock > img')[1].getAttribute('src').split('?')[0].split('/')
                    switch (syncTypeSrc[syncTypeSrc.length - 1].replace('.png', '')) {
                        case 'sync':
                            syncType = 'SYNC';
                            break;
                        case 'fs':
                            syncType = 'FS';
                            break;
                        case 'fsplus':
                            syncType = 'FS+';
                            break;
                        case 'fsd':
                            syncType = 'FDX';
                            break;
                        case 'fsdplus':
                            syncType = 'FDX+';
                            break;
                        default:
                            syncType = '';
                            break;
                    }

                    let idx = record.querySelector('form > input[name="idx"]').getAttribute('value')
                    let recordData = {
                        track: track,
                        time: time,
                        difficulty: difficulty,
                        chartType: chartType,
                        level: level,
                        songName: songName,
                        achievement: achievement,
                        achievementNewRecord: achievementNewRecord,
                        dxScore: dxScore,
                        dxScoreNewRecord: dxScoreNewRecord,
                        dxStar: dxStar,
                        fcType: fcType,
                        syncType: syncType,
                        idx: idx
                    }

                    recentData.data.records.push(recordData)
                })

                win.postMessage(recentData, '*')
            }

            if (typeof e.data !== 'string') return;
            if (e.data.startsWith('request_recentDetail__')) {
                let idx = e.data.split('__')[1]
                let recentDetailData = { type: 'recentDetail', data: {} }
                let data = await fetch(`https://maimaidx-eng.com/maimai-mobile/record/playlogDetail?idx=${idx}`)
                let dom = new DOMParser().parseFromString(await data.text(), 'text/html')

                let record = dom.querySelector('.p_10.t_l.f_0.v_b')
                let track = parseInt(record.querySelectorAll('.playlog_top_container.p_r > .sub_title > span')[0].textContent.replace(/TRACK /g, ''))
                let time = new Date(`${record.querySelectorAll('.playlog_top_container.p_r > .sub_title > span')[1].textContent} GMT+9`)

                let difficulty
                if (record.querySelector('.playlog_remaster_container')) difficulty = 'remaster'
                else if (record.querySelector('.playlog_master_container')) difficulty = 'master'
                else if (record.querySelector('.playlog_expert_container')) difficulty = 'expert'
                else if (record.querySelector('.playlog_advanced_container')) difficulty = 'advanced'
                else if (record.querySelector('.playlog_basic_container')) difficulty = 'basic'

                let songName = record.querySelector(`.playlog_${difficulty}_container > .basic_block`).textContent.replace(record.querySelector('.w_80.f_r > .music_lv_back').textContent, '').replace(/[\t\n]+/g, '')

                let level = record.querySelector('.w_80.f_r > .music_lv_back').textContent

                let chartType
                let chartTypeSrc = record.querySelector('.playlog_music_kind_icon').getAttribute('src').split('?')[0].split('/')
                switch (chartTypeSrc[chartTypeSrc.length - 1].replace('.png', '')) {
                    case 'music_standard':
                        chartType = 'std';
                        break;
                    case 'music_dx':
                        chartType = 'dx';
                        break;
                }

                let achievement = record.querySelector('.playlog_achievement_txt').textContent
                let achievementNewRecord = !!record.querySelector('.playlog_achievement_newrecord')

                let dxScore = record.querySelector('.playlog_score_block').textContent.replace(/[\t\n]+/g, '')
                let dxScoreNewRecord = !!record.querySelector('.playlog_deluxscore_newrecord')
                let dxStar
                if (record.querySelector('.playlog_deluxscore_star') === null) {
                    dxStar = 0;
                } else {
                    let srcArray = record.querySelector('.playlog_deluxscore_star').getAttribute('src').split('?')[0].split('/')
                    switch (srcArray[srcArray.length - 1].replace('.png', '')) {
                        case 'dxstar_1':
                            dxStar = 1;
                            break;
                        case 'dxstar_2':
                            dxStar = 2;
                            break;
                        case 'dxstar_3':
                            dxStar = 3;
                            break;
                        case 'dxstar_4':
                            dxStar = 4;
                            break;
                        case 'dxstar_5':
                            dxStar = 5;
                            break;
                        default:
                            dxStar = 0;
                            break;
                    }
                }

                let fcType
                let fcTypeSrc = record.querySelectorAll('.playlog_result_innerblock > img')[0].getAttribute('src').split('?')[0].split('/')
                switch (fcTypeSrc[fcTypeSrc.length - 1].replace('.png', '')) {
                    case 'fc':
                        fcType = 'FC';
                        break;
                    case 'fcplus':
                        fcType = 'FC+';
                        break;
                    case 'ap':
                        fcType = 'AP';
                        break;
                    case 'applus':
                        fcType = 'AP+';
                        break;
                    default:
                        fcType = '';
                        break;
                }

                let syncType
                let syncTypeSrc = record.querySelectorAll('.playlog_result_innerblock > img')[1].getAttribute('src').split('?')[0].split('/')
                switch (syncTypeSrc[syncTypeSrc.length - 1].replace('.png', '')) {
                    case 'sync':
                        syncType = 'SYNC';
                        break;
                    case 'fs':
                        syncType = 'FS';
                        break;
                    case 'fsplus':
                        syncType = 'FS+';
                        break;
                    case 'fsd':
                        syncType = 'FDX';
                        break;
                    case 'fsdplus':
                        syncType = 'FDX+';
                        break;
                    default:
                        syncType = '';
                        break;
                }

                let noteDetail = {}
                let noteDetailElement = dom.querySelector('.playlog_notes_detail')
                let notes = ['', 'tap', 'hold', 'slide', 'touch', 'break']
                for (let i = 1; i < notes.length; i++) {
                    let thisNote = noteDetailElement.querySelectorAll('tr')[i]
                    let countElement = thisNote.querySelectorAll('td')
                    countElement.forEach(element => {
                        let count = element.textContent.trim().length === 0 ? '-' : element.textContent.trim()
                        if (!noteDetail[notes[i]]) {
                            noteDetail[notes[i]] = []
                        }
                        noteDetail[notes[i]].push(count)
                    })

                }

                let combo = dom.querySelectorAll('.gray_block > .p_5 > .col2 > .playlog_score_block')[0].textContent.replace(/[\t\n]+/g, '')
                let sync = dom.querySelectorAll('.gray_block > .p_5 > .col2 > .playlog_score_block')[1].textContent.replace(/[\t\n]+/g, '')

                let fastLate = []
                let fastLateElement = dom.querySelectorAll('.playlog_fl_block > .w_96.f_l.t_r > .p_t_5').forEach(element => fastLate.push(element.textContent.replace(/[\t\n]+/g, '')))

                recentDetailData.data = {
                    track: track,
                    time: time,
                    difficulty: difficulty,
                    chartType: chartType,
                    level: level,
                    songName: songName,
                    achievement: achievement,
                    achievementNewRecord: achievementNewRecord,
                    dxScore: dxScore,
                    dxScoreNewRecord: dxScoreNewRecord,
                    dxStar: dxStar,
                    fcType: fcType,
                    syncType: syncType,
                    fastLate: {
                        fast: fastLate[0],
                        late: fastLate[1]
                    },
                    idx: idx,
                    noteDetail: noteDetail,
                    combo: combo,
                    sync: sync
                }
                win.postMessage(recentDetailData, '*')
            }

            if (e.data.startsWith('request_allScores__')) {
                let difficulty = e.data.split('__')[1]
                let scoresData = { type: 'scoresData', data: { records: [] } }
                let scoreData = await fetch(`https://maimaidx-eng.com/maimai-mobile/record/musicSort/search/?search=A&sort=1&playCheck=on&diff=${difficultyNumber[difficulty]}`)
                let playCountData = await fetch(`https://maimaidx-eng.com/maimai-mobile/record/musicMybest/search/?diff=${difficultyNumber[difficulty]}`)

                let scoreDom = new DOMParser().parseFromString(await scoreData.text(), 'text/html')
                let playCountDom = new DOMParser().parseFromString(await playCountData.text(), 'text/html')

                let allRecords = scoreDom.querySelectorAll(`.music_${difficulty}_score_back`)
                let allPlayCounts = playCountDom.querySelectorAll(`.music_${difficulty}_score_back`)

                let dataScore = []
                let dataPlayCount = []

                for (let record of allRecords) {
                    let name = record.querySelector('.music_name_block').textContent.replace(/[\t\n]+/g, '')
                    let chartTypeIcon = record.querySelector('.music_kind_icon').getAttribute('src').split('?')[0].split('/').pop().replace('.png', '')
                    let chartType
                    switch (chartTypeIcon) {
                        case 'music_standard':
                            chartType = 'std';
                            break;
                        case 'music_dx':
                            chartType = 'dx';
                            break;
                        default:
                            chartType = '';
                            break;
                    }

                    let level = record.querySelector('.music_lv_block').textContent
                    let achievement = record.querySelectorAll('.music_score_block')[0].textContent.replace(/[\t\n]+/g, '')
                    let dxScore = record.querySelectorAll('.music_score_block')[1].textContent.replace(/[\t\n]+/g, '')

                    let syncTypeIcon = record.querySelectorAll('.h_30.f_r')[0].getAttribute('src').split('?')[0].split('/').pop().replace('.png', '')
                    let syncType
                    switch (syncTypeIcon) {
                        case 'music_icon_fs':
                            syncType = 'FS';
                            break;
                        case 'music_icon_fsp':
                            syncType = 'FS+';
                            break;
                        case 'music_icon_fdx':
                            syncType = 'FDX';
                            break;
                        case 'music_icon_fdxp':
                            syncType = 'FDX+';
                            break;
                        case 'music_icon_sync':
                            syncType = 'SYNC';
                            break;
                        case 'music_icon_back':
                            syncType = 'none';
                            break;
                        default:
                            syncType = '';
                            break;
                    }

                    let comboTypeIcon = record.querySelectorAll('.h_30.f_r')[1].getAttribute('src').split('?')[0].split('/').pop().replace('.png', '')
                    let comboType
                    switch (comboTypeIcon) {
                        case 'music_icon_fc':
                            comboType = 'FC';
                            break;
                        case 'music_icon_fcp':
                            comboType = 'FC+';
                            break;
                        case 'music_icon_ap':
                            comboType = 'AP';
                            break;
                        case 'music_icon_app':
                            comboType = 'AP+';
                            break;
                        case 'music_icon_back':
                            comboType = 'none';
                            break;
                        default:
                            comboType = '';
                            break;
                    }

                    dataScore.push({
                        name: name,
                        chartType: chartType,
                        level: level,
                        difficulty: difficulty,
                        achievement: achievement,
                        dxScore: dxScore,
                        syncType: syncType,
                        comboType: comboType
                    })
                }

                for (let playCountRecord of allPlayCounts) {
                    let name = playCountRecord.querySelector('.music_name_block').textContent.replace(/[\t\n]+/g, '')
                    let chartTypeIcon = playCountRecord.querySelector('.music_kind_icon').getAttribute('src').split('?')[0].split('/').pop().replace('.png', '')
                    let chartType
                    switch (chartTypeIcon) {
                        case 'music_standard':
                            chartType = 'std';
                            break;
                        case 'music_dx':
                            chartType = 'dx';
                            break;
                        default:
                            chartType = '';
                            break;
                    }
                    let playCount = playCountRecord.querySelector('.music_score_block').textContent.replace(/[\t\n]+/g, '').split('：')[1]
                    dataPlayCount.push({
                        name: name,
                        chartType: chartType,
                        difficulty: difficulty,
                        playCount: playCount
                    })
                }

                for (let score of dataScore) {
                    let playCountRecord = dataPlayCount.find(record => record.name === score.name && record.chartType === score.chartType && record.difficulty === score.difficulty);
                    if (playCountRecord) {
                        score.playCount = playCountRecord.playCount;
                    }
                    scoresData.data.records.push(score);
                }

                scoresData.data.difficulty = difficulty;

                console.log(scoresData);

                win.postMessage(scoresData, '*')
            }
        })
    }
    urlSpan.appendChild(url)
    commentBox.appendChild(urlSpan)
})();