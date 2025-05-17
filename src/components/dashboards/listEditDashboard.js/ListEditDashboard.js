import { useEffect, useRef, useState } from "react";
import { ListContainer } from "../../containers/listContainer/ListContainer";
import { ToolbarConfig } from "../../containers/toolbarContainer/toolbarConfig";
import { ToolbarContainer } from "../../containers/toolbarContainer/ToolbarContainer";
import "./ListEditDashboardStyles.css"
import { ReactListUtils } from "../../../utils/react/listUtils";
import { clearObjectProps } from "../../../utils/react/propsUtils";

const ButtonIDs = {
    NEW : "new",
    SAVE : "save",
    DELETE : "delete"
}

export function ListEditDashboard({data, valueMember, ItemContainer, MainContainer, onDataChanged, onToolbarButtonClicked}) {

    const [boundData, setBoundData] = useState([]);
    const [selectedItem, setSelectedItem] = useState(null);

    useEffect(() => {
        if (data != null) {
            setBoundData(data.map((item, index) => ({...item, _id_ : index})));
        }
    },[data]);

    const config = new ToolbarConfig();
    config.addToolbarItem(ButtonIDs.NEW, "New", "add");
    config.addToolbarItem(ButtonIDs.SAVE, "Save", "save");
    config.addToolbarItem(ButtonIDs.DELETE, "Delete", "delete");

    
    const createNewItem = () => {
        // Clone item
        let item =  {...data[data.length - 1]};
        item = clearObjectProps(item);

        // Unique ID
        item._id_ = boundData.length;
        item[valueMember] = "new_item" + boundData.length;

        ReactListUtils.pushItem(item, setBoundData);
    }

    // Handlers
    const handleOnSelectedItemChanged = (selectedItem) => {
        // alert("1")
        setSelectedItem(selectedItem);
    }

    const handleOnDataChanged = (selectedData) => {
        // alert("2");
        const updatedData = boundData.map(item => item["_id_"] === selectedItem["_id_"] ? selectedData : item);
        setBoundData(updatedData);
        setSelectedItem(selectedData);
        if (onDataChanged) onDataChanged(updatedData);
    }

    const handeOnToolbarButtonClicked = (buttonID) => {
        let item = selectedItem;
        
        switch(buttonID) {
            case ButtonIDs.NEW:
                createNewItem();
                break;

            case ButtonIDs.SAVE:
                const isNew = data.find(item => item[valueMember] == selectedItem[valueMember]) == null;
                item.isNew = isNew;
                break;
            
                case ButtonIDs.DELETE:
                setBoundData(list => list.filter(item => item[valueMember] != selectedItem[valueMember]));
                break;
        }

        if (onToolbarButtonClicked) onToolbarButtonClicked(buttonID, item)
    }

    return (
        <div className="list-edit-dashboard">
            <ListContainer data={boundData} valueMember={valueMember} ItemContainer={ItemContainer} onSelectedItemChanged={handleOnSelectedItemChanged}/>
            <div className="list-edit-dashboard-content">
                <MainContainer data={selectedItem} onChange={handleOnDataChanged}/>
                <ToolbarContainer config={config} onButtonClicked={handeOnToolbarButtonClicked}/>
            </div>
        </div>
    )
}