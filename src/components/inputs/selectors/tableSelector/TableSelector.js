import { SimpleTableCell, TableBody, TableCell, TableContainer, TableHeader, TableRow } from "../../../containers/tableContainer/TableContainer";
import { BaseSelector } from "../baseSelector/BaseSelector";
import './TableSelectorStyles.css';

export function TableSelector({caption, 
                               data, 
                               initialValue, 
                               valueProperty, 
                               displayProperty, 
                               onValueChanged, 
                               visibleColumns = [],
                               ...props}) {

    // Functions
    const shouldColumnBeVisible = (column) => visibleColumns.length == 0 || visibleColumns.includes(column);
                                
    // Rendering
    const headerRow = () => {
        if (data == null || data.length == 0) return;
        var keys = Object.keys(data[0]).filter(key => shouldColumnBeVisible(key));
        return keys.map(key => <SimpleTableCell caption={key}/>)
    }

    function SelectorOption({data, className, ...props}) {
        return (
            <TableRow className={className} {...props}>{bodyRow(data)}</TableRow>
        )
    }

    const bodyRows = () => {
        return data?.map(row => <SelectorOption data={row} className={"selector-option"}/>);
    }

    const bodyRow = (rowData) => {
        var values = Object.entries(rowData).filter(([key]) => shouldColumnBeVisible(key)).map(([key, value]) => value);
        return values.map(value => <SimpleTableCell caption={String(value)}/>);
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