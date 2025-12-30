import { useEffect, useState } from "react";
import { useIsInitialized } from "./useIsInitialized";
import { ReactListUtils } from "../utils/react/listUtils";

const BoundDataType = {
    NOTSUPPORTED : "NotSupported",
    OBJECT : "Object",
    ARRAY : "Array"
}

export const BoundItemState = {
    UNMODIFIED : "Unmodified",
    MODIFIED : "Modified",
    NEW : "New"
}

/**
 * Provides a way to bound data.
 * @param {*} data 
 * @param {string} valueProperty 
 * @param {string} displayProperty 
 * @param {*} initialValue 
 * @param {Function} onChange 
 * @returns 
 */
export function useBoundData(data, valueProperty, displayProperty, initialValue, onChange) {

    const [boundData, setBoundData] = useState(null);
    const [selectedItem, setSelectedItem] = useState(null);
    const [value, setValue] = useState(null);
    const [displayValue, setDisplayValue] = useState(null);
    const {isInitialized} = useIsInitialized(data);

    let useId = false;
    let type = BoundDataType.NOTSUPPORTED;

    // Effects
    useEffect(() => {
        if (isInitialized) {
            resolveBoundDataType();
            handleBoundData();
        }
    }, [isInitialized]);

    useEffect(() => {
        setSelectedItem(resolveSelectedDataByInitialValue(initialValue));
    }, [initialValue, isInitialized]);

    useEffect(() => {
        if (selectedItem) {
            if (!valueProperty)
                setValue(selectedItem);
            else
                setValue(selectedItem[valueProperty]);

            if (!displayProperty)
                setDisplayValue(selectedItem);
            else
                setDisplayValue(selectedItem[displayProperty]);
        }
        else {
            setValue(null);
            setDisplayValue(null);
        }
    }, [selectedItem]);

    // Functions
    const resolveSelectedDataByInitialValue = () => {
        if (!valueProperty)
            return initialValue;
        else {
            return data?.find(item => item[valueProperty] == initialValue);
        }
    };

    const resolveBoundDataType = () => {
        if (isDataArrayOfObjects())
            type = BoundDataType.ARRAY;
        else
            type = BoundDataType.OBJECT;
    }

    const resolveItemState = (item) => {
        const existsInDatabase = data.some(
            original => original[valueProperty] == item[valueProperty]
        );

        return existsInDatabase ? BoundItemState.MODIFIED : BoundItemState.NEW;
    };

    const addItem = (item) => {
        ReactListUtils.pushItem(item, setBoundData);
        return item;
    }

    const updateItem = (originalItem, updatedItem) => {
        if (!originalItem) return;

        updatedItem.__State__ = resolveItemState(updatedItem);
        ReactListUtils.updateChangedProperties(valueProperty, originalItem, updatedItem, setBoundData);
    }

    const removeItem = (item) => {
        ReactListUtils.removeSpecificItem(item, setBoundData);
    }
    
    const isDataArrayOfObjects = () => Array.isArray(data) && data.every(item => typeof item === 'object' && item !== null);

    const prepareBoundData = (data) => {
        return data.map((item, index) => ({...item, __State__ : BoundItemState.UNMODIFIED}));
    }

    const handleBoundData = () => {
        if (valueProperty) {
            setBoundData(prepareBoundData(data));
        }
        else {
            setBoundData(data.map((item, index) => ({...item, __id__ : index})));
            useId = true;
        }
    }

    return {
        boundData,
        value,
        displayValue,
        initialized : isInitialized,
        selectedItem,
        setSelectedItem,
        addItem,
        updateItem,
        removeItem
    }
}