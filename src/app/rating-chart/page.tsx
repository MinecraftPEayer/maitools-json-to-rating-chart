import { Suspense } from "react"
import RatingChart from "./RatingChart"
import axios from "axios"

const RatingChartPage = async () => {
    const songDatabse = (await axios.get('https://dp4p6x0xfi5o9.cloudfront.net/maimai/data.json')).data
    return (<Suspense><RatingChart songDatabase={songDatabse}/></Suspense>)
}

export default RatingChartPage