import { BaseInput } from "../baseInput/BaseInput";
import './ColorInputStyles.css';
import { InputHelpContainer } from "../containers/inputHelpContainer/InputHelpContainer";
import { joinProps } from "../../../utils/react/propsUtils";
import { useInputValidation } from "../../../hooks/useInputValidation";
import { useFallbackHookProps } from "../../../hooks/useFallbackHookProps";

export function ColorInput({caption, value, onChange, error, ...props}) {

    // Functions
    const validate = (value) => {
        if (!isColorValid(value)) return "Color input is not valid!";
        return null;
    } 

    const isColorValid = (value) => /^#([0-9A-Fa-f]{6})$/.test(value);
    
    // Hooks
    const input = useFallbackHookProps(useInputValidation, 
                                      {
                                        defaultValue : value, 
                                        observeDefaultValueChanges : true, 
                                        validate : props.validate ?? validate}, 
                                      {value, onChange});
    
    return (
        <div {...props} className={joinProps("color-input-container", props?.className)}>
            <BaseInput caption={caption} value={input.value} onChange={input.onChange} error={input.error}/>
            <input type="color" value={input.value} onChange={input.onChange}/>
            <InputHelpContainer/>
        </div>
    )
}