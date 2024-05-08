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

/**
 * Sets click event listener to the resolved selector element(s).
 * @param {string} selectorID Selector ID
 * @param {function} listenerFunction Callback function. Always passes event as a parameter.
 */
DocumentUtils.setClickEventListener = function(selectorID, listenerFunction) {
    setEventListener(selectorID, "click", listenerFunction);
}

/**
 * Sets submit event listener to the resolved selector element(s).
 * @param {string} selectorID Selector ID
 * @param {function} listenerFunction Callback function. Always passes event as a parameter.
 */
DocumentUtils.setSubmitEventListener = function(selectorID, listenerFunction) {
    setEventListener(selectorID, "submit", listenerFunction);
}

/**
 * Sets change event listener to the resolved selector element(s).
 * @param {string} selectorID Selector ID
 * @param {function} listenerFunction Callback function. Always passes event as a parameter.
 */
DocumentUtils.setChangeEventListener = function(selectorID, listenerFunction) {
    setEventListener(selectorID, "change", listenerFunction);
}

/**
 * Generic function | Sets event listener with the given type to the resolved selector element(s).
 * @param {string} selectorID Selector ID
 * @param {string} type Type of the event
 * @param {function} listenerFunction Callback function. Always passes event as a parameter.
 */
function setEventListener(selectorID, type, listenerFunction) {
    if (!typeof listenerFunction === "function") return;

    let resolvedSelector = SelectorResolver.resolve(selectorID);
    if (!resolvedSelector.hasElements()) return;
    
    setEventListenerByResolver(resolvedSelector, type, listenerFunction);
}

/**
 * Sets click event listener to the resolved selector child element of the given element.
 * @param {string} selectorID Selector ID
 * @param {HTMLElement} element Current element
 * @param {function} listenerFunction Callback function. Always passes event as a parameter.
 */
DocumentUtils.setChildClickEventListener = function(selectorID, element, listenerFunction) {
    setChildEventListener(selectorID, element, "click", listenerFunction);
}

/**
 * Sets click event listener to the resolved selector child element.
 * @param {string} selectorID Selector ID
 * @param {HTMLElement} element Current element
 * @param {string} type Type of the event
 * @param {function} listenerFunction Callback function. Always passes event as a parameter.
 */
function setChildEventListener(selectorID, element, type, listenerFunction) {
    if (!typeof listenerFunction === "function") return;

    let resolvedSelector = ChildSelectorResolver.resolve(selectorID, element);
    if (!resolvedSelector.hasElements()) return;

    setEventListenerByResolver(resolvedSelector, type, listenerFunction);
}

/**
 * Generic function | Sets event listener with the given type to the resolved selector element(s).
 * @param {SelectorResolver} resolver Resolved selector instance
 * @param {string} type Type of the event
 * @param {function} listenerFunction Callback function. Always passes event as a parameter.
 */
function setEventListenerByResolver(resolver, type, listenerFunction) {
    if (resolver.hasMultipleElements) {
        for (var element of resolver.elements) {
            setEventListenerByElement(element, type, listenerFunction);
        }
    }
    else {
        setEventListenerByElement(resolver.elements[0], type, listenerFunction);
    }
}

/**
 * Sets event listener with the given type to the element.
 * @param {HTMLElement} element Element
 * @param {string} type Type of the event
 * @param {function} listenerFunction Callback function. Always passes event as a parameter.
 */
function setEventListenerByElement(element, type, listenerFunction) {
    element.addEventListener(type, e => listenerFunction(e));
}

//#endregion

//#region Inner HTML utils

/**
 * Sets inner HTML to the resolved selector element(s).
 * @param {string} selectorID Selector ID
 * @param {string} innerHTML Inner HTML content
 */
DocumentUtils.setInnerHTML = function(selectorID, innerHTML) {
    if (innerHTML == null) return;

    let resolvedSelector = SelectorResolver.resolve(selectorID);

    setInnerHTMLByResolver(resolvedSelector, innerHTML);
}

