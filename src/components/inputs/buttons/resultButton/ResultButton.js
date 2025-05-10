import { forwardRef, useEffect, useImperativeHandle, useState } from "react"

import './ResultButtonStyles.css';

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

export const ResultButton = forwardRef(({caption, id, className, promise, onButtonClicked, onPromiseFulfilled}, ref) => {

    const MessageMapping = new Map([
        [State.Initial, caption],
        [State.Success, "SUCCESS"],
        [State.Loading, "LOADING"],
        [State.Failure, "FAILURE"]
    ]);

    const [state, setState] = useState(State.Initial);
    const [resultClassName, setResultClassName] = useState("");
    const [resultCaption, setResultCaption] = useState(caption);
    const [showAnimation, setShowAnimation] = useState(false);

    useEffect(() => {
        setResultClassName(ClassNameMapping.get(state));
        setResultCaption(MessageMapping.get(state));

        switch (state) {
            case State.Success:
            case State.Failure:
                setTimeout(() => {
                    switchToInitialState();
                }, 3000);    
                break;
        }

    }, [state]);

    const handleClick = async () => {
        if (state == State.Loading) return;
        if(onButtonClicked != null) onButtonClicked();
        if (!promise) return;

        switchToLoadingState();
        const response = await promise();

        if (response.success) switchToSuccessState();
        else switchToFailureState();

        if (!onPromiseFulfilled) return;
        onPromiseFulfilled(response);
    }

    const switchToInitialState = () => {
        setState(State.Initial);
    }

    const switchToSuccessState = () => {
        setState(State.Success);
        setShowAnimation(false);
    }

    const switchToLoadingState = () => {
        setState(State.Loading);
        setShowAnimation(true);
    }

    const switchToFailureState = () => {
        setState(State.Failure);
        setShowAnimation(false);
    }

    useImperativeHandle(ref, () => ({
        switchToInitialState,
        switchToSuccessState,
        switchToLoadingState,
        switchToFailureState
    }))

    return (
        <button className={`result-button ${showAnimation ? "result-button-animation" : ""} ${resultClassName} ${className}`} id={id} onClick={handleClick}>
            <span className="rb-content-container">{resultCaption}</span>
        </button>
    )

})