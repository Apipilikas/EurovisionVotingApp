import { useEffect, useState } from "react";

export const BarState = {
    INITIALIZING : "INITIALIZING",
    INPROGRESS : "INPROGRESS",
    CANCELED : "CANCELED",
    WARNING : "WARNING",
    COMPLETED : "COMPLETED"
};

const ClassMapper = new Map([
    [BarState.INITIALIZING, ""],
    [BarState.WARNING, "warning"],
    [BarState.CANCELED, "canceled"],
    [BarState.COMPLETED, "completed"]
])

const IconMapper = new Map([
    [BarState.INITIALIZING, "hourglass_empty"],
    [BarState.INPROGRESS, "progress_activity"],
    [BarState.CANCELED, "priority_high"],
    [BarState.WARNING, "warning"],
    [BarState.COMPLETED, "done_outline"]
])

export function useProgressBar(steps, initialStep) {
    // States
    const [barState, setBarState] = useState(BarState.INITIALIZING);
    const [startValue, setStartValue] = useState(0);
    const [endValue, setEndValue] = useState(0);
    const [currentStep, setCurrentStep] = useState(0);
    const [icon, setIcon] = useState("");
    const [description, setDescription] = useState("Initializing...");
    const [barClass, setBarClass] = useState("");

    const stepIncrement = Math.floor(100 / steps);

    // Effects - Sync
    useEffect(() => {
        setEndValue(Math.floor(currentStep * stepIncrement));
    }, [currentStep]);
    
    useEffect(() => {
        moveBar(endValue);
    }, [endValue]);

    useEffect(() => {
        setIcon(IconMapper.get(barState));
        setBarClass(ClassMapper.get(barState));
    }, [barState]);

    // Functions

    const moveBar = (nextValue) => {
        // if (barState != BarState.RUNNING && barState != BarState.WARNING) return;
        
        let progressForward = nextValue > startValue;
        let progress = setInterval(() => {
            setStartValue((previousValue) => {
                if (previousValue === nextValue) {
                    clearInterval(progress);

                    if (previousValue == 100) setBarState(BarState.COMPLETED);

                    return previousValue;
                }
                    
                const next = progressForward ? previousValue + 1 : previousValue - 1;
    
                return next;
            });
        }, 100);
    }

    const begin = () => {
        setBarState(BarState.INPROGRESS);
        setDescription("Started");
    }

    const complete = () => {
        moveBar(100);
    }
    
    const cancel = () => {
        setBarState(BarState.CANCELED);
        setDescription("Canceled");
    }

    const warn = (desc = "Warning") => {
        setBarState(BarState.WARNING);
        setDescription(desc);
    }

    const nextStep = () => setCurrentStep(value => value + 1);
    
    const previousStep = () => setCurrentStep(value => value - 1);

    return {
        barState,
        currentStep,
        icon,
        barClass,
        startValue,
        endValue,
        description,
        setDescription,
        begin,
        cancel,
        complete,
        warn,
        nextStep,
        previousStep
    }
}