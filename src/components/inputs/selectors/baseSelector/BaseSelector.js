import { Children, useEffect, useRef, useState } from "react"
import { createPortal } from "react-dom"; // <-- Added import
import './BaseSelectorStyles.css';
import { animated, useSpring } from "react-spring";
import { BaseInput } from "../../baseInput/BaseInput";
import { useInput } from "../../../../hooks/useInput";
import { useClickOutside } from "../../../../hooks/useClickOutside";
import { joinProps } from "../../../../utils/react/propsUtils";
import { useBoundData } from "../../../../hooks/useBoundData";
import { cloneNestedElements } from "../../../../utils/react/elementUtils";

export function BaseSelector({caption, 
                        data, 
                        initialValue, 
                        valueProperty, 
                        displayProperty, 
                        onValueChanged, 
                        children, 
                        value : inputValue, 
                        onChange, 
                        required, 
                        className,
                        style,
                        ...props}) {


    // Initialization
    const [showDropdown, setShowDropdown] = useState(false);
    const [showClearIcon, setShowClearIcon] = useState(false);
    const [dropdownProps, setDropdownProps] = useState({ top: 0, left: 0, width: 0 });
    
    const {value, displayValue, setSelectedItem} = useBoundData(data, valueProperty, displayProperty, initialValue ?? inputValue, onChange);
    const input = useInput(displayValue, onValueChanged, true);
    
    const containerRef = useRef(null);
    const dropdownRef = useRef(null);

    // Effects
    useEffect(() => {
        if (onChange) onChange(value);
    }, [value]);

    useEffect(() => {
        setShowClearIcon(input.value);
    }, [input.value]);

    useEffect(() => {
        if (showDropdown && containerRef.current) {
            const rect = containerRef.current.getBoundingClientRect();
            setDropdownProps({
                top: rect.bottom + window.scrollY,
                left: rect.left + window.scrollX,
                width: rect.width
            });
        }
    }, [showDropdown]);

    useClickOutside(containerRef, (e) => {
        if (dropdownRef.current && dropdownRef.current.contains(e.target)) {
            return;
        }
        setShowDropdown(false);
    });

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
        setSelectedItem(data);
        setShowDropdown(false);
    }

    const handleOnClearClick = () => {
        setSelectedItem(null);
    };

    // Rendering
    const modifier = (element) => {
        const isSelectorOption = element.props.className && element.props.className.split(/\s+/).includes("selector-option");

        return {...(isSelectorOption && {
            onClick: () => handleOnClick(element.props.data)
            })};
    }

    const elements = Children.map(children, child => cloneNestedElements(child, modifier));

    const selectorOptions = showDropdown ? createPortal(
        <animated.div 
            className="selector-options" 
            style={{
                ...dropdownStyles,
                position: 'absolute',
                top: `${dropdownProps.top}px`,
                left: `${dropdownProps.left}px`,
                width: `${dropdownProps.width}px`,
                zIndex: 9999
            }} 
            ref={dropdownRef}
        >
            {elements}
        </animated.div>,
        document.body
    ) : null;

    return (
        <div className={joinProps("selector-container", className)} style={style} ref={containerRef}>
            <BaseInput
            caption={caption}
            onClick={() => setShowDropdown(value => !value)}
            // onFocus={() => setShowDropdown(true)} 
            autoComplete={"off"}
            readOnly={true}
            required={required}
            {...input}
            {...props}/>
            <animated.i className="material-icons dropdown-icon" style={dropdownIconStyles}>keyboard_arrow_down</animated.i>
            <animated.i className="material-icons clear-icon" style={clearIconStyles} onClick={handleOnClearClick}>clear_all</animated.i>            
            {selectorOptions}
        </div>
    )
}