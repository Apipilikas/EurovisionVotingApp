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
    }, [defaultValue]);

    useEffect(() => {
        if (onValueChanged) {
            onValueChanged(value);
        }
    }, [value]);

    const resolveInputValue = (e) => {
        let input = e?.target;

        if (input == null) return e;

        switch(input.type) {
            case Checkbox_INPUT:
                return input.checked;
            default:
                return input.value;
        }
    }

    const onChange = (e) => {
        let newValue = resolveInputValue(e);
        setValue(newValue);
    }

    return {
        value,
        onChange
    };
}