import { Children, cloneElement, createContext, forwardRef, useContext, useEffect, useImperativeHandle, useRef, useState } from 'react';
import { joinProps } from '../../../utils/react/propsUtils';
import './TableContainerStyles.css'
import { animated } from "react-spring";
import SimpleButton from '../../inputs/buttons/simpleButton/SimpleButton';


export function TableContainer({children, ...props}) {
    return (
        <div {...props} className={joinProps("table-container", props.className)}>
            {children}
        </div>
    )
}

export function TableHeader({children, ...props}) {
    return (
        <div {...props} className={joinProps("table-header", props.className)}>
            {children}
        </div>
    )
}

export function TableBody({children, ...props}) {
    return (
        <div {...props} className={joinProps("table-body", props.className)}>
            {children}
        </div>
    )
}

export function SortTableRow({children, onSortButtonClicked, ...props}) {

    const cellRefs = useRef({});

    const handleCellSortValueChanged = (cellID, value) => {
        Object.entries(cellRefs.current).forEach((value) => {
            if (cellID != value[0]) {
                // Reset all icons!
                value[1].setSortValue?.(0);
            }
        });

        if (onSortButtonClicked) {
            onSortButtonClicked(cellID, value);
        }
    }

    const elements = Children.map(children, (child, index) => {
        let cellID = child.props.cellID;
        return cloneElement(child, {
            ref : (rf) => (cellRefs.current[cellID] = rf),
            onSortButtonClicked : (value) => handleCellSortValueChanged(cellID, value)
        })
    })

    return (
        <animated.div {...props} className={joinProps("sort-table-row", props.className)}>
            {elements}
        </animated.div>
    )
}

export function TableRow({children, ...props}) {
    return (
        <animated.div {...props} className={joinProps("table-row", props.className)}>
            {children}
        </animated.div>
    )
}

export function TableCell({children, cellID, ...props}) {
    return (
        <animated.div {...props} className={joinProps("table-cell", props.className)}>
            {children}
        </animated.div>
    )
}

export function ButtonTableCell({children, buttonCaption, cellID, onButtonClicked, ...props}) {
    return (
        <TableCell {...props} cellID={cellID} className={joinProps("button-table-cell", props.className)}>
            <SimpleButton caption={buttonCaption} onButtonClicked={onButtonClicked}/>
        </TableCell>
    )
}

export function SimpleTableCell({caption, cellID, ...props}) {
    return (
        <TableCell {...props} cellID={cellID} className={joinProps("simple-table-cell", props.className)}>
            <p>{caption}</p>
        </TableCell>
    )
}

export const SortTableCell = forwardRef(({children, cellID, onSortButtonClicked, ...props}, ref) => {

    const [sortValue, setSortValue] = useState(0);
    const [sortIcon, setSortIcon] = useState("filter_alt_off");

    useEffect(() => {
        switch (sortValue) {
            case -1:
                setSortIcon("arrow_drop_down")
                break;
            case 0:
                setSortIcon("filter_alt_off")
                break;
            case 1:
                setSortIcon("arrow_drop_up")
                break;
            default:
                break; 
        }
    }, [sortValue]);

    const handleSortButtonClicked = () => {
        let value = sortValue == 0 ? 1 : sortValue * -1;
        setSortValue(value);

        if (onSortButtonClicked) {
            onSortButtonClicked(value);
        }
    }

    useImperativeHandle(ref, () => ({
        setSortValue
    }))

    return (
        <TableCell {...props} cellID={cellID}>
            <div className="sort-table-cell">
                {children}
                <i class="material-icons sorting-icon" onClick={handleSortButtonClicked}>{sortIcon}</i>
            </div>
        </TableCell>
    )
})

export const SimpleSortTableCell = forwardRef(({caption, cellID, onSortButtonClicked, ...props}, ref) => {
    
    return (
        <SortTableCell {...props} cellID={cellID} onSortButtonClicked={onSortButtonClicked} className={joinProps("simple-table-cell", props.className)} ref={ref}>
            <p>{caption}</p>
        </SortTableCell>
    )
})