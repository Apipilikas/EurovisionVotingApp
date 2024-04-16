const State = {
    Initial : "I",
    Success : "S",
    Loading : "L",
    Failure : "F"
}

const ClassNameMapping = new Map([
    [State.Initial, ""],
    [State.Success, "success"],
    [State.Loading, "loading"],
    [State.Failure, "failure"]
]);

const MessageMapping = new Map([
    [State.Success, "SUCCESS"],
    [State.Loading, "LOADING"],
    [State.Failure, "FAILURE"]
]);

export class ResultButton {

    constructor(button) {
        this.button = button;
        this.contentContainer = button.querySelector(".rb-content-container");
        this.statusContainer = button.querySelector(".rb-status-container");
        this.state = State.Initial;
        this.initialContentMessage = this.contentContainer.textContent;
    }

    static getByID(elementID) {
        let button = document.getElementById(elementID);
        return this.getByElement(button);
    }

    static getByElement(button) {
        if(!this.isResultBtn(button)) return null;
        return new ResultButton(button);
    }

    static isResultBtn(button) {
        return button.classList.contains("result-button");
    }

    async execute(promise) {
        this.switchToLoadingState();

        // All the promises return a ClientResponse object (Promise<ClientResponse>).
        const thenResponse = promise.then(response => {
            if (response.success) this.switchToSuccessState();
            else this.switchToFailureState();

            return response;
        })

        return thenResponse;
    }

    switchToInitialState() {
        this.state = State.Initial;
    }

    switchToSuccessState() {
        this.changeState(State.Success, false);
    }

    switchToLoadingState() {
        this.changeState(State.Loading, true, null);
    }

    switchToFailureState() {
        this.changeState(State.Failure, false);
    }

    changeState(toState, showAnimation, hideAfterMs = 3000) {
        this.clearColor();

        this.state = toState;

        this.changeColor();
        this.showStatusMessage(showAnimation);
        if (hideAfterMs != null) {
            setTimeout(() => {
                this.hideStatusMessage();
                this.changeState(State.Initial, false, null);
            }, hideAfterMs);
        }
    }

    changeColor() {
        if (this.state == State.Initial) return;

        const className = ClassNameMapping.get(this.state);
        this.statusContainer.classList.add(className);
    }

    clearColor() {
        const className = ClassNameMapping.get(this.state);
        if (this.statusContainer.classList.contains(className)) {
            this.statusContainer.classList.remove(className);
        }
    }

    startBorderAnimation() {
        this.button.classList.add("result-button-animation");
    }

    stopBorderAnimation() {
        this.button.classList.remove("result-button-animation");
    }

    showStatusMessage(showAnimation = true) {
        if (this.state == State.Initial) return;

        if (showAnimation) this.startBorderAnimation();
        else this.stopBorderAnimation();
        
        this.contentContainer.textContent = null;
        this.statusContainer.textContent = MessageMapping.get(this.state);
        this.statusContainer.classList.add("rb-status-transition");
    }

    hideStatusMessage() {
        this.statusContainer.classList.remove("rb-status-transition");
        this.contentContainer.textContent = this.initialContentMessage;
    }
}