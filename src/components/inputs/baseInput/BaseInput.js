import { useId } from 'react';
import './BaseInputStyles.css';
import { useInput } from '../../../hooks/useInput';

export function BaseInput({caption, inputType = "text", ...inputProps}) {
    
    const id = `bi-${useId()}`;
    const input = useInput(); // This will be used as a fallback if inputProps do not provide value and onChange props.
    const { value = input.value, onChange = input.onChange, ...restProps } = inputProps;
    
    return (
        <div className="base-input">
            <input type={inputType} 
                id={id}
                name={id}
                className={value ? "has-value" : ""}
                value={value}
                onChange={onChange}
                {...restProps}/>
            <label for={id}>{caption}</label>
        </div>
    )
}