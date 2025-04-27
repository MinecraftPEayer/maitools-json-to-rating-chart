# maitools-json-to-rating-chart

English | [繁體中文](README_TW.md)

# Description
This is a tool for converting JSON data into a rating chart. It is designed to be used with the [mai-tools](https://github.com/myjian/mai-tools).

# How to use
1. Use the mai-tools to analyze your rating
2. Click on the "Export as JSON (all records)" button
![Step2](public/README_ASSETS/step2_en.png)
3. Back to maimai DX NET, and use the bookmark script to auto redirect to this page (The bookmark script tutorial can be found [here](https://myjian.github.io/mai-tools/#howto), and the script is at the bottom)
4. Upload JSON file
5. Click on the "Load Chart" button
![Step3-4](public/README_ASSETS/step_4_5_en.png)
6. The generated chart can be found at the bottom of the page for downloading

# Bookmark link

```js
javascript:(function (d) { if (["https://maimaidx-eng.com"].indexOf(d.location.origin) >= 0) { var s = d.createElement("script"); s.src = "https://chart.minecraftpeayer.me/scripts/bookmark.js?t=" + Math.floor(Date.now() / 60000); d.body.append(s); } })(document)
```