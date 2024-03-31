import { blurScreen, unblurScreen } from "../utils/documentUtils.js";
import { generalTemplates } from "../utils/handlebarsUtils.js";

const closeErrorBoxClassName = "close-error-box";

export class ErrorBox {
    constructor(message, stackTrace, type, help, description) {
        this.message = message;
        this.stackTrace = stackTrace;
        this.type = type;
        this.help = help;
        this.description = description;
    }

    static show(message, stackTrace, type, help = null, description = null, elementID = "display-box-container") {
        let errorBox = new ErrorBox(message, stackTrace, type, help, description);

        errorBox.show(elementID);

        return errorBox;
    }

    static show(myError, elemementID = "display-box-container") {
        let errorBox = new ErrorBox(myError.message, myError.stack, myError.type, myError.help, myError.description);

        errorBox.show(elemementID);

        return errorBox;
    }

    show(elemementID) {
        blurScreen();

        let content = {message : this.message, description : this.description, stackTrace : this.stackTrace, type : this.type, help : this.help, link : window.location.href};

        const errorBoxContainer = document.getElementById(elemementID);
        let errorBoxContent = generalTemplates.errorBox(content);
        errorBoxContainer.innerHTML = errorBoxContent;

        const closeBtn = errorBoxContainer.querySelector(".close-btn");
        closeBtn.addEventListener("click", e => this.close());

        const copyBtn = errorBoxContainer.querySelector(".copy-btn");
        copyBtn.addEventListener("click", e => {
            navigator.clipboard.writeText(this.stackTrace);
        });
    }

    close() {
        unblurScreen();

        const errorBox = document.querySelector(".error-box");
        errorBox.classList.add(closeErrorBoxClassName);
    }
}