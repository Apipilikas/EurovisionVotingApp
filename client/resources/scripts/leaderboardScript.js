import { AnnouncementHelper, AnnouncementUtils } from "./utils/announcementUtils.js";
import { DocumentUtils } from "./utils/document/documentUtils.js";
import { leaderboardTemplates, votingTemplates } from "./utils/handlebarsUtils.js";
import { InitUtils } from "./utils/initUtils.js";
import { serverURL, CountryRequests, JudgeRequests } from "./utils/requestUtils.js";
import { io } from "https://cdn.socket.io/4.4.1/socket.io.esm.min.js"

var loginJudge = null;
var runningCountry = 0;
var totalCountries = 0;
var announcementHelper = new AnnouncementHelper();
const socket = io(serverURL.address, {autoConnect: false});
const StatusMapping = new Map([
    ["OPEN", "open-voting-status"],
    ["CLOSED", "closed-voting-status"]
]);

window.onload = init;

async function init() {
    try {
        loginJudge = await InitUtils.initLoginJudge(socket).then(response => {return response});
    
        initLeaderboardContainer();
    
        initBtnListeners();
    
        AnnouncementUtils.initAnnouncementContainer(announcementHelper);
    
        initVotingCountryPanelContainer();
    }
    catch (e) {DocumentUtils.handleError(e)}
}

//#region Init functions

function initBtnListeners() {
    InitUtils.initMenuBtnListener();
}

function initLeaderboardContainer() {
    getInitData()
    .then(data => {
        if (data != null) {
            var content = leaderboardTemplates.votingLeaderboardContainer(data);
            DocumentUtils.setInnerHTML("#voting-leaderboard-container", content);

            initVotesToJudgesAndVotingStatuses(data.countries, data.votingStatuses);
            highlightRunningCountry();
            initTableRowListeners();
        }
    })
    .catch(e => handleError(e));
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
    DocumentUtils.addClickEventListener("tbody tr ALL", tableRowListener);
}

function initVotingCountryPanelContainer() {
    let content = votingTemplates.votingContent(votingTemplates.votingContent.content);
    DocumentUtils.setInnerHTML("#voting-country-panel-content", content);
    DocumentUtils.addClickEventListener("#close-voting-country-panel-btn", closeVotingCountryPanelBtnListener);
    DocumentUtils.addClickEventListener("#voting-country-panel-content button", voteBtnListener);
}

//#endregion

//#region General functions

async function getInitData() {
    const runningCountryResponse = await CountryRequests.getRunningCountryNumber();
    const countriesResponse = await CountryRequests.getAllCountries();
    const judgesResponse = await JudgeRequests.getAllJudges();
    const votingStatusesResponse = await CountryRequests.getVotingCountryStatuses();

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
    const tag = "#" + countryCode + "-total-votes";
    DocumentUtils.setInnerHTML(tag, totalVotes);
}

function closeVotingCountryPanel() {
    const votingCountryPanelContainer = document.getElementById("voting-country-panel-container");
    votingCountryPanelContainer.style.display = "none";
    DocumentUtils.unblurScreen();
}

//#endregion

//#region Event Listener functions

function tableRowListener(e) {
    let tr = e.target.parentNode;
    let countryName = tr.getAttribute("countryname");
    let countryCode = tr.getAttribute("countrycode");
    const votingCountryPanelContainer = document.getElementById("voting-country-panel-container");
    const countryNameCaption = document.getElementById("country-name-caption");
    
    window.VotingCountryPanel = {};
    VotingCountryPanel.countryCode = countryCode;
    
    // Open voting country panel if voting status is OPEN
    let isVotingOpen = tr.querySelector(".open-voting-status") != null;
    if (!isVotingOpen) return;

    DocumentUtils.blurScreen();
    votingCountryPanelContainer.style.display = "initial";
    countryNameCaption.innerHTML = countryName;
}

function closeVotingCountryPanelBtnListener(e) {
    closeVotingCountryPanel();
}

function voteBtnListener(e) {
    let countryCode = VotingCountryPanel.countryCode;
    let points = e.target.parentNode.querySelector("input[name='choose-vote']:checked").value;
    console.log(points)
    CountryRequests.voteCountry(countryCode, loginJudge.code, points)
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
    const nextRunningCountryTableRow = document.querySelector("tbody tr:nth-child(" + runningCountry +")");
    
    // Running country table row
    const runningCountryTableRow = document.querySelector(".running-country");
    if (runningCountryTableRow != null) {
        runningCountryTableRow.classList.remove(className)
    }

    if (nextRunningCountryTableRow == null) return;

    nextRunningCountryTableRow.classList.add(className);
}

//#endregion

//#region Socket Listeners

socket.on("hi", (arg) => {
    console.log(arg);
});

socket.on("nextCountry", (response) => {
    let nextRunningCountry = response.data.nextRunningCountry;

    runningCountry = runningCountry % totalCountries + 1;

    if (nextRunningCountry.runningCountry != runningCountry) {
        initLeaderboardContainer()
        return;
    }
    highlightRunningCountry();
    setVotingStatus(nextRunningCountry.country.code, nextRunningCountry.votingStatus);
    let htmlText = response.message.htmlText;
    announcementHelper.addAnnouncement(AnnouncementHelper.Priority.HIGH, htmlText);
});

socket.on("votes", (response) => {
    let voting = response.data.voting;

    setVoteToJudge(voting.judgeCode, voting.countryCode, voting.points, false);
    setTotalVotes(voting.countryCode, voting.totalVotes);
    let htmlText = response.message.htmlText;
    announcementHelper.addAnnouncement(AnnouncementHelper.Priority.MEDIUM, htmlText);
});

socket.on("votingStatus", (response) => {
    let status = response.data.votingStatus.status;

    for (var countryCode of response.data.votingStatus.countries) {
        setVotingStatus(countryCode, status);
    }

    response.messages.forEach(message => {
        announcementHelper.addAnnouncement(AnnouncementHelper.Priority.MEDIUM, message.htmlText);
    });
});

socket.on("general", (response) => {
    DocumentUtils.handleGeneralSocketEvent(response);
});

//#endregion