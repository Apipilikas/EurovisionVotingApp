import { BaseProgressBar } from "./baseProgressBar.js";



export class LinearProgressBar extends BaseProgressBar {
    /**
     * LinearProgressBar constructor
     * @param {number} steps Number of steps
     */
    constructor(steps = 0) {
        super(steps);
    }

    /**
     * @override
     */
    getContainer() {
        return document.getElementsByClassName("linear-progress-bar")[0];
    }

    /**
     * @override
     */
    updateBarStatus(currentValue) {
        this.bar.style.width = `${currentValue}%`;
    }
}