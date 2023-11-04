import { fillDetailInputsAreaListener } from "../utils/documentUtils.js";
import { adminTemplates } from "../utils/handlebarsUtils.js";
import { createCountry, getAllCountries } from "../utils/requestUtils.js";

var isCountriesLoaded = false;
var countries = [];
const inputsArea = adminTemplates.countries.formInputsArea;

window.onload = init;

function init() {
    const createCountryContainer = document.getElementById("create-country-container");
    const modifyCountriesContainer = document.getElementById("modify-countries-container");
    
    const createCountryForm = document.getElementById("create-country-form");
    const modifyCountriesListContainer = document.getElementById("modify-countries-list-container");

    const modifyBtn = document.getElementById("modify-btn");
    const deleteBtn = document.getElementById("delete-btn");

    createCountryContainer.addEventListener("click", e => fillDetailInputsAreaListener(createCountryContainer,
                                                                                       modifyCountriesContainer,
                                                                                       inputsArea,
                                                                                       updateColorPickerInputs()));

    modifyCountriesContainer.addEventListener("click", e => fillDetailInputsAreaListener(modifyCountriesContainer,
                                                                                         createCountryContainer,
                                                                                         inputsArea,
                                                                                         loadCountries()));

    createCountryForm.addEventListener("submit", e => createCountryFormListener(e));

    modifyCountriesListContainer.addEventListener("click", e => countryContainerListener(e));

    modifyBtn.addEventListener("click", e => modifyBtnListener(e));

    deleteBtn.addEventListener("click", e => deleteBtnListener(e));
}

function createCountryFormListener(e) {
    e.preventDefault();
    const codeValue = document.getElementById("code-txt").value;
    const nameValue = document.getElementById("name-txt").value;
    const qualifiedValue = document.getElementById("qualified-cbx").value;
    const runningOrderValue = document.getElementById("runningorder-nmbr").value;
    const flagColor1Value = document.getElementById("flagcolor1-txt").value;
    const flagColor2Value = document.getElementById("flagcolor2-txt").value;
    const flagColor3Value = document.getElementById("flagcolor3-txt").value;
    const songValue = document.getElementById("song-txt").value;
    const artistValue = document.getElementById("artist-txt").value;

    // TODO: Add validation checks and required fields
    let country = {
        code: codeValue,
        name: nameValue,
        qualified: qualifiedValue,
        runningOrder: runningOrderValue,
        votes: 0,
        totalVotes: 0,
        flagColors: [flagColor1Value, flagColor2Value, flagColor3Value],
        artist: artistValue,
        song: songValue
    }

    // TODO: Success / Failure message
    createCountry(country);
}

function loadCountries() {
    updateColorPickerInputs();

    if (!isCountriesLoaded) {
        getAllCountries()
        .then(result => {
            countries = result;
            isCountriesLoaded = true;
            
            var content = { countries: countries };

            const modifyCountriesListContainer = document.getElementById("modify-countries-list-container");
            modifyCountriesListContainer.innerHTML = adminTemplates.countries.countryContainer(content);
        })

    }
}

function updateColorPickerInputs() {
    const colorPickerContainers = document.querySelectorAll(".color-picker-container");

    for (var container of colorPickerContainers) {
        var inputClr = container.querySelector("input[type='color']");
        var inputTxt = container.querySelector("input[type='text']");

        updateColorInput(inputClr, inputTxt)
    }
}

function updateColorInput(inputClr, inputTxt) {
    inputClr.addEventListener("input", e => inputTxt.value = e.target.value);
    inputTxt.addEventListener("input", e => inputClr.value = e.target.value);
}

function countryContainerListener(e) {
    var country = countries.find(({code}) => code == e.target.id);

    // TODO: When clicked, highlight the container

    fillInputs(country)
}

function fillInputs(country) {
    document.getElementById("code-txt").value = country.code;
    document.getElementById("name-txt").value = country.name;
    document.getElementById("qualified-cbx").value = country.qualified;
    document.getElementById("runningorder-nmbr").value = country.runningOrder;
    document.getElementById("flagcolor1-txt").value = country.flagColor1;
    document.getElementById("flagcolor2-txt").value = country.flagColor2;
    document.getElementById("flagcolor3-txt").value = country.flagColor3;
    document.getElementById("song-txt").value = country.song;
    document.getElementById("artist-txt").value = country.artist;
}