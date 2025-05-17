export async function register() {
    if (process.env.NEXT_RUNTIME === "nodejs") {
        try {
            const MaimaiDXNETDataFetcher = (
                await import("@/lib/MaimaiDXNETDataFetcher")
            ).default;
            const instance = MaimaiDXNETDataFetcher.getInstance();
            await instance.login();
        } catch (e) {
            throw new Error("Unable to init config provider");
        }
    }
}
