import { votingTemplates } from "./utils/handlebarsUtils.js"
import { getAllCountries, getRunningCountryNumber, getVotingCountryStatus, serverURL, voteCountry } from "./utils/requestUtils.js";
import { io } from "https://cdn.socket.io/4.4.1/socket.io.esm.min.js"

var loginJudgeCode = "agg";
var runningCountry = 0;
var countries = [];
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

        countries = []; // Clear in case of re - initialization

        countriesResponse.jsonData.countries.forEach(country => {
            countries.push({code : country.code, runningOrder : parseInt(country.runningOrder)});
        });

        const runningCountryCode = getCountryCodeByRunningCountry();
        const votingCountryStatusResponse = await getVotingCountryStatus(runningCountryCode);
        
        if(votingCountryStatusResponse.success) {
            return {countries : countriesResponse.jsonData.countries, isVotingOpen : votingCountryStatusResponse.jsonData.status == "OPEN"};
        }
    }

    return null;
}

function getCountryCodeByRunningCountry() {
    let country = countries.find(element => element.runningOrder == runningCountry);
    
    if (country == null) return null;
    else return country.code;
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
    runningCountry = runningCountry % countries.length + 1;

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
}

function setVotingContentToRunningCountry(isVotingOpen)
{
    var currentRunningCountry = document.querySelectorAll(".voting-country-container")[3];

    var runningCountryCode = currentRunningCountry.getAttribute("countrycode");
    
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
//#endregion

//#region  Event Listener Functions
function voteBtnListener(e)
{
    let points = e.target.parentNode.querySelector("input[name='choose-vote']:checked").value;
    voteCountry(runningCountryCode, loginJudgeCode, points);
}
//#endregion

//#region Socket Listeners

socket.on("hi", (arg) => {
    console.log(arg)
});

socket.on("nextCountry", (nextRunningCountry) => {
    moveToNextCountry(nextRunningCountry);
});

socket.on("points", (vote) => {
    console.log(vote);
});

socket.on("votingStatus", (votingStatus) => {
    console.log(votingStatus);

    let isVotingOpen = votingStatus.status == "OPEN";
    if (votingStatus.countries.find(el => el == getCountryCodeByRunningCountry()) != null) {
        setVotingContentToRunningCountry(isVotingOpen);
    }
});

//#endregion