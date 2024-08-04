import { SelectorResolver } from "./selectorResolver.js";

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