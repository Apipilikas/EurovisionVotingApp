import React, { forwardRef, useEffect, useImperativeHandle, useState } from 'react';
import Heart from '../heart/Heart';
import './LoaderStyles.css';
import { useCountries } from '../../../hooks/useCountries';
import { useRunningOrder } from '../../../hooks/useRunningOrder';
import { useJudges } from '../../../hooks/useJudges';

export const Loader = forwardRef((props, ref) => {
    
    const [reveal, setReveal] = useState(false);

    const {initialized : countriesInitialized} = useCountries();
    const {initialized : judgesInitialized} = useJudges();
    const {initialized : runningOrderInitialized} = useRunningOrder();

    useEffect(() => {
        if (countriesInitialized && judgesInitialized && runningOrderInitialized) {
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
                <p>Please wait . . . </p>
            </div>
        </div>
    );
});