import { votingTemplates } from "./utils/handlebarsUtils.js"
import { getAllCountries, getRunningCountryNumber, serverURL, voteCountry } from "./utils/requestUtils.js";
import { io } from "https://cdn.socket.io/4.4.1/socket.io.esm.min.js"

var loginJudgeCode = "agg";
var runningCountry = 0;
var totalCountries = 0;
var runningCountryCode = null;
const socket = io(serverURL.p3000);

window.onload = init;

function init() {
    initCarousel();
}

//#region Init functions

function initCarousel() {
    getInitData()
    .then(data => {
        if (data == null) return;
        
        setCountriesToCarousel(data.countries);
        setVotingContentToRunningCountry(data.isVotingOpen);
    })
}

//#endregion

//#region General functions

async function getInitData() {
    const runningCountryResponse = await getRunningCountryNumber(); 
    const countriesResponse = await getAllCountries();

    if (runningCountryResponse.success && countriesResponse.success) {
        runningCountry = runningCountryResponse.jsonData.runningCountry;
        runningCountryCode = runningCountryResponse.jsonData.runningCountryCode;
        let votingStatus = runningCountryResponse.jsonData.votingStatus;
        totalCountries = countriesResponse.jsonData.countries.length;
        
        return {countries : countriesResponse.jsonData.countries, isVotingOpen : votingStatus == "OPEN"};
    }

    return null;
}

function setCountriesToCarousel(countries)
{
    // FUTURE-TO-DO: Get countries 10 by 10 batches

    // Get correct country order
    var startIndex = (runningCountry - 4 <= 0) ? 0 : runningCountry - 4;

    // Shift countries to find the current one
    for (var i = 0; i < startIndex; i++) countries.push(countries.shift());

    let emptyCountries = [];

    // Add empty country containers [only for runningOrder = 1 - 3]
    for (var i = 0; i < 4 - runningCountry; i++) emptyCountries.push({});

    const countriesCarouselContainer = document.getElementById("countries-carousel-container");
    const countriesData = {countries : countries, emptyCountries : emptyCountries};

    let content = votingTemplates.countries(countriesData);
    countriesCarouselContainer.innerHTML = content;
}

function moveToNextCountry(nextRunningCountry) {
    runningCountry = runningCountry % totalCountries + 1;

    if (nextRunningCountry.runningCountry != runningCountry) {
        // Country carousel is not syncronized.
        initCarousel();
        return;
    }

    // Get the first country container and move it at the end.
    var removedVotingCountry = document.querySelectorAll(".voting-country-container")[0];
    removedVotingCountry.remove();

    if (!removedVotingCountry.classList.contains("empty-country-container")) {
        var countriesCarouselContainer = document.getElementById("countries-carousel-container");
        countriesCarouselContainer.innerHTML += removedVotingCountry.outerHTML;
    }

    if (nextRunningCountry.votingStatus == "OPEN") {
        setVotingContentToRunningCountry(true);
    }
}

function setVotingContentToRunningCountry(isVotingOpen) {
    var currentRunningCountry = document.querySelectorAll(".voting-country-container")[3];

    runningCountryCode = currentRunningCountry.getAttribute("countrycode");
    
    if (currentRunningCountry == null) return;
    
    let votingCountryContent = currentRunningCountry.querySelector(".voting-country-content");
    
    if (!isVotingOpen) {
        votingCountryContent.innerHTML = "VOTING CLOSED";
        return;
    }

    let votingData = votingTemplates.votingContent.content;
    votingData.countryCode = runningCountryCode;
    let content = votingTemplates.votingContent(votingData);

    votingCountryContent.innerHTML = content;

    votingCountryContent.querySelector("button").addEventListener("click", e => voteBtnListener(e));
}

function setTotalVotes(countryCode, totalVotes) {
    const votingCountryDetail = document.querySelector("details[countrycode=" + countryCode +"]");
    if (votingCountryDetail == null) return;

    votingCountryDetail.querySelector(".total-votes").innerHTML = totalVotes;
}

//#endregion

//#region  Event Listener Functions
function voteBtnListener(e) {
    let countryCode = e.target.parentNode.parentNode.getAttribute("countrycode");
    let points = e.target.parentNode.querySelector("input[name='choose-vote']:checked").value;
    
    voteCountry(countryCode, loginJudgeCode, points);
}
//#endregion

//#region Socket Listeners

socket.on("hi", (arg) => {
    console.log(arg)
});

socket.on("nextCountry", (nextRunningCountry) => {
    moveToNextCountry(nextRunningCountry);
});

socket.on("votes", (voting) => {
    console.log(voting);
    setTotalVotes(voting.countryCode, voting.totalVotes);
});

socket.on("votingStatus", (votingStatus) => {
    console.log(votingStatus);

    let isVotingOpen = votingStatus.status == "OPEN";
    if (votingStatus.countries.find(el => el == runningCountryCode) != null) {
        setVotingContentToRunningCountry(isVotingOpen);
    }
});

//#endregion