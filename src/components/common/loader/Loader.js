import React, { forwardRef, useEffect, useImperativeHandle, useState } from 'react';
import Heart from '../heart/Heart';
import './LoaderStyles.css';
import { useCountries } from '../../../hooks/useCountries';
import { useRunningOrder } from '../../../hooks/useRunningOrder';
import { useJudges } from '../../../hooks/useJudges';
import { CountdownContainer } from '../../containers/countdownContainer/CountdownContainer';

export const Loader = forwardRef((props, ref) => {
    
    const [reveal, setReveal] = useState(false);

    const {initialized : countriesInitialized} = useCountries();
    const {initialized : judgesInitialized} = useJudges();
    const {initialized : runningOrderInitialized} = useRunningOrder();
    
    const endDate = process.env.REACT_APP_COUNTDOWN_EVENT_DATE;
    const currentTime = new Date().getTime();
    const eventTime = new Date(endDate).getTime();
    const isCountdownFinished = (eventTime - currentTime) <= 0;

    useEffect(() => {
        if (isCountdownFinished && countriesInitialized && judgesInitialized && runningOrderInitialized) {
            revealScreen();
        }
    }, [countriesInitialized, judgesInitialized, runningOrderInitialized]);

    const revealScreen = () => {
        setReveal(true);
    }

    useImperativeHandle(ref, () => ({
        revealScreen
    }));

    return (
        <div ref={ref} id="loader" className={reveal ? "fade-out" : ""}>
            <div className="content">
                <Heart/>
                <h2>Eurovision Voting App</h2>
                {isCountdownFinished ? 
                    <p>Please wait . . . </p>
                    :
                    <CountdownContainer endDate={endDate}/>
                }
            </div>
        </div>
    );
});