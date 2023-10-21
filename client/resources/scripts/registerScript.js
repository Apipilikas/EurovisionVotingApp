// to get arguments from url => index.html?userID=test&userName=name
// const params = new URLSearchParams(document.location.search);

import { getAllJudges } from "./utils/requestUtils.js";
import { templates } from "./utils/handlebarsUtils.js";
import { io } from "https://cdn.socket.io/4.4.1/socket.io.esm.min.js"



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
    let judgesContent = templates.judges(context);
    container.innerHTML = judgesContent;
}

function connectBtnListener(e) {
    const checkedRadioInput = document.querySelector("input[type=radio]:checked");

    if (checkedRadioInput != null) {
        let judgeName = checkedRadioInput.value;
        window.location.replace("http://127.0.0.1:5500/client/voting.html?judgeName=" + judgeName);
    }
}