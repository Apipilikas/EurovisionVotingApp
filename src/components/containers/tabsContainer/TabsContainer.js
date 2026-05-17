import { Children, cloneElement, useId, useRef, useState } from "react";
import './TabsContainerStyles.css';
import { joinProps } from "../../../utils/react/propsUtils";

export function TabsContainer({children, className, initialSelectedTabIndex}) {

    const name = `tabs-header-${useId()}`;
    const [selectedIndex, setSelectedIndex] = useState(initialSelectedTabIndex ?? 0);

    // Listeners
    const handleOnChange = (tabIndex) => {
        setSelectedIndex(tabIndex);
    }

    // Rendering
    const tabsHeader = Children.map(children, (child, index) => {

        const {caption, tabIndex} = child.props;
        const id = `tab-header-${index}`;

        return (
            <div className="tab-header">
                <input type="radio" id={id} name={name} onChange={() => handleOnChange(tabIndex)} defaultChecked={tabIndex == initialSelectedTabIndex}/>
                <label htmlFor={id}>{caption}</label>
            </div>
        );
    });

    const elements = Children.map(children, (child, index) => {
        const {tabIndex} = child.props;

        return cloneElement(child, {
            style : {display : tabIndex == selectedIndex ? "initial" : "none"}
        })
    })

    return (
        <div className={joinProps("tabs-container", className)}>
            <div className="tabs-header">
                    {tabsHeader}
            </div>
            <div className="tabs-content">
                {elements}
            </div>
        </div>
    );
}

export function TabContainer({caption, tabIndex, children, ...props}) {
    return (
        <div className="tab-container" tabIndex={tabIndex} {...props}>
            {children}
        </div>
    );
}