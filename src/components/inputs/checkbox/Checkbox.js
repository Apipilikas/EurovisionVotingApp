import { joinProps } from '../../../utils/react/propsUtils';
import { animated, useSpring } from "react-spring";
import { InputHelpContainer } from '../containers/inputHelpContainer/InputHelpContainer';
import './CheckboxStyles.css';
import { useInput } from '../../../hooks/useInput';

export function Checkbox({caption, value, onChange, ...props}) {

    const input = useInput(value, null, true);

    const checkboxStyles = useSpring({
        color: input.value ? '#fff' : 'black',
        background: input.value ? 'var(--third-color)' : 'transparent',
        transform: input.value ? 'scale(1)' : 'scale(0.9)',
        config: { tension: 250, friction: 20 },
    });

    return (
        <div {...props} className={joinProps("checkbox-input-container", props?.className)}>
            <label htmlFor="chbx">{caption}</label>
            <animated.input className="checkbox" type="checkbox" id="chbx" style={checkboxStyles} checked={value} onChange={onChange}/>
            <InputHelpContainer/>
        </div>
    )
}