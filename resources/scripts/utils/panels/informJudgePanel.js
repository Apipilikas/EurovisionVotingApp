import { BaseDialog, DialogResult, DialogType } from "../dialogs/baseDialog.js";
import { DocumentUtils } from "../document/documentUtils.js";

export class InformJudgePanel extends BaseDialog {
    /**
     * InformJudgePanel constructor
     */
    constructor() {
        super("inform-judge-panel", DialogType.INFO, "Inform judge");

        this.setBottomContainer(`
            <textarea></textarea>
            `);

        this.setButtonsArea(`
            <button class="inform-btn">INFORM</button>
            <button class="warn-btn">WARN</button>
            `);
    }

    /**
     * Gets text.
     */
    get text() {
        return DocumentUtils.getChildElementAttribute("textarea", this.container, "value")[0];
    }

    /**
     * @override
     */
    getDisplayContainer() {
        return document.getElementById("inform-judge-panel-container");
    }

    /**
     * @override
     */
    initBtnListeners() {
        this.setClickBtnEventListener(".inform-btn", this.#informBtnListener);
        this.setClickBtnEventListener(".warn-btn", this.#warnBtnListener);
    }

    // #region Button listeners

    #informBtnListener(e) {
        this.dialogResult = DialogResult.CHOICE1;
        this.close();
    }

    #warnBtnListener(e) {
        this.dialogResult = DialogResult.CHOICE2;
        this.close();
    }

    // #endregion
}