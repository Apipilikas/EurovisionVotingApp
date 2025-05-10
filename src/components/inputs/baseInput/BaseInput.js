import { useId } from 'react';
import './BaseInputStyles.css';

export function BaseInput({caption, inputType = "text", ...inputProps}) {
    
    const id = `bi-${useId()}`;
    
    return (
        <div className="base-input">
            <input type={inputType} 
                id={id}
                name={id}
                {...inputProps}
                required/>
            <label for={id}>{caption}</label>
        </div>
    )
}