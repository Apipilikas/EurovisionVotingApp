export class SelectorResolver {
    static SelectorType = {
        ElementID : "ElementID",
        ClassName : "ClassName",
        QuerySelector : "QuerySelector",
        QuerySelectorAll : "QuerySelectorAll"
    }

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

    static resolve(selector) {
        let selectorResolver = new SelectorResolver(selector);
        selectorResolver.resolve();
        return selectorResolver;
    }

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
    
    getProcessedSelector() {
        switch (this.selectorType) {
            case SelectorResolver.SelectorType.ElementID: return this.selector.replace("#", "");
            case SelectorResolver.SelectorType.ClassName: return this.selector.replace(".", "");
            case SelectorResolver.SelectorType.QuerySelectorAll: return this.selector.replace(" ALL", "");
        }
    
        return this.selector;
    }

    hasElements() {
        return this.hasResolved && (this.elements != null || this.elements.length > 0);
    }
}

export class ElementSelectorResolver extends SelectorResolver {
    constructor(selector, element) {
        super(selector);
        this.element = element;
    }

    static resolve(selector, element) {
        let selectorResolver = new ElementSelectorResolver(selector, element);
        selectorResolver.resolve();
        return selectorResolver;
    }

    static resolveAll(selector, element) {
        let selectorResolver = new ElementSelectorResolver(selector, element);
        selectorResolver.resolveAll();
        return selectorResolver;
    }

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

    resolveAll() {
        this.resolve();
        if (!this.hasElements()) super.resolve();
    }
}

export class ParentElementSelectorResolver extends SelectorResolver {
    constructor(selector, currentElement) {
        super(selector);
        this.currentElement = currentElement;
        this.parentElement = currentElement;
    }

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
            this.hasResolved = true;
        }
    }
}