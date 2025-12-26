import { useContext, useEffect } from "react";
import { FormContext } from "../components/containers/formContainer/FormContainer";

export function useFormRegistration(input) {
    const context = useContext(FormContext);

    useEffect(() => {
        if (!context || !input) return;

        const unregister = context.registerInput(input);

        return unregister;
    }, [context]);
}