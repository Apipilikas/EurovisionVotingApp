import React, { forwardRef, useEffect, useImperativeHandle, useState } from 'react';
import { Link } from 'react-router-dom';
import './NavigationStyles.css';
import { useSession } from '../session/SessionProvider';

export default function Navigation({isAdmin, isOpen, onNavItemClick}) {

    const mainPages = [
        {to : "/", caption : "Register"},
        {to : "/voting", caption : "Voting"},
        {to : "/leaderboard", caption : "Leaderboard"}
    ]

    const adminPages = [
        {to : "/admin/voting", caption : "Admin Voting"},
        {to : "/admin/Judges", caption : "Judges"},
        {to : "/admin/Countries", caption : "Countries"}
    ]

    const [judgeParam, setJudgeParam] = useState("");
    const [pages, setPages] = useState(mainPages);
    const {judge} = useSession();

    useEffect(() => {
        if (judge != null) {
            setJudgeParam(`?judgeCode=${judge.code}`);
            if (judge.admin) {
                setPages(pages => [...pages, ...adminPages]);
            }
        }
    }, [judge]);

    const mapPages = () => pages.map(item => <li onClick={onNavItemClick}><Link to={item.to + judgeParam}>{item.caption}</Link></li>);

    return (
        <nav>
            <ul id="header-navigation-bar" 
                className={isOpen ? "" : "hide-nav"}
                style={{display:(isOpen ? "flex" : "none")}}>
                {mapPages()}
            </ul>
        </nav>
    );
};