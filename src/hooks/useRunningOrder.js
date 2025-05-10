import { useEffect, useState } from "react";
import { CountryRequests } from "../utils/requestUtils";
import { EventID, useSession } from "../components/common/session/SessionProvider";

export function useRunningOrder() {

    const [runningOrder, setRunningOrder] = useState(-1);

    const {addListener} = useSession();

    // Initialize
    useEffect(() => {
        fetchData();
        registerEvents();
    }, []);

    const fetchData = async () => {
        const response = await CountryRequests.getRunningCountryNumber();

        if (response.success) {
            setRunningOrder(response.jsonData.currentRunningOrder);
        }
    }

    // Socket Listeners
    const registerEvents = () => {
        addListener(EventID.NEXTCOUNTRY, onNextCountryListener);
    }

    const onNextCountryListener = (sender, nextRunningCountry) => {
        setRunningOrder(nextRunningCountry.runningOrder);
    }

    return {
        runningOrder
    }
}