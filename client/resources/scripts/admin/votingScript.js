import { getAllCountries, getAllJudges, serverURL } from "../utils/requestUtils.js";
import { io } from "https://cdn.socket.io/4.4.1/socket.io.esm.min.js";
import { adminTemplates } from "../utils/handlebarsUtils.js";

var runningCountryNumber = 0;
const socket = io(serverURL.p3000);

window.onload = init;

function init() {
    const countriesListContainer = document.getElementById("voting-countries-order-list-container");

    getEssentialData()
    .then(data => {
        var content = adminTemplates.voting.votingCountryContainer.content;
        content.countries = data.countries;
        content.judges = data.judges;
        
        countriesListContainer.innerHTML = adminTemplates.voting.votingCountryContainer(content);

        const votingToggleSwitches = document.getElementsByClassName("voting-toggle-switch");

        for (var toggleSwitch of votingToggleSwitches) {
            toggleSwitch.addEventListener("change", e => toggleSwitchListener(e));
        };
    });
}

async function getEssentialData() {
    const countriesResponse = await getAllCountries();
    const judgesResponse = await getAllJudges();

    if (countriesResponse.success && judgesResponse.success) {
        return {countries : countriesResponse.jsonData.countries, judges : judgesResponse.jsonData.judges};
    }

    return null;
}

socket.on("hi", (arg) => {
    console.log(arg);
})

socket.on("points", (arg) => {
    console.log(arg);
})

function toggleSwitchListener(e) {
    console.log(e.target.parentElement);

    socket.emit("nextCountry", "test");
}