import { joinProps } from "../../../utils/react/propsUtils";
import { BaseInput } from "../baseInput/BaseInput";
import { InputErrorContainer } from "../containers/inputErrorContainer/InputErrorContainer";
import { InputHelpContainer } from "../containers/inputHelpContainer/InputHelpContainer";
import './NumberInputStyles.css';

export function NumberInput({caption, value, onChange, ...props}) {
    return (
        <div {...props} className={joinProps("number-input-container", props?.className)}>
            <BaseInput inputType="number" caption={caption} value={value} onChange={onChange}/>
            <InputHelpContainer/>
            <InputErrorContainer/>
        </div>
    )
}