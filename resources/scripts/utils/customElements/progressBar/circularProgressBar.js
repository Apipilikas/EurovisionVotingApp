import { BaseProgressBar } from "./baseProgressBar.js"

export class CircularProgressBar extends BaseProgressBar {
    /**
     * CircularProgressBar constructor
     * @param {number} steps number of steps 
     */
    constructor(steps = 0) {
        super(steps);
    }

    /**
     * @override
     */
    getContainer() {
        return document.getElementsByClassName("circular-progress-bar")[0];
    }

    /**
     * @override
     */
    updateBarStatus(currentValue) {
        this.container.style.background = `conic-gradient(var(--info-color) ${currentValue * 3.6}deg, #ededed 0deg)`;
    }
}