/**
 * Sets inner HTML to the resolved selector child element(s).
 * @param {string} selectorID Selector ID
 * @param {HTMLElement} element Current element
 * @param {string} innerHTML Inner HTML content
 */
DocumentUtils.setChildInnerHTML = function(selectorID, element, innerHTML) {
    let resolvedSelector = ChildSelectorResolver.resolve(selectorID, element);
    
    setInnerHTMLByResolver(resolvedSelector, innerHTML);
}

/**
 * Sets inner HTML to the resolved selector parent element.
 * @param {string} selectorID Selector ID
 * @param {HTMLElement} element Current element
 * @param {string} innerHTML Inner HTML content
 */
DocumentUtils.setParentInnerHTML = function(selectorID, element, innerHTML) {
    let resolvedSelector = ParentSelectorResolver.resolve(selectorID, element);

    setInnerHTMLByResolver(resolvedSelector, innerHTML);
}

/**
 * Sets inner HTML to the current element.
 * @param {HTMLElement} element Current element
 * @param {string} innerHTML Inner HTML content 
 */
DocumentUtils.setInnerHTMLByElement = function(element, innerHTML) {
    if (element == null || innerHTML == null) return;
    
    element.innerHTML = innerHTML;
}

/**
 * Generic function | Sets inner HTML to the resolved selector element(s).
 * @param {SelectorResolver} resolver Resolver instance
 * @param {string} innerHTML Inner HTML content
 */
