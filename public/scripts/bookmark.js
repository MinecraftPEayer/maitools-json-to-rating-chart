const indexDefine = ['SSSp', 'APp', 'SSS', 'AP', 'SSp', 'FCp', 'SS', 'FC', 'Sp', 'FDXp', 'S', 'FDX', 'CLEAR', 'FSp', 'dxstar_5', 'FS', 'dxstar_4', 'SYNCPLAY', 'dxstar_3', 'dxstar_2', 'dxstar_1'];

const DifficultyNumber = {
    basic: 0,
    advanced: 1,
    expert: 2,
    master: 3,
    remaster: 4
};

const Difficulty = {
    Basic: 0,
    Advanced: 1,
    Expert: 2,
    Master: 3,
    ReMaster: 4
}

const ComboType = {
    none: -1,
    FC: 0,
    FCp: 1,
    AP: 2,
    APp: 3
}

const SyncType = {
    none: -1,
    FS: 0,
    FSp: 1,
    FDX: 2,
    FDXp: 3,
    SYNC: 4
}

const ChartType = {
    STD: 0,
    DX: 1,
    UTAGE: 2
}

const TitleType = {
    Normal: 0,
    Bronze: 1,
    Silver: 2,
    Gold: 3,
    Rainbow: 4,
}

const DifficultyStringId = {
    [Difficulty.Basic]: 'basic',
    [Difficulty.Advanced]: 'advanced',
    [Difficulty.Expert]: 'expert',
    [Difficulty.Master]: 'master',
    [Difficulty.ReMaster]: 'remaster'
}

const ToolURL = 'https://chart.minecraftpeayer.me/update-data';

async function requestPlayerData(e) {
    let playerData = { type: 'playerData', data: {} }
    let data = await fetch('https://maimaidx-eng.com/maimai-mobile/playerData')
    let dom = new DOMParser().parseFromString(await data.text(), 'text/html')
    let playerName = dom.querySelector('.name_block').textContent
    playerData.data.playerName = playerName

    let rating = dom.querySelector('.rating_block').textContent
    playerData.data.rating = parseInt(rating)

    let trophyElement = dom.querySelector('.trophy_inner_block');
    let title = { text: trophyElement.textContent.replace(/[\t\n]+/g, '') };
    if (dom.querySelector('.trophy_Normal')) {
        title.type = TitleType.Normal;
    } else if (dom.querySelector('.trophy_Bronze')) {
        title.type = TitleType.Bronze;
    } else if (dom.querySelector('.trophy_Silver')) {
        title.type = TitleType.Silver;
    } else if (dom.querySelector('.trophy_Gold')) {
        title.type = TitleType.Gold;
    } else if (dom.querySelector('.trophy_Rainbow')) {
        title.type = TitleType.Rainbow;
    }
    playerData.data.title = title

    let avatarURL = dom.querySelector('.basic_block > img').src;
    playerData.data.avatar = avatarURL;

    playerData.data.overviewData = {}
    let overviewData = dom.querySelectorAll('.musiccount_block')
    for (let i = 0; i < overviewData.length; i++) {
        let index = indexDefine[i]
        let text = overviewData[i].textContent.replace(/[\t\n]+/g, '').replace(/,/g, '')
        playerData.data.overviewData[index] = text.split('/').map(item => parseInt(item))
    }

    let courseImage = dom.querySelectorAll('.h_35.f_l')[0].getAttribute('src')
    let classImage = dom.querySelectorAll('.h_35.f_l')[1].getAttribute('src')

    playerData.data.course = courseImage
    playerData.data.class = classImage

    let playCountMsg = dom.querySelector('.m_5.m_b_5.t_r.f_12').innerHTML.replace('<br>', '\n')
    let playCountAll = parseInt(playCountMsg.split('\n')[1].split('：')[1])
    let playCountCurrent = parseInt(playCountMsg.split('\n')[0].split('：')[1])
    playerData.data.playCount = { all: playCountAll, current: playCountCurrent }

    return playerData
}

