import { Children, cloneElement } from "react";

export function cloneNestedElements(element, modifierFn) {
    const {children} = element.props;

    const props = modifierFn(element);

    if (children) props.children = Children.map(children, child => cloneNestedElements(child, modifierFn));

    return cloneElement(element, props);
}