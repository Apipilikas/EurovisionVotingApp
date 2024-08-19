import { DocumentUtils } from "../document/documentUtils.js";
import { generalTemplates } from "../handlebarsUtils.js";
import { TranslationHelper } from "../translation/translationHelper.js";

const showBaseDialogClassName = "show-dialog";
const closeBaseDialogClassName = "close-dialog";

export const DialogResult = {
    OK : "OK",
    CANCEL : "CANCEL",
    CLOSE : "CLOSE",
    AUTOCLOSE : "AUTOCLOSE",
    ABORT : "ABORT",
    CHOICE1 : "CHOICE1",
    CHOICE2 : "CHOICE2"

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
    timerContainerCaption = "Closing in"
    topContainerVisibility = true
    simpleShowAnimation = false

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

        this.initContainer();
        this.initListeners();
    }

    /**
     * Gets main container.
     * @returns {HTMLElement}
     * @readonly
     */
    get container() {
        return this.#container;
    }

    /**
     * Initializes main container.
     * This function SHOULD always be invoked first.
     */
    initContainer() {
        let className = ClassMapping.get(this.type);
        let iconCode = IconMapping.get(this.type);
        let caption = (this.caption == null) ? CaptionMapping.get(this.type) : this.caption;
        let content = {dialogName: this.dialogName, className : className, icon : iconCode, caption : caption};

        let boxContainer = this.getDisplayContainer();
        let baseDialogContent = generalTemplates.baseDialog(content);
        boxContainer.innerHTML = baseDialogContent;
        this.#container = boxContainer.querySelector(".base-dialog");

        TranslationHelper.observeTranslationChanges(this.#container);
    }

    /**
     * Initializes button listeners. Initialization occurs only when setButtonsArea is invoked.
     */
    initBtnListeners() {
    }

    /**
     * Initializes listeners.
     */
    initListeners() {
    }

    /**
     * Sets click button event listener.
     * @param {string} btnClassName 
     * @param {Function} listenerFunction 
     */
    setClickBtnEventListener(btnClassName, listenerFunction) {
        DocumentUtils.setChildClickEventListener(btnClassName, this.#container, listenerFunction.bind(this));
    }

    /**
     * Gets display container.
     * @returns {HTMLElement}
     */
    getDisplayContainer() {
        return DocumentUtils.getDisplayBoxContainer();
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
        this.initBtnListeners();
    }

    /**
     * Shows the base dialog.
     * @returns {Promise<DialogResult>} Returns the DialogResult.
     */
    show() {
        if(!this.topContainerVisibility) DocumentUtils.setChildStyle(".top-container", this.#container, "display", "none");
        if (this.simpleShowAnimation) DocumentUtils.addClassNameByElement(this.#container, "simple-animation");

        DocumentUtils.blurScreen();
        
        DocumentUtils.addClassName(".base-dialog", showBaseDialogClassName);
        this.setClickBtnEventListener(".close-btn", this.#closeBtnListener);

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
        ms += 3000; // animation delay
        this.closeAfterMs(ms);
        return this.show();
    }

    /**
     * Closes the dialog after specific ms.
     * @param {number} ms 
     */
    closeAfterMs(ms) {
        const timerContainer = this.#container.querySelector(".timer-container");
        timerContainer.style.display = "flex";
        
        DocumentUtils.setChildInnerHTML(".timer-caption", timerContainer, this.timerContainerCaption);
        const timerTxt = timerContainer.querySelector(".timer-seconds-txt");

        // Animation
        let totalMs = 0;
        let interval = setInterval(() => {
            totalMs += 1000;
            
            if (totalMs >= ms) {
                clearInterval(interval);
            }
            
            timerTxt.innerHTML = (ms - totalMs) / 1000;
        }, 1000);
        setTimeout(() => {
            this.close();
        }, ms);
    }

    /**
     * Closes the base dialog.
     */
    close() {
        this.#container.dispatchEvent(new Event("closingDialog"));
        DocumentUtils.unblurScreen();

        DocumentUtils.removeClassNameByElement(this.#container, showBaseDialogClassName);
        DocumentUtils.addClassNameByElement(this.#container, closeBaseDialogClassName);
    }

    /**
     * Disposes the dialog.
     */
    dispose() {
        this.#container.remove();
        DocumentUtils.unblurScreen();
    }

    //#region 

    #closeBtnListener(e) {
        this.dialogResult = DialogResult.CLOSE;
        this.close();
    }

    //#endregion
}