function setInnerHTMLByResolver(resolver, innerHTML) {
    if (!resolver.hasElements()) return;

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

/**
 * Gets element's attribute from the resolved selector first element.
 * @param {*} selectorID Selector ID
 * @param {*} attributeName Attribute name
 * @returns {object} Attribute value. If attribute was not found, returns null.
 */
DocumentUtils.getElementAttribute = function(selectorID, attributeName) {
    if (attributeName == null) return null;

    let resolvedSelector = SelectorResolver.resolve(selectorID);
    if (!resolvedSelector.hasElements() || resolvedSelector.hasMultipleElements) return null;

    return this.getElementAttributeByElement(resolvedSelector.elements[0], attributeName);
}

/**
 * Sets element's attribute to the resolved selector first element.
 * @param {string} selectorID Selector ID
 * @param {string} attributeName Attribute name
 * @param {object} attributeValue Attribute value
 */
DocumentUtils.setElementAttribute = function(selectorID, attributeName, attributeValue) {
    if (attributeName == null) return;
    
    let resolvedSelector = SelectorResolver.resolve(selectorID);
    if (!resolvedSelector.hasElements() || resolvedSelector.hasMultipleElements) return;
    
    this.setElementAttributeByElement(resolvedSelector.elements[0], attributeName, attributeValue)
}

/**
 * Gets element's attribute.
 * @param {HTMLElement} element 
 * @param {string} attributeName Attribute name
 * @returns 
 */
DocumentUtils.getElementAttributeByElement = function(element, attributeName) {
    if (element == null) return null;
    return element[attributeName];
}

/**
 * Sets element's attribute.
 * @param {HTMLElement} element 
 * @param {string} attributeName Attribute name
 * @param {object} attributeValue Attribute value
 */
DocumentUtils.setElementAttributeByElement = function(element, attributeName, attributeValue) {
    if (element == null) return;
    element[attributeName] = attributeValue;
}

//#endregion

//#region Document class utils

/**
 * Adds class name to the resolved selector element(s) class list.
 * The addition takes place if the class name is not contained in element's class list.
 * @param {string} selectorID Selector ID
 * @param {string} className Class name
 */
DocumentUtils.addClassName = function(selectorID, className) {
    if (className == null) return;

    let resolvedSelector = SelectorResolver.resolve(selectorID);
    if (!resolvedSelector.hasElements()) return;

    if (resolvedSelector.hasMultipleElements) {
        for (var element of resolvedSelector.elements) {
            this.addClassNameByElement(element, className);
        }
    }
    else {
        this.addClassNameByElement(resolvedSelector.elements[0], className);
    }
}

/**
 * Removes class name from the resolved selector element(s) class list.
 * The removement takes place if the class name is contained in element's class list.
 * @param {string} selectorID Selector ID
 * @param {string} className Class name
 */
DocumentUtils.removeClassName = function(selectorID, className) {
    if (className == null) return;

    let resolvedSelector = SelectorResolver.resolve(selectorID);
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

/**
 * Checks if class name is contained in the resolved selector element class list.
 * @param {string} selectorID Selector ID
 * @param {string} className Class name
 * @returns {boolean} Returns true if class name is present. Otherwise false.
 */
DocumentUtils.containsClassName = function(selectorID, className) {
    if (className == null) return;

    let resolvedSelector = SelectorResolver.resolve(selectorID);
    if (!resolvedSelector.hasElements() || resolvedSelector.hasMultipleElements) return;

    return this.containsClassNameByElement(resolvedSelector.elements[0], className);
}

/**
 * Adds class name to the element's class list.
 * The addition takes place if the class name is not contained in element's class list.
 * @param {HTMLElement} element 
 * @param {string} className Class name
 */
DocumentUtils.addClassNameByElement = function(element, className) {
    if (element != null && !this.containsClassNameByElement(element, className)) {
        element.classList.add(className);
    }
}

/**
 * Removes class name from the element's class list.
 * The removement takes place if the class name is contained in element's class list.
 * @param {HTMLElement} element 
 * @param {string} className Class name
 */
DocumentUtils.removeClassNameByElement = function(element, className) {
    if (this.containsClassNameByElement(element, className)) {
        element.classList.remove(className);
    }
}

/**
 * Checks if class name is contained in the class list.
 * @param {HTMLElement} element 
 * @param {string} className Class name
 * @returns {boolean} Returns true if class name is present. Otherwise false.
 */
DocumentUtils.containsClassNameByElement = function(element, className) {
    if (element == null) return false;

    return element.classList.contains(className);
}

//#endregion

//#region Root property utils

/**
 * Sets value to the :root property name.
 * @param {string} propertyName Name of the property
 * @param {string} propertyValue Value of the property
 */
DocumentUtils.setRootProperty = function(propertyName, propertyValue) {
    const rootVariables = document.querySelector(":root");
    rootVariables.style.setProperty(propertyName, propertyValue);
}

//#endregion

//#region General utils

/**
 * Blurs the screen.
 */
DocumentUtils.blurScreen = function() {
    const blurScreen = document.getElementById("blur-screen");
    blurScreen.style.display = "initial";
}

/**
 * Unblurs the screen.
 */
DocumentUtils.unblurScreen = function() {
    const blurScreen = document.getElementById("blur-screen");
    blurScreen.style.display = "none";
}

/**
 * Handles the errors by showing Error box.
 * @param {Error} error Error that will be handled 
 */
DocumentUtils.handleError = function(error) {
    if (error instanceof MyError) {
        ErrorBox.showMyError(error);
    }
    else {
        ErrorBox.show(error.message, error.stack, "GENERAL_ERROR", "Contact Aggelos and reload the page.");
    }
}

/**
 * Reloads the page.
 */
DocumentUtils.reloadPage = function() {
    location.reload();
}

/**
 * Gets the Display Box Container Element.
 * @returns {HTMLElement} Display box Container
 */
DocumentUtils.getDisplayBoxContainer = function() {
    return document.getElementById("display-box-container");
}

/**
 * Handles the "general" socket event.
 * @param {Object} response The response of the "general" event 
 */
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

/**
 * Handles response failure error came from requests to the server.
 * @param {ClientResponse} response The server response
 */
DocumentUtils.handleResponseFailure = function(response) {
    let error = response.jsonData.error;
    NotificationBox.show(NotificationBox.Type.ERROR, error.code, error.description);
}

//#endregion

export { DocumentUtils }