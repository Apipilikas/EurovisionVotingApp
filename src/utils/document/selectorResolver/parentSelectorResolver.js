import { SelectorResolver } from "./selectorResolver.js";

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