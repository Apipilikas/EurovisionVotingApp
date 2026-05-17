import { useEffect, useState } from "react";
import { JudgeRequests } from "../utils/requestUtils";
import { useIsInitialized } from "./useIsInitialized";

export function useJudges() {

    const [judges, setJudges] = useState([]);
    const {isInitialized} = useIsInitialized(judges);

    // Initialize
    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        const response = await JudgeRequests.getAllJudges();

        if (response.success) {
            setJudges(response.jsonData.judges);
        }
    }

    return {
        judges,
        initialized : isInitialized
    }
}