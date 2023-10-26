import { createCountry } from "../utils/requestUtils.js";

window.onload = init;

function init() {
    const createCountryForm = document.getElementById("create-country-form");
    const colorPickerContainers = document.querySelectorAll(".color-picker-container");

    updateColorPickerTextInputs(colorPickerContainers);
    console.log("loaded")
    createCountryForm.addEventListener("submit", e => createCountryFormListener(e));
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

    createCountry(country);
}

function updateColorPickerTextInputs(colorPickerContainers) {
    for (var container of colorPickerContainers) {
        var inputClr = container.querySelector("input[type='color']");
        var inputTxt = container.querySelector("input[type='text']");

        updateInputEvent(inputClr, inputTxt)
    }
}

function updateInputEvent(inputClr, inputTxt) {
    inputClr.addEventListener("input", e => inputTxt.value = e.target.value);
    inputTxt.addEventListener("input", e => inputClr.value = e.target.value);
}