import { Children, cloneElement, useEffect, useId, useRef, useState } from "react"
import './BaseSelectorStyles.css';
import { useTransition, animated, useSpring, a } from "react-spring";
import { BaseInput } from "../../baseInput/BaseInput";
import { useInput } from "../../../../hooks/useInput";
import { useClickOutside } from "../../../../hooks/useClickOutside";

export function BaseSelector({caption, data, initialValue, valueProperty, displayProperty, onValueChanged, children, ...props}) {

    const {value : inputValue, onChange, ...restProps} = props;

    // Functions
    const resolveCurrentDataByInitialValue = () => {
        let val = initialValue ?? inputValue;

        if (!valueProperty)
            return val;
        else {
            return data?.find(item => item[valueProperty] == val);
        }
    };

    // Initialization
    const [showDropdown, setShowDropdown] = useState(false);
    const [showClearIcon, setShowClearIcon] = useState(false);
    const [currentData, setCurrentData] = useState(resolveCurrentDataByInitialValue());
    const [value, setValue] = useState(null);
    const [displayValue, setDisplayValue] = useState(null);
    const input = useInput(displayValue, onValueChanged, true);
    const ref = useRef(null);

    // Effects
    useEffect(() => {
        if (onChange) onChange(value);
    }, [value]);

    useEffect(() => {
        if (currentData) {
            if (!valueProperty)
                setValue(currentData);
            else
                setValue(currentData[valueProperty]);

            if (!displayProperty)
                setDisplayValue(currentData);
            else
                setDisplayValue(currentData[displayProperty]);
        }
        else {
            setValue(null);
            setDisplayValue(null);
        }
    }, [currentData]);

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
        setCurrentData(data);
    }

    const handleOnClearClick = () => {
        setCurrentData(null);
    };

    // Rendering
    const cloneElements = (element) => {

        const { data, children } = element.props;

        const isSelectorOption = element.type.name == "SelectorOption";

        const props = {
            ...(isSelectorOption && {
            onClick: () => handleOnClick(data)
            }),
            ...(children && {
            children: Children.map(children, child => cloneElements(child))
            })
        };

        return cloneElement(element, props);
    };

    const elements = Children.map(children, (child, index) => {
        return cloneElements(child);
    });

    return (
        <div className="selector-container" {...restProps}>
            <BaseInput
            caption={caption}
            onFocus={() => setShowDropdown(true)} 
            autoComplete={"off"}
            readOnly={true}
            {...input}
            />
            <animated.i class="material-icons dropdown-icon" style={dropdownIconStyles}>keyboard_arrow_down</animated.i>
            <animated.i class="material-icons clear-icon" style={clearIconStyles} onClick={handleOnClearClick}>clear_all</animated.i>
            <animated.div className="selector-options" style={dropdownStyles} ref={ref}>
                {elements}
            </animated.div>
        </div>
    )
}