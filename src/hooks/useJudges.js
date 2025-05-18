import { useEffect, useState } from "react";
import { JudgeRequests } from "../utils/requestUtils";

export function useJudges() {

    const [judges, setJudges] = useState([]);
    const [initialized, setInitialized] = useState(false);

    // Initialize
    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        const response = await JudgeRequests.getAllJudges();

        if (response.success) {
            setJudges(response.jsonData.judges);
            setInitialized(true);
        }
    }

    return {
        judges,
        initialized
    }
}