import { LinearProgressBar } from "../customElements/progressBar/linearProgressBar.js";
import { BaseDialog, DialogType } from "../dialogs/baseDialog.js";
import { DocumentUtils } from "../document/documentUtils.js";
import { adminTemplates, generalTemplates } from "../handlebarsUtils.js";
import { CountryRequests } from "../requestUtils.js";

export class ClearTotalVotesPanel extends BaseDialog {

    constructor(countries, judgeCode) {
        super("clear-total-votes-panel", DialogType.INFO, "Clear total votes");

        this.countries = countries;
        this.judgeCode = judgeCode;

        this.setBottomContainer(adminTemplates.voting.countriesListContent({countries : countries}) + `
            <p class='confirm-message'>Are you sure?</p>
            ` + generalTemplates.linearProgressBar());

        this.setButtonsArea(`
            <button class="ok-btn">OK</button>
            <button class="yes-btn">YES</button>
            <button class="no-btn">NO</button>
            `);

        this.#showFirstStep();
    }

    get selectedCountryCode() {
        return DocumentUtils.getChildElementAttribute("select", this.container, "value")[0];
    }

    getDisplayContainer() {
        return document.getElementById("clear-total-votes-panel-container");
    }

    initBtnListeners() {
        this.setClickBtnEventListener(".ok-btn", this.#okBtnListener);
        this.setClickBtnEventListener(".yes-btn", this.#yesBtnListener);
        this.setClickBtnEventListener(".no-btn", this.#noBtnListener);
    }

    //#region Button listeners

    #okBtnListener(e) {
        this.#showSecondStep();
    }

    #yesBtnListener(e) {
        this.#showThirdStep();
        let progressBar = new LinearProgressBar(2);
        progressBar.begin();
        CountryRequests.clearCountryTotalVotes(this.judgeCode, this.selectedCountryCode)
        .then(response => {
            if (response.success) {
                progressBar.complete();
            }
            else {
                progressBar.cancel(response.jsonData.error.description);
            }
        });
    }

    #noBtnListener(e) {
        this.close();
    }

    //#endregion

    //#region Steps

    #showFirstStep() {
        console.time("test")
        DocumentUtils.setChildStyle("select", this.container, "display", "initial");
        DocumentUtils.setChildStyle(".confirm-message", this.container, "display", "none");
        DocumentUtils.setChildStyle(".linear-progress-bar", this.container, "display", "none");

        DocumentUtils.setChildStyle(".ok-btn", this.container, "display", "initial");
        DocumentUtils.setChildStyle(".yes-btn", this.container, "display", "none");
        DocumentUtils.setChildStyle(".no-btn", this.container, "display", "none");
        console.timeEnd("test");
    }

    #showSecondStep() {
        DocumentUtils.setChildStyle("select", this.container, "display", "none");
        DocumentUtils.setChildStyle(".confirm-message", this.container, "display", "initial");
        DocumentUtils.setChildStyle(".linear-progress-bar", this.container, "display", "none");

        DocumentUtils.setChildStyle(".ok-btn", this.container, "display", "none");
        DocumentUtils.setChildStyle(".yes-btn", this.container, "display", "initial");
        DocumentUtils.setChildStyle(".no-btn", this.container, "display", "initial");
    }

    #showThirdStep() {
        DocumentUtils.setChildStyle(".linear-progress-bar", this.container, "display", "initial");
        DocumentUtils.setChildStyle(".confirm-message", this.container, "display", "none");

        DocumentUtils.setChildStyle(".yes-btn", this.container, "display", "none");
        DocumentUtils.setChildStyle(".no-btn", this.container, "display", "none");
    }

    //#endregion
}