async function requestRecentAll(e) {
    let recentData = { type: 'recentAll', data: { records: [] } }
    let data = await fetch('https://maimaidx-eng.com/maimai-mobile/record/')
    let dom = new DOMParser().parseFromString(await data.text(), 'text/html')

    let allRecords = dom.querySelectorAll('.p_10.t_l.f_0.v_b')
    allRecords.forEach((record) => {
        let track = parseInt(record.querySelectorAll('.playlog_top_container.p_r > .sub_title > span')[0].textContent.replace(/TRACK /g, ''))
        let time = new Date(`${record.querySelectorAll('.playlog_top_container.p_r > .sub_title > span')[1].textContent} GMT+9`)

        let difficulty
        if (record.querySelector('.playlog_remaster_container')) difficulty = Difficulty.ReMaster
        else if (record.querySelector('.playlog_master_container')) difficulty = Difficulty.Master
        else if (record.querySelector('.playlog_expert_container')) difficulty = Difficulty.Expert
        else if (record.querySelector('.playlog_advanced_container')) difficulty = Difficulty.Advanced
        else if (record.querySelector('.playlog_basic_container')) difficulty = Difficulty.Basic


        let songName = record.querySelector(`.playlog_${DifficultyStringId[difficulty]}_container > .basic_block`).textContent.replace(record.querySelector('.w_80.f_r > .music_lv_back').textContent, '').replace(/[\t\n]+/g, '')

        let level = record.querySelector('.w_80.f_r > .music_lv_back').textContent

        let chartType
        let chartTypeSrc = record.querySelector('.playlog_music_kind_icon').getAttribute('src').split('?')[0].split('/')
        switch (chartTypeSrc[chartTypeSrc.length - 1].replace('.png', '')) {
            case 'music_standard':
                chartType = ChartType.STD;
                break;
            case 'music_dx':
                chartType = ChartType.DX;
                break;
        }

        let achievement = parseFloat(record.querySelector('.playlog_achievement_txt').textContent.replace('%', ''))
        let achievementNewRecord = !!record.querySelector('.playlog_achievement_newrecord')

        let dxScore = record.querySelector('.playlog_score_block').textContent.replace(/[\t\n]+/g, '').split('/').map(item => parseInt(item.replace(/,/g, '')))
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
                fcType = ComboType.FC;
                break;
            case 'fcplus':
                fcType = ComboType.FCp;
                break;
            case 'ap':
                fcType = ComboType.AP;
                break;
            case 'applus':
                fcType = ComboType.APp;
                break;
            default:
                fcType = ComboType.none;
                break;
        }

        let syncType
        let syncTypeSrc = record.querySelectorAll('.playlog_result_innerblock > img')[1].getAttribute('src').split('?')[0].split('/')
        switch (syncTypeSrc[syncTypeSrc.length - 1].replace('.png', '')) {
            case 'sync':
                syncType = SyncType.SYNC;
                break;
            case 'fs':
                syncType = SyncType.FS;
                break;
            case 'fsplus':
                syncType = SyncType.FSp;
                break;
            case 'fsd':
                syncType = SyncType.FDX;
                break;
            case 'fsdplus':
                syncType = SyncType.FDXp;
                break;
            default:
                syncType = SyncType.none;
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

    return recentData
}

async function requestRecentDetail(e) {
    let idx = e.data.split('__')[1]
    let recentDetailData = { type: 'recentDetail', data: {} }
    let data = await fetch(`https://maimaidx-eng.com/maimai-mobile/record/playlogDetail?idx=${idx}`)
    let dom = new DOMParser().parseFromString(await data.text(), 'text/html')

    let record = dom.querySelector('.p_10.t_l.f_0.v_b')
    let track = parseInt(record.querySelectorAll('.playlog_top_container.p_r > .sub_title > span')[0].textContent.replace(/TRACK /g, ''))
    let time = new Date(`${record.querySelectorAll('.playlog_top_container.p_r > .sub_title > span')[1].textContent} GMT+9`)

    let difficulty
    if (record.querySelector('.playlog_remaster_container')) difficulty = Difficulty.ReMaster
    else if (record.querySelector('.playlog_master_container')) difficulty = Difficulty.Master
    else if (record.querySelector('.playlog_expert_container')) difficulty = Difficulty.Expert
    else if (record.querySelector('.playlog_advanced_container')) difficulty = Difficulty.Advanced
    else if (record.querySelector('.playlog_basic_container')) difficulty = Difficulty.Basic

    let songName = record.querySelector(`.playlog_${DifficultyStringId[difficulty]}_container > .basic_block`).textContent.replace(record.querySelector('.w_80.f_r > .music_lv_back').textContent, '').replace(/[\t\n]+/g, '')

    let level = record.querySelector('.w_80.f_r > .music_lv_back').textContent

    let chartType
    let chartTypeSrc = record.querySelector('.playlog_music_kind_icon').getAttribute('src').split('?')[0].split('/')
    switch (chartTypeSrc[chartTypeSrc.length - 1].replace('.png', '')) {
        case 'music_standard':
            chartType = ChartType.STD;
            break;
        case 'music_dx':
            chartType = ChartType.DX;
            break;
    }

    let achievement = parseFloat(record.querySelector('.playlog_achievement_txt').textContent.replace('%', ''))
    let achievementNewRecord = !!record.querySelector('.playlog_achievement_newrecord')

    console.log(record.querySelector('.playlog_score_block').textContent)
    let dxScore = record.querySelector('.playlog_score_block').textContent.replace(/[\t\n]+/g, '').split('/').map(item => parseInt(item.replace(/,/g, '')))
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
            fcType = ComboType.FC;
            break;
        case 'fcplus':
            fcType = ComboType.FCp;
            break;
        case 'ap':
            fcType = ComboType.AP;
            break;
        case 'applus':
            fcType = ComboType.APp;
            break;
        default:
            fcType = ComboType.none;
            break;
    }

    let syncType
    let syncTypeSrc = record.querySelectorAll('.playlog_result_innerblock > img')[1].getAttribute('src').split('?')[0].split('/')
    switch (syncTypeSrc[syncTypeSrc.length - 1].replace('.png', '')) {
        case 'sync':
            syncType = SyncType.SYNC;
            break;
        case 'fs':
            syncType = SyncType.FS;
            break;
        case 'fsplus':
            syncType = SyncType.FSp;
            break;
        case 'fsd':
            syncType = SyncType.FDX;
            break;
        case 'fsdplus':
            syncType = SyncType.FDXp;
            break;
        default:
            syncType = SyncType.none;
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

    let combo = dom.querySelectorAll('.gray_block > .p_5 > .col2 > .playlog_score_block')[0].textContent.replace(/[\t\n]+/g, '').split('/').map(item => parseInt(item))
    let sync = dom.querySelectorAll('.gray_block > .p_5 > .col2 > .playlog_score_block')[1].textContent.replace(/[\t\n]+/g, '').split('/').map(item => parseInt(item))

    let fastLate = []
    let fastLateElement = dom.querySelectorAll('.playlog_fl_block > .w_96.f_l.t_r > .p_t_5').forEach(element => fastLate.push(parseInt(element.textContent.replace(/[\t\n]+/g, ''))))

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

    return recentDetailData
}

async function requestAllScores(e) {
    let difficulty = e.data.split('__')[1]
    let scoresData = { type: 'scoresData', data: { records: [] } }
    let scoreData = await fetch(`https://maimaidx-eng.com/maimai-mobile/record/musicSort/search/?search=A&sort=1&playCheck=on&diff=${DifficultyNumber[difficulty]}`)
    let playCountData = await fetch(`https://maimaidx-eng.com/maimai-mobile/record/musicMybest/search/?diff=${DifficultyNumber[difficulty]}`)

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
                chartType = ChartType.STD;
                break;
            case 'music_dx':
                chartType = ChartType.DX;
                break;
            default:
                chartType = '';
                break;
        }

        let level = record.querySelector('.music_lv_block').textContent
        let achievement = parseFloat(record.querySelectorAll('.music_score_block')[0].textContent.replace(/[\t\n]+/g, '').replace('%', ''))
        let dxScore = record.querySelectorAll('.music_score_block')[1].textContent.replace(/[\t\n]+/g, '').split('/').map(item => parseInt(item.replace(/,/g, '')))

        let syncTypeIcon = record.querySelectorAll('.h_30.f_r')[0].getAttribute('src').split('?')[0].split('/').pop().replace('.png', '')
        let syncType
        switch (syncTypeIcon) {
            case 'music_icon_fs':
                syncType = SyncType.FS;
                break;
            case 'music_icon_fsp':
                syncType = SyncType.FSp;
                break;
            case 'music_icon_fdx':
                syncType = SyncType.FDX;
                break;
            case 'music_icon_fdxp':
                syncType = SyncType.FDXp;
                break;
            case 'music_icon_sync':
                syncType = SyncType.SYNC;
                break;
            case 'music_icon_back':
                syncType = SyncType.none;
                break;
            default:
                syncType = SyncType.none;
                break;
        }

        let comboTypeIcon = record.querySelectorAll('.h_30.f_r')[1].getAttribute('src').split('?')[0].split('/').pop().replace('.png', '')
        let comboType
        switch (comboTypeIcon) {
            case 'music_icon_fc':
                comboType = ComboType.FC;
                break;
            case 'music_icon_fcp':
                comboType = ComboType.FCp;
                break;
            case 'music_icon_ap':
                comboType = ComboType.AP;
                break;
            case 'music_icon_app':
                comboType = ComboType.APp;
                break;
            case 'music_icon_back':
                comboType = ComboType.none;
                break;
            default:
                comboType = ComboType.none;
                break;
        }

        dataScore.push({
            name: name,
            chartType: chartType,
            level: level,
            difficulty: DifficultyNumber[difficulty],
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
                chartType = ChartType.STD;
                break;
            case 'music_dx':
                chartType = ChartType.DX;
                break;
            default:
                chartType = -1;
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

    return scoresData
}

(function () {
    'use strict';

    let commentBox = document.querySelector('.comment_block')
    let urlSpan = document.createElement('span')
    let url = document.createElement('a')
    url.href = ToolURL
    url.innerText = 'Upload Data to maibot'
    url.target = "ratingChart"
    url.class = 'f_14'
    url.style = 'color: rgb(20, 119, 230);'
    urlSpan.onclick = (e) => {
        let win = window.open(ToolURL, 'ratingChart')

        window.addEventListener('message', async (e) => {
            if (e.data === 'request_playerData') {
                win.postMessage(await requestPlayerData(e), '*')
            }

            if (e.data === 'request_recentAll') {
                win.postMessage(await requestRecentAll(e), '*')
            }

            if (typeof e.data !== 'string') return;
            if (e.data.startsWith('request_recentDetail__')) {
                win.postMessage(await requestRecentDetail(e), '*')
            }

            if (e.data.startsWith('request_allScores__')) {
                win.postMessage(await requestAllScores(e), '*')
            }
        })
    }
    urlSpan.appendChild(url)
    commentBox.appendChild(urlSpan)
})();