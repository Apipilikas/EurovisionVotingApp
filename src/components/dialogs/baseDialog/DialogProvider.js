import { createContext, useContext, useEffect, useState } from "react"
import { NotificationBoxConfig } from "../../boxes/notificationBox/notificationBoxConfig";
import { ErrorBoxConfig } from "../../boxes/errorBox/errorBoxConfig";
import { DialogOrigin } from "./BaseDialog";
import { DocumentUtils } from "../../../utils/document/documentUtils";

const DialogContext = createContext();

export const useDialog = () => useContext(DialogContext);

export default function DialogProvider({children}) {

    const [dialogOrigin, setDialogOrigin] = useState(null);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [dialogConfig, setDialogConfig] = useState(null);
    const [resolve, setResolve] = useState(null);

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

    const resolveDialogOrigin = (config) => {
        if (config instanceof NotificationBoxConfig) {
            setDialogOrigin(DialogOrigin.NOTIFICATIONBOX);
        }
        else if (config instanceof ErrorBoxConfig) {
            setDialogOrigin(DialogOrigin.ERRORBOX);
            DocumentUtils.blurScreen();
        }
        else {
            setDialogOrigin(DialogOrigin.BASEDIALOG);
            DocumentUtils.blurScreen();
        }
    }

    const showDialog = (config) => {

        resolveDialogOrigin(config);

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
        <DialogContext.Provider value={{dialogOrigin, isDialogOpen, showDialog, closeDialog, registerEvent, dialogConfig}}>
            {children}
        </DialogContext.Provider>
    );
}