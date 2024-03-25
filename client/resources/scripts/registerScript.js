// to get arguments from url => index.html?userID=test&userName=name
// const params = new URLSearchParams(document.location.search);

import { clientURL, getAllJudges, getSpecificJudge } from "./utils/requestUtils.js";
import { registerTemplates } from "./utils/handlebarsUtils.js";



window.onload = init;

function init() {
    const judgesContainer = document.getElementById("judges-list-container");
    const connectBtn = document.getElementById("connect-btn");
    
    const params = new URLSearchParams(document.location.search);
    let judgeCode = params.get("judgeCode");

    connectBtn.addEventListener("click", connectBtnListener);
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
        });
    }
    else {
        getAllJudges()
        .then(response => {
            if (response.success) {
                content.judges = response.jsonData.judges;
                updateContainer(judgesContainer, content)
            }
        });
    }
}

function updateContainer(container, content) {
    let judgesContent = registerTemplates.judges(content);
    container.innerHTML = judgesContent;
}

function connectBtnListener(e) {
    const checkedRadioInput = document.querySelector("input[type=radio]:checked");

    if (checkedRadioInput != null) {
        let judgeCode = checkedRadioInput.value;
        window.location.replace(clientURL + "client/voting.html?judgeCode=" + judgeCode);
    }
}