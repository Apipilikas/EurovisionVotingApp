import { joinProps } from "../../../utils/react/propsUtils";
import { BaseInput } from "../baseInput/BaseInput";
import { animated, useSpring } from "react-spring";
import { InputErrorContainer } from "../containers/inputErrorContainer/InputErrorContainer";
import { InputHelpContainer } from "../containers/inputHelpContainer/InputHelpContainer";
import './NumberInputStyles.css';
import { useState } from "react";

export function NumberInput({caption, value, onChange, ...props}) {

    const [focused, setFocused] = useState(false);

    // Events
    const handleOnSpinUpClick = () => {
        if (onChange) onChange(parseInt(value + 1));
    }

    const handleOnSpinDownClick = () => {
        if (onChange) onChange(parseInt(value - 1));
    }

    // Styles
    const spinDownIconStyles = useSpring({
        opacity: focused ? 1 : 0,
        config: { tension: 250, friction: 20 },
    });

    return (
        <div {...props} className={joinProps("number-input-container", props?.className)}
                        onMouseOver={() => setFocused(true)} 
                        onMouseOut={() => setFocused(false)}>
            <BaseInput inputType="number" caption={caption} value={value} 
                       onChange={onChange}/>
            <animated.i class="material-icons spin-up-icon" style={spinDownIconStyles} 
                        onClick={handleOnSpinUpClick}>keyboard_arrow_up</animated.i>
            <animated.i class="material-icons spin-down-icon" style={spinDownIconStyles} 
                        onClick={handleOnSpinDownClick}>keyboard_arrow_down</animated.i>
            <InputHelpContainer/>
            <InputErrorContainer/>
        </div>
    )
}