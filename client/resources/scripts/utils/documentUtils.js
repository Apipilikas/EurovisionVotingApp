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

export {
    fillDetailInputsAreaListener,
    areRequiredInputsFilled
}