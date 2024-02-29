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

function announcementContainer(votingAnnouncements, votingStatusAnnouncements) {
    const announcementContainer = document.getElementById("announcement-content");
    var pElement = announcementContainer.firstChild;

    if (pElement == null) return;
    let isDefaultAnnouncementSet = false;
    
    setInterval(() => {
        let pElement = announcementContainer.querySelector("p");
        if (pElement == null) return;
        
        let nextAnnouncement = defaultAnnouncement;
        let isAnnouncementSet = false;

        if (votingStatusAnnouncements.length > 0) {
            isAnnouncementSet = true;
            isDefaultAnnouncementSet = false;
            nextAnnouncement  = votingStatusAnnouncements.shift();
        }
        else if (votingAnnouncements.length > 0) {
            isAnnouncementSet = true;
            isDefaultAnnouncementSet = false;
            nextAnnouncement = votingAnnouncements.shift();
        }

        if (isDefaultAnnouncementSet && !isAnnouncementSet) return;

        pElement.classList.add("hide-announcement-box");

        setTimeout(() => {
            pElement.classList.remove("hide-announcement-box");
            pElement.innerHTML = nextAnnouncement;

            if (!isAnnouncementSet) isDefaultAnnouncementSet = true;
        }, 1000);
    }, 4000);
}

function announcementListener(votingAnnouncements, votingStatusAnnouncements) {
    
}

// #endregion

export {
    fillDetailInputsAreaListener,
    areRequiredInputsFilled,
    initMenuBtnListener,
    announcementContainer
}