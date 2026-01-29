"use client";

import React, { useState } from "react";

const translations = {
    en: {
        title: "maibot-bookmarklet",
        steps: [
            {
                title: "Create a bookmark:",
                desc: "Add a new bookmark in your browser.",
            },
            {
                title: "Edit the bookmark:",
                desc: "Open its edit dialog and replace the URL. (You can change the name if you want.)",
            },
            {
                title: "Paste the script and add 'javascript:' at the beginning:",
                instructions:
                    "Click the box to copy, then paste into the bookmark's URL/location field and save.",
                copied: "Copied!",
                important: "Important:",
                importantText: "Make sure the bookmark URL begins with",
                example: "Example:",
            },
            {
                title: "Complete!",
            },
        ],
        userScript: "If you wish to use user scripts instead, consider using",
        userScriptLink: "this user script",
    },
    tw: {
        title: "maibot-bookmarklet",
        steps: [
            {
                title: "建立書籤：",
                desc: "在您的瀏覽器中新增一個任意書籤。",
            },
            {
                title: "編輯書籤：",
                desc: "打開該書籤的編輯對話框，並準備替換網址。（您可以根據需要更改名稱。）",
            },
            {
                title: "貼上腳本並在開頭手動加上 'javascript:'：",
                instructions:
                    "點擊上方區塊即可複製，接著貼上到書籤的「網址」欄位並儲存。",
                copied: "已複製！",
                important: "重要：",
                importantText: "請務必確保書籤網址是以",
                example: "範例：",
            },
            {
                title: "完成！",
            },
        ],
        userScript: "如果您偏好使用使用者腳本 (User Script)，可以考慮安裝",
        userScriptLink: "此使用者腳本",
    },
};

const BookmarkletPage = () => {
    const [lang, setLang] = useState<"en" | "tw">("tw");
    const [copied, setCopied] = useState(false);

    const t = translations[lang];
    const bookmarklet = `(function(d){if(["https://maimaidx-eng.com"].indexOf(d.location.origin)>=0){var s=d.createElement("script");s.src="https://minecraftpeayer.me/maibot-bookmarklet/main.bundle.js?t="+Math.floor(Date.now()/60000);d.body.append(s);}})(document)`;

    const copyToClipboard = async () => {
        try {
            await navigator.clipboard.writeText(bookmarklet);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch {
            /* ignore */
        }
    };

    return (
        <div className="bg-gray-800 min-h-screen p-6 text-white relative">
            {/* 語言切換按鈕 */}
            <div className="absolute top-6 right-6 flex space-x-2">
                <button
                    onClick={() => setLang("en")}
                    className={`px-3 py-1 rounded text-sm ${lang === "en" ? "bg-blue-600" : "bg-gray-700 hover:bg-gray-600"}`}
                >
                    English
                </button>
                <button
                    onClick={() => setLang("tw")}
                    className={`px-3 py-1 rounded text-sm ${lang === "tw" ? "bg-blue-600" : "bg-gray-700 hover:bg-gray-600"}`}
                >
                    繁體中文
                </button>
            </div>

            <h1 className="text-4xl font-bold mb-8 pr-32">{t.title}</h1>

            <ol className="list-decimal ml-6 space-y-6 max-w-4xl">
                <li>
                    <strong>{t.steps[0].title}</strong> {t.steps[0].desc}
                </li>
                <li>
                    <strong>{t.steps[1].title}</strong> {t.steps[1].desc}
                </li>
                <li>
                    <strong>{t.steps[2].title}</strong>
                    <div className="mt-3 flex flex-col sm:flex-row sm:items-center sm:space-x-3">
                        <input
                            readOnly
                            value={bookmarklet}
                            onClick={copyToClipboard}
                            className="flex-1 bg-gray-700 text-sm p-3 rounded border border-gray-600 cursor-pointer font-mono hover:border-gray-400 transition-colors"
                            aria-label="bookmarklet"
                            title="Click to copy"
                        />
                    </div>

                    <div className="text-sm text-gray-300 mt-2 h-6">
                        {copied ? (
                            <span className="text-green-300 font-medium animate-pulse">
                                {t.steps[2].copied}
                            </span>
                        ) : (
                            t.steps[2].instructions
                        )}
                    </div>

                    <div className="mt-4 p-4 rounded bg-yellow-400 text-black text-sm">
                        <div className="font-bold mb-1">
                            {t.steps[2].important}
                        </div>
                        {t.steps[2].importantText}{" "}
                        <code className="bg-black/10 px-1 rounded font-mono font-bold">
                            javascript:
                        </code>
                        <div className="mt-2 opacity-80">
                            {t.steps[2].example}{" "}
                            <code className="font-mono">
                                javascript:(function(...))()
                            </code>
                        </div>
                    </div>
                </li>
                <li>
                    <strong>{t.steps[3].title}</strong>
                </li>
            </ol>

            <div className="mt-12 pt-6 border-t border-gray-700 text-gray-400 text-sm">
                {t.userScript}{" "}
                <a
                    href="https://github.com/MinecraftPEayer/maibot-bookmarklet/raw/main/scripts/script.user.js"
                    className="text-blue-400 underline hover:text-blue-300"
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    {t.userScriptLink}
                </a>
                。
            </div>
        </div>
    );
};

export default BookmarkletPage;
