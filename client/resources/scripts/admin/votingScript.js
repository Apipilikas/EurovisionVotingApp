import { getAllCountries, getAllJudges, getRunningCountryNumber, getVotingCountryStatuses, serverURL } from "../utils/requestUtils.js";
import { io } from "https://cdn.socket.io/4.4.1/socket.io.esm.min.js";
import { adminTemplates } from "../utils/handlebarsUtils.js";

var runningCountry = 0;
var countries = [];
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

//#endregion

//#region General functions

async function getInitData() {
    const countriesResponse = await getAllCountries();
    const judgesResponse = await getAllJudges();
    const runningCountryResponse = await getRunningCountryNumber();
    const votingCountryStatusesResponse = await getVotingCountryStatuses();

    if (countriesResponse.success && judgesResponse.success && runningCountryResponse.success && votingCountryStatusesResponse.success) {
        runningCountry = runningCountryResponse.jsonData.runningCountry;

        countriesResponse.jsonData.countries.forEach(country => {
            countries.push({code : country.code, runningOrder : parseInt(country.runningOrder)});
        });

        const fetchedCountries = countriesResponse.jsonData.countries;
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

function setVotingStatusToToggleSwitch(countryCode, votingStatus) {
    const votingStatusToggleSwitch = document.querySelector('input[countrycode="' + countryCode + '"]');
    
    if (votingStatusToggleSwitch != null) votingStatusToggleSwitch.checked = votingStatus == "OPEN";
}

function findCountryCodeByRunningCountry() {
    let country = countries.find(element => element.runningOrder == runningCountry);

    if (country == null) return null;
    else return country.code;
}

function emitVotingStatus(status, countryCodes) {
    socket.emit("votingStatus", {status : status, countries : countryCodes});
}

//#endregion


//#region Event Listener Functions

function toggleSwitchListener(e) {
    let countryCode = e.target.getAttribute("countrycode");
    let status = e.target.checked ? "OPEN" : "CLOSED";

    emitVotingStatus(status, [countryCode]);
}

function nextCountryBtnListener() {
    runningCountry = runningCountry % countries.length + 1; 
    const runningCountryCode = findCountryCodeByRunningCountry();
    const votingStatus = "OPEN";

    socket.emit("nextCountry", {runningCountry : runningCountry});
    emitVotingStatus(votingStatus, [runningCountryCode]);
    setVotingStatusToToggleSwitch(runningCountryCode, votingStatus);
}

//#endregion

//#region Socket Listeners

socket.on("hi", (arg) => {
    console.log(arg);
})

socket.on("points", (arg) => {
    console.log(arg);
})

//#endregion