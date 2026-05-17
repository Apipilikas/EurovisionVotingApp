import { useEffect, useState } from "react";

/**
 * Provides a way to inform when the data is initialized.
 * @param {*} data 
 * @param {*} defaultValue 
 * @example
 * List: data is initialized WHEN data is array AND length of data is > 0.
 * Object: data is initialized WHEN data is different from the initial value.
 * @returns 
 */
export function useIsInitialized(data, defaultValue = null) {

    const [isInitialized, setIsInitialized] = useState(false);

    // Functions
    const isInitializedArray = () => Array.isArray(data) && data.length > 0;
    const isValueChanged = () => defaultValue != null && defaultValue != data;

    // Effects
    useEffect(() => {
        if (data != null && (isInitializedArray() || isValueChanged()) && !isInitialized) {
            setIsInitialized(true);
        }
    }, [data])

    return {
        isInitialized
    }
}