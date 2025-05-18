import { useEffect, useState } from "react";
import { CountryRequests } from "../utils/requestUtils";
import { EventID, useSession } from "../components/common/session/SessionProvider";
import { ReactListUtils } from "../utils/react/listUtils";
import { useRunningOrder } from "./useRunningOrder";

export function useCountries() {

    const [countries, setCountries] = useState([]);
    const [runningCountry, setRunningCountry] = useState(null);
    const [initialized, setInitialized] = useState(false);
    
    const {runningOrder} = useRunningOrder();
    const {addListener, removeListener} = useSession();

    // Initialize
    useEffect(() => {
        fetchData();
        registerEvents();
        return () => {
            unregisterEvents();
        }
    }, []);

    useEffect(() => {
        setRunningCountry(countries?.find(country => country.runningOrder == runningOrder));
    }, [runningOrder]);

    const fetchData = async () => {
        const response = await CountryRequests.getAllCountriesWithVotes();

        if (response.success) {
            setCountries(response.jsonData.countries?.sort((a, b) => a?.runningOrder - b?.runningOrder));
            setInitialized(true);
        }
    }

    // Update functions
    const updateProperties = (updatedCountry, ...properties) => {
        ReactListUtils.updateProperties("code", updatedCountry, setCountries, ...properties);
    }

    const updateVote = (countryCode, judgeCode, points) => {
        setCountries((list) => list.map((country) => {
            if (country.code == countryCode) {
                country.votes[judgeCode] = points;
            }

            return country;
        }))
    }

    // Socket Listeners
    const registerEvents = () => {
        addListener(EventID.NEXTCOUNTRY, onNextCountryListener);
        addListener(EventID.VOTES, onVotesListener);
        addListener(EventID.VOTINGSTATUS, onVotingStatusListener);
    }

    const unregisterEvents = () => {
        removeListener(EventID.NEXTCOUNTRY, onNextCountryListener);
        removeListener(EventID.VOTES, onVotesListener);
        removeListener(EventID.VOTINGSTATUS, onVotingStatusListener);
    }

    const onNextCountryListener = (sender, nextRunningCountry) => {
        updateProperties(nextRunningCountry, "votingStatus");
    }

    const onVotesListener = (sender, judge, country, points) => {
        updateProperties(country, "totalVotes");
        updateVote(country.code, judge.code, points);
    }

    const onVotingStatusListener = (sender, country, votingStatus) => {
        updateProperties(country, "votingStatus");
    }

    return {
        countries,
        runningCountry,
        initialized
    }
}