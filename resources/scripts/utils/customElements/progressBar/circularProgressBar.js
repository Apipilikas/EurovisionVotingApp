import { BaseProgressBar } from "./baseProgressBar.js"

export class CircularProgressBar extends BaseProgressBar {
    constructor(steps = 0) {
        super(steps);
    }

    /**
     * @override
     */
    initContainer() {
        this.container = document.getElementsByClassName("circular-progress-bar")[0];
        super.initContainer();
    }

    /**
     * @override
     */
    updateBarStatus(currentValue) {
        this.container.style.background = `conic-gradient(var(--info-color) ${currentValue * 3.6}deg, #ededed 0deg)`;
    }
}