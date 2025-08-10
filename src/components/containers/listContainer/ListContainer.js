import { useEffect, useId, useState } from "react"
import "./ListContainerStyles.css"
import { useBoundData } from "../../../hooks/useBoundData";
import { useFallbackHookProps } from "../../../hooks/useFallbackHookProps";

export function ListContainer({data, initialValue, valueProperty, DisplayContainer, onSelectedItemChanged}) {

    const id = `list-container-${useId()}`;
    const props = {boundData : data};
    const binder = useFallbackHookProps(useBoundData, [data, valueProperty, null, initialValue], props);

    // Effects
    useEffect(() => {
        if (binder.selectedData && onSelectedItemChanged) onSelectedItemChanged(binder.selectedData);
    }, [binder.selectedData])

    // Functions
    const getItemValue = (item) => {
        if (valueProperty) return item[valueProperty];
        return "";
    }

    // Events
    const handleOnChange = (data) => {
        binder.setSelectedData(data);
    }

    return (
        <div className="list-container">
            {binder.boundData?.map(item => {
                const itemValue = getItemValue(item);

                return (
                    <div className="list-container-item">
                        <input type="radio" id={itemValue} name={id} value={itemValue} defaultChecked={itemValue == initialValue} onChange={() => handleOnChange(item)} />
                        <label for={itemValue}>
                        <DisplayContainer item={item} className="list-container-item-content"/>
                        </label>
                    </div>
                )
            })}
        </div>
    )
}