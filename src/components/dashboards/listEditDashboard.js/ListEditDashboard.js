import { ListContainer } from "../../containers/listContainer/ListContainer";
import { ToolbarConfig } from "../../containers/toolbarContainer/toolbarConfig";
import { ToolbarContainer } from "../../containers/toolbarContainer/ToolbarContainer";
import "./ListEditDashboardStyles.css"
import { cloneObjectProps } from "../../../utils/react/propsUtils";
import { useBoundData } from "../../../hooks/useBoundData";

export const ButtonIDs = {
    NEW : "new",
    SAVE : "save",
    DELETE : "delete"
}

export function ListEditDashboard({data, 
                                valueProperty,
                                initialValue,
                                DisplayContainer, 
                                MainContainer, 
                                mainContainerProps, 
                                onDataChanged, 
                                onToolbarButtonClicked}) {

    const binder = useBoundData(data, valueProperty, undefined, initialValue, undefined);

    const config = new ToolbarConfig();
    config.addToolbarItem(ButtonIDs.NEW, "New", "add");
    config.addToolbarItem(ButtonIDs.SAVE, "Save", "save");
    config.addToolbarItem(ButtonIDs.DELETE, "Delete", "delete");

    // Functions
    const createNewItem = () => {
        // Clone item
        let item = binder.boundData[binder.boundData.length - 1];
        item = cloneObjectProps(item);

        item[valueProperty] = "new_item_" + binder.boundData.length;
        binder.addItem(item);
    }

    const removeSelectedItem = () => {
        binder.removeItem(binder.selectedItem);
        binder.setSelectedItem(null);
    }

    // Events
    const handleOnSelectedItemChanged = (selectedItem) => {
        binder.setSelectedItem(selectedItem);
    }

    const handleOnDataChanged = (originalItem, updatedItem) => {
        if (!binder.initialized) return;
        binder.updateItem(originalItem, updatedItem);
    }

    const handeOnToolbarButtonClicked = async (buttonID) => {
        let handled = true;

        if (onToolbarButtonClicked) handled = await onToolbarButtonClicked(buttonID, binder.selectedItem);
        
        if (!handled) return;

        switch(buttonID) {
            case ButtonIDs.NEW:
                createNewItem();
                break;

            case ButtonIDs.SAVE:
                break;
            
            case ButtonIDs.DELETE:
                removeSelectedItem();
                break;
        }
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
                <MainContainer data={binder.selectedItem} onChange={handleOnDataChanged} {...mainContainerProps}/>
                <ToolbarContainer config={config} onButtonClicked={handeOnToolbarButtonClicked}/>
            </div>
        </div>
    )
}