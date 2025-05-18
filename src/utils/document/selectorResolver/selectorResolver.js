/**
 * This class is used to find specific elements of the DOM, given a specific selector ID.
 */
export class SelectorResolver {
    #elements

    static SelectorType = {
        ElementID : "ElementID",
        ClassName : "ClassName",
        QuerySelector : "QuerySelector",
        QuerySelectorAll : "QuerySelectorAll"
    }

    /**
     * SelectorResolver constructor
     * @param {string} selector Selector ID
     */
    constructor(selector) {
        this.selector = selector;
        this.selectorType = this.resolveType(selector);
        this.processedSelector = this.getProcessedSelector();
        this.#elements = null;
        this.hasMultipleElements = false;
        this.hasResolved = false;
    }

    get elements() {
        return this.#elements;
    }

    set elements(value) {
        if (value == null) {
            this.#elements = [];
        }
        else if (value instanceof Element) {
            this.#elements = [value];
        }
        else {
            this.#elements = value;
        }
    }

    /**
     * Resolves selector
     * @param {*} selector Selector ID
     * @returns {SelectorResolver} Resolved selector
     */
    static resolve(selector) {
        let selectorResolver = new SelectorResolver(selector);
        selectorResolver.resolve();
        return selectorResolver;
    }

    /**
     * Gets elements from document with the specific resolved selector type.
     */
    resolve() {
        switch (this.selectorType) {
            case SelectorResolver.SelectorType.ElementID:
                this.elements = document.getElementById(this.processedSelector);
                break;
            case SelectorResolver.SelectorType.ClassName:
                this.elements = document.getElementsByClassName(this.processedSelector);
                this.hasMultipleElements = true;
                break;
            case SelectorResolver.SelectorType.QuerySelector:
                this.elements = document.querySelector(this.processedSelector);
                break;
            case SelectorResolver.SelectorType.QuerySelectorAll:
                this.elements = document.querySelectorAll(this.processedSelector);
                this.hasMultipleElements = true;
                break;
        }

        this.hasResolved = true;
    }
    
    /**
     * Gets selector type.
     * Selector has the following format:
     * #element-id                  -> search for element by element ID
     * .class-name                  -> search for elements by class Name
     * tag                          -> search for element with specific tag (query Selector)
     * #element-id .class-name      -> search for element that suits specific selector (query Selector)
     * #element-id .class-name ALL  -> search for elements that suit specific selector (query Selector All)
     * @param {string} selector Selector ID 
     * @returns {string} Selector type
     */
    resolveType(selector) {
        let isQuerySelector = selector.split(' ').length > 1;
    
        if (isQuerySelector) {
            let isQuerySelectorAll = selector.endsWith("ALL");
    
            if (isQuerySelectorAll) {
                return SelectorResolver.SelectorType.QuerySelectorAll;
            }
        }
        else {
            let isElementID = selector.startsWith("#");
            let isClassName = selector.startsWith(".");
    
            if (isElementID) {
                return SelectorResolver.SelectorType.ElementID;
            }
            else if (isClassName) {
                return SelectorResolver.SelectorType.ClassName;
            }
        }
        
        return SelectorResolver.SelectorType.QuerySelector;
    }
    
    /**
     * Gets the processed selector ID based on selector type.
     * @returns {string} Processed selector ID
     */
    getProcessedSelector() {
        switch (this.selectorType) {
            case SelectorResolver.SelectorType.ElementID: return this.selector.replace("#", "");
            case SelectorResolver.SelectorType.ClassName: return this.selector.replace(".", "");
            case SelectorResolver.SelectorType.QuerySelectorAll: return this.selector.replace(" ALL", "");
        }
    
        return this.selector;
    }

    /**
     * Applies callback function to each one of the resolved elements. Gets the result of the callback function.
     * @param {Function} callbackFunction Callback function. First argument SHOULD always be the element.
     * @param  {...any} args Callback function arguments
     * @returns 
     */
    applyFunctionToElements(callbackFunction, ...args) {
        if (!this.hasResolved) return null;

        let results = [];
        
        if (this.hasMultipleElements) {
            for (var element of this.elements) {
                let result = callbackFunction.apply(null, Utils.getArgs(element, ...args));
                results.push(result);
            }
        }
        else {
            let result = callbackFunction.apply(null, Utils.getArgs(this.elements[0], ...args));
            results.push(result);
        }

        return results;
    }

    /**
     * Shows if the resolver has elements. The resolver will have elements if it has been resolved, elements are not null
     * and have length greater than 0.
     * @returns {boolean} 
     */
    hasElements() {
        return this.hasResolved && (this.elements != null || this.elements.length > 0);
    }
}

//#region Utils

var Utils = {};

Utils.getArgs = function(element, ...args) {
    let newArgs = new Array(element);
    newArgs.push(...args);
    return newArgs;
}

//#endregion