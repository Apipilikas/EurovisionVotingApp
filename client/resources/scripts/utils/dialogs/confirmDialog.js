import { DocumentUtils } from "../document/documentUtils.js";
import { generalTemplates } from "../handlebarsUtils.js";

const closeConfirmDialogClassName = "close-confirm-dialog";

export class ConfirmDialog {
    static DialogResult = {
        YES : "YES",
        NO : "NO",
        CLOSE : "CLOSE"
    }

    constructor(message) {
        this.message = message;
    }

    static show(message) {
        let confirmDialog = new ConfirmDialog(message);

        return confirmDialog.show();
    }

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

    close() {
        DocumentUtils.unblurScreen();

        const confirmDialog = document.querySelector(".confirm-dialog");
        confirmDialog.classList.add(closeConfirmDialogClassName);
    }
}