import { createContext, useContext, useEffect, useState } from "react"
import './BaseDialogStyles.css';
import { useDialog } from "./DialogProvider";
import { DialogUtils } from "../dialogUtils";
import { DocumentUtils } from "../../../utils/document/documentUtils";

export const DialogResult = {
    OK : "OK",
    CANCEL : "CANCEL",
    CLOSE : "CLOSE",
    AUTOCLOSE : "AUTOCLOSE",
    ABORT : "ABORT",
    CHOICE1 : "CHOICE1",
    CHOICE2 : "CHOICE2"

}

export const DialogType = {
    SUCCESS : "SUCCESS",
    INFO : "INFO",
    WARNING : "WARNING",
    ERROR : "ERROR" 
}

export const DialogOrigin = {
    BASEDIALOG : "BASEDIALOG",
    NOTIFICATIONBOX : "NOTIFICATIONBOX",
    ERRORBOX : "ERRORBOX"
}

const closeBaseDialogclassNameName = "close-dialog";

export function BaseDialog() {

    const [time, setTime] = useState(0);
    const {isDialogOpen, showDialog, closeDialog, registerEvent, dialogConfig} = useDialog();
    const [show, setShow] = useState(true);

    useEffect(() => {
        if (dialogConfig) {
            const ms = dialogConfig?.closeAfterMs;

            if (ms > 0) {
                closeDialogAfterMs(ms);
            }
        }
    }, []); 

    if (!dialogConfig) return;    
    const {title, type, content, closeAfterMs, buttons} = dialogConfig;

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

    const handleCloseDialog = (dialogResult) => {
        closeDialog(dialogResult);
        setTimeout(() => {
            setShow(false);
        }, 500);
    }
    
    const showTimerContainer = closeAfterMs > 0;

    return (
        <div className={`base-dialog ${DialogUtils.getDialogClassName(type)} ${isDialogOpen ? "" : closeBaseDialogclassNameName}`} style={{display : (show ? "flex" : "none")}}>
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
                {content}
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