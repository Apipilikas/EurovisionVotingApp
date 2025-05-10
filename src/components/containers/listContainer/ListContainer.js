import { useEffect, useId } from "react"
import "./ListContainerStyles.css"

export function ListContainer({data, initialValue, valueMember, ItemContainer, onSelectedItemChanged}) {

    const id = `list-container-${useId()}`;

    const handleOnChange = (e) => {
        const countryCode = e.target.value;
        const selectedItem = data.find(item => item[valueMember] == countryCode);
        if (onSelectedItemChanged) onSelectedItemChanged(selectedItem);
    }

    return (
        <div className="list-container">
            {data.map(item => {
                return (
                    <div className="list-container-item">
                        <input type="radio" id={item[valueMember]} name={id} value={item[valueMember]} defaultChecked={item[valueMember] == initialValue} onChange={handleOnChange} />
                        <label for={item.code}>
                        <ItemContainer item={item} className="list-container-item-content"/>
                        </label>
                    </div>
                )
            })}
        </div>
    )
}