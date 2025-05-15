import { NotificationBanner } from '../notificationBanner/NotificationBanner';
import Navigation from '../navigation/Navigation';
import './HeaderStyles.css';
import { useState } from 'react';

export default function Header({hideNavigation}) {

    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const handleClick = () => {
        setIsMenuOpen(value => !value);
    }

    return (
        <header>
            <NotificationBanner/>
            <div id="header-container">
                <div id="main-logo-container">
                    <div id="logo-container">
                        <img src={"/images/eurovision-logo-white-cropped.svg"}/>
                        <p>2025</p>
                    </div>
                </div>
                <Menu isOpen={isMenuOpen}
                onClick={handleClick}
                />
            </div>
            {hideNavigation ? null : <Navigation isOpen={isMenuOpen} onNavItemClick={handleClick}/>}
            {/* <nav>
                <ul id="header-navigation-bar">
                    <div id="language-switcher-container">
                        <input type="radio" name="language-switcher" id="gr"/>
                        <label for="gr"><img src="./resources/images/flags/GRE.svg" width="30px"/></label>
                        <input type="radio" name="language-switcher" id="en" checked/>
                        <label for="en"><img src="./resources/images/flags/GBR.svg" width="30px"/></label>
                    </div>
                </ul>
            </nav> */}
        </header>
    );
}

function Menu({isOpen, ...props}) {

    return (
        <div id="menu-button" className={isOpen ? "menu-button-clicked" : ""} {...props}>
            <div></div>
        </div>
    );
}