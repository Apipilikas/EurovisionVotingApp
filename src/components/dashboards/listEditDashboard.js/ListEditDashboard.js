import { useEffect, useRef, useState } from "react";
import { ListContainer } from "../../containers/listContainer/ListContainer";
import { ToolbarConfig } from "../../containers/toolbarContainer/toolbarConfig";
import { ToolbarContainer } from "../../containers/toolbarContainer/ToolbarContainer";
import "./ListEditDashboardStyles.css"
import { ReactListUtils } from "../../../utils/react/listUtils";
import { clearObjectProps, cloneObjectProps } from "../../../utils/react/propsUtils";
import { useBoundData } from "../../../hooks/useBoundData";

const ButtonIDs = {
    NEW : "new",
    SAVE : "save",
    DELETE : "delete"
}

export function ListEditDashboard({data, valueProperty, DisplayContainer, MainContainer, onDataChanged, onToolbarButtonClicked}) {

    const binder = useBoundData(data, valueProperty, undefined, "agg", undefined);

    const config = new ToolbarConfig();
    config.addToolbarItem(ButtonIDs.NEW, "New", "add");
    config.addToolbarItem(ButtonIDs.SAVE, "Save", "save");
    config.addToolbarItem(ButtonIDs.DELETE, "Delete", "delete");

    // Functions
    const createNewItem = () => {
        // Clone item
        let item = binder.boundData[binder.boundData.length - 1];
        item = cloneObjectProps(item);

        // Unique ID
        // item._id_ = binder.boundData.length;
        item[valueProperty] = "new_item" + binder.boundData.length;
        binder.addData(item);
    }

    const removeSelectedItem = () => {
        binder.removeData(binder.selectedData);
    }

    // Events
    const handleOnSelectedItemChanged = (selectedItem) => {
        binder.setSelectedData(selectedItem);
    }

    const handleOnDataChanged = (item) => {
        if (!binder.initialized) return;
        binder.updateData(item);
    }

    const handeOnToolbarButtonClicked = (buttonID) => {
        // let item = selectedItem;
        
        switch(buttonID) {
            case ButtonIDs.NEW:
                createNewItem();
                break;

            case ButtonIDs.SAVE:
                // const isNew = data.find(item => item[valueProperty] == selectedItem[valueProperty]) == null;
                // item.isNew = isNew;
                break;
            
                case ButtonIDs.DELETE:
                removeSelectedItem();
                break;
        }

        // if (onToolbarButtonClicked) onToolbarButtonClicked(buttonID, item)
    }

    return (
        <div className="list-edit-dashboard">
            <ListContainer data={binder.boundData} 
            initialValue={binder.value}
            valueProperty={valueProperty}
            DisplayContainer={DisplayContainer}
            onSelectedItemChanged={handleOnSelectedItemChanged}
            />
            <div className="list-edit-dashboard-content">
                <MainContainer data={binder.selectedData} onChange={handleOnDataChanged}/>
                <ToolbarContainer config={config} onButtonClicked={handeOnToolbarButtonClicked}/>
            </div>
        </div>
    )
}