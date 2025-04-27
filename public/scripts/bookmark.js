if (confirm('如果你已經到mai-tools的Analyze Rating頁面下載好了成績資料的JSON檔案請按確定')) {
    let resp = await(await fetch('https://maimaidx-eng.com/maimai-mobile/home')).text()
    let dom = new DOMParser().parseFromString(resp, 'text/html')
    let playerName = document.querySelector('.name_block').innerHTML
    let playerAvatar = new URL(document.querySelector('.basic_block img').src).pathname.split('/').slice(-1)[0].replace('.png', '')

    location.href = `https://chart.minecraftpeayer.me/rating-chart?playerName=${playerName}&avatar=${playerAvatar}`
}

// javascript: (function (d) { if (["https://maimaidx-eng.com"].indexOf(d.location.origin) >= 0) { var s = d.createElement("script"); s.src = "https://chart.minecraftpeayer.me/scripts/bookmark.js?t=" + Math.floor(Date.now() / 60000); d.body.append(s); } })(document)