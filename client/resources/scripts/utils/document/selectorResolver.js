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
        this.elements = null;
        this.hasMultipleElements = false;
        this.hasResolved = false;
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
            default:
                return false;
        }

        this.hasResolved = true;

        return true;
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
        return this.hasResolved && (this.elements != null || this.elements > 0);
    }
}