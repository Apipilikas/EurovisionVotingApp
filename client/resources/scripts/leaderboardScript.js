import { NotificationBox, NotificationType } from "./customElements/notificationBox.js";
import { initAnnouncementContainer, initMenuBtnListener } from "./utils/documentUtils.js";
import { leaderboardTemplates, votingTemplates } from "./utils/handlebarsUtils.js";
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

    initAnnouncementContainer(announcements, importantAnnouncements);

    initVotingCountryPanelContainer();
}

//#region Init functions

function initBtnListeners() {
    initMenuBtnListener();

    NotificationBox.createAndShow(NotificationType.ERROR, "test", "notification-box-container", "HI");
}

function initLeaderboardContainer() {
    getInitData()
    .then(data => {
        if (data != null) {
            const votingLeaderboardContainer = document.getElementById("voting-leaderboard-container");

            var content = leaderboardTemplates.votingLeaderboardContainer(data);
            votingLeaderboardContainer.innerHTML = content;

            initVotesToJudgesAndVotingStatuses(data.countries, data.votingStatuses);
            highlightRunningCountry();
            initTableRowListeners();
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

function initTableRowListeners() {
    const leaderboardTableRows = document.querySelectorAll("tr:not(:first-child)");

    leaderboardTableRows.forEach(tr => {
        tr.addEventListener("click", e => tableRowListener(e));
    });
}

function initVotingCountryPanelContainer() {
    const votingCountryPanelContent = document.getElementById("voting-country-panel-content");
    let content = votingTemplates.votingContent(votingTemplates.votingContent.content);
    votingCountryPanelContent.innerHTML = content;
    
    const votingCountryPanelBtn = votingCountryPanelContent.querySelector("button");
    votingCountryPanelBtn.addEventListener("click", e => voteBtnListener(e));
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

function setVoteToJudge(judgeCode, countryCode, points, disableAnimation = true) {
    const className = "voting-animation";
    const tag = countryCode + "-" + judgeCode + "-points";
    const votingCell = document.getElementById(tag);

    if (votingCell == null) return;

    votingCell.innerHTML = points;

    if (disableAnimation) return;

    // Setting voting animation
    votingCell.classList.add(className);

    setTimeout(() => {
        votingCell.classList.remove(className);
    }, 2000);
}

function setVotingStatus(countryCode, votingStatus) {
    const className = "voting-status-animation";
    const tag = countryCode + "-voting-status";
    const votingStatusCell = document.getElementById(tag);

    if (votingStatusCell == null) return;

    let previousVotingStatus = votingStatusCell.innerHTML;
    if (previousVotingStatus == votingStatus) return;

    votingStatusCell.className = "";
    votingStatusCell.classList.add(StatusMapping.get(votingStatus));
    votingStatusCell.innerHTML = votingStatus;

    // Setting voting status animation
    votingStatusCell.parentElement.classList.add(className)

    setTimeout(() => {
        votingStatusCell.parentElement.classList.remove(className);
    }, 5000);
}

function setTotalVotes(countryCode, totalVotes) {
    const tag = countryCode + "-total-votes";
    const totalVotesCell = document.getElementById(tag);

    if (totalVotesCell == null) return;

    totalVotesCell.innerHTML = totalVotes;
}

function closeVotingCountryPanel() {
    const blurScreen = document.getElementById("blur-screen");

    blurScreen.style.display = "none";
}

//#endregion

//#region Event Listener functions

function tableRowListener(e) {
    let tr = e.target.parentNode;
    let countryName = tr.getAttribute("countryname");
    let countryCode = tr.getAttribute("countrycode");
    const blurScreen = document.getElementById("blur-screen");
    const countryNameCaption = document.getElementById("country-name-caption");

    window.VotingCountryPanel = {};
    VotingCountryPanel.countryCode = countryCode;
    
    // Open voting country panel if voting status is OPEN
    let isVotingOpen = tr.querySelector(".open-voting-status") != null;
    if (!isVotingOpen) return;

    blurScreen.style.display = "initial";
    countryNameCaption.innerHTML = countryName;
}

function closeVotingCountryPanelBtnListener() {
    closeVotingCountryPanel();
}

function voteBtnListener(e) {
    let countryCode = VotingCountryPanel.countryCode;
    let points = e.target.parentNode.querySelector("input[name='choose-vote']:checked").value;

    voteCountry(countryCode, loginJudgeCode, points)
    .then(response => {
        if (response.success) {
            closeVotingCountryPanel();
        }
    })
}

//#endregion

//#region Animation functions

function highlightRunningCountry() {
    const className = "running-country";
    // First tr is the header - Next running country table row
    const nextRunningCountryTableRow = document.querySelector("tr:nth-child(" + (runningCountry + 1) +")");

    // Running country table row
    const runningCountryTableRow = document.querySelector(".running-country");
    if (runningCountryTableRow != null) {
        runningCountryTableRow.classList.remove(className)
    }

    nextRunningCountryTableRow.classList.add(className);
}

//#endregion

//#region Socket Listeners

socket.on("hi", (arg) => {
    console.log(arg);
});

socket.on("nextCountry", (nextRunningCountry) => {
    runningCountry = runningCountry % totalCountries + 1;

    if (nextRunningCountry.runningCountry != runningCountry) {
        initLeaderboardContainer()
        return;
    }

    highlightRunningCountry();
    setVotingStatus(nextRunningCountry.runningCountryCode, nextRunningCountry.votingStatus);
    importantAnnouncements.push(nextRunningCountry.message.innerHTML);
});

socket.on("votes", (voting) => {
    setVoteToJudge(voting.judgeCode, voting.countryCode, voting.points, false);
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