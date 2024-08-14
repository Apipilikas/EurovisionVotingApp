import { BaseDialog, DialogResult, DialogType } from "../dialogs/baseDialog.js";
import { DocumentUtils } from "../document/documentUtils.js";
import { adminTemplates } from "../handlebarsUtils.js";

export class RevealWinnerPanel extends BaseDialog {
    constructor(countries) {
        super(".reveal-winner-panel", DialogType.INFO, "Reveal winner");

        this.setBottomContainer(adminTemplates.voting.countriesListContent({countries : countries}));

        this.setButtonsArea(`
            <button class="ok-btn">OK</button>
            <button class="clear-btn">CLEAR</button>
            `);
    }

    get winnerCountryCode() {
        return DocumentUtils.getChildElementAttribute("select", this.container, "value")[0];
    }

    static show(countries) {
        let dialog = new RevealWinnerPanel(countries);
        return dialog.show();
    }

    getDisplayContainer() {
        return document.getElementById("reveal-winner-panel-container");
    }

    initBtnListeners() {
        this.setClickBtnEventListener(".ok-btn", this.#okBtnListener);
        this.setClickBtnEventListener(".clear-btn", this.#clearBtnListener);
    }

    //#region Button listeners
    
    #okBtnListener(e) {
        this.dialogResult = DialogResult.OK;
        this.close();
    }

    #clearBtnListener(e) {
        this.dialogResult = DialogResult.CHOICE1; // Clear
        this.close();
    }

    //#endregion
}