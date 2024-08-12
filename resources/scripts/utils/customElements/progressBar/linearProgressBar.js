import { BaseProgressBar } from "./baseProgressBar.js";



export class LinearProgressBar extends BaseProgressBar {

    constructor(steps = 0) {
        super(steps);
    }

    /**
     * @override
     */
    initContainer() {
        this.container = document.getElementsByClassName("linear-progress-bar")[0];
        super.initContainer()
    }

    /**
     * @override
     */
    updateBarStatus(currentValue) {
        this.bar.style.width = `${currentValue}%`;
    }
}