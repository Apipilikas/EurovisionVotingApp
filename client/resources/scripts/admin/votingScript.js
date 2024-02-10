import { getAllCountries, getAllJudges, getRunningCountryNumber, serverURL } from "../utils/requestUtils.js";
import { io } from "https://cdn.socket.io/4.4.1/socket.io.esm.min.js";
import { adminTemplates } from "../utils/handlebarsUtils.js";

var runningCountryNumber = 0;
var countries = [];
const socket = io(serverURL.p3000);

window.onload = init;

function init() {
    const countriesListContainer = document.getElementById("voting-countries-order-list-container");
    const nextCountryBtn = document.getElementById("next-country-btn");
    //const allCountriesVotingToggle

    getRunningCountryNumber()
    .then(response => {
        if (response.success) {
            runningCountryNumber = response.jsonData.runningCountry;
        }
    });

    initVotingCountryContainer()
    .then(data => {
        var content = adminTemplates.voting.votingCountryContainer.content;
        content.countries = data.countries;
        content.judges = data.judges;

        data.countries.forEach(country => {
            countries.push({code : country.code, runningOrder : parseInt(country.runningOrder)});
        });
        
        countriesListContainer.innerHTML = adminTemplates.voting.votingCountryContainer(content);

        const votingToggleSwitches = document.getElementsByClassName("voting-toggle-switch");

        for (var toggleSwitch of votingToggleSwitches) {
            toggleSwitch.addEventListener("change", e => toggleSwitchListener(e));
        };
    });

    nextCountryBtn.addEventListener("click", e => nextCountryBtnListener());
}

async function initVotingCountryContainer() {
    const countriesResponse = await getAllCountries();
    const judgesResponse = await getAllJudges();

    if (countriesResponse.success && judgesResponse.success) {
        return {countries : countriesResponse.jsonData.countries, judges : judgesResponse.jsonData.judges};
    }

    return null;
}

function findCountryCodeByRunningCountry() {
    let country = countries.find(element => element.runningOrder == runningCountryNumber);

    if (country == null) return null;
    else return country.code;
}

function emitVotingStatus(status, countryCodes) {
    socket.emit("votingStatus", {status : status, countries : countryCodes});
}

//#region Event Listeners

function toggleSwitchListener(e) {
    let countryCode = e.target.parentElement.getAttribute("countrycode");
    let status = e.target.checked ? "OPEN" : "CLOSED";

    emitVotingStatus(status, [countryCode]);
}

function nextCountryBtnListener() {
    runningCountryNumber = runningCountryNumber % countries.length; 

    socket.emit("nextCountry", {runningCountry : ++runningCountryNumber});

    emitVotingStatus("OPEN", [findCountryCodeByRunningCountry()]);
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