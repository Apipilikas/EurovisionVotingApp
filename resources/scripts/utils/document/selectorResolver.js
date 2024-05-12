/**
 * This class is used to find specific elements of the DOM, given a specific selector ID.
 */
export class SelectorResolver {
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
        this._elements = null;
        this.hasMultipleElements = false;
        this.hasResolved = false;
    }

    get elements() {
        return this._elements;
    }

    set elements(value) {
        if (value == null) {
            this._elements = [];
        }
        else if (value instanceof Element) {
            this._elements = [value];
        }
        else {
            this._elements = value;
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
     * Shows if the resolver has elements. The resolver will have elements if it has been resolved, elements are not null
     * and have length greater than 0.
     * @returns {boolean} 
     */
    hasElements() {
        return this.hasResolved && (this.elements != null || this.elements.length > 0);
    }
}

/**
 * This class is used to find a specific child element, given a selector and the parent element.
 */
export class ChildSelectorResolver extends SelectorResolver {
    /**
     * ChildSelectorResolver constructor
     * @param {string} selector Selector ID
     * @param {HTMLElement} element Current element
     */
    constructor(selector, element) {
        super(selector);
        this.element = element;
    }

    /**
     * Resolves child selector
     * @param {string} selector Selector ID
     * @param {*} element Current element
     * @returns {ChildSelectorResolver} Resolved selector
     */
    static resolve(selector, element) {
        let selectorResolver = new ChildSelectorResolver(selector, element);
        selectorResolver.resolve();
        return selectorResolver;
    }

    /**
     * Resolves child selector. If no child elements are found, then elements are resolved based on document and not on current element.
     * @param {*} selector Selector ID
     * @param {*} element Current element
     * @returns {ChildSelectorResolver} Resolved selector
     */
    static resolveAll(selector, element) {
        let selectorResolver = new ChildSelectorResolver(selector, element);
        selectorResolver.resolveAll();
        return selectorResolver;
    }

    /**
     * Finds elements from current element with the specific resolved selector type.
     * @returns 
     */
    resolve() {
        switch (this.selectorType) {
            case SelectorResolver.SelectorType.ElementID: return;
            case SelectorResolver.SelectorType.ClassName:
                this.elements = this.element.getElementsByClassName(this.processedSelector);
                this.hasMultipleElements = true;
                break;
            case SelectorResolver.SelectorType.QuerySelector:
                this.elements = this.element.querySelector(this.processedSelector);
                break;
            case SelectorResolver.SelectorType.QuerySelectorAll:
                this.elements = this.element.querySelectorAll(this.processedSelector);
                this.hasMultipleElements = true;
                break;
        }

        this.hasResolved = true;
    }

    /**
     * Finds elements from document with the specific resolved selector type. If no elements were found, it will get
     * elements from document.
     */
    resolveAll() {
        this.resolve();
        if (!this.hasElements()) super.resolve();
    }
}

/**
 * This class is used to find a specific parent element, given a selector and the child element.
 */
export class ParentSelectorResolver extends SelectorResolver {
    /**
     * ParentSelectorResolver constructor
     * @param {string} selector Selector ID
     * @param {HTMLElement} element Current element
     */
    constructor(selector, element) {
        super(selector);
        this.currentElement = element;
        this.parentElement = element;
    }

    /**
     * Resolves parent selector
     * @param {string} selector 
     * @param {HTMLElement} element 
     * @returns {ParentSelectorResolver}
     */
    static resolve(selector, element) {
        let selectorResolver = new ParentSelectorResolver(selector, element);
        selectorResolver.resolve();
        return selectorResolver;
    }

    /**
     * Finds element that matches selector.
     */
    resolve() {
        let isParentElementFound = false;

        switch (this.selectorType) {
            case SelectorResolver.SelectorType.ElementID:
                if (this.parentElement.id == this.processedSelector) isParentElementFound = true;
                break;
            case SelectorResolver.SelectorType.ClassName:
                if (this.parentElement.className == this.processedSelector) isParentElementFound = true;
                break;
            case SelectorResolver.SelectorType.QuerySelector:
                if (this.parentElement.parentNode.querySelector(this.processedSelector) != null) isParentElementFound = true;
                break;
        }

        if (!isParentElementFound) {
            this.parentElement = this.parentElement.parentNode;
            this.resolve();
        }
        else {
            this.elements = this.parentElement;
            this.hasResolved = true;
        }
    }
}