import GitHubIcon from "../../public/github.svg";

export default function Home() {
    return (
        <div className="flex justify-center content-center w-[100vw] h-[100vh] items-center bg-black">
            <div>
                <p className="text-gray-600 text-2xl text-center">
                    恭喜你找到了主頁，但這東西沒有主頁
                </p>
                <p className="text-gray-600 text-lg">
                    Congratulations, you found the home page, but there is no
                    home page here.
                </p>
                <a
                    href="/rating-chart"
                    className="text-gray-300 hover:underline text-lg"
                >
                    <p className="text-center mt-5">點我前往工具</p>
                </a>
                <a
                    href="/rating-chart"
                    className="text-gray-300 hover:underline text-lg"
                >
                    <p className="text-center">Click here to go to the tool</p>
                </a>
            </div>

            <a
                className="fixed bottom-5 right-5 w-12 h-12"
                href="https://github.com/MinecraftPEayer/maitools-json-to-rating-chart"
            >
                <GitHubIcon
                    className="w-full h-full"
                    preserveAspectRatio="xMidYMid meet"
                    viewBox="0 0 100 100"
                />
            </a>
        </div>
    );
}
