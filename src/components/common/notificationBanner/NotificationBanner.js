import { useEffect, useState } from 'react';
import { animated, useTransition } from '@react-spring/web';
import './NotificationBannerStyles.css';
import {NotificationPriority, useNotificationCollection} from './NotificationProvider';
import { EventID, useSession } from '../session/SessionProvider';
import Heart from '../heart/Heart';
import {useCountries} from '../../../hooks/useCountries';

export function NotificationBanner() {

    const [notification, setNotification] = useState("tes");

    const {addNotification, getNextNotification, hasMoreNotifications} = useNotificationCollection();
    const {addListener} = useSession();
    const {runningCountry} = useCountries();

    useEffect(() => {
        init();
        registerEvents();
    }, []);

    const registerEvents = () => {
        addListener(EventID.NEXTCOUNTRY, onNextCountryListener);
        addListener(EventID.VOTES, onVotesListener);
    }

    const init = () => {
        setInterval(() => {
            if (!hasMoreNotifications()) return;
            
            let nextAnnouncement = getNextNotification();
    
            setTimeout(() => {
                setNotification(nextAnnouncement);
            }, 1000);
        }, 3000);
    }

    const notificationTransition = useTransition(notification, {
        config : {tension : 120, friction : 26},
        from : {transform : "scale(0.0)", fontSize : "0em", height : "0px"},
        enter : {transform : "scale(1.0)", fontSize : "1em", height : "100px"},
        leave : {transform : "scale(0.0)", fontSize : "0em", height : "0px"}
    });

    // Session Listeners
    const onNextCountryListener = (sender, nextRunningCountry) => {
        const message = `The next country is ${nextRunningCountry.name}`;
        addNotification(NotificationPriority.HIGH, message);
    }

    const onVotesListener = (sender, judge, country, points) => {
        const message = `${judge.name} has voted ${points} points for ${country.name}`;
        addNotification(NotificationPriority.MEDIUM, message);
    }

    return (
        <div id="live-notification-container">
            <Heart/>
            <div id="live-box-content">
                <div className='now-container'>
                    <p className='now-caption'>NOW</p>
                </div>
                <p className='running-country-name'>{runningCountry?.name}</p>
            </div>
            <div id="notification-content">
                {notificationTransition((style, caption) => {
                    return <animated.p style={style}>{caption}</animated.p>
                })}
            </div>
        </div>
    )
}