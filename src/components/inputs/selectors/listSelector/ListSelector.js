import { joinProps } from "../../../../utils/react/propsUtils";
import { BaseSelector } from "../baseSelector/BaseSelector";
import './ListSelectorStyles.css';

export function ListSelector({caption, list, initialValue, onValueChanged, ...props}) {

    return (
        <BaseSelector caption={caption} data={list} initialValue={initialValue} onValueChanged={onValueChanged} SelectorOption={SelectorOption} {...props}>
            {list?.map(item => <SelectorOption data={item} className={"selector-option"}/>)}
        </BaseSelector>
    )
}

function SelectorOption({data, className, ...props}) {
    return (
        <span {...props} className={joinProps("list-selector-option", className)}>{data}</span>
    )
}