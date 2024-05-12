import { DocumentUtils } from "../document/documentUtils.js";
import { generalTemplates } from "../handlebarsUtils.js";

const closeConfirmDialogClassName = "close-confirm-dialog";

/**
 * This class is used to ensure user wants to procceed to ones action. Three dialog results are supported: [YES] meaning user has
 * clicked the yes button, [NO] meaning user has clicked the no button and [CLOSE] meaning user has clicked the close button.
 */
export class ConfirmDialog {
    static DialogResult = {
        YES : "YES",
        NO : "NO",
        CLOSE : "CLOSE"
    }

    /**
     * ConfirmDialog constructor
     * @param {string} message Question to the user
     */
    constructor(message) {
        this.message = message;
    }

    /**
     * Creates and shows the confirm dialog.
     * @param {string} message Question to the user
     * @returns {Promise<ConfirmDialog.DialogResult>} Returns the DialogResult. [YES] meaning user has
     * clicked the yes button, [NO] meaning user has clicked the no button and [CLOSE] meaning user has clicked the close button.
     */
    static show(message) {
        let confirmDialog = new ConfirmDialog(message);

        return confirmDialog.show();
    }

    /**
     * Shows the confirm dialog.
     * @returns {Promise<ConfirmDialog.DialogResult>} Returns the DialogResult. [YES] meaning user has
     * clicked the yes button, [NO] meaning user has clicked the no button and [CLOSE] meaning user has clicked the close button.
     */
    show() {
        DocumentUtils.blurScreen();

        let content = {message : this.message};

        const confirmDialogContainer = DocumentUtils.getDisplayBoxContainer();
        let confirmDialogContent = generalTemplates.confirmDialog(content);
        confirmDialogContainer.innerHTML = confirmDialogContent;

        const closeBtn = confirmDialogContainer.querySelector(".close-btn");
        const yesBtn = confirmDialogContainer.querySelector(".yes-btn");
        const noBtn = confirmDialogContainer.querySelector(".no-btn");

        return new Promise((resolve) => {
            yesBtn.addEventListener("click", e => {
                resolve(ConfirmDialog.DialogResult.YES);
                this.close();
            })

            noBtn.addEventListener("click", e => {
                resolve(ConfirmDialog.DialogResult.NO);
                this.close();
            })

            closeBtn.addEventListener("click", e => {
                resolve(ConfirmDialog.DialogResult.CLOSE);
                this.close();
            });
        })
    }

    /**
     * Closes the confirm dialog.
     */
    close() {
        DocumentUtils.unblurScreen();

        const confirmDialog = document.querySelector(".confirm-dialog");
        confirmDialog.classList.add(closeConfirmDialogClassName);
    }
}