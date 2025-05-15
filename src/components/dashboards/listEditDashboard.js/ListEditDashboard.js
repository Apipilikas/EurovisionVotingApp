import { useEffect, useState } from "react";
import { ListContainer } from "../../containers/listContainer/ListContainer";
import { ToolbarConfig } from "../../containers/toolbarContainer/toolbarConfig";
import { ToolbarContainer } from "../../containers/toolbarContainer/ToolbarContainer";
import "./ListEditDashboardStyles.css"
import { ReactListUtils } from "../../../utils/react/listUtils";

const ButtonIDs = {
    NEW : "new",
    SAVE : "save",
    DELETE : "delete"
}

export function ListEditDashboard({data, valueMember, ItemContainer, children, MainContainer, onDataChanged, onToolbarButtonClicked}) {

    const [bindedData, setBindedData] = useState([]);
    const [selectedItem, setSelectedItem] = useState(null);

    useEffect(() => {
        if (data != null) {
            setBindedData(data);
        }
    },[data]);

    const config = new ToolbarConfig();
    config.addToolbarItem(ButtonIDs.NEW, "New", "add");
    config.addToolbarItem(ButtonIDs.SAVE, "Save", "save");
    config.addToolbarItem(ButtonIDs.DELETE, "Delete", "delete");

    const handleOnSelectedItemChanged = (selectedItem) => {
        setSelectedItem(selectedItem);
    }

    const handleOnDataChanged = (selectedItem) => {
        const updatedData = bindedData.map(item => item[valueMember] === selectedItem[valueMember] ? selectedItem : item);
        setBindedData(updatedData);
        setSelectedItem(selectedItem);
        if (onDataChanged) onDataChanged(updatedData);
    }

    const handeOnToolbarButtonClicked = (buttonID) => {
        let item = selectedItem;
        
        debugger
        switch(buttonID) {
            case ButtonIDs.NEW:
                item = {[valueMember] : "New Item"};
                ReactListUtils.pushItem(item, setBindedData);
                break;

            case ButtonIDs.SAVE:
                const isNew = data.find(item => item[valueMember] == selectedItem[valueMember]) == null;
                item.isNew = isNew;
                break;
            
                case ButtonIDs.DELETE:
                setBindedData(list => list.filter(item => item[valueMember] != selectedItem[valueMember]));
                break;
        }

        if (onToolbarButtonClicked) onToolbarButtonClicked(buttonID, item)
    }

    return (
        <div className="list-edit-dashboard">
            <ListContainer data={bindedData} valueMember={valueMember} ItemContainer={ItemContainer} onSelectedItemChanged={handleOnSelectedItemChanged}/>
            <div className="list-edit-dashboard-content">
                <MainContainer data={selectedItem} onChange={handleOnDataChanged}/>
                <ToolbarContainer config={config} onButtonClicked={handeOnToolbarButtonClicked}/>
            </div>
        </div>
    )
}