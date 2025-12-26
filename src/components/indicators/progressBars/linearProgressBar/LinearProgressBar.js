import { forwardRef, useEffect, useImperativeHandle, useState } from "react";
import { joinProps } from "../../../../utils/react/propsUtils";
import { BarState, useProgressBar } from "../../../../hooks/useProgressBar";
import "./LinearProgressBarStyles.css";
import { animated, useSpring } from "react-spring";

// Mappers

export const LinearProgressBar = forwardRef(({steps, ...props}, ref) => {
    const progressBar = useProgressBar(steps);
    const showPercentage = progressBar.barState == BarState.INPROGRESS;


    const barStyles = useSpring({
        width: `${progressBar.startValue}%`,
        config: { tension: 250, friction: 20 },
    });

    useImperativeHandle(ref, () => ({
        begin : progressBar.begin,
        warn : progressBar.warn,
        cancel : progressBar.cancel,
        nextStep : progressBar.nextStep,
        previousStep : progressBar.previousStep,
        complete : progressBar.complete
    }), []);

    return (
        <div className={joinProps("linear-progress-bar", props.className)}>
            <div class="linear-progress-bar-container">
                <animated.div class={joinProps("bar", progressBar.barClass)} style={barStyles}>
                <div class="bar-details">
                    {showPercentage ? 
                    <span class="percentage">{progressBar.startValue}%</span>
                    :
                    <i class="material-icons">{progressBar.icon}</i>
                    }
                </div>
                </animated.div>
            </div>
            <span class="description">{progressBar.description}</span>
        </div>
    );
});