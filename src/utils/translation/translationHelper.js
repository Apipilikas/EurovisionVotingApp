import { ChildSelectorResolver } from "../document/selectorResolver/childSelectorResolver.js";
import { SelectorResolver } from "../document/selectorResolver/selectorResolver.js";
import { TranslationManager } from "./translationManager.js";

let TranslationHelper = { };

const TranslationManagers = new Map([
    ["en", TranslationManager.getEnglishManager()],
    ["gr", TranslationManager.getGreekManager()]
]);

let preferredManager = TranslationManagers.get("gr");

/**
 * 
 */
TranslationHelper.applyTranslations = function() {
    let resolver = SelectorResolver.resolve("[translation-id] ALL");
    resolver.applyFunctionToElements(applyTranslationToElement, preferredManager)
}

/**
 * 
 * @param {*} element 
 */
TranslationHelper.applyTranslationsToChildElements = function(element) {
    let resolver = ChildSelectorResolver.resolve("[translation-id] ALL", element);
    resolver.applyFunctionToElements(applyTranslationToElement, preferredManager);
}

/**
 * 
 * @param {*} element 
 */
TranslationHelper.observeTranslationChanges = function(element) {
    const observer = new MutationObserver(function(mutationsList, observer) {
        observer.disconnect();
        console.log(mutationsList)
        for (var record of mutationsList) {
            TranslationHelper.applyTranslationsToChildElements(record.target);
        }
    });
      
      // call `observe()`, passing it the element to observe, and the options object
      observer.observe(element, {
        subtree: true,
        childList: true
      });
}

/**
 * 
 * @param {*} language 
 * @returns 
 */
TranslationHelper.getTranslationManager = function(language) {
    return TranslationManagers.get(language);
}

/**
 * 
 * @returns 
 */
TranslationHelper.getPreferredLanguage = function() {
    return preferredManager.language.id;
}

/**
 * 
 * @param {*} language 
 */
TranslationHelper.setPreferredLanguage = function(language) {
    window.localStorage.setItem("language", language);
    // set json string in local storage. different page-
    preferredManager = TranslationManagers.get(language);
}

/**
 * 
 * @returns 
 */
TranslationHelper.initPreferredLanguage = async function() {
   let language =  window.localStorage.getItem("language");

   if (language != null) preferredManager = TranslationManagers.get(language);
   let result = await preferredManager.loadFromFile();

   return result;
}

/**
 * Gets translation based on preferred language.
 * @param {string} id 
 * @returns 
 */
TranslationHelper.getTranslation = function(id) {
    return preferredManager.getTranslation(id);
}

/**
 * 
 * @param {HTMLElement} element 
 * @param {TranslationManager} manager 
 */
function applyTranslationToElement(element, manager) {
    let translationID = element.getAttribute("translation-id");

    let translation = manager.getTranslation(translationID);
    if (translation == null) return;

    element.innerHTML = translation;
}

export {TranslationHelper};