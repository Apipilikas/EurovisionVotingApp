export class ResultButton {
    //const animation = "animate 1.4s linear infinite 0.2s";

    constructor(button) {
        this.button = button;
        this.contentContainer = button.getElementsByClassName("rb-content-container")[0];
        this.statusContainer = button.getElementsByClassName("rb-status-container")[0];
        this.state = State.Initial;
        this.initialContentMessage = this.contentContainer.textContent;
        this.animation = "animate 1.4s linear infinite 0.2s";
    }

    switchToInitialState() {
        this.state = State.Initial;
        this.button.style.setProperty("color", "");
    }

    switchToSuccessState() {
        this.state = State.Success;
        this.changeBorderColor("#ff0087");
        this.showStatusMessage("SUCCESS", false);

        setTimeout(() => this.hideStatusMessage(), 3000)
    }

    switchToLoadingState() {

        this.state = State.Loading;
        this.changeBorderColor("#fa0087");
        this.showStatusMessage("LOADING");
    }

    switchToFailureState() {

        this.state = State.Failure;
        this.changeBorderColor("#fc0087");
        this.showStatusMessage("FAILURE", false);
    }

    changeBorderColor(colorProperty)
    {
        this.button.style.setProperty("--color", colorProperty);
    }

    startBorderAnimation()
    {
        this.button.style.animation = this.animation;
    }

    stopBorderAnimation()
    {
        this.button.style.animation = null;
    }

    showStatusMessage(message, showAnimation = true)
    {
        if (showAnimation) this.startBorderAnimation();
        else this.stopBorderAnimation();
        
        this.contentContainer.textContent = null;
        this.statusContainer.textContent = message;
        this.statusContainer.classList.add("rb-status-transition");
    }

    hideStatusMessage()
    {
        this.statusContainer.classList.remove("rb-status-transition");
        this.contentContainer.textContent = this.initialContentMessage;
    }
}

const State = {
    Initial : "I",
    Success : "S",
    Loading : "L",
    Failure : "F"
}