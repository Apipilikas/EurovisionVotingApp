import { BaseSelector } from "../baseSelector/BaseSelector";
import './ListSelectorStyles.css';

export function ListSelector({caption, list, initialValue, onValueChanged, ...props}) {

    return (
        <BaseSelector caption={caption} data={list} initialValue={initialValue} onValueChanged={onValueChanged} SelectorOption={SelectorOption} {...props}>
            {list?.map(item => <SelectorOption data={item}/>)}
        </BaseSelector>
    )
}

function SelectorOption({data, ...props}) {
    return (
        <span {...props} className="list-selector-option">{data}</span>
    )
}