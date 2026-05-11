import { useEffect, useState } from "react";
import { useTransition, animated } from "@react-spring/web";
import "./CountdownContainerStyles.css";

export function CountdownContainer({endDate}) {
    const getRemainingTime = () => {
        const currentTime = new Date().getTime();
        const eventTime = new Date(endDate).getTime();
        return Math.max(0, eventTime - currentTime);
    };

    const [remainingTime, setRemainingTime] = useState(() => {
        return getRemainingTime();
    });

    const eventName = process.env.REACT_APP_COUNTDOWN_EVENT_NAME;

    useEffect(() => {
        const countdownInterval = setInterval(() => {
            let timeToFinish = getRemainingTime();

            if (timeToFinish <= 0) {
                timeToFinish = 0;
                clearInterval(countdownInterval);
            }

            setRemainingTime(timeToFinish);
        }, 1000);

        return () => clearInterval(countdownInterval);
    }, [])

    return (
        <div className="countdown-container">
            <p id="top-caption">The <span><span>{eventName}</span></span> starts in</p>
            <CountdownTimer currentTime={remainingTime}/>
            <p id="bottom-caption">{(remainingTime <= 0) ? "Its tiiiiimee!" : "Are you ready?"}</p>
            {(remainingTime <= 0) ? <p>Please refresh the page...</p> : ""}
        </div>
    )
}

function CountdownTimer({currentTime}) {
    const [seconds, setSeconds] = useState(0);
    const [minutes, setMinutes] = useState(0);
    const [hours, setHours] = useState(0);
    const [days, setDays] = useState(0);

    useEffect(() => {
        const secs = Math.floor((currentTime / 1000) % 60);
        const mins = Math.floor((currentTime / (1000 * 60)) % 60);
        const hs = Math.floor((currentTime / (1000 * 60 * 60)) % 24);
        const ds = Math.floor(currentTime / (1000 * 60 * 60 * 24));

        setSeconds(secs);
        setMinutes(mins);
        setHours(hs);
        setDays(ds);
    }, [currentTime])

    const getCaption = (name, value) => {
        if (value > 1) return name + "s";
        else return name;
    }

    return (
        <div className="countdown-timer">
            <CountdownValueContainer value={days} caption={getCaption("Day", days)}/>
            <CountdownValueContainer value={hours} caption={getCaption("Hour", hours)}/>
            <CountdownValueContainer value={minutes} caption={getCaption("Minute", minutes)}/>
            <CountdownValueContainer value={seconds} caption={getCaption("Second", seconds)}/>
        </div>
    )
}

function CountdownValueContainer({value, caption}) {
    return (
        <div className="countdown-value-container">
            <AnimatedNumber value={value}/>
            <p className="countdown-caption">{caption}</p>
        </div>
    )
}

function AnimatedNumber({value}) {
    const transitions = useTransition(value, {
        from: { opacity: 0, transform: "translateY(-20px)" },
        enter: { opacity: 1, transform: "translateY(0px)" },
        leave: { opacity: 0, transform: "translateY(20px)" },
        config: { tension: 300, friction: 20 },
    });

    const formattedValue = String(value).padStart(2, "0");

    return (
        <div style={{ position: "relative", display: "inline-flex", justifyContent: "center" }}>
            {transitions((style, item) => (
                <animated.span className="number-timer" style={{ ...style, position: "absolute" }}>
                    {String(item).padStart(2, "0")}
                </animated.span>
            ))}
            
            <span style={{ visibility: "hidden" }}>
                {formattedValue}
            </span>
        </div>
    );
}