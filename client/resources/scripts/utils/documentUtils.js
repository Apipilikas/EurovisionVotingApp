import { ErrorBox } from "../customElements/errorBox.js";
import { LoginError, MyError } from "./errorUtils.js";

const defaultAnnouncement = "UNITED BY MUSIC";

function fillDetailInputsAreaListener(currentDetail, otherDetail, inputsArea, callbackFunction = null) {
    if (!currentDetail.hasAttribute("open")) {
        otherDetail.removeAttribute("open");
        
        const currentDetailInputsArea = currentDetail.querySelector(".inputs-area");
        const otherDetailInputsArea = otherDetail.querySelector(".inputs-area");

        currentDetailInputsArea.innerHTML = inputsArea;
        otherDetailInputsArea.innerHTML = "";

        if (typeof callbackFunction === "function") callbackFunction();
    }
}

function areRequiredInputsFilled(inputsArea) {
    const inputs = inputsArea.querySelectorAll("input");

    for (var input in inputs) {
        if (input.hasAttribute("required")) return false;
    }

    return true;
}

//#region General functions

function blurScreen() {
    const blurScreen = document.getElementById("blur-screen");
    blurScreen.style.display = "initial";
}

function unblurScreen() {
    const blurScreen = document.getElementById("blur-screen");
    blurScreen.style.display = "none";
}

function handleError(e) {
    if (e instanceof MyError) {
        ErrorBox.showMyError(e);
    }
    else {
        ErrorBox.show(e.message, e.stack, "GENERAL_ERROR", "Contact Aggelos and reload the page.");
    }
}

//#endregion

//#region Init link pages url

function initLoginJudge(socket) {
    const params = new URLSearchParams(document.location.search);
    let judgeCode = params.get("judgeCode");

    if (judgeCode != null) {
        const urlParamTag = "?judgeCode=" + judgeCode; 
        const votingPage = document.querySelector("a[href='voting.html']");
        const leaderboardPage = document.querySelector("a[href='leaderboard.html']");
        votingPage.href += urlParamTag;
        leaderboardPage.href += urlParamTag;

        socket.connect();
        socket.emit("connecting", {judgeCode : judgeCode});
    }
    else {
        throw new LoginError("Judge hasn't connected properly.", null);
    }

    return judgeCode;
}

//#endregion

// #region Menu button

function initMenuBtnListener() {
    const menuBtn = document.getElementById("menu-button");

    menuBtn.addEventListener("click", e => menuBtnListener(e));
}

function menuBtnListener(e) {
    const menuClassName = "menu-button-clicked";
    const navClassName = "hide-nav";
    let menuBtn = e.target;
    let navigationBar = document.getElementById("header-navigation-bar");

    navigationBar.classList.remove(navClassName);

    if (menuBtn.classList.contains(menuClassName)) {
        menuBtn.classList.remove(menuClassName);
        navigationBar.classList.add(navClassName);
        setTimeout(() => {
            navigationBar.style.display = "none";
        }, 800);
        
    }
    else {
        menuBtn.classList.add(menuClassName);
        navigationBar.style.display = "flex";
    }
}

// #endregion

//#region Announcement container

function initAnnouncementContainer(announcements, importantAnnouncements) {
    const announcementContainer = document.getElementById("announcement-content");
    var pElement = announcementContainer.firstChild;

    if (pElement == null) return;
    let isAnnouncementSet = 1;
    
    setInterval(() => {
        let pElement = announcementContainer.querySelector("p");
        if (pElement == null) return;
        
        let nextAnnouncement = defaultAnnouncement;

        if (importantAnnouncements.length > 0) {
            isAnnouncementSet = 0;
            nextAnnouncement  = importantAnnouncements.shift();
        }
        else if (announcements.length > 0) {
            isAnnouncementSet = 0;
            nextAnnouncement = announcements.shift();
        }

        if (isAnnouncementSet > 1) return;

        pElement.classList.add("hide-announcement-box");

        setTimeout(() => {
            pElement.classList.remove("hide-announcement-box");
            pElement.innerHTML = nextAnnouncement;

            isAnnouncementSet++;
        }, 1000);
    }, 4000);
}

//#endregion

export {
    fillDetailInputsAreaListener,
    areRequiredInputsFilled,
    initLoginJudge,
    initMenuBtnListener,
    initAnnouncementContainer,
    blurScreen,
    unblurScreen,
    handleError
}