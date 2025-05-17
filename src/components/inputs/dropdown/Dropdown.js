import { useId } from "react"
import './DropdownStyles.css';

export function Dropdown({caption, list, initialValue, value, onChange}) {

    const id = `dropdown-${useId()}`;

    return (
        <div className="dropdown-container">
            <label for={id}>{caption}</label>
            <select id={id} defaultValue={initialValue} value={value} onChange={onChange}>
                {list?.map(item => <option value={item}>{item}</option>)}
            </select>
        </div>
    )
}