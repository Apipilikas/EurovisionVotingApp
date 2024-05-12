import { AnnouncementHelper, AnnouncementUtils } from "./utils/announcementUtils.js";
import { NotificationBox } from "./utils/boxes/notificationBox.js";
import { ResultButton } from "./utils/customElements/resultButton.js";
import { DocumentUtils } from "./utils/document/documentUtils.js";
import { InitDataError } from "./utils/errorUtils.js";
import { votingTemplates } from "./utils/handlebarsUtils.js"
import { InitUtils } from "./utils/initUtils.js";
import { serverURL, CountryRequests } from "./utils/requestUtils.js";
import { io } from "https://cdn.socket.io/4.4.1/socket.io.esm.min.js"

var loginJudge = null;
var runningCountry = 0;
var totalCountries = 0;
var announcementHelper = new AnnouncementHelper();
var runningCountryCode = null;
const socket = io(serverURL.address, {autoConnect: false});

window.onload = init;

async function init() {
    try {
        loginJudge = await InitUtils.initLoginJudge(socket).then(response => {return response});
    
        initBtnListeners();

        initCarousel();
    
        AnnouncementUtils.initAnnouncementContainer(announcementHelper);
    }
    catch (e) {DocumentUtils.handleError(e)}
}

//#region Init functions

function initBtnListeners() {
    InitUtils.initMenuBtnListener();
}

function initCarousel() {
    getInitData()
    .then(data => {
        if (data == null) return;
        
        setCountriesToCarousel(data.countries);
        setVotesToCarousel(data.countries);
        setVotingContentToRunningCountry(data.isVotingOpen);
    })
    .catch(e => DocumentUtils.handleError(e));
}

//#endregion

//#region General functions

async function getInitData() {
    const runningCountryResponse = await CountryRequests.getRunningCountryNumber(); 
    const countriesResponse = await CountryRequests.getAllCountries();

    if (runningCountryResponse.success && countriesResponse.success) {
        runningCountry = runningCountryResponse.jsonData.runningCountry;
        runningCountryCode = runningCountryResponse.jsonData.runningCountryCode;
        let votingStatus = runningCountryResponse.jsonData.votingStatus;
        totalCountries = countriesResponse.jsonData.countries.length;
        
        return {countries : countriesResponse.jsonData.countries, isVotingOpen : votingStatus == "OPEN"};
    }
    else {
        throw new InitDataError("Failed to get countries and running Country.");
    }
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

    let content = votingTemplates.countries({countries : countries, emptyCountries : emptyCountries});
    DocumentUtils.setInnerHTML("#countries-carousel-container", content);
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
    const previousRunningCountry = document.querySelectorAll(".voting-country-container")[2]; 
    const currentRunningCountry = document.querySelectorAll(".voting-country-container")[3];

    runningCountryCode = currentRunningCountry.getAttribute("countrycode");
    let flagColor1 = currentRunningCountry.getAttribute("flagColor1");
    let flagColor2 = currentRunningCountry.getAttribute("flagColor2");
    let flagColor3 = currentRunningCountry.getAttribute("flagColor3");
    
    if (currentRunningCountry == null) return;
    
    let votingCountryContent = previousRunningCountry.querySelector(".voting-country-content");
    if (votingCountryContent != null) votingCountryContent.innerHTML = "";

    votingCountryContent = currentRunningCountry.querySelector(".voting-country-content");

    currentRunningCountry.addEventListener("click", e => currentRunningCountryContainerListener(e));

    if (votingCountryContent == null) return;

    // Style voting country content
    DocumentUtils.setRootProperty("--checked-label-color", flagColor2);

    let labelColor = flagColor3;

    if (flagColor1 == flagColor3) {
        labelColor = flagColor2;
    }

    DocumentUtils.setRootProperty("--label-color", labelColor);
    DocumentUtils.setRootProperty("--button-color", flagColor1);

    votingCountryContent.style = "background-color:" + flagColor1;

    if (!isVotingOpen) {
        votingCountryContent.innerHTML = votingTemplates.votingContent.closedVoting;
        return;
    }

    let votingData = votingTemplates.votingContent.content;
    let content = votingTemplates.votingContent(votingData);

    votingCountryContent.innerHTML = content;

    var personalVote = DocumentUtils.getChildInnerHTML(".personal-vote", currentRunningCountry);
    var selectedVoteTag = "input[name='choose-vote'][value='" + personalVote + "'";
    DocumentUtils.setChildElementAttribute(selectedVoteTag, currentRunningCountry, "checked", true);

    setTimeout(() => {
        currentRunningCountry.open = true;
    }, 3000);

    votingCountryContent.querySelector("button").addEventListener("click", e => voteBtnListener(e));
}

function setTotalVotes(countryCode, totalVotes) {
    DocumentUtils.setInnerHTML("details[countrycode=" + countryCode +"] .total-votes", totalVotes);
}

function setVotesToCarousel(countries) {
    for (var country of countries) {
        let points = country.votes[loginJudge.code];

        if (points == null) continue;
        setPersonalVote(country.code, points);
    }
}

function setPersonalVote(countryCode, points) {
    DocumentUtils.setInnerHTML("details[countrycode=" + countryCode +"] .personal-vote", points);
}

//#endregion

//#region  Event Listener Functions

function voteBtnListener(e) {
    let countryCode = e.target.parentNode.parentNode.getAttribute("countrycode");
    let checkedPoint = e.target.parentNode.querySelector("input[name='choose-vote']:checked");
    
    if (checkedPoint == null) {
        NotificationBox.show(NotificationBox.Type.WARNING, "You haven't selected a point.");
        return;
    }
    let points = checkedPoint.value;
    
    let resultBtn = new ResultButton(e.target);
    resultBtn.execute(CountryRequests.voteCountry(countryCode, loginJudge.code, points))
    .then(response => {
        if (response.success) {
            setPersonalVote(countryCode, points);
        }
        else DocumentUtils.handleResponseFailure(response);
    });
}

function currentRunningCountryContainerListener(e) {
    const detail = e.target.parentNode;
        
    if (detail.open) {
        e.preventDefault();
        detail.classList.add("hide-container");

        setTimeout(() => {
            detail.open = false;
            detail.classList.remove("hide-container");
        }, 1500);
    };
}

//#endregion

//#region Socket Listeners

socket.on("hi", (arg) => {
    console.log(arg)
});

socket.on("nextCountry", (response) => {
    let nextRunningCountry = response.data.nextRunningCountry;

    moveToNextCountry(nextRunningCountry);
    let htmlText = response.message.htmlText
    announcementHelper.addAnnouncement(AnnouncementHelper.Priority.HIGH, htmlText);
});

socket.on("votes", (response) => {
    let voting = response.data.voting;

    setTotalVotes(voting.countryCode, voting.totalVotes);
    let htmlText = response.message.htmlText;
    announcementHelper.addAnnouncement(AnnouncementHelper.Priority.MEDIUM, htmlText);
});

socket.on("votingStatus", (response) => {
    let votingStatus = response.data.votingStatus;

    let isVotingOpen = votingStatus.status == "OPEN";
    if (votingStatus.countries.find(el => el == runningCountryCode) != null) {
        setVotingContentToRunningCountry(isVotingOpen);
    }
});

socket.on("general", (response) => {
    DocumentUtils.handleGeneralSocketEvent(response);
});

//#endregion