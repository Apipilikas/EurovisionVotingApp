// React list handler

var ReactListUtils = {};

ReactListUtils.pushItem = function(item, setterFn) {
    setterFn((list) => [...list, item]);
}

ReactListUtils.replaceItem = function(list, previousItem, currentItem, callbackFn) {

}

ReactListUtils.removeSpecificItem = function(item, setterFn) {
    setterFn(list => list.filter(it => it !== item));
}

ReactListUtils.shiftItem = function(list, callbackFn) {
    let removedItem = list[list.length - 1];
    callbackFn(list.slice(0, list.length - 1))
    return removedItem;
}

ReactListUtils.updateProperties = function(valueProperty, updatedItem, setterFn, ...properties) {
    setterFn((list) => list.map((item) => {
        if (item[valueProperty] == updatedItem[valueProperty]) {
            properties.forEach(property => item[property] = updatedItem[property]);
        }

        return item;
    }))
}

ReactListUtils.updateChangedProperties = function(valueProperty, originalItem, updatedItem, setterFn) {
    setterFn((list) => list?.map((item) => {
        const properties = Object.keys(item);

        if (item[valueProperty] == originalItem[valueProperty]) {
            properties.forEach(property => {
                if (item[property] != updatedItem[property]) {
                    item[property] = updatedItem[property];
                }
            });
        }

        return item;
    }))  
}

export {ReactListUtils};