import { serverURL, CountryRequests, JudgeRequests, AdminRequests } from "../utils/requestUtils.js";
import { io } from "https://cdn.socket.io/4.4.1/socket.io.esm.min.js";
import { adminTemplates } from "../utils/handlebarsUtils.js";
import { DocumentUtils } from "../utils/document/documentUtils.js";
import { ResultButton } from "../utils/customElements/resultButton.js";
import { InitUtils } from "../utils/initUtils.js";

var loginJudge = null;
var runningCountry = 0;
var totalCountries = 0;
const socket = io(serverURL.address, {autoConnect: false});

window.onload = init;

async function init() {
    try {
        loginJudge = await InitUtils.initLoginJudge(socket).then(response => { return response });
        
        initContainers();
    }
    catch (e) {DocumentUtils.handleError(e)}

}

//#region Init functions

function initContainers() {
    const countriesListContainer = document.getElementById("voting-countries-order-list-container");

    getInitData()
    .then(data => {
        if (data == null) return;
        
        var content = adminTemplates.voting.votingCountryContainer.content;
        content.countries = data.countries;
        content.judges = data.judges;
        
        initDashboard(data.countries, data.judges.length, data.onlineJudgeCodes.length);

        countriesListContainer.innerHTML = adminTemplates.voting.votingCountryContainer(content);
        
        initVotesToJudges(data.countries);

        setRevealWinnerResultText(data.winnerCountry?.code);

        initRevealWinnerPanelContainer(data.countries);

        initInformJudgePanelContainer();

        initBtnLinsteners();
    })
    .catch (e => DocumentUtils.handleError(e));
}

function initBtnLinsteners() {
    // next country button
    DocumentUtils.addClickEventListener("#next-country-btn", nextCountryBtnListener);

    // Admin settings buttons
    DocumentUtils.addClickEventListener("#reset-running-country-btn", resetRunningCountryBtnListener);
    DocumentUtils.addClickEventListener("#reset-voting-status-cache-btn", resetVotingStatusCacheBtnListener);
    DocumentUtils.addClickEventListener("#reset-judges-cache-btn", resetJudgesCacheBtnListener);
    DocumentUtils.addClickEventListener("#reset-countries-cache-btn", resetCountriesCacheBtnListener);
    DocumentUtils.addClickEventListener("#reset-all-caches-btn", resetAllCachesBtnListener);
    DocumentUtils.addClickEventListener("#inform-judge-btn", openInformJudgePanelContainer);

    // Toggle switches
    DocumentUtils.addClickEventListener(".voting-toggle-switch", toggleSwitchListener);

    // Update vote buttons
    DocumentUtils.addClickEventListener(".update-vote-btn", updateBtnListener);

    // Init menu button
    InitUtils.initMenuBtnListener();
}

function initVotesToJudges(countries) {
    for (var country of countries) {
        for (var [judgeCode, points] of Object.entries(country.votes)) {
            setVoteToJudge(judgeCode, country.code, points);
        }
    }
}

function initDashboard(countries, judgesNumber, onlineJudgesNumber) {
    let country = countries.find(el => parseInt(el.runningOrder) == parseInt(runningCountry));
    
    setDataToDashboard(country, judgesNumber, onlineJudgesNumber);
}

function initRevealWinnerPanelContainer(countries) {
    let content = adminTemplates.voting.revealWinnerBoxContainerContent({countries : countries});
    DocumentUtils.setInnerHTML("#reveal-winner-panel-content", content);
    DocumentUtils.addClickEventListener("#reveal-winner-panel-container .close-btn", closeRevealWinnerPanelContainerBtnListener);
    DocumentUtils.addClickEventListener("#reveal-winner-panel-container .ok-btn", closeRevealWinnerPanelContainerBtnListener);
    DocumentUtils.addClickEventListener("#reveal-winner-panel-container .clear-btn", clearWinnerCountryBtnListener)
    DocumentUtils.addClickEventListener("#reveal-winner-btn", openRevealWinnerPanelContainer);
}

