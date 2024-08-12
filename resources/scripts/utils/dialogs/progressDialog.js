import { CircularProgressBar } from "../customElements/progressBar/circularProgressBar.js";
import { LinearProgressBar } from "../customElements/progressBar/linearProgressBar.js";
import { DocumentUtils } from "../document/documentUtils.js";
import { generalTemplates } from "../handlebarsUtils.js";
import { BaseDialog, DialogResult, DialogType } from "./baseDialog.js";

export class ProgressDialog extends BaseDialog {
    constructor(isCircular, steps) {
        if (isCircular) {
            super("circular-progress-dialog", DialogType.INFO);
    
            this.setBottomContainer(generalTemplates.circularProgressBar());

            this.progressBar = new CircularProgressBar(steps);
        }
        else {
            super("linear-progress-dialog", DialogType.INFO);
            
            this.setBottomContainer(generalTemplates.linearProgressBar());
            this.setButtonsArea(`
                <button class="cancel-btn">Cancel</button>
                `);

            this.#initBtnListeners();
            this.progressBar = new LinearProgressBar(steps);
            // this.onBarCompletedListener = this.progressBar.onBarCompletedListener;
        }
        this.topContainerVisibility = false;
        this.simpleShowAnimation = true;
        this.progressBar.onBarCompletedListener = this.onBarCompletedListener.bind(this); // Handles barCompleted Event
    }

    #initBtnListeners() {
        DocumentUtils.setChildClickEventListener(".cancel-btn", this.container, (e) => {
            this.dialogResult = DialogResult.CANCEL;
            this.progressBar.cancel();
            this.closeAfterMs(4000);
        })
    }

    static createCircular(steps) {
        let dialog = new ProgressDialog(true, steps);
        return dialog;
    }

    static createLinear(steps) {
        let dialog = new ProgressDialog(false, steps);
        return dialog;
    }

    onBarCompletedListener(sender, e) {
        this.closeAfterMs(200);
    }
}