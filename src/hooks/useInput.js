import { useEffect, useState } from "react";
import { getValueOrEmpty } from "../utils/react/propsUtils";

const Checkbox_INPUT = "checkbox";

/**
 * Returns a stateful value and an event when value is changed.
 * @param {*} defaultValue 
 * @returns 
 */
export function useInput(defaultValue, onValueChanged = null, observeDefaultValueChanges = false) {

    const [value, setValue] = useState(defaultValue);

    useEffect(() => {
        if (observeDefaultValueChanges) {
            setValue(getValueOrEmpty(defaultValue));
        }
    }, [defaultValue])

    function resolveInputValue(e) {
        let input = e.target;

        switch(input.type) {
            case Checkbox_INPUT:
                return input.checked;
            default:
                return input.value;
        }
    }

    function onChange(e) {
        let newValue = resolveInputValue(e);
        setValue(newValue);

        if (onValueChanged) {
            onValueChanged(newValue);
        }
    }

    return {
        value,
        onChange
    };
}