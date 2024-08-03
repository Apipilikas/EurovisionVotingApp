import { DocumentUtils } from "../document/documentUtils.js";
import { generalTemplates } from "../handlebarsUtils.js";

const showBaseDialogClassName = "show-dialog";
const closeBaseDialogClassName = "close-dialog";

export const DialogResult = {
    OK : "OK",
    CANCEL : "CANCEL",
    CLOSE : "CLOSE",
    AUTOCLOSE : "AUTOCLOSE",
    ABORT : "ABORT"
}

export const DialogType = {
    SUCCESS : "SUCCESS",
    INFO : "INFO",
    WARNING : "WARNING",
    ERROR : "ERROR" 
}

const ClassMapping = new Map([
    [DialogType.SUCCESS, "success"],
    [DialogType.INFO, "info"],
    [DialogType.WARNING, "warning"],
    [DialogType.ERROR, "error"]
]);

const IconMapping = new Map([
    [DialogType.SUCCESS, "check_circle"],
    [DialogType.INFO, "info"],
    [DialogType.WARNING, "warning"],
    [DialogType.ERROR, "error"]
]);

const CaptionMapping = new Map([
    [DialogType.INFO, "Information message"],
    [DialogType.WARNING, "Warning message"]
]);

export class BaseDialog {
    static Type = DialogType;

    #container
    dialogResult
    #timerContainerCaption = "Closing in"

    /**
     * BaseDialog constructor
     * @param {string} dialogName 
     * @param {DialogType} type 
     * @param {string} caption 
     */
    constructor(dialogName, type, caption = null) {
        this.dialogName = dialogName;
        this.type = type;
        this.caption = caption;

        this.initializeContainer();
    }

    /**
     * Gets main container.
     * @returns {HTMLElement}
     */
    get container() {
        return this.#container;
    }

    set timerContainerCaption(value) {
        this.#timerContainerCaption = value;
    }

    /**
     * Initializes main container.
     * This function SHOULD always be invoked first.
     */
    initializeContainer() {
        let className = ClassMapping.get(this.type);
        let iconCode = IconMapping.get(this.type);
        let caption = (this.caption == null) ? CaptionMapping.get(this.type) : this.caption;
        let content = {dialogName: this.dialogName, className : className, icon : iconCode, caption : caption};

        this.#container = DocumentUtils.getDisplayBoxContainer();
        let baseDialogContent = generalTemplates.baseDialog(content);
        this.#container.innerHTML = baseDialogContent;
    }

    /**
     * Sets the bottom container.
     * @param {string} innerHTML 
     */
    setBottomContainer(innerHTML) {
        DocumentUtils.setChildInnerHTML(".bottom-container", this.#container, innerHTML);
    }

    /**
     * Sets the buttons in the buttons area. If this function hasn't been invoked, buttons area stays invisible.
     * @param {string} innerHTML 
     */
    setButtonsArea(innerHTML) {
        DocumentUtils.setChildStyle(".buttons-area", this.#container, "display", "flex");
        DocumentUtils.setChildInnerHTML(".buttons-area", this.#container, innerHTML);
    }

    /**
     * Shows the base dialog.
     * @returns {Promise<DialogResult>} Returns the DialogResult.
     */
    show() {
        DocumentUtils.blurScreen();
        
        DocumentUtils.addClassName(".base-dialog", showBaseDialogClassName);
        DocumentUtils.setChildClickEventListener(".base-dialog .close-btn", this.#container, (e) => {this.close()});

        return new Promise((resolve) => {
            this.#container.addEventListener("closingDialog", () => {
                resolve(this.dialogResult);
            });
        });
    }

    /**
     * Shows the dialog and closes it after specific ms if user hasn't done it before this time.
     * @param {number} ms 
     * @returns Returns the DialogResult.
     */
    showAndCloseAfterMs(ms) {
        const timerContainer = document.getElementsByClassName("timer-container")[0];
        timerContainer.style.display = "flex";
        
        DocumentUtils.setChildInnerHTML(".timer-caption", timerContainer, this.#timerContainerCaption);
        const timerTxt = timerContainer.querySelector(".timer-seconds-txt");

        let totalMs = 0;
        let interval = setInterval(() => {
            if (totalMs >= ms) {
                clearInterval(interval);
                this.close();
            }
            
            totalMs += 1000;
            timerTxt.innerHTML = (ms - totalMs) / 1000;
        },1000)
        setTimeout(() => {
            this.close();
        }, ms);

        return this.show();
    }

    /**
     * Closes the base dialog.
     */
    close() {
        this.#container.dispatchEvent(new Event("closingDialog"));
        DocumentUtils.unblurScreen();

        DocumentUtils.removeClassName(".base-dialog", showBaseDialogClassName);
        DocumentUtils.addClassName(".base-dialog", closeBaseDialogClassName);
    }

    dispose() {

    }
}