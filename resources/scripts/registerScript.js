import { clientURL, JudgeRequests } from "./utils/requestUtils.js";
import { registerTemplates } from "./utils/handlebarsUtils.js";
import { DocumentUtils } from "./utils/document/documentUtils.js";
import { InitUtils } from "./utils/initUtils.js";

window.onload = init;

async function init() {
    try {
        initBtnLinsteners();
    
        initCaptionAnimation();
    
        initJudgeListContainer();
    }
    catch (e) {DocumentUtils.handleError(e)}
}

//#region Init functions

function initBtnLinsteners() {
    DocumentUtils.setClickEventListener("#connect-btn", connectBtnListener);
    InitUtils.initMenuBtnListener();
}

function initJudgeListContainer() {
    const params = new URLSearchParams(document.location.search);
    let judgeCode = params.get("judgeCode");

    let content = {
        "judges": null
    }
    
    if (judgeCode != null) {
        JudgeRequests.getSpecificJudge(judgeCode)
        .then(response => {
            console.log(response)
            if (response.success) {
                content.judges = [response.jsonData.judge];
                updateContainer(content);
            }
            else DocumentUtils.handleResponseFailure(response);
        })
        .catch(e => DocumentUtils.handleError(e));
    }
    else {
        JudgeRequests.getAllJudges()
        .then(response => {
            if (response.success) {
                content.judges = response.jsonData.judges;
                updateContainer(content);
            }
            else DocumentUtils.handleResponseFailure(response);
        })
        .catch(e => DocumentUtils.handleError(e));
    }
}

function initCaptionAnimation() {
    const captionContainer = document.getElementById("caption-container");

    for(var i = 0; i < 50; i++) {
        let firstTime = true;
        let topRandom = Math.random() * 90;
        let leftRandom = Math.random() * 90;
        let fontSizeRandom = Math.random() * 5;
        let removeRandom = Math.random() * 10000;

        let p = document.createElement("p");
        p.innerHTML = "TA";
        p.style.top = topRandom + "%";
        p.style.left = leftRandom + "%";
        p.style.fontSize = fontSizeRandom + "em";

        setInterval(() => {
            if (firstTime) {
                firstTime = false;
                captionContainer.appendChild(p);
            }
            p.style.display = "initial";
            setTimeout(() => {
                p.style.display = "none";
            }, removeRandom)

        }, removeRandom + 1000)
    }

}

//#endregion

//#region General functions

function updateContainer(content) {
    let judgesContent = registerTemplates.judges(content);
    DocumentUtils.setInnerHTML("#judges-list-container", judgesContent);
}

//#endregion

//#region Event linstener functions

function connectBtnListener(e) {
    let judgeCode = DocumentUtils.getElementAttribute("input[type=radio]:checked", "value");

    if (judgeCode != null) {
        window.location.replace(clientURL + "/voting.html?judgeCode=" + judgeCode);
    }
}

//#endregion