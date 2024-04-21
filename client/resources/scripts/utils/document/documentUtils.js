import { ErrorBox } from "../boxes/errorBox.js";
import { MyError } from "../errorUtils.js";
import { SelectorResolver } from "./selectorResolver.js";

const defaultAnnouncement = "UNITED BY MUSIC";
let DocumentUtils = {};

DocumentUtils.fillDetailInputsAreaListener = function(currentDetail, otherDetail, inputsArea, callbackFunction = null) {
    if (!currentDetail.hasAttribute("open")) {
        otherDetail.removeAttribute("open");
        
        const currentDetailInputsArea = currentDetail.querySelector(".inputs-area");
        const otherDetailInputsArea = otherDetail.querySelector(".inputs-area");

        currentDetailInputsArea.innerHTML = inputsArea;
        otherDetailInputsArea.innerHTML = "";

        if (typeof callbackFunction === "function") callbackFunction();
    }
}

function areRequiredInputsFilled(inputsArea) {
    const inputs = inputsArea.querySelectorAll("input");

    for (var input in inputs) {
        if (input.hasAttribute("required")) return false;
    }

    return true;
}

//#region Event Listeners utils

DocumentUtils.addClickEventListener = function(selector, listenerFunction) {
    addEventListener(selector, "click", listenerFunction);
}

DocumentUtils.addSubmitEventListener = function(selector, listenerFunction) {
    addEventListener(selector, "submit", listenerFunction);
}

function addEventListener(selector, type, listenerFunction) {
    if (!typeof listenerFunction === "function") return;

    let resolvedSelector = SelectorResolver.resolve(selector);
    if (!resolvedSelector.hasElements()) return;
    
    if (resolvedSelector.hasMultipleElements) {
        for (var element of resolvedSelector.elements) {
            element.addEventListener(type, e => listenerFunction(e));
        }
    }
    else {
        resolvedSelector.elements.addEventListener(type, e => listenerFunction(e));
    }
}

DocumentUtils.setInnerHTML = function(selector, innerHTML) {
    if (innerHTML == null) return;

    let resolvedSelector = SelectorResolver.resolve(selector);
    if (!resolvedSelector.hasElements()) return;

    if (resolvedSelector.hasMultipleElements) {
        for (var element of resolvedSelector.elements) {
            element.innerHTML = innerHTML;
        }
    }
    else {
        resolvedSelector.elements.innerHTML = innerHTML;
    }
}

DocumentUtils.getElementAttribute = function(selector, attributeName) {
    if (attributeName == null) return;

    let resolvedSelector = SelectorResolver.resolve(selector);
    if (!resolvedSelector.hasElements() || resolvedSelector.hasMultipleElements) return null;

    return resolvedSelector.elements[attributeName];
}

DocumentUtils.setElementAttribute = function(selector, attributeName, attributeValue) {
    if (attributeName == null) return;

    let resolvedSelector = SelectorResolver.resolve(selector);
    if (!resolvedSelector.hasElements() || resolvedSelector.hasMultipleElements) return;
    
    resolvedSelector.elements[attributeName] = attributeValue;
}

//#endregion

//#region Display utils

DocumentUtils.blurScreen = function() {
    const blurScreen = document.getElementById("blur-screen");
    blurScreen.style.display = "initial";
}

DocumentUtils.unblurScreen = function() {
    const blurScreen = document.getElementById("blur-screen");
    blurScreen.style.display = "none";
}

DocumentUtils.handleError = function(e) {
    if (e instanceof MyError) {
        ErrorBox.showMyError(e);
    }
    else {
        ErrorBox.show(e.message, e.stack, "GENERAL_ERROR", "Contact Aggelos and reload the page.");
    }
}

//#endregion

export { DocumentUtils }