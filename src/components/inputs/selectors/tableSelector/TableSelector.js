import { SimpleTableCell, TableBody, TableCell, TableContainer, TableHeader, TableRow } from "../../../containers/tableContainer/TableContainer";
import { BaseSelector } from "../baseSelector/BaseSelector";
import './TableSelectorStyles.css';

export function TableSelector({caption, data, initialValue, valueProperty, displayProperty, onValueChanged, ...props}) {

    // Rendering
    const headerRow = () => {
        var keys = Object.keys(data[0]);
        return keys.map(key => <SimpleTableCell caption={key}/>)
    }

    function SelectorOption({data, ...props}) {
        return (
            <TableRow className="selector-option" {...props}>{bodyRow(data)}</TableRow>
        )
    }

    const bodyRows = () => {
        return data?.map(row => <SelectorOption data={row}/>);
    }

    const bodyRow = (rowData) => {
        var values = Object.values(rowData);
        return values.map(value => <SimpleTableCell caption={value}/>);
    }

    return (
        <BaseSelector caption={caption} data={data} initialValue={initialValue} 
                      valueProperty={valueProperty} displayProperty={displayProperty}
                      onValueChanged={onValueChanged} {...props}>
            <TableContainer className="table-selector-options">
                <TableHeader>
                    <TableRow>
                        {headerRow()}
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {bodyRows()}
                </TableBody>
            </TableContainer>
        </BaseSelector>
    )
}