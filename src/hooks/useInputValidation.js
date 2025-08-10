import { useEffect, useState } from "react";
import { useInput } from "./useInput";

export function useInputValidation(defaultValue, 
                                  onValueChanged = null, 
                                  observeDefaultValueChanges = false, 
                                  onValueChanging = null,  
                                  validate = null,
                                  suppressValidation = false) {
    
    const [error, setError] = useState(null);
    const input = useInput(defaultValue, onValueChanged, observeDefaultValueChanges, onValueChanging);

    useEffect(() => {
        if (input.value) {
            validateValue();
        }
    }, [input.value])

    const validateValue = () => {
        if (suppressValidation) return;
        if (validate) {
            let message = validate(input.value);
            setError(message);
        }
    }

    return {
        ...input,
        error,
        validateValue
    };
}