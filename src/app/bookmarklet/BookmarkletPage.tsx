'use client';

import React, { useState } from "react";


const BookmarkletPage = () => {
    const bookmarklet = `(function(d){if(["https://maimaidx-eng.com"].indexOf(d.location.origin)>=0){var s=d.createElement("script");s.src="https://minecraftpeayer.me/maibot-bookmarklet/main.bundle.js?t="+Math.floor(Date.now()/60000);d.body.append(s);}})(document)`;
    const [copied, setCopied] = useState(false);

    const copyToClipboard = async () => {
        try {
            await navigator.clipboard.writeText(bookmarklet);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch {
            // ignore
        }
    };

    return <div className="bg-gray-800 w-screen h-screen p-6 text-white">
        <h1 className="text-4xl font-bold mb-4">maibot-bookmarklet</h1>

        <ol className="list-decimal ml-6 space-y-4">
            <li>
                <strong>Create a bookmark:</strong> Add a new bookmark in your browser.
            </li>
            <li>
                <strong>Edit the bookmark:</strong> Open its edit dialog and replace the URL. (You can change the name if you want.)
            </li>
            <li>
                <strong>Paste the script:</strong>
                <div className="mt-2 flex flex-col sm:flex-row sm:items-center sm:space-x-3">
                    <input
                        readOnly
                        value={bookmarklet}
                        onClick={copyToClipboard}
                        className="flex-1 bg-gray-700 text-sm p-2 rounded border border-gray-600 cursor-pointer font-mono"
                        aria-label="bookmarklet"
                        title="Click to copy bookmarklet"
                    />
                </div>

                <p className="text-sm text-gray-300 mt-2">{copied ? (
                    <div className="mt-2 text-green-300 font-medium">
                        Copied!
                    </div>
                ) : <p>Click the box to copy, then paste into the bookmark's URL/location field and save.</p>}</p>
            </li>
            <li>
                <strong>Complete!</strong>
            </li>
        </ol>

        <ol className="list-decimal ml-6 space-y-4">
            If you wish to use user scripts instead, consider using{" "}
            <a
                href="https://github.com/MinecraftPEayer/maibot-bookmarklet/raw/main/scripts/script.user.js"
                className="text-blue-400 underline"
                target="_blank"
                rel="noopener noreferrer"
            >
                this user script
            </a>
            .
        </ol>
    </div>;
}

export default BookmarkletPage;