import { DocumentUtils } from "../../document/documentUtils.js"

const BarState = {
    INITIALIZING : "INITIALIZING",
    RUNNING : "RUNNING",
    CANCELED : "CANCELED",
    WARNING : "WARNING",
    COMPLETED : "COMPLETED"
};

export class BaseProgressBar {

    #barState
    #steps = 0
    #currentStep = 0
    #stepIncrement = 0
    #startValue = 0
    #endValue = 0
    container
    bar
    #percentage
    #description
    #onAnimation = false

    /**
     * BaseProgressBar constructor
     * @param {number} steps Number of steps 
     */
    constructor(steps = 0) {
        this.#steps = steps;
        if (this.#steps > 0) this.#stepIncrement = Math.floor(100 / steps);
        
        this.#barState = BarState.INITIALIZING;
        this.initContainer();
        this.initListeners();
    }

    initContainer() {
        this.#percentage = this.container.querySelector(".percentage");
        this.#description = this.container.querySelector(".description");
        this.bar = this.container.querySelector(".bar");
    }

    initListeners() {
        this.container.addEventListener("barCompleted", (e) => this.onBarCompletedListener(this, e));
    }

    /**
     * Gets bar state.
     * @returns {BarState}
     * @readonly
     */
    get barState() {
        return this.#barState;
    }

    /**
     * Gets steps number.
     * @returns {number}
     * @readonly
     */
    get steps() {
        return this.#steps;
    }

    /**
     * Sets the description.
     */
    set description(value) {
        this.#description.textContent = value;
    }

    /**
     * Shows percentage and hides icon container.
     */
    showPercentage() {
        this.#percentage.style.display = "initial";
        let iconEl = this.container.querySelector("i"); 
        iconEl.style.display = "none";
    }

    /**
     * Shows icon and hides percentage container.
     * @param {String} icon Icon ID
     */
    showIcon(icon) {
        this.#percentage.style.display = "none";
        let iconEl = this.container.querySelector("i"); 
        iconEl.style.display = "initial";
        iconEl.innerHTML = icon;
    }

    #setBarAsCompleted() {
        this.showIcon("check");
        DocumentUtils.removeClassNameByElement(this.container, "warning");
        DocumentUtils.addClassNameByElement(this.container, "completed");
        this.description = "Completed";
        this.container.dispatchEvent(new Event("barCompleted"));
    }

    /**
     * Starts the progress bar.
     */
    begin() {
        this.#barState = BarState.RUNNING;
        this.showPercentage();
        this.description = "Started";
    }

    /**
     * Completes the progress bar.
     */
    complete() {
        this.moveBar(100);
        this.#barState = BarState.COMPLETED;
    }

    /**
     * Occurs when the progress bar is completed.
     * @param {LinearProgressBar} sender 
     * @param {Event} e 
     * @event
     */
    onBarCompletedListener(sender, e) {
    }

    /**
     * Sets the progress bar into warning mode.
     * @param {*} desc Description
     */
    warn(desc = "Warning") {
        this.#barState = BarState.WARNING;
        this.showIcon("warning");
        DocumentUtils.addClassNameByElement(this.container, "warning");
        this.description = desc;

        setTimeout(() => {
            this.showPercentage();
        }, 2000);
    }

    /**
     * Stops permanently the progress bar.
     * @param {string} desc Description
     */
    cancel(desc = "Canceled") {
        if (this.#barState == BarState.COMPLETED) return;

        this.#barState = BarState.CANCELED;
        this.showIcon("priority_high");
        DocumentUtils.addClassNameByElement(this.container, "canceled");
        this.description = desc;
    }

    /**
     * Moves the progress bar to the next step.
     */
    nextStep() {
        this.#currentStep++;
        let nextValue = this.#currentStep * this.#stepIncrement;
        this.moveBar(nextValue);
    }

    /**
     * Moves the progress bar to the previous step.
     */
    previousStep() {
        this.#currentStep--;
        let nextValue = this.#currentStep * this.#stepIncrement;
        this.moveBar(nextValue);
    }

    /**
     * Moves the progress bar to the given percentage.
     * @param {*} nextValue Next percentage
     * @returns {Promise<boolean>} True when the animation has finished. If it has been invoked by other while being on animation, returns false.
     */
    moveBar(nextValue) {
        if (this.#barState != BarState.RUNNING && this.#barState != BarState.WARNING) return;
        
        let startValue = this.#startValue;
        this.#endValue = nextValue;
        let progressForward = nextValue > startValue;
    
    return new Promise(resolve => {
        if (this.#onAnimation) {
            resolve(false);
            return;
        } 

        this.#onAnimation = true

        let progress = setInterval(() => {
            if (progressForward) startValue++;
            else startValue--;
        
            this.#percentage.textContent = `${startValue}%`;
            this.updateBarStatus(startValue); // Should be overriden.
        
            if (startValue == this.#endValue) {
                clearInterval(progress);
                this.#startValue = startValue;
                this.#onAnimation = false;

                if (startValue == 100) this.#setBarAsCompleted();
                
                resolve(true);
            }
        }, 10);
    });
    }

    /**
     * Updates the progress bar animation.
     * @param {*} currentValue 
     */
    updateBarStatus(currentValue) {

    }
}