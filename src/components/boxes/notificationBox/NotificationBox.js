import { DialogResult } from "../../dialogs/baseDialog/BaseDialog";
import { useDialog } from "../../dialogs/baseDialog/DialogProvider";
import { DialogUtils } from "../../dialogs/dialogUtils";
import './NotificationBoxStyles.css';

const closeNotificationBoxClassName = "close-notification-box";

export function NotificationBox() {

    const {isDialogOpen, showDialog, closeDialog, registerEvent, dialogConfig} = useDialog();

    if (!dialogConfig) return;
    const {message, type, description} = dialogConfig;

    return (
        <div class={`notification-box ${DialogUtils.getDialogClassName(type)} ${isDialogOpen ? "" : closeNotificationBoxClassName}`}>
            <div class="left-container">
                <div class="icon-container">
                    <i class="material-icons">{DialogUtils.getDialogIcon(type)}</i>
                    <span>{type}</span>
                </div>
                <div class="message-container">
                    <h1 class="notification-message">{message}</h1>
                    <p class="notification-description">{description}</p>
                </div>
            </div>
            <span class="close-btn" onClick={() => closeDialog(DialogResult.CLOSE)}>&times;</span>
        </div>
    );
}