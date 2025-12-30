import { useEffect, useRef, useState } from "react";
import { useInput } from "./useInput";

export function useInputValidation(defaultValue, 
                                  onValueChanged = null, 
                                  observeDefaultValueChanges = false, 
                                  onValueChanging = null,  
                                  validate = null,
                                  suppressValidationOnValueChange = false) {
    
    const [error, setError] = useState(null);
    const input = useInput(defaultValue, onValueChanged, observeDefaultValueChanges, onValueChanging);

    const isFirstRender = useRef(true);
    
    useEffect(() => {
        if (isFirstRender.current) {
            isFirstRender.current = false;
            return;
        }
        
        setError(null);

        if (!suppressValidationOnValueChange) validateValue();
    }, [input.value])

    const validateValue = () => {
        if (validate) {
            let message = validate(input.value);
            setError(message);
            return message == null;
        }

        return true;
    }

    return {
        ...input,
        error,
        hasError : error != null,
        validateValue,
        setError
    };
}