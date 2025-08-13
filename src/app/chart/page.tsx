import fs from "fs";
import { Suspense } from "react";
import ChartElement from "./Chart";
import axios from "axios";
import exception from "@/../public/expection.json";

const Chart = async () => {
    const data = fs.readFileSync("tmp/data.json", "utf-8");

    const songDatabse = (
        await axios.get("https://dp4p6x0xfi5o9.cloudfront.net/maimai/data.json")
    ).data;
    return (
        <Suspense>
            <ChartElement
                data={JSON.parse(data)}
                database={songDatabse}
            ></ChartElement>
        </Suspense>
    );
};

export default Chart;
