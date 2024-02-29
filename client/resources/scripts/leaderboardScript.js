import { announcementContainer, initMenuBtnListener } from "./utils/documentUtils.js";
import { leaderboardTemplates } from "./utils/handlebarsUtils.js";
import { getAllCountries, getAllJudges, getRunningCountryNumber, getVotingCountryStatuses, serverURL, voteCountry } from "./utils/requestUtils.js";
import { io } from "https://cdn.socket.io/4.4.1/socket.io.esm.min.js"

var loginJudgeCode = "agg";
var runningCountry = 0;
var totalCountries = 0;
var announcements = [];
var importantAnnouncements = [];
const socket = io(serverURL.p3000);
const StatusMapping = new Map([
    ["OPEN", "open-voting-status"],
    ["CLOSED", "closed-voting-status"]
]);

window.onload = init;

function init() {
    initLeaderboardContainer();

    initBtnListeners();

    announcementContainer(announcements, importantAnnouncements);
    const test = document.getElementById("test");

    test.addEventListener("click", e => test2(e))
}

function test2(e) {
    const d = document.getElementById("announcement-content");
    d.querySelector("p").classList.add("hide-announcement-box");
    
    setTimeout(() => {
        d.innerHTML = "<p>Announcements-2</p>";
        
    }, 1000);
}

//#region Init functions

function initBtnListeners() {
    initMenuBtnListener();
}

function initLeaderboardContainer() {
    getInitData()
    .then(data => {
        if (data != null) {
            const votingLeaderboardContainer = document.getElementById("voting-leaderboard-container");

            var content = leaderboardTemplates.votingLeaderboardContainer(data);
            votingLeaderboardContainer.innerHTML = content;

            initVotesToJudgesAndVotingStatuses(data.countries, data.votingStatuses);
        }
    });
}

function initVotesToJudgesAndVotingStatuses(countries, votingStatuses) {
    for (var country of countries) {
        for (var [judgeCode, points] of Object.entries(country.votes)) {
            setVoteToJudge(judgeCode, country.code, points);
        }

        let votingStatus = votingStatuses.find(element => element.countryCode == country.code);
        
        if (votingStatus == null) continue;
        setVotingStatus(country.code, votingStatus.status);
    }
}

//#endregion

//#region General functions

async function getInitData() {
    const runningCountryResponse = await getRunningCountryNumber();
    const countriesResponse = await getAllCountries();
    const judgesResponse = await getAllJudges();
    const votingStatusesResponse = await getVotingCountryStatuses();

    if (runningCountryResponse.success && countriesResponse.success &&
        judgesResponse.success && votingStatusesResponse.success) {
        runningCountry = runningCountryResponse.jsonData.runningCountry;
        totalCountries = countriesResponse.jsonData.countries.length;

        return {countries : countriesResponse.jsonData.countries, judges : judgesResponse.jsonData.judges, votingStatuses : votingStatusesResponse.jsonData.votingStatuses}
    }

    return null;
}

function setVoteToJudge(judgeCode, countryCode, points) {
    const tag = countryCode + "-" + judgeCode + "-points";
    const votingCell = document.getElementById(tag);

    if (votingCell == null) return;

    votingCell.innerHTML = points;
}

function setVotingStatus(countryCode, votingStatus) {
    const tag = countryCode + "-voting-status";
    const votingStatusCell = document.getElementById(tag);

    if (votingStatusCell == null) return;

    votingStatusCell.innerHTML = votingStatus;
    //let votingStatusClass = StatusMapping.get(votingStatus);
    //votingStatusCell.classList.remove()
}

function setTotalVotes(countryCode, totalVotes) {
    const tag = countryCode + "-total-votes";
    const totalVotesCell = document.getElementById(tag);

    if (totalVotesCell == null) return;

    totalVotesCell.innerHTML = totalVotes;
}

//#endregion

//#region Socket Listeners

socket.on("hi", (arg) => {
    console.log(arg);
});

socket.on("nextCountry", (nextRunningCountry) => {
    // TO-ADD: Next running country sync.
    //moveToNextCountry(nextRunningCountry); // TO-DO: Highlight next country
    setVotingStatus(nextRunningCountry.runningCountryCode, nextRunningCountry.votingStatus);
    importantAnnouncements.push(nextRunningCountry.message.innerHTML);
});

socket.on("votes", (voting) => {
    setVoteToJudge(voting.judgeCode, voting.countryCode, voting.points);
    setTotalVotes(voting.countryCode, voting.totalVotes);
    announcements.push(voting.message.innerHTML);
});

socket.on("votingStatus", (votingStatus) => {
    for (var countryCode of votingStatus.countries) {
        setVotingStatus(countryCode, votingStatus.status);
    }

    votingStatus.messages.forEach(message => {
        importantAnnouncements.push(message.innerHTML);
    });
});

//#endregion