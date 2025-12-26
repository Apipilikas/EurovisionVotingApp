import { Children, useEffect, useRef, useState } from "react"
import './BaseSelectorStyles.css';
import { animated, useSpring } from "react-spring";
import { BaseInput } from "../../baseInput/BaseInput";
import { useInput } from "../../../../hooks/useInput";
import { useClickOutside } from "../../../../hooks/useClickOutside";
import { joinProps } from "../../../../utils/react/propsUtils";
import { useBoundData } from "../../../../hooks/useBoundData";
import { cloneNestedElements } from "../../../../utils/react/elementUtils";

export function BaseSelector({caption, data, initialValue, valueProperty, displayProperty, onValueChanged, children, ...props}) {

    const {value : inputValue, onChange, required, className, ...restProps} = props;

    // Initialization
    const [showDropdown, setShowDropdown] = useState(false);
    const [showClearIcon, setShowClearIcon] = useState(false);
    const {value, displayValue, setSelectedData} = useBoundData(data, valueProperty, displayProperty, initialValue ?? inputValue, onChange);
    const input = useInput(displayValue, onValueChanged, true);
    const ref = useRef(null);

    // Effects
    useEffect(() => {
        if (onChange) onChange(value);
    }, [value]);

    useEffect(() => {
        setShowClearIcon(input.value);
    }, [input.value]);

    useClickOutside(ref, () => setShowDropdown(false));

    // Styles
    const dropdownIconStyles = useSpring({
        right : showClearIcon ? "2em" : "1em",
        transform: showDropdown ? 'rotate(180deg)' : 'rotate(0deg)',
        config: { tension: 170, friction: 26 },
    });

    const clearIconStyles = useSpring({
        opacity: showClearIcon ? 1 : 0,
        right: showClearIcon ? '1em' : '0em',
        config: { tension: 170, friction: 26 },
    });

    const dropdownStyles = useSpring({
        opacity: showDropdown ? 1 : 0,
        transform: showDropdown ? `translateY(0px)` : `translateY(-10px)`,
        pointerEvents: showDropdown ? 'auto' : 'none',
        config: { tension: 250, friction: 20 },
    });

    // Listeners
    const handleOnClick = (data) => {
        setSelectedData(data);
    }

    const handleOnClearClick = () => {
        setSelectedData(null);
    };

    // Rendering
    const modifier = (element) => {
        const isSelectorOption = element.type.name === "SelectorOption";

        return {...(isSelectorOption && {
            onClick: () => handleOnClick(element.props.data)
            })};
    }

    const elements = Children.map(children, child => cloneNestedElements(child, modifier));

    return (
        <div className={joinProps("selector-container", className)}>
            <BaseInput
            caption={caption}
            onClick={() => setShowDropdown(value => !value)}
            // onFocus={() => setShowDropdown(true)} 
            autoComplete={"off"}
            readOnly={true}
            required={required}
            error = {props.error}
            {...input}
            {...restProps}
            />
            <animated.i class="material-icons dropdown-icon" style={dropdownIconStyles}>keyboard_arrow_down</animated.i>
            <animated.i class="material-icons clear-icon" style={clearIconStyles} onClick={handleOnClearClick}>clear_all</animated.i>
            <animated.div className="selector-options" style={dropdownStyles} ref={ref}>
                {elements}
            </animated.div>
        </div>
    )
}