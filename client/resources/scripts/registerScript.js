// to get arguments from url => index.html?userID=test&userName=name
// const params = new URLSearchParams(document.location.search);

import { clientURL, getAllJudges } from "./utils/requestUtils.js";
import { registerTemplates } from "./utils/handlebarsUtils.js";



window.onload = init;

function init() {
    const judgesContainer = document.getElementById("judges-list-container");
    const connectBtn = document.getElementById("connect-btn");
    
    const params = new URLSearchParams(document.location.search);
    let judgeName = params.get("judgeName");

    connectBtn.addEventListener("click", connectBtnListener);
    let context = {
        "judges": null
    }
    
    // Find better way to handle this
    if (judgeName != null) {
        context.judges = [{name: judgeName}];
        updateContainer(judgesContainer, context)
    }
    else {
        getAllJudges()
        .then(result => {
            context.judges = result;
            updateContainer(judgesContainer, context)
        })
    }
}

function updateContainer(container, context) {
    let judgesContent = registerTemplates.judges(context);
    container.innerHTML = judgesContent;
}

function connectBtnListener(e) {
    const checkedRadioInput = document.querySelector("input[type=radio]:checked");

    if (checkedRadioInput != null) {
        let judgeName = checkedRadioInput.value;
        window.location.replace(clientURL + "client/voting.html?judgeName=" + judgeName);
    }
}