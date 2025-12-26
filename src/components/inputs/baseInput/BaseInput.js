import { useId } from 'react';
import './BaseInputStyles.css';
import { useFallbackHookProps } from '../../../hooks/useFallbackHookProps';
import { joinProps } from '../../../utils/react/propsUtils';
import { InputErrorContainer } from '../containers/inputErrorContainer/InputErrorContainer';
import { useInputValidation } from '../../../hooks/useInputValidation';
import { useFormRegistration } from '../../../hooks/useFormRegistration';

export function BaseInput({caption, inputType = "text", helpCaption = null, required = false, ...inputProps}) {
    
    const id = `bi-${useId()}`;
    const hookProps = useFallbackHookProps(useInputValidation, undefined, inputProps);

    useFormRegistration(hookProps);

    return (
        <div className="base-input">
            <input type={inputType} 
                id={id}
                name={id}
                className={joinProps(hookProps.value ? "has-value" : "", hookProps.error ? "has-error" : "", inputProps.className)}
                required={required}
                {...hookProps}/>
            <label for={id}>{caption}{required ? <i className="material-icons input-required-icon">emergency</i> : ""}</label>
            <InputErrorContainer caption={hookProps.error}/>
        </div>
    )
}