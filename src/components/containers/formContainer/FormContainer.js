import { createContext, forwardRef, useImperativeHandle, useRef } from "react";

export const FormContext = createContext();

export const FormContainer = forwardRef(({children, onSubmit, ...props}, ref) => {

    const inputs = useRef([]);

    // Handlers
    const handleOnSubmit = (e) => {
        e.preventDefault();
        if (onSubmit) onSubmit(e);
    }; 

    // Functions
    const isEmpty = (value) => value == null || value == "";

    const registerInput = (input) => {
        inputs.current.push(input);
        return () => inputs.current = inputs.current.filter(i => i !== input);
    };

    const validate = () => {
        for (let input of inputs.current) {
            if (!input.validateValue()) return false;
            if (input.required && isEmpty(input.value)) {
                input.setError("This field is mandatory!");
                return false;
            }
        }

        return true;
    };

    useImperativeHandle(ref, () => ({
        validate,
    }));

    return (
        <FormContext.Provider value={{ registerInput }}>
            <form ref={ref} onSubmit={handleOnSubmit} {...props}>
                {children}
            </form>
        </FormContext.Provider>
    );
});