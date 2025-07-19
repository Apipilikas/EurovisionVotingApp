import { createContext, useContext, useEffect, useState } from "react"
import './BaseDialogStyles.css';
import { DialogResult, useDialog } from "../DialogProvider";
import { DialogUtils } from "../dialogUtils";
import { DocumentUtils } from "../../../utils/document/documentUtils";

const closeBaseDialogclassNameName = "close-dialog";

export function BaseDialog() {
    const [time, setTime] = useState(0);
    const {isDialogOpen, showDialog, closeDialog, registerEvent, dialogConfig} = useDialog();
    const [display, setDisplay] = useState("flex");

    useEffect(() => {
        setDisplay("flex");
    }, [isDialogOpen])

    useEffect(() => {
        if (dialogConfig) {
            const ms = dialogConfig?.closeAfterMs;

            if (ms > 0) {
                closeDialogAfterMs(ms);
            }
        }
    }, []); 

    if (!dialogConfig) return;    
    const {title, type, innerContent, closeAfterMs, buttons} = dialogConfig;

    const closeDialogAfterMs = (ms) => {
        ms += 3000; // animation delay
        // Animation
        let totalMs = 0;
        let interval = setInterval(() => {
            totalMs += 1000;
            
            if (totalMs >= ms) {
                clearInterval(interval);
            }
            
            setTime((ms - totalMs) / 1000);
        }, 1000);
        setTimeout(() => {
            if (isDialogOpen) handleCloseDialog(DialogResult.AUTOCLOSE);
            
        }, ms);
    }

    const handleCloseDialog = (result) => {
        closeDialog(result)
        setTimeout(() => {
            setDisplay("none")
        }, 500);
    }
    
    const showTimerContainer = closeAfterMs > 0;

    return (
        <div className={`base-dialog ${DialogUtils.getDialogClassName(type)} ${isDialogOpen ? "" : closeBaseDialogclassNameName}`} style={{display : display}}>
            <div className="top-container">
                <div className="icon-container">
                    <i className="material-icons">{DialogUtils.getDialogIcon(type)}</i>
                    <p>{title}</p>
                </div>
                <div className="right-container">
                    <div className={`timer-container ${showTimerContainer ? "show" : ""}`}>
                        <p className="timer-caption">Closing in</p>
                        <p className="timer-txt"><span className="timer-seconds-txt">{time}</span> s</p>
                    </div>
                    <span className="close-btn" onClick={() => handleCloseDialog(DialogResult.CLOSE)}>&times;</span>
                </div>
            </div>
            <div className="bottom-container">
                {innerContent}
            </div>
            <div className="buttons-area">
                {buttons.map(btn => {
                    const title = btn.title;
                    const result = btn.result;
                    const selected = btn.selected;

                    return <button className={`dialog-button ${selected ? "selected" : ""}`} onClick={(e) => handleCloseDialog(result)}key={title}>{title}</button>
                })}
            </div>
        </div>
    );
}