function initInformJudgePanelContainer() {
    DocumentUtils.addClickEventListener("#inform-judge-panel-container .close-btn", closeInformJudgePanelContainerBtnListener);
    DocumentUtils.addClickEventListener("#inform-judge-panel-container .inform-btn", informJudgePanelContainerBtnListener);
    DocumentUtils.addClickEventListener("#inform-judge-panel-container .warn-btn", informJudgePanelContainerBtnListener);
}

//#endregion

//#region General functions

async function getInitData() {
    const countriesResponse = await CountryRequests.getAllCountries();
    const judgesResponse = await JudgeRequests.getAllJudges();
    const runningCountryResponse = await CountryRequests.getRunningCountryNumber();
    const votingCountryStatusesResponse = await CountryRequests.getVotingCountryStatuses();
    const onlineJudgeCodesResponse = await AdminRequests.getAllOnlineJudgeCodes(loginJudge.code);
    const winnerCountryResponse = await CountryRequests.getWinnerCountry();

    if (countriesResponse.success && judgesResponse.success && runningCountryResponse.success && votingCountryStatusesResponse.success && onlineJudgeCodesResponse.success && winnerCountryResponse.success) {
        runningCountry = runningCountryResponse.jsonData.runningCountry;

        const fetchedCountries = countriesResponse.jsonData.countries;
        totalCountries = fetchedCountries.length;
        const fetchedVotingCountryStatuses = votingCountryStatusesResponse.jsonData.votingStatuses;
        
        return {countries : mergeVotingStatusesToCountries(fetchedCountries, fetchedVotingCountryStatuses), judges : judgesResponse.jsonData.judges, onlineJudgeCodes : onlineJudgeCodesResponse.jsonData.judges, winnerCountry : winnerCountryResponse.jsonData.country};
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
    DocumentUtils.setElementAttribute('input[runningorder="' + runningOrder + '"]', "checked", votingStatus == "OPEN");
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

// Reveal Winner container
function openRevealWinnerPanelContainer() {
    DocumentUtils.blurScreen();
    const revealWinnerPanelContainer = document.getElementById("reveal-winner-panel-container");
    revealWinnerPanelContainer.style.display = "initial";
}

function closeRevealWinnerPanelContainer() {
    DocumentUtils.unblurScreen();
    const revealWinnerPanelContainer = document.getElementById("reveal-winner-panel-container");
    revealWinnerPanelContainer.style.display = "none";
}

function getWinnerCountryCode() {
    return DocumentUtils.getElementAttribute("input[name='reveal-winner']:checked", "value");
}

function setRevealWinnerResultText(winnerCountryCode) {
    DocumentUtils.setInnerHTML("#reveal-winner-container .result-text", winnerCountryCode);
}

// Inform judge container
function openInformJudgePanelContainer() {
    DocumentUtils.blurScreen();
    const informJudgePanelContainer = document.getElementById("inform-judge-panel-container");
    informJudgePanelContainer.style.display = "initial";
}

function closeInformJudgePanelContainer() {
    DocumentUtils.unblurScreen();
    const informJudgePanelContainer = document.getElementById("inform-judge-panel-container");
    informJudgePanelContainer.style.display = "none";
}

function emitInformMessageToJudge(code, message) {
    socket.emit("general", {code : code, message : message});
}

//#endregion

//#region Dashboard functions

function setDataToDashboard(country, judgesNumber, onlineJudgesNumber) {
    let offlineJudgesNumber = judgesNumber - onlineJudgesNumber;
    let judgesVotedNumber = null;
    if (country != null) {
        judgesVotedNumber = Object.keys(country.votes).length;
        setRunningCountryDashboard(country.runningOrder, country.name, country.song, country.artist);
        setTotalVotesDashboard(country.totalVotes);
    }
    
    setJudgesDashboard(judgesVotedNumber, onlineJudgesNumber, offlineJudgesNumber,judgesNumber);
}

function setRunningCountryDashboard(runningOrder, countryName, song, artist) {
    DocumentUtils.setInnerHTML("#admin-db-running-order-txt", runningOrder);
    DocumentUtils.setInnerHTML("#admin-db-running-country-name-txt", countryName);
    DocumentUtils.setInnerHTML("#admin-db-song-txt", song);
    DocumentUtils.setInnerHTML("#admin-db-artist-txt", artist);
}

function setJudgesDashboard(judgesVotedNumber, onlineJudgesNumber, offlineJudgesNumber, totalJudgesNumber = null) {
    DocumentUtils.setInnerHTML(".admin-db-total-judges-no-txt", totalJudgesNumber);
    DocumentUtils.setInnerHTML("#judges-voted-no-txt", judgesVotedNumber);
    DocumentUtils.setInnerHTML("#admin-db-online-judges-no-txt", onlineJudgesNumber);
    DocumentUtils.setInnerHTML("#admin-db-offline-judges-no-txt", offlineJudgesNumber);
}

function setTotalVotesDashboard(totalVotes) {
    DocumentUtils.setInnerHTML("#admin-db-total-votes-txt", totalVotes);
}

//#endregion

//#region Event Listener functions

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

function updateBtnListener(e) {
    const tableRow = e.target.parentNode.parentNode;
    const countryCode = tableRow.getAttribute("countrycode");
    const judgeCode = tableRow.getAttribute("judgecode");
    const points = tableRow.querySelector("input:checked").value;
    
    CountryRequests.voteCountry(countryCode, judgeCode, points)
    .then(response => {
        if (response.success) {
            
        }
    })
}

function resetRunningCountryBtnListener(e) {
    ResultButton.getByElement(e.target)
    .execute(AdminRequests.resetRunningCountry(loginJudge.code))
    .then(response => {
        if (response.success) {
            emitInformMessageToJudge("RESET_CACHE", "Running order has been resetted.");
        }
    });
}

function resetVotingStatusCacheBtnListener(e) {
    ResultButton.getByElement(e.target)
    .execute(AdminRequests.resetVotingStatusCache(loginJudge.code))
    .then(response => {
        if (response.success) {
            emitInformMessageToJudge("RESET_CACHE", "Voting statuses have been resetted.");
        }
    });
}

function resetJudgesCacheBtnListener(e) {
    ResultButton.getByElement(e.target)
    .execute(AdminRequests.resetJudgesCache(loginJudge.code))
    .then(response => {
        if (response.success) {
            emitInformMessageToJudge("RESET_CACHE", "Judges cache has been resetted.");
        }
    });
}

function resetCountriesCacheBtnListener(e) {
    ResultButton.getByElement(e.target)
    .execute(AdminRequests.resetCountriesCache(loginJudge.code))
    .then(response => {
        if (response.success) {
            emitInformMessageToJudge("RESET_CACHE", "Countries cache has been resetted.");
        }
    });
}

function resetAllCachesBtnListener(e) {
    ResultButton.getByElement(e.target)
    .execute(AdminRequests.resetAllCaches(loginJudge.code))
    .then(response => {
        if (response.success) {
            emitInformMessageToJudge("RESET_CACHE", "All caches have been resetted.");
        }
    });
}

// Reveal Winner panel listeners
function closeRevealWinnerPanelContainerBtnListener(e) {
    closeRevealWinnerPanelContainer();

    if (e.target.classList.contains("close-btn")) return;
    
    let winnerCountryCode = getWinnerCountryCode();
    setRevealWinnerResultText(winnerCountryCode);

    AdminRequests.setWinnerCountry(loginJudge.code, winnerCountryCode);
}

function clearWinnerCountryBtnListener(e) {
    AdminRequests.clearWinnerCountry(loginJudge.code)
    .then(response => {
        if (response.success) {
            closeRevealWinnerPanelContainer();
            setRevealWinnerResultText("NONE");
        }
    })
}

// Inform judge panel listeners
function informJudgePanelContainerBtnListener(e) {
    let textAreaValue = DocumentUtils.getElementAttribute("#inform-judge-panel-container textarea", "value");
    let code = "WARNING";

    if (e.target.className == "inform-btn") {
        code = "INFORM";
    }

    code += "_MESSAGE"

    emitInformMessageToJudge(code, textAreaValue);

    closeInformJudgePanelContainer();
}

function closeInformJudgePanelContainerBtnListener(e) {
    closeInformJudgePanelContainer();
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
    setDataToDashboard(nextRunningCountry, null, null);
})

//#endregion