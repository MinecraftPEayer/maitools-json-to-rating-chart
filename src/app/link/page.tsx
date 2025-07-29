"use client";

import { Suspense } from "react";
import LinkPage from "./Link";

const Page = () => {
    return (
        <Suspense>
            <LinkPage />
        </Suspense>
    );
};

export default Page;
