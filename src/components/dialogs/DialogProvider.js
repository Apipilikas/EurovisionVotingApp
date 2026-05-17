import { createContext, useContext, useEffect, useState } from "react"
import { DocumentUtils } from "../../utils/document/documentUtils";
import { DialogConfig } from "./dialogConfig";

const DialogContext = createContext();

export const useDialog = () => useContext(DialogContext);

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

export default function DialogProvider({children}) {

    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [dialogConfig, setDialogConfig] = useState(null);
    const [dialogContent, setDialogContent] = useState(null);
    const [resolve, setResolve] = useState(null);

    useEffect(() => {
        if (dialogConfig != null) resolveDialogConfig(dialogConfig);
    }, [dialogConfig]);

    // Events
    const [onDialogClosing, setOnDialogClosing] = useState(null);
    const [onDialogClosed, setOnDialogClosed] = useState(null);

    const registerEvent = (eventName, fn) => {
        switch (eventName) {
            case "onDialogClosing":
                setOnDialogClosing(fn);
                break;
            
            case "onDialogClosed":
                setOnDialogClosed(fn);
                break;
        }
    }

    const resolveDialogConfig = (config) => {
        if (dialogConfig instanceof DialogConfig)
            setDialogContent(config.content);
        else throw new Error("Dialog config provided is not of type DialogConfig");
    }

    const showDialog = (config) => {
        return new Promise((resolve) => {
            setDialogConfig(config);
            setIsDialogOpen(true);
            setResolve(() => resolve);
        });
    }

    const closeDialog = (result) => {
        if (resolve) {
            let cancel = false;
            if (onDialogClosing) {
                onDialogClosing(cancel)
                if (cancel) return;
            }
            setIsDialogOpen(false);
            
            if (onDialogClosed) onDialogClosed(result);
            resolve(result);
            DocumentUtils.unblurScreen();
        }
    }

    return (
        <DialogContext.Provider value={{isDialogOpen, showDialog, closeDialog, registerEvent, dialogConfig}}>
            {children}
            {dialogContent}
        </DialogContext.Provider>
    );
}