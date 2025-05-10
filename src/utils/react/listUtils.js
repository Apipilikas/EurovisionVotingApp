// React list handler

var ReactListUtils = {};

ReactListUtils.pushItem = function(item, setterFn) {
    setterFn((list) => [...list, item]);
}

ReactListUtils.replaceItem = function(list, previousItem, currentItem, callbackFn) {

}

ReactListUtils.removeSpecificItem = function(list, item, callbackFn) {

}

ReactListUtils.shiftItem = function(list, callbackFn) {
    let removedItem = list[list.length - 1];
    callbackFn(list.slice(0, list.length - 1))
    return removedItem;
}

ReactListUtils.updateProperties = function(propertyID, updatedItem, setterFn, ...properties) {
    setterFn((list) => list.map((item) => {
        if (item[propertyID] == updatedItem[propertyID]) {
            properties.forEach(property => item[property] = updatedItem[property]);
        }

        return item;
    }))
}

ReactListUtils.updateChangedProperties = function(propertyID, updatedItem, setterFn) {
    setterFn((list) => list.map((item) => {
        const properties = Object.keys(item);

        if (item[propertyID] == updatedItem[propertyID]) {
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