import { DocumentUtils } from "../document/documentUtils.js";
import { generalTemplates } from "../handlebarsUtils.js";

const closeErrorBoxClassName = "close-error-box";

export class ErrorBox {
    constructor(message, stackTrace, type, help, description) {
        this.message = message;
        this.stackTrace = stackTrace;
        this.type = type;
        this.help = help;
        this.description = description;
    }

    static show(message, stackTrace, type, help = null, description = null) {
        let errorBox = new ErrorBox(message, stackTrace, type, help, description);

        errorBox.show();

        return errorBox;
    }

    static showMyError(myError) {
        let stackTrace = myError.stack;

        if (myError.innerError != null) {
            stackTrace += "\n Inner Error stack trace \n" + myError.innerError.stack;
        }

        return this.show(myError.message, stackTrace, myError.type, myError.help, myError.description);
    }

    show() {
        DocumentUtils.blurScreen();

        let content = {message : this.message, description : this.description, stackTrace : this.stackTrace, type : this.type, help : this.help, link : window.location.href};

        const errorBoxContainer = DocumentUtils.getDisplayBoxContainer();
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
        DocumentUtils.unblurScreen();

        const errorBox = document.querySelector(".error-box");
        errorBox.classList.add(closeErrorBoxClassName);
    }
}