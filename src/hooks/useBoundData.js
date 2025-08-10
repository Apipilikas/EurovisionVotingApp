import { useEffect, useState } from "react";
import { useIsInitialized } from "./useIsInitialized";
import { ReactListUtils } from "../utils/react/listUtils";

const BoundDataType = {
    NOTSUPPORTED : "NotSupported",
    OBJECT : "Object",
    ARRAY : "Array"
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
    const [selectedData, setSelectedData] = useState(null);
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
        setSelectedData(resolveSelectedDataByInitialValue(initialValue));
    }, [initialValue, isInitialized]);

    useEffect(() => {
        if (selectedData) {
            if (!valueProperty)
                setValue(selectedData);
            else
                setValue(selectedData[valueProperty]);

            if (!displayProperty)
                setDisplayValue(selectedData);
            else
                setDisplayValue(selectedData[displayProperty]);
        }
        else {
            setValue(null);
            setDisplayValue(null);
        }
    }, [selectedData]);

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

    const addData = (data) => {
        ReactListUtils.pushItem(data, setBoundData);
        // switch (type) {
        //     case BoundDataType.ARRAY:
        //         break;
        // }
    }

    const updateData = (data) => {
        ReactListUtils.updateChangedProperties(valueProperty, data, setBoundData);
    }

    const removeData = (data) => {
        ReactListUtils.removeSpecificItem(data, setBoundData);
        setSelectedData(null);
        // switch (type) {
        //     case BoundDataType.ARRAY:
        //         break;
        // }
    }
    
    const isDataArrayOfObjects = () => Array.isArray(data) && data.every(item => typeof item === 'object' && item !== null);

    const handleBoundData = () => {
        if (valueProperty) {
            setBoundData(data);
        }
        else {
            setBoundData(data.map((item, index) => ({...item, _id_ : index})));
            useId = true;
        }
    }

    return {
        boundData,
        value,
        displayValue,
        initialized : isInitialized,
        selectedData,
        setSelectedData,
        addData,
        updateData,
        removeData
    }
}