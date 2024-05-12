import { DocumentUtils } from "../document/documentUtils.js";
import { generalTemplates } from "../handlebarsUtils.js";

export const MessageType = {
    INFO : "INFO",
    WARNING : "WARNING"
}

const MessageClassMapping = new Map([
    [MessageType.INFO, "info"],
    [MessageType.WARNING, "warning"]
]);

const MessageIconMapping = new Map([
    [MessageType.INFO, "info"],
    [MessageType.WARNING, "warning"]
]);

const MessageCaptionMapping = new Map([
    [MessageType.INFO, "Information message"],
    [MessageType.WARNING, "Warning message"]
]);

const closeMessageDialogClassName = "close-message-dialog";

/**
 * This class is used to display different kind of information ensuring user future actions.
 */
export class MessageDialog {
    static Type = MessageType;

    /**
     * MessageDialog constructor
     * @param {MessageDialog.Type} type Type of the dialog
     * @param {string} message 
     * @param {boolean} reloadPage True to reload page
     */
    constructor(type, message, reloadPage = false) {
        this.type = type;
        this.message = message;
        this.reloadPage = reloadPage;
    }

    /**
     * Creates and shows the message dialog.
     * @param {MessageDialog.Type} type Type of the dialog
     * @param {string} message 
     * @param {boolean} reloadPage True to reload page
     * @returns {MessageDialog} Returns a MessageDialog instance.
     */
    static show(type, message, reloadPage = false) {
        let messageDialog = new MessageDialog(type, message, reloadPage);

        messageDialog.show();

        return messageDialog;
    }

    /**
     * Shows the message dialog.
     */
    show() {
        DocumentUtils.blurScreen();

        let className = MessageClassMapping.get(this.type);
        let iconCode = MessageIconMapping.get(this.type);
        let caption = MessageCaptionMapping.get(this.type)
        let content = {className : className, icon : iconCode, caption : caption, message : this.message};

        const messageConfirmContainer = DocumentUtils.getDisplayBoxContainer();
        let messageConfirmContent = generalTemplates.messageDialog(content);
        messageConfirmContainer.innerHTML = messageConfirmContent;

        const closeBtn = messageConfirmContainer.querySelector(".close-btn");
        const okBtn = messageConfirmContainer.querySelector(".ok-btn");

        okBtn.addEventListener("click", e => this.close());
        closeBtn.addEventListener("click", e => this.close());
    }

    /**
     * Closes message dialog after specific ms if user hasn't done it before this time. Countdown is displayed next to close button.
     * @param {number} ms  
     */
    closeAfterMs(ms) {
        const timerContainer = document.getElementsByClassName("timer-container")[0];
        timerContainer.style.display = "flex";
        
        DocumentUtils.setChildInnerHTML(".timer-caption", timerContainer, this.getTimerContainerCaption());
        const timerTxt = timerContainer.querySelector(".timer-seconds-txt");

        let totalMs = 0;
        let interval = setInterval(() => {
            if (totalMs >= ms) {
                clearInterval(interval);
                this.close();
            }
            
            totalMs += 1000;
            timerTxt.innerHTML = (ms - totalMs) / 1000;
        },1000)
        setTimeout(() => {
            this.close();
        }, ms);
    }

    /**
     * Gets timer container caption. If reload page is true then the caption is "Reloading in". Otherwise "Closing in".
     * @returns {string} Caption
     */
    getTimerContainerCaption() {
        if (this.reloadPage) return "Reloading in";
        else return "Closing in";
    }

    /**
     * Closes the message dialog. If reload page is true, closing the dialog forces page to be reloaded.
     */
    close() {
        DocumentUtils.unblurScreen();

        if (this.reloadPage) {
            DocumentUtils.reloadPage();
        }

        const messageDialog = document.querySelector(".message-dialog");
        DocumentUtils.addClassNameByElement(messageDialog, closeMessageDialogClassName);
    }
}