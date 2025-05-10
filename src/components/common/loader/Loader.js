import React, { forwardRef, useImperativeHandle, useState } from 'react';
import Heart from '../heart/Heart';
import './LoaderStyles.css';

export const Loader = forwardRef((props, ref) => {
    const [reveal, setReveal] = useState(true);

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