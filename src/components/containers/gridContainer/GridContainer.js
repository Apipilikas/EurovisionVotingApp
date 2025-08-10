import { Children, cloneElement } from "react";
import { joinProps } from "../../../utils/react/propsUtils";
import './GridContainerStyles.css';

export function GridTemplateContainer({className, children, templateRows, templateColumns, templateAreas, ...props}) {

    const templates = templateAreas.map(row => `"${row.join(" ")}"`).join("\n");

    const gridStyles = {
        gridTemplateRows : templateRows,
        gridTemplateColumns : templateColumns,
        gridTemplateAreas : templates
    };

    // Rendering
    const elements = Children.map(children, (child, index) => {
        const {gridTemplateArea, style, ...restProps} = child.props;
        return cloneElement(child, {
            ...restProps,
            style : {
                gridArea : gridTemplateArea,
                ...(style || {})
            }
        })
    })

    return (
        <div className={joinProps("grid-template-container", className)} style={gridStyles} {...props}>
            {elements}
        </div>
    );
}