import { DocumentUtils } from "./document/documentUtils.js";
import { LoginError } from "./errorUtils.js";
import { JudgeRequests } from "./requestUtils.js";

var InitUtils = {};

//#region Init Login judge

InitUtils.initLoginJudge = async function(socket) {
    const params = new URLSearchParams(document.location.search);
    let judgeCode = params.get("judgeCode");

    if (judgeCode != null) {
        const urlParamTag = "?judgeCode=" + judgeCode;
        const elements = document.querySelectorAll("#header-navigation-bar li a")
        for (var element of elements) {
            element.href += urlParamTag;
        }

        if (socket != null) {
            socket.connect();
            socket.emit("connecting", {judgeCode : judgeCode});
        }
    }
    else {
        throw new LoginError("Judge hasn't connected properly.", null);
    }

    let judgeResponse = await JudgeRequests.getSpecificJudge(judgeCode);
    
    if (judgeResponse.jsonData.judge == null) {
        let description = "Judge code [" + judgeCode + "] has not found on the database.";
        throw new LoginError("Judge code not found!", description);
    }

    return judgeResponse.jsonData.judge;
}

//#endregion

// #region Menu button

InitUtils.initMenuBtnListener = function() {
    DocumentUtils.setClickEventListener("#menu-button", menuBtnListener);
    InitUtils.initLanguageSwitcherListener();
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

//#endregion

//#region Language switcher

InitUtils.initLanguageSwitcherListener = function() {
    DocumentUtils.setChangeEventListener("input[name='language-switcher'] ALL", languageSwitcherListener);
}

function languageSwitcherListener(e) {
    console.log(e.target.id);
}

//#endregion

export {InitUtils}