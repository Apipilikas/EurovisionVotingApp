import './ToolbarContainerStyles.css'

export function ToolbarContainer({config, onButtonClicked}) {
    
    const handleOnClick = (e) => {
        const buttonID = e.target.name;
        if (onButtonClicked) onButtonClicked(buttonID);
    }
    
    return (
        <div className="toolbar-container">
            {config.items.map(item => <ToolbarButton item={item} onClick={handleOnClick}/>)}
        </div>
    )
}

function ToolbarButton({item, onClick}) {
    return (
        <button className="toolbar-button" onClick={onClick} name={item.id}>
            <i class="material-icons sorting-icon" >{item.icon}</i>
        </button>
    )
}