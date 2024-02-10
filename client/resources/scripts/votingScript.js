import { votingTemplates } from "./utils/handlebarsUtils.js"
import { getAllCountries, getRunningCountryNumber, getVotingCountryStatus, serverURL, voteCountry } from "./utils/requestUtils.js";
import { io } from "https://cdn.socket.io/4.4.1/socket.io.esm.min.js"

var loginJudgeCode = "agg";
var runningCountry = 0;
var totalCountries = 0;
var runningCountryCode = null;
const socket = io(serverURL.p3000);

window.onload = init;

function init() {
    // Initialize carousel
    initCarousel();
}

function initCarousel() {
    getAllCountries()
    .then(response => {
        if (response.success) {
            getRunningCountryNumber()
            .then(response2 => {
                if (response2.success) {
                    runningCountry = response2.jsonData.runningCountry;

                    setCountriesToCarousel(response.jsonData.countries);

                    getVotingCountryStatus(runningCountryCode)
                    .then(response3 => {
                        if (response3.success) {
                            let isVotingOpen = response3.jsonData.status == "OPEN";
                            console.log(response3)
                            setVotingContentToRunningCountry(isVotingOpen);
                        }
                    })

                };
            })
        };
    });
}

function setCountriesToCarousel(countries)
{
    totalCountries = countries.length;
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
    if (nextRunningCountry.runningCountry != (runningCountry + 1) % totalCountries) {
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

function getRunningCountryCode() {
    var currentRunningCountry = document.querySelectorAll(".voting-country-container")[3];

    return currentRunningCountry.getAttribute("countrycode");
}

//#region  Event Listeners
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

    if (votingStatus.countries.find(el => el == getRunningCountryCode()) != null) {
        setVotingContentToRunningCountry(isVotingOpen);
    }
});

//#endregion