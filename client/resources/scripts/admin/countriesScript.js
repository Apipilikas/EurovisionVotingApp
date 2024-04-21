import { ResultButton } from "../utils/customElements/resultButton.js";
import { DocumentUtils } from "../utils/document/documentUtils.js";
import { adminTemplates } from "../utils/handlebarsUtils.js";
import { InitUtils } from "../utils/initUtils.js";
import { CountryRequests } from "../utils/requestUtils.js";

var loginJudge = null;
var areCountriesLoaded = false;
var countries = [];
const inputsArea = adminTemplates.countries.formInputsArea;

window.onload = init;

async function init() {
    try {
        loginJudge = await InitUtils.initLoginJudge(null).then(response => {return response});

        initBtnListeners();
    }
    catch (e) {DocumentUtils.handleError(e)}
}

//#region Init functions

function initBtnListeners() {
    const createCountryContainer = document.getElementById("create-country-container");
    const modifyCountriesContainer = document.getElementById("modify-countries-container");

    createCountryContainer.addEventListener("click", e => DocumentUtils.fillDetailInputsAreaListener(createCountryContainer,
                                                                                       modifyCountriesContainer,
                                                                                       inputsArea,
                                                                                       initColorPickerInputs()));

    modifyCountriesContainer.addEventListener("click", e => DocumentUtils.fillDetailInputsAreaListener(modifyCountriesContainer,
                                                                                         createCountryContainer,
                                                                                         inputsArea,
                                                                                         loadCountries()));

    DocumentUtils.addSubmitEventListener("#create-country-form", createCountryFormListener);
    DocumentUtils.addClickEventListener("#modify-countries-list-container", countryContainerListener);

    DocumentUtils.addClickEventListener("#modify-btn", modifyBtnListener);
    DocumentUtils.addClickEventListener("#delete-btn", deleteBtnListener);
}

//#endregion

//#region General functions

function initColorPickerInputs() {
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

function loadCountries() {
    initColorPickerInputs();

    if (!areCountriesLoaded) {
        CountryRequests.getAllCountries()
        .then(response => {
            countries = response.jsonData.countries;
            areCountriesLoaded = true;
            
            var content = adminTemplates.countries.countryContainer({ countries: countries });
            DocumentUtils.setInnerHTML("#modify-countries-list-container", content);
        })

    }
}

function fillInputs(country) {
    const attributeName = "value";
    DocumentUtils.setElementAttribute("#code-txt", attributeName, country.code);
    DocumentUtils.setElementAttribute("#name-txt", attributeName, country.name);
    DocumentUtils.setElementAttribute("#name-txt", attributeName, country.name);
    DocumentUtils.setElementAttribute("#qualified-cbx", attributeName, country.qualified);
    DocumentUtils.setElementAttribute("#runningorder-nmbr", attributeName, country.runningOrder);
    DocumentUtils.setElementAttribute("#flagcolor1-txt", attributeName, country.flagColors[0]);
    DocumentUtils.setElementAttribute("#flagcolor2-txt", attributeName, country.flagColors[1]);
    DocumentUtils.setElementAttribute("#flagcolor3-txt", attributeName, country.flagColors[2]);
    DocumentUtils.setElementAttribute("#song-txt", attributeName, country.song);
    DocumentUtils.setElementAttribute("#artist-txt", attributeName, country.artist);
}

function getCountryInputsValue() {
    const attributeName = "value";
    const codeValue = DocumentUtils.getElementAttribute("#code-txt", attributeName);
    const nameValue = DocumentUtils.getElementAttribute("#name-txt", attributeName);
    const qualifiedValue = DocumentUtils.getElementAttribute("#qualified-cbx", attributeName);
    const runningOrderValue = DocumentUtils.getElementAttribute("#runningorder-nmbr", attributeName);
    const flagColor1Value = DocumentUtils.getElementAttribute("#flagcolor1-txt", attributeName);
    const flagColor2Value = DocumentUtils.getElementAttribute("#flagcolor2-txt", attributeName);
    const flagColor3Value = DocumentUtils.getElementAttribute("#flagcolor3-txt", attributeName);
    const songValue = DocumentUtils.getElementAttribute("#song-txt", attributeName);
    const artistValue = DocumentUtils.getElementAttribute("#artist-txt", attributeName);

    let country = {
        code: codeValue,
        name: nameValue,
        qualified: qualifiedValue,
        runningOrder: runningOrderValue,
        flagColors: [flagColor1Value, flagColor2Value, flagColor3Value],
        artist: artistValue,
        song: songValue
    }

    return country;
}

//#endregion

//#region Event Listener functions

function createCountryFormListener(e) {
    e.preventDefault();

    let submitBtn = e.target.querySelector("#submit-btn");

    // TODO: Add validation checks and required fields
    let country = getCountryInputsValue();

    ResultButton.getByElement(submitBtn)
    .execute(CountryRequests.createCountry(loginJudge.code, country));
}

function countryContainerListener(e) {
    var country = countries.find(({code}) => code == e.target.id);

    // TODO: When clicked, highlight the selected container

    fillInputs(country)
}

function modifyBtnListener(e) {
    e.preventDefault();

    let modifyBtn = e.target;
    let selectedModifiedCountryCode = e.target.form.querySelector("#code-txt").value;
    let modifiedCountry = getCountryInputsValue();

    ResultButton.getByElement(modifyBtn)
    .execute(CountryRequests.updateCountry(loginJudge.code, selectedModifiedCountryCode, modifiedCountry));
}

function deleteBtnListener(e) {
    e.preventDefault();

    let deleteBtn = e.target;
    let selectedModifiedCountryCode = e.target.form.querySelector("#code-txt").value;

    ResultButton.getByElement(deleteBtn)
    .execute(CountryRequests.deleteCountry(loginJudge.code, selectedModifiedCountryCode));
}

//#endregion