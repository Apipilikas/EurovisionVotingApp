import { DocumentUtils } from "../document/documentUtils.js";
import { BaseDialog, DialogResult } from "./baseDialog.js";

/**
 * This class is used to ensure user wants to procceed to ones action.
 */
export class ConfirmDialog extends BaseDialog {
    /**
     * ConfirmDialog constructor
     * @param {string} message Question to the user
     */
    constructor(message) {
        super("confirm-dialog", BaseDialog.Type.INFO, "Confirm your action");
        this.message = message;

        this.setBottomContainer(`
            <p class="confirm-message">` + message + `</p>
        `);

        this.setButtonsArea(`
            <button class="yes-btn">YES</button>
            <button class="no-btn">NO</button>
        `);
    }

    /**
     * Creates and shows the confirm dialog.
     * @param {string} message Question to the user
     * @returns Returns the DialogResult.
     */
    static show(message) {
        let confirmDialog = new ConfirmDialog(message);

        return confirmDialog.show();
    }

    initBtnListeners() {
        this.setClickBtnEventListener(".yes-btn", this.#yesBtnListener);
        this.setClickBtnEventListener(".no-btn", this.#noBtnListener);
    }

    //#region Button listeners

    #yesBtnListener(e) {
        this.dialogResult = DialogResult.OK;
        this.close();
    }

    #noBtnListener(e) {
        this.dialogResult = DialogResult.CANCEL;
        this.close();
    }

    //#endregion
}