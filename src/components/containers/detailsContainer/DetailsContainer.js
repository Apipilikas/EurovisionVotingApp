import "./DetailsContainerStyles.css";

export function DetailsContainer({summaryContent, className, id, children, onClick}) {
    
    const handleClick = (e) => {
        if (onClick) onClick();
    }
    
    return (
        <details className={`details-container ${className}`} id={id} onClick={handleClick}>
            <summary>{summaryContent}</summary>
            <div className="details-content">
                {children}
            </div>
        </details>
    )
}

export function SimpleDetailsContainer({summaryCaption, className, id, children, onClick}) {
    return (
        <DetailsContainer summaryContent={summaryCaption} 
                          className={className}
                          id={id}
                          children={children}
                          onClick={onClick}/>
    )
}