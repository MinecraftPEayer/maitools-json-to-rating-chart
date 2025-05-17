import { Suspense } from "react"
import RatingChart from "./RatingChart"
import axios from "axios"

import expection from '@/../public/expection.json'

const RatingChartPage = async () => {
    const songDatabse = (await axios.get('https://dp4p6x0xfi5o9.cloudfront.net/maimai/data.json')).data
    return (<Suspense><RatingChart songDatabase={songDatabse} expection={expection} /></Suspense>)
}

export default RatingChartPage