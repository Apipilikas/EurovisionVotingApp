import { useEffect, useState } from "react";
import { BaseInput } from "../baseInput/BaseInput";
import './ColorInputStyles.css';
import { InputHelpContainer } from "../containers/inputHelpContainer/InputHelpContainer";
import { joinProps } from "../../../utils/react/propsUtils";

export function ColorInput({caption, value, onChange, ...props}) {

    const isColorValid = (value) => {
        return /^#([0-9A-Fa-f]{6})$/.test(value);
    }

    return (
        <div {...props} className={joinProps("color-input-container", props?.className)}>
            <BaseInput caption={caption} value={value} onChange={onChange}/>
            <input type="color" value={value} onChange={onChange}/>
            <InputHelpContainer/>
        </div>
    )
}