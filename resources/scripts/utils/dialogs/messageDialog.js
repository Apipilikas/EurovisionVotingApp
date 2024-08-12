import { DocumentUtils } from "../document/documentUtils.js";
import { BaseDialog, DialogResult, DialogType } from "./baseDialog.js";

/**
 * This class is used to display different kind of information ensuring user future actions.
 */
export class MessageDialog extends BaseDialog {

    /**
     * MessageDialog constructor
     * @param {DialogType} type Type of the dialog
     * @param {string} message 
     * @param {boolean} reloadPage True to reload page
     */
    constructor(type, message, reloadPage = false) {
        super("message-dialog", type);
        this.type = type;
        this.message = message;
        this.reloadPage = reloadPage;

        this.setBottomContainer(`
            <p class="message">` + message + `</p>
        `);

        this.setButtonsArea(`
            <button class="ok-btn">OK</button>
        `);
        this.#initBtnListeners();
        this.timerContainerCaption = this.getTimerContainerCaption();
        
    }

    /**
     * Creates and shows the message dialog.
     * @param {DialogType} type Type of the dialog
     * @param {string} message 
     * @param {boolean} reloadPage True to reload page
     * @returns Returns the DialogResult.
     */
    static show(type, message, reloadPage = false) {
        let messageDialog = new MessageDialog(type, message, reloadPage);
        return messageDialog.show();
    }

    /**
     * 
     * @param {DialogType} type Type of the dialog
     * @param {string} message
     * @param {number} ms 
     * @param {boolean} reloadPage True to reload page
     * @returns Returns the DialogResult.
     */
    static showAndCloseAfterMs(type, message, ms, reloadPage = false) {
        let messageDialog = new MessageDialog(type, message, reloadPage);
        return messageDialog.showAndCloseAfterMs(ms);
    }

    #initBtnListeners() {
        DocumentUtils.setChildClickEventListener(".ok-btn", this.container, (e) => {
            this.dialogResult = DialogResult.OK;
            this.close();
        });
    }

    /**
     * Gets timer container caption. If reload page is true then the caption is "Reloading in". Otherwise default caption.
     * @returns {string} Caption
     */
    getTimerContainerCaption() {
        if (this.reloadPage) return "Reloading in";
        else return this.timerContainerCaption;
    }

    /**
     * Closes the message dialog. If reload page is true, closing the dialog forces page to be reloaded.
     * @override
     */
    close() {
        super.close();
        if (this.reloadPage) DocumentUtils.reloadPage();
    }
}