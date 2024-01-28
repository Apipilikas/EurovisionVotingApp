import { votingTemplates } from "./utils/handlebarsUtils.js"
import { getAllCountries, getRunningCountryNumber, serverURL, voteCountry } from "./utils/requestUtils.js";
import { io } from "https://cdn.socket.io/4.4.1/socket.io.esm.min.js"

var loginJudgeCode = "agg";
var runningCountryNumber = 0;
const socket = io(serverURL.p3000);

window.onload = init;

function init() {
    // Get all countries
    getAllCountries()
    .then(result => {
        getRunningCountryNumber()
        .then(result2 => {
            runningCountryNumber = result2.runningOrder;

            setCountriesToCarousel(result, runningCountryNumber);
        });
    });
    // Get current running country

    // if contest hasnt began:

    // if running country is 01

    const connectBtn = document.getElementById("connect-btn");

    connectBtn.addEventListener("click", connectBtnListener);
}

function checkRunningOrderCompliance()
{
    // if getcurrentrunningorder != running order
    // then we want to get to the correct country.
    // Further implementation should be added to transition
    // Add a class that says to objects move without stopping
    // untill the correct country. For scenario that ro = 2
    // and fetched ro = 7.
}

function setCountriesToCarousel(countries, runningCountryNumber)
{
    // FUTURE-TO-DO: Get countries 10 by 10 batches

    // Get correct country order
    var startIndex = (runningCountryNumber - 4 <= 0) ? 0 : runningCountryNumber - 4;

    // Shift countries to find the current one
    for (var i = 0; i < startIndex; i++) countries.push(countries.shift());

    let emptyCountries = [];

    // Add empty country containers [only for runningOrder = 1 - 3]
    for (var i = 0; i < 4 - runningCountryNumber; i++) emptyCountries.push({});

    const countriesCarouselContainer = document.getElementById("countries-carousel-container");
    const countriesData = {countries : countries, emptyCountries : emptyCountries};

    let content = votingTemplates.countries(countriesData);
    countriesCarouselContainer.innerHTML = content;
}

function moveToNextCountry() {
    // Get the first country container and move it at the end
    var removedVotingCountry = document.querySelectorAll(".voting-country-container")[0];
    removedVotingCountry.remove();

    if (!removedVotingCountry.classList.contains("empty-country-container")) {
        var countriesCarouselContainer = document.getElementById("countries-carousel-container");
        countriesCarouselContainer.innerHTML += removedVotingCountry.outerHTML;
    }
}

function connectBtnListener(e) {

    moveToNextCountry();

    setVotingContentToRunningCountry();
}

function setVotingContentToRunningCountry()
{
    var currentRunningCountry = document.querySelectorAll(".voting-country-container")[3];

    if (currentRunningCountry == null) return;

    let countryCode = currentRunningCountry.getAttribute("countrycode");

    let votingCountryContent = currentRunningCountry.querySelector(".voting-country-content");

    let votingData = votingTemplates.votingContent.content;
    votingData.countryCode = countryCode;
    let content = votingTemplates.votingContent(votingData);

    votingCountryContent.innerHTML = content;

    votingCountryContent.querySelector("button").addEventListener("click", e => voteBtnListener(e, countryCode));
}

function voteBtnListener(e, countryCode)
{
    let points = e.target.parentNode.querySelector("input[name='choose-vote']:checked").value;
    voteCountry(countryCode, loginJudgeCode, points);
}

function setVotingStatusToOpen()
{

}

function setVotingStatusToClosed()
{

}

//#region Socket Listeners

socket.on("hi", (arg) => {
    console.log(arg)
})

socket.on("nextCountry", (arg) => {
    // next country. To ensure:
    // {runningCountry : 01, isVotingOpen : false}

    // Find detail by ID and fill voting content.
})

socket.on("votingStatus", (arg) => {
    // current country. To ensure:
    // {runningCountry : 01, isVotingOpen : true}

    // Find detail by ID. Create a new class
    // transitions etc for close/open voting.
})

//#endregion