import { getAllCountries, getAllJudges, getRunningCountryNumber, getVotingCountryStatuses, serverURL } from "../utils/requestUtils.js";
import { io } from "https://cdn.socket.io/4.4.1/socket.io.esm.min.js";
import { adminTemplates } from "../utils/handlebarsUtils.js";
import { handleError, initLoginJudge } from "../utils/documentUtils.js";

var loginJudgeCode = null;
var runningCountry = 0;
var totalCountries = 0;
const socket = io(serverURL.address, {autoConnect: false});

window.onload = init;

function init() {
    try {
        loginJudgeCode = initLoginJudge(socket);

        initVotingCountryContainer();
    }
    catch (e) {handleError(e)}

}

//#region Init functions

function initVotingCountryContainer() {
    const countriesListContainer = document.getElementById("voting-countries-order-list-container");

    getInitData()
    .then(data => {
        if (data == null) return;
        
        var content = adminTemplates.voting.votingCountryContainer.content;
        content.countries = data.countries;
        content.judges = data.judges;
        
        initDashboard(data.countries);

        countriesListContainer.innerHTML = adminTemplates.voting.votingCountryContainer(content);
        
        initVotesToJudges(data.countries);

        initBtnLinsteners();
    })
}

function initBtnLinsteners() {
    const nextCountryBtn = document.getElementById("next-country-btn");
    nextCountryBtn.addEventListener("click", e => nextCountryBtnListener());

    const votingToggleSwitches = document.getElementsByClassName("voting-toggle-switch");
    for (var toggleSwitch of votingToggleSwitches) {
        toggleSwitch.addEventListener("change", e => toggleSwitchListener(e));
    };
}

function initVotesToJudges(countries) {
    for (var country of countries) {

        for (var [judgeCode, points] of Object.entries(country.votes)) {
            setVoteToJudge(judgeCode, country.code, points);
        }
    }
}

function initDashboard(countries) {
    let country = countries.find(el => parseInt(el.runningOrder) == parseInt(runningCountry));
    if (country != null) {
        setRunningCountryDashboard(runningCountry, country.name, country.song, country.artist);
        setTotalVotesDashboard(country.totalVotes);
        setJudgesDashboard(Object.keys(country.votes).length, 1, 2, countries.length);
    }
}

//#endregion

//#region General functions

async function getInitData() {
    const countriesResponse = await getAllCountries();
    const judgesResponse = await getAllJudges();
    const runningCountryResponse = await getRunningCountryNumber();
    const votingCountryStatusesResponse = await getVotingCountryStatuses();

    if (countriesResponse.success && judgesResponse.success && runningCountryResponse.success && votingCountryStatusesResponse.success) {
        runningCountry = runningCountryResponse.jsonData.runningCountry;

        const fetchedCountries = countriesResponse.jsonData.countries;
        totalCountries = fetchedCountries.length;
        const fetchedVotingCountryStatuses = votingCountryStatusesResponse.jsonData.votingStatuses;
        
        return {countries : mergeVotingStatusesToCountries(fetchedCountries, fetchedVotingCountryStatuses), judges : judgesResponse.jsonData.judges};
    }

    return null;
}

function mergeVotingStatusesToCountries(countries, votingStatuses) {
    countries.forEach(country => {
        if (votingStatuses == null) {
            country.isVotingOpen = false;
        }
        else {
            var votingStatus = votingStatuses.find(element => element.countryCode == country.code);
    
            if (votingStatus == null) country.isVotingOpen = false;
            else country.isVotingOpen = votingStatus.status == "OPEN";
        }
    });

    return countries;
}

function setVotingStatusToToggleSwitch(runningOrder, votingStatus) {
    const votingStatusToggleSwitch = document.querySelector('input[runningorder="' + runningOrder + '"]');
    
    if (votingStatusToggleSwitch != null) votingStatusToggleSwitch.checked = votingStatus == "OPEN";
}

