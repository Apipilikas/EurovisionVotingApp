import React, { forwardRef, useEffect, useImperativeHandle, useState } from 'react';
import { Link } from 'react-router-dom';
import './NavigationStyles.css';
import { useSession } from '../session/SessionProvider';

export default function Navigation({isAdmin, isOpen, onNavItemClick}) {

    const [judgeParam, setJudgeParam] = useState("");
    const {judge} = useSession();

    useEffect(() => {
        if (judge != null) {
            setJudgeParam(`?judgeCode=${judge.code}`)
        }
    }, [judge]);

    const showAdminPages = (isAdmin != null || isAdmin);

    const pages = [
        {to : "/", caption : "Register"},
        {to : "/voting", caption : "Voting"},
        {to : "/leaderboard", caption : "Leaderboard"}
    ]

    const adminPages = [
        {to : "/admin/voting", caption : "Voting"},
        {to : "/admin/Judges", caption : "Judges"}
    ]

    const mapAdminPages = () => adminPages.map(item => <li onClick={onNavItemClick}><Link to={item.to + judgeParam}>{item.caption}</Link></li>);

    const mapPages = () => pages.map(item => <li onClick={onNavItemClick}><Link to={item.to + judgeParam}>{item.caption}</Link></li>);

    return (
        <nav>
            <ul id="header-navigation-bar" 
                className={isOpen ? "" : "hide-nav"}
                style={{display:(isOpen ? "flex" : "none")}}>
                {showAdminPages ? mapAdminPages() : mapPages()}
            </ul>
        </nav>
    );
};