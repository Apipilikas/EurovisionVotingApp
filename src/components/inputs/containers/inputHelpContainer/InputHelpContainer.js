import './InputHelpContainerStyles.css';

export function InputHelpContainer({caption}) {

    if (caption == null) return null;

    return (
        <div className="input-help-container">
            <i className="material-icons input-help-icon">info</i>
            <span className="input-help-caption">{caption}</span>
        </div>
    )
}