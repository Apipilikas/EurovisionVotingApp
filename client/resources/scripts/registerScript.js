// to get arguments from url => index.html?userID=test&userName=name
// const params = new URLSearchParams(document.location.search);

import { clientURL, getAllJudges, getSpecificJudge } from "./utils/requestUtils.js";
import { registerTemplates } from "./utils/handlebarsUtils.js";
import { MyError } from "./utils/errorUtils.js";
import { ErrorBox } from "./customElements/errorBox.js";



window.onload = init;

function init() {
    try {
        initBtnLinsteners();
    
        initCaptionAnimation();
    
        initJudgeListContainer();
    }
    catch (e) {
        handleError(e);
    }
}

function handleError(e) {
    console.log(e);
        if (e instanceof MyError) {
            ErrorBox.show(e);
        }
}

//#region Init functions

function initBtnLinsteners() {
    const connectBtn = document.getElementById("connect-btn");
    connectBtn.addEventListener("click", connectBtnListener);
}

function initJudgeListContainer() {
    const judgesContainer = document.getElementById("judges-list-container");
    
    const params = new URLSearchParams(document.location.search);
    let judgeCode = params.get("judgeCode");

    let content = {
        "judges": null
    }
    
    if (judgeCode != null) {
        getSpecificJudge(judgeCode)
        .then(response => {
            console.log(response)
            if (response.success) {
                content.judges = [response.jsonData.judge];
                updateContainer(judgesContainer, content)
            }
        })
        .catch(e => {handleError(e)});
    }
    else {
        getAllJudges()
        .then(response => {
            if (response.success) {
                content.judges = response.jsonData.judges;
                updateContainer(judgesContainer, content)
            }
        })
        .catch(e => {handleError(e)});
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

function updateContainer(container, content) {
    let judgesContent = registerTemplates.judges(content);
    container.innerHTML = judgesContent;
}

//#endregion

//#region Event linstener functions

function connectBtnListener(e) {
    const checkedRadioInput = document.querySelector("input[type=radio]:checked");

    if (checkedRadioInput != null) {
        let judgeCode = checkedRadioInput.value;
        window.location.replace(clientURL + "client/voting.html?judgeCode=" + judgeCode);
    }
}

//#endregion