function setVoteToJudge(judgeCode, countryCode, points) {
    const tag = countryCode + "-" + judgeCode + "-point" + points;
    const chosenPoint = document.getElementById(tag);

    if (chosenPoint == null) return;

    chosenPoint.checked = true;
}

function setTotalVotes(countryCode, totalVotes) {
    const votingCountryDetail = document.querySelector("details[countrycode=" + countryCode + "]");
    if (votingCountryDetail == null) return;

    votingCountryDetail.querySelector(".total-votes-txt").innerHTML = totalVotes;
}

//#endregion

//#region Dashboard functions

function setRunningCountryDashboard(runningOrder, countryName, song, artist) {
    const runningOrderTag = "admin-db-running-order-txt";
    const runningCountryNameTag = "admin-db-running-country-name-txt";
    const songTag = "admin-db-song-txt";
    const artistTag = "admin-db-artist-txt";

    const runningOrderSpan = document.getElementById(runningOrderTag);
    const runningCountryCodeSpan = document.getElementById(runningCountryNameTag);
    const songSpan = document.getElementById(songTag);
    const artistSpan = document.getElementById(artistTag);

    runningOrderSpan.innerHTML = runningOrder;
    runningCountryCodeSpan.innerHTML = countryName;
    songSpan.innerHTML = song;
    artistSpan.innerHTML = artist;
}

function setJudgesDashboard(judgesVotedNumber, onlineJudgesNumber, offlineJudgesNumber, totalJudgesNumber = null) {
    const totalJudgesNoTag = "admin-db-total-judges-no-txt";
    const judgesVotedNoTag = "judges-voted-no-txt";
    const onlineJudgesNoTag = "admin-db-online-judges-no-txt";
    const offlineJudgesNoTag = "admin-db-offline-judges-no-txt";

    if (totalJudgesNumber != null) {
        const totalJudgesNoSpans = document.getElementsByClassName(totalJudgesNoTag);
        for (let totalJudgeNoSpan of totalJudgesNoSpans) {
            totalJudgeNoSpan.innerHTML = totalJudgesNumber;
        }
    }
    const judgesVotedNoSpan = document.getElementById(judgesVotedNoTag);
    const onlineJudgesNoSpan = document.getElementById(onlineJudgesNoTag);
    const offlineJudgesNoSpan = document.getElementById(offlineJudgesNoTag);

    judgesVotedNoSpan.innerHTML = judgesVotedNumber;
    onlineJudgesNoSpan.innerHTML = onlineJudgesNumber;
    offlineJudgesNoSpan.innerHTML = offlineJudgesNumber;
}

function setTotalVotesDashboard(totalVotes) {
    const totalVotesTag = "admin-db-total-votes-txt";

    const totalVotesSpan = document.getElementById(totalVotesTag);
    totalVotesSpan.innerHTML = totalVotes;
}

//#endregion


//#region Event Listener Functions

function toggleSwitchListener(e) {
    let countryCode = e.target.getAttribute("countrycode");
    let status = e.target.checked ? "OPEN" : "CLOSED";

    socket.emit("votingStatus", {status : status, countries : [countryCode]});
}

function nextCountryBtnListener() {
    runningCountry = runningCountry % totalCountries + 1; 
    const votingStatus = "OPEN";

    socket.emit("nextCountry", {runningCountry : runningCountry, votingStatus : votingStatus});
    setVotingStatusToToggleSwitch(runningCountry, votingStatus);
}

//#endregion

//#region Socket Listeners

socket.on("hi", (arg) => {
    console.log(arg);
})

socket.on("votes", (response) => {
    let voting = response.data.voting;

    setVoteToJudge(voting.judgeCode, voting.countryCode, voting.points);
    setTotalVotes(voting.countryCode, voting.totalVotes);
})

socket.on("nextCountry", (response) => {
    let nextRunningCountry = response.data.nextRunningCountry.country;
    console.log(nextRunningCountry)
    setRunningCountryDashboard(nextRunningCountry.runningOrder, nextRunningCountry.name, nextRunningCountry.song, nextRunningCountry.artist);
})

//#endregion