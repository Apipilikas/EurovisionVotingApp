import { ErrorBox } from "../boxes/errorBox.js";
import { MyError } from "../errorUtils.js";
import { ChildSelectorResolver, ParentSelectorResolver, SelectorResolver } from "./selectorResolver.js";
import { MessageDialog } from "../dialogs/messageDialog.js";
import { NotificationBox } from "../boxes/notificationBox.js";

let DocumentUtils = {};

//#region Input utils

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

//#endregion

//#region Event Listeners utils

DocumentUtils.addClickEventListener = function(selector, listenerFunction) {
    addEventListener(selector, "click", listenerFunction);
}

DocumentUtils.addSubmitEventListener = function(selector, listenerFunction) {
    addEventListener(selector, "submit", listenerFunction);
}

DocumentUtils.addChangeEventListener = function(selector, listenerFunction) {
    addEventListener(selector, "change", listenerFunction);
}

function addEventListener(selector, type, listenerFunction) {
    if (!typeof listenerFunction === "function") return;

    let resolvedSelector = SelectorResolver.resolve(selector);
    if (!resolvedSelector.hasElements()) return;
    
    addEventListenerByResolver(resolvedSelector, type, listenerFunction);
}

DocumentUtils.addChildClickEventListener = function(selector, parentElement, listenerFunction) {
    addChildEventListener(selector, parentElement, "click", listenerFunction);
}

function addChildEventListener(selector, parentElement, type, listenerFunction) {
    if (!typeof listenerFunction === "function") return;

    let resolvedSelector = ChildSelectorResolver.resolve(selector, parentElement);
    if (!resolvedSelector.hasElements()) return;

    addEventListenerByResolver(resolvedSelector, type, listenerFunction);
}

function addEventListenerByResolver(resolver, type, listenerFunction) {
    if (resolver.hasMultipleElements) {
        for (var element of resolver.elements) {
            addEventListenerByElement(element, type, listenerFunction);
        }
    }
    else {
        addEventListenerByElement(resolver.elements[0], type, listenerFunction);
    }
}

function addEventListenerByElement(element, type, listenerFunction) {
    element.addEventListener(type, e => listenerFunction(e));
}

//#endregion

//#region Inner HTML utils

DocumentUtils.setInnerHTML = function(selector, innerHTML) {
    if (innerHTML == null) return;

    let resolvedSelector = SelectorResolver.resolve(selector);
    if (!resolvedSelector.hasElements()) return;

    setInnerHTMLByResolver(resolvedSelector, innerHTML);
}

DocumentUtils.setChildInnerHTML = function(selector, element, innerHTML) {
    let resolvedSelector = ChildSelectorResolver.resolve(selector, element);
    if (!resolvedSelector.hasElements()) return;
    
    setInnerHTMLByResolver(resolvedSelector, innerHTML);
}

DocumentUtils.setParentInnerHTML = function(selector, element, innerHTML) {
    let resolvedSelector = ParentSelectorResolver.resolve(selector, element);
    if (!resolvedSelector.hasElements()) return;

    setInnerHTMLByResolver(resolvedSelector, innerHTML);
}

DocumentUtils.setInnerHTMLByElement = function(element, innerHTML) {
    if (element == null || innerHTML == null) return;
    
    element.innerHTML = innerHTML;
}

function setInnerHTMLByResolver(resolver, innerHTML) {
    if (resolver.hasMultipleElements) {
        for (var element of resolver.elements) {
            DocumentUtils.setInnerHTMLByElement(element, innerHTML);
        }
    }
    else {
        DocumentUtils.setInnerHTMLByElement(resolver.elements[0], innerHTML)
    }
}

//#endregion

//#region Element Attribute utils

DocumentUtils.getElementAttribute = function(selector, attributeName) {
    if (attributeName == null) return;

    let resolvedSelector = SelectorResolver.resolve(selector);
    if (!resolvedSelector.hasElements() || resolvedSelector.hasMultipleElements) return null;

    return this.getElementAttributeByElement(resolvedSelector.elements[0], attributeName);
}

DocumentUtils.setElementAttribute = function(selector, attributeName, attributeValue) {
    if (attributeName == null) return;
    
    let resolvedSelector = SelectorResolver.resolve(selector);
    if (!resolvedSelector.hasElements() || resolvedSelector.hasMultipleElements) return;
    
    this.setElementAttributeByElement(resolvedSelector.elements[0], attributeName, attributeValue)
}

DocumentUtils.getElementAttributeByElement = function(element, attributeName) {
    if (element == null || !element instanceof Element) return;
    return element[attributeName];
}

DocumentUtils.setElementAttributeByElement = function(element, attributeName, attributeValue) {
    if (element == null || !element instanceof Element) return;
    element[attributeName] = attributeValue;
}

//#endregion

//#region Document class utils

DocumentUtils.addClassName = function(selector, className) {
    if (className == null) return;

    let resolvedSelector = SelectorResolver.resolve(selector);
    if (!resolvedSelector.hasElements()) return;

    if (resolvedSelector.hasMultipleElements) {
        for (var element of resolvedSelector.elements) {
            this.addClassListByElement(element, className);
        }
    }
    else {
        this.addClassNameByElement(resolvedSelector.elements[0], className);
    }
}

DocumentUtils.removeClassName = function(selector, className) {
    if (className == null) return;

    let resolvedSelector = SelectorResolver.resolve(selector);
    if (!resolvedSelector.hasElements()) return;

    if (resolvedSelector.hasMultipleElements) {
        for (var element of resolvedSelector.elements) {
            this.removeClassNameByElement(element, className);
        }
    }
    else {
        this.removeClassNameByElement(resolvedSelector.elements[0], className);
    }
}

DocumentUtils.containsClassName = function(selector, className) {
    if (className == null) return;

    let resolvedSelector = SelectorResolver.resolve(selector);
    if (!resolvedSelector.hasElements() || resolvedSelector.hasMultipleElements) return;

    return this.containsClassNameByElement(resolvedSelector.elements[0], className);
}

DocumentUtils.addClassNameByElement = function(element, className) {
    if (element != null && !this.containsClassNameByElement(element, className)) {
        element.classList.add(className);
    }
}

DocumentUtils.removeClassNameByElement = function(element, className) {
    if (this.containsClassNameByElement(element, className)) {
        element.classList.remove(className);
    }
}

DocumentUtils.containsClassNameByElement = function(element, className) {
    if (element == null) return false;

    return element.classList.contains(className);
}

//#endregion

//#region General utils

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

DocumentUtils.reloadPage = function() {
    location.reload();
}

DocumentUtils.getDisplayBoxContainer = function() {
    return document.getElementById("display-box-container");
}

DocumentUtils.handleGeneralSocketEvent = function(response) {
    let code = response.data.code;
    let message = response.message.plainText;

    switch (code) {
        case "INFORM_MESSAGE":
            MessageDialog.show(MessageDialog.Type.INFO, message);
            break;
        case "WARNING_MESSAGE":
            MessageDialog.show(MessageDialog.Type.WARNING, message);
            break;
        case "RESET_CACHE":
            MessageDialog.show(MessageDialog.Type.WARNING, message + " Page will be refreshed soon.", true).closeAfterMs(8000);
            break;
    }
}

DocumentUtils.handleResponseFailure = function(response) {
    let error = response.jsonData.error;
    NotificationBox.show(NotificationBox.Type.ERROR, error.code, error.description);
}

//#endregion

export { DocumentUtils }