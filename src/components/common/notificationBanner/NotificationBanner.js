import { useEffect, useState } from 'react';
import { animated, useTransition } from '@react-spring/web';
import './NotificationBannerStyles.css';
import {NotificationPriority, useNotificationCollection} from './NotificationProvider';
import { EventID, useSession } from '../session/SessionProvider';
import Heart from '../heart/Heart';
import {useCountries} from '../../../hooks/useCountries';

export function NotificationBanner() {

    const [notification, setNotification] = useState(null);

    const {addNotification, getNextNotification, hasMoreNotifications} = useNotificationCollection();
    const {addListener} = useSession();
    const {runningCountry} = useCountries();
    const [showNow, setShowNow] = useState(true);

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

        setInterval(() => {
            setShowNow(value => !value)
        }, 5000)
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

    const transition = useTransition(showNow ? 1 : 0, {
    from: { opacity: 0, scale: 0, width : "0px", fontSize : "0em"},
    enter: { opacity: 1, scale: 1, width : "200px", fontSize : "1em" },
    leave: { opacity: 0, scale: 0, width : "0px", fontSize : "0em" },
    })

    return (
        <div id="live-notification-container">
            <Heart/>
            <div id="live-box-content">
                <animated.div className='now-container'>
                    {transition((style, item) => {
                        if (item == 1) {
                            return <animated.p style={style} className='now-caption'>NOW</animated.p>
                        }
                        else {
                            return (
                                  <animated.div style={style} className='running-country-container'>
                                    {runningCountry == null ? null : <animated.img src={`../../../images/flags/${runningCountry?.code}.svg`}/>}
                                    <animated.p className='running-country-name'>{runningCountry == null ? "Not started" : runningCountry?.name}</animated.p>
                                   </animated.div>
                            );
                        }
                    })}
                </animated.div>
            </div>
            <div id="notification-content">
                {notificationTransition((style, caption) => {
                    return <animated.p style={style}>{caption}</animated.p>
                })}
            </div>
        </div>
    )
}