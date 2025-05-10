import React from 'react';
import './SimpleButtonStyles.css';

export default function SimpleButton({caption, onButtonClicked, ...props}) {
    
    const handleButtonClicked = (e) => {
        onButtonClicked(e);
    }
    
    return (
        <button type="button" 
                className="simple-button" 
                id={props.id}
                onClick={handleButtonClicked}
                {...props}>
            <span></span>{caption}
        </button>
    )
}