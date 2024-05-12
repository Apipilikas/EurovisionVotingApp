import { DocumentUtils } from "../document/documentUtils.js";
import { MyError } from "../errorUtils.js";
import { generalTemplates } from "../handlebarsUtils.js";

const closeErrorBoxClassName = "close-error-box";

/**
 * This class is used to display further information when an error is thrown.
 */
export class ErrorBox {
    /**
     * ErrorBox constructor
     * @param {string} message Error message
     * @param {string} stackTrace Error stack trace
     * @param {string} type Error type
     * @param {string} help Help message
     * @param {string} description Description for further information
     */
    constructor(message, stackTrace, type, help, description) {
        this.message = message;
        this.stackTrace = stackTrace;
        this.type = type;
        this.help = help;
        this.description = description;
    }

    /**
     * Creates and shows the error box.
     * @param {string} message Error message
     * @param {string} stackTrace Error stack trace
     * @param {string} type Error type
     * @param {string} help Help message
     * @param {string} description Description for further information
     * @returns {ErrorBox} Returns an ErrorBox instance.
     */
    static show(message, stackTrace, type, help = null, description = null) {
        let errorBox = new ErrorBox(message, stackTrace, type, help, description);

        errorBox.show();

        return errorBox;
    }

    /**
     * Creates and shows the error box using MyError information.
     * @param {MyError} myError MyError instance
     * @returns {ErrorBox} Returns an ErrorBox instance.
     */
    static showMyError(myError) {
        let stackTrace = myError.stack;

        if (myError.innerError != null) {
            stackTrace += "\n Inner Error stack trace \n" + myError.innerError.stack;
        }

        return this.show(myError.message, stackTrace, myError.type, myError.help, myError.description);
    }

    /**
     * Shows the error box.
     */
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

    /**
     * Closes the error box.
     */
    close() {
        DocumentUtils.unblurScreen();

        const errorBox = document.querySelector(".error-box");
        errorBox.classList.add(closeErrorBoxClassName);
    }
}