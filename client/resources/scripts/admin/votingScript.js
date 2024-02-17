import { getAllCountries, getAllJudges, getRunningCountryNumber, getVotingCountryStatuses, serverURL } from "../utils/requestUtils.js";
import { io } from "https://cdn.socket.io/4.4.1/socket.io.esm.min.js";
import { adminTemplates } from "../utils/handlebarsUtils.js";

var runningCountry = 0;
var totalCountries = 0;
const socket = io(serverURL.p3000);

window.onload = init;

function init() {
    initVotingCountryContainer();
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
        if (country.votes == 0) continue; // TO CHANGE

        for (var [judgeCode, points] of Object.entries(country.votes)) {
            console.log(judgeCode)
            setVoteToJudge(judgeCode, country.code, points);
        }
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

socket.on("votes", (voting) => {
    setVoteToJudge(voting.judgeCode, voting.countryCode, voting.points);
    setTotalVotes(voting.countryCode, voting.totalVotes);
})

//#endregion