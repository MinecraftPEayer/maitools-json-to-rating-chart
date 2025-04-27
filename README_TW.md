# maitools-json-to-rating-chart

[English](README.md) | 繁體中文

# 說明
這是一個將 JSON 資料轉換成 rating 圖表的工具。它是為了配合 [mai-tools](https://github.com/myjian/mai-tools) 使用而設計的。

# 使用方式
1. 使用 mai-tools 分析你的 rating
2. 點擊 "匯出成 JSON 格式 (所有歌曲)" 按鈕
![Step2](/public/README_ASSETS/step2_tw.png)
3. 回到 maimai DX NET，並使用書籤腳本自動重定向到此頁面 (書籤腳本新增方法可參考 [這裡](https://myjian.github.io/mai-tools/#howto)，腳本連結在下面)
4. 上傳 JSON 檔案
5. 點擊 "Load Chart" 按鈕
![Step3-4](public/README_ASSETS/step_4_5_en.png)
6. 點擊下方圖片的右側按鍵可以下載圖片

# 書籤連結

```js
javascript:(function (d) { if (["https://maimaidx-eng.com"].indexOf(d.location.origin) >= 0) { var s = d.createElement("script"); s.src = "https://chart.minecraftpeayer.me/scripts/bookmark.js?t=" + Math.floor(Date.now() / 60000); d.body.append(s); } })